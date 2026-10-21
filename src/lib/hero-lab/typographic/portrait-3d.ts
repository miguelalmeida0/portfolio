import type { gsap as GSAP } from 'gsap';
import type { Object3D, Material, Texture, Mesh } from 'three';
import { portraitModel } from './portrait-model';
import { createTurntable } from './turntable';
import { portraitCameraDistance } from './portrait-framing';

/** The existing lab motion owner mounts/reverts this scene with its GSAP context. */
export function mountPortrait3D(stage: HTMLElement, gsap: typeof GSAP) {
  const url = portraitModel.url;
  const surface = stage.querySelector<HTMLElement>('[data-portrait-surface]');
  if (!url || !surface) return () => {};
  const abort = new AbortController();
  const cleanups: Array<() => void> = [];
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true; abort.abort();
    cleanups.reverse().forEach(cleanup => cleanup());
    delete stage.dataset.portraitReady;
    delete stage.dataset.portraitRunning;
  };

  void (async () => {
    const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
      import('three'), import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/environments/RoomEnvironment.js')
    ]);
    if (disposed) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!context) return; // The original photo remains complete and visible.
    const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    cleanups.push(() => { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, .01, 100);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    room.dispose(); pmrem.dispose();
    scene.environment = environment.texture;
    cleanups.push(() => environment.dispose());
    scene.add(new THREE.HemisphereLight(0xffffff, 0x637066, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.8);
    rim.position.set(3, 2, -3); scene.add(rim);

    const response = await fetch(url, { signal: abort.signal });
    if (!response.ok) throw new Error(`Portrait model: HTTP ${response.status}`);
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), new URL('.', new URL(url, location.href)).href);
    if (disposed) { disposeModel(gltf.scene); return; }
    cleanups.push(() => disposeModel(gltf.scene));
    const bounds = new THREE.Box3().setFromObject(gltf.scene);
    const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('Portrait model has empty geometry');
    gltf.scene.position.sub(center);
    const subject = new THREE.Group();
    subject.add(gltf.scene); subject.scale.setScalar(2 / size.y); scene.add(subject);
    subject.updateMatrixWorld(true);
    const framing: number[] = [];
    const vertex = new THREE.Vector3();
    subject.traverse(object => {
      const mesh = object as Mesh;
      const positions = mesh.geometry?.getAttribute('position');
      if (!positions) return;
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
        framing.push(vertex.x, vertex.y, vertex.z);
      }
    });
    const framingPoints = new Float32Array(framing);
    const turn = createTurntable(portraitModel.yaw);
    subject.rotation.y = turn.yaw;
    const photo = surface.querySelector('picture');
    cleanups.push(() => photo?.removeAttribute('aria-hidden'));
    let visible = false, running = false, ready = false;
    let paused = stage.dataset.ambientPaused === 'true';
    let drag: { id: number; x: number; time: number } | undefined;
    const draw = () => { subject.rotation.y = turn.yaw; renderer.render(scene, camera); };
    const frame = (_: number, delta: number) => { turn.step(delta / 1000); draw(); };
    const sync = () => {
      const next = ready && visible && !paused && !disposed && document.visibilityState === 'visible';
      if (next !== running) { running = next; if (running) gsap.ticker.add(frame); else gsap.ticker.remove(frame); }
      stage.dataset.portraitRunning = String(running);
    };
    const measure = () => {
      const box = surface.getBoundingClientRect();
      if (!box.width || !box.height) return;
      renderer.setSize(Math.round(box.width), Math.round(box.height), false);
      camera.aspect = box.width / box.height;
      camera.position.set(0, 0, portraitCameraDistance(framingPoints, camera.aspect, camera.fov));
      camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); draw();
      // A zero-size/hidden container must never hide the usable photograph.
      if (!ready) {
        ready = true; stage.dataset.portraitReady = '';
        photo?.setAttribute('aria-hidden', 'true'); sync();
      }
    };
    const on = (target: EventTarget, name: string, listener: EventListener, options?: AddEventListenerOptions) => {
      target.addEventListener(name, listener, options);
      cleanups.push(() => target.removeEventListener(name, listener, options));
    };
    const release = () => {
      const id = drag?.id; drag = undefined; turn.end();
      if (id !== undefined && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
    };
    on(canvas, 'pointerdown', ((event: PointerEvent) => {
      if (event.button !== 0 || document.documentElement.classList.contains('ask-present')) return;
      drag = { id: event.pointerId, x: event.clientX, time: event.timeStamp };
      turn.begin(); canvas.setPointerCapture(event.pointerId);
    }) as EventListener);
    on(canvas, 'pointermove', ((event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      turn.drag((event.clientX - drag.x) * .008, (event.timeStamp - drag.time) / 1000);
      drag.x = event.clientX; drag.time = event.timeStamp; draw();
    }) as EventListener);
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) on(canvas, event, release);
    on(canvas, 'keydown', ((event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') turn.reset(); else turn.nudge(event.key === 'ArrowLeft' ? -.15 : .15);
      draw();
    }) as EventListener);
    on(stage, 'hero:motion', (event => { paused = (event as CustomEvent<{ paused: boolean }>).detail.paused; sync(); }));
    on(document, 'visibilitychange', () => { if (document.visibilityState !== 'visible') release(); sync(); });
    on(canvas, 'webglcontextlost', (event => { event.preventDefault(); dispose(); }));
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const resize = new ResizeObserver(measure);
    visibility.observe(surface); resize.observe(surface);
    cleanups.push(() => { visibility.disconnect(); resize.disconnect(); gsap.ticker.remove(frame); release(); });
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', '3D portrait of Miguel Almeida. Drag or use left and right arrows to rotate. Home resets the view.');
    surface.append(canvas); measure();
    sync();
  })().catch(error => {
    if (!disposed) console.warn('3D portrait unavailable; retaining original photo.', error);
    dispose();
  });
  return dispose;
}

function disposeModel(root: Object3D) {
  const materials = new Set<Material>(), textures = new Set<Texture>();
  root.traverse(object => {
    const mesh = object as Mesh;
    mesh.geometry?.dispose();
    if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => materials.add(material));
  });
  materials.forEach(material => {
    Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value as Texture); });
    material.dispose();
  });
  textures.forEach(texture => {
    const image = texture.source?.data;
    if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) image.close();
    texture.dispose();
  });
}
