import { gsap } from 'gsap';
import { MOTION } from './config';
import { silhouetteProfile } from './silhouette';
import { framePortrait } from './portrait-frame';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './turn-shader';
import type { Role } from './types';

type Uniforms = Record<'tF' | 'tB' | 'pF' | 'pB' | 'a0' | 'pr' | 'lead' | 'blur' | 'lx' | 'amb', WebGLUniformLocation | null>;

/** WebGL renderer for the turn. `create` resolves to null when WebGL is unavailable. */
export class TurnRenderer {
  private state = { a0: 0, p: 0, blur: 0 };
  private lastP = 0;
  private tween: gsap.core.Tween | null = null;
  private destroyed = false;

  private constructor(
    private gl: WebGLRenderingContext,
    private canvas: HTMLCanvasElement,
    private box: HTMLElement,
    private u: Uniforms,
  ) {}

  static async create(box: HTMLElement, front: HTMLImageElement, back: HTMLImageElement, role: Role, signal?: AbortSignal): Promise<TurnRenderer | null> {
    if (signal?.aborted) return null;
    const canvas = box.querySelector<HTMLCanvasElement>('canvas');
    if (!canvas) return null;
    try { await Promise.all([front.decode(), back.decode()]); } catch { /* decode() can reject for cached images; sizes are still valid */ }
    if (signal?.aborted || !front.naturalWidth || !back.naturalWidth) return null;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return null;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader error');
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link error');
      gl.useProgram(prog);
    } catch (e) { console.warn('[turntable-header] WebGL unavailable, using fallback', e); return null; }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const texture = (unit: number, src: HTMLCanvasElement | Uint8Array, width = 0) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const filter = src instanceof Uint8Array ? gl.NEAREST : gl.LINEAR;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      if (src instanceof Uint8Array) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, src);
      else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      }
    };
    const framedFront = framePortrait(front, 'engineer'), framedBack = framePortrait(back, 'designer');
    const pf = silhouetteProfile(framedFront), pb = silhouetteProfile(framedBack);
    texture(0, framedFront); texture(1, framedBack); texture(2, pf.data, pf.height); texture(3, pb.data, pb.height);

    const names = ['tF', 'tB', 'pF', 'pB', 'a0', 'pr', 'lead', 'blur', 'lx', 'amb'] as const;
    const u = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)])) as Uniforms;
    gl.uniform1i(u.tF, 0); gl.uniform1i(u.tB, 1); gl.uniform1i(u.pF, 2); gl.uniform1i(u.pB, 3);
    gl.uniform1f(u.lead, MOTION.turn.lead); gl.uniform1f(u.amb, MOTION.turn.ambient); gl.uniform1f(u.lx, MOTION.turn.lightX);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const r = new TurnRenderer(gl, canvas, box, u);
    r.set(role);
    r.resize();
    return r;
  }

  resize(): void {
    if (this.destroyed) return;
    const rect = this.box.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(2, Math.round(rect.width * dpr)), h = Math.max(2, Math.round(rect.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    this.draw();
  }

  /** Jump to a role without animating. */
  set(role: Role): void {
    if (this.destroyed) return;
    this.tween?.kill();
    this.box.dataset.restRole = role;
    this.box.classList.remove('is-turning');
    this.state = { a0: role === 'designer' ? Math.PI : 0, p: 0, blur: 0 };
    this.draw();
  }

  /** Turn to `role`. Always the same direction: front → back → front is one revolution. */
  turnTo(role: Role): Promise<void> {
    if (this.destroyed) return Promise.resolve();
    const T = MOTION.turn;
    this.tween?.kill();
    this.state = { a0: role === 'designer' ? 0 : Math.PI, p: 0, blur: 0 };
    this.lastP = 0;
    // Paint the exact initial pose before revealing the canvas. At rest the
    // browser displays the original photo, avoiding another resampling pass.
    this.draw();
    this.box.classList.add('is-turning');
    return new Promise((resolve) => {
      this.tween = gsap.to(this.state, {
        p: 1, duration: T.duration, ease: T.ease, delay: T.delay,
        onUpdate: () => {
          const dp = Math.abs(this.state.p - this.lastP);
          this.lastP = this.state.p;
          this.state.blur = Math.min(T.maxBlur, dp * Math.PI * T.blurGain);
          this.draw();
        },
        onComplete: () => {
          this.state.blur = 0; this.draw();
          this.box.dataset.restRole = role;
          this.box.classList.remove('is-turning');
          resolve();
        },
        onInterrupt: resolve,
      });
    });
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.tween?.kill();
    if (this.box.isConnected !== false) this.box.classList.remove('is-turning');
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private draw(): void {
    if (this.destroyed) return;
    const { gl, u, state } = this;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.a0, state.a0);
    gl.uniform1f(u.pr, state.p);
    gl.uniform1f(u.blur, state.blur);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
