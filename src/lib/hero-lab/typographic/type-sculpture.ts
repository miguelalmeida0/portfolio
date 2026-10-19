import type { gsap as GSAP } from 'gsap';

/** Progressive enhancement of the two existing words, under the existing ticker. */
export function mountTypeSculpture(stage: HTMLElement, gsap: typeof GSAP) {
  let disposed = false;
  const cleanups: Array<() => void> = [];
  const words = [...stage.querySelectorAll<HTMLElement>('[data-back-word]')];
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    words.forEach(word => delete word.dataset.sculpted);
    cleanups.reverse().forEach(fn => fn());
    delete stage.dataset.typeReady;
    delete stage.dataset.typeRunning;
  };
  const abort = new AbortController();
  cleanups.push(() => abort.abort());

  void (async () => {
    const [THREE, { decodeInflatedGlyphs, inflatedWord, inflatedWordScale, typePose }, { inflatedTypeMaterial }, { RoomEnvironment }, [manifest, buffer]] = await Promise.all([
      import('three'), import('./type-geometry'), import('./inflated-type-material'),
      import('three/addons/environments/RoomEnvironment.js'),
      Promise.all([
        fetch('/models/inflated-type.json', { signal: abort.signal }).then(response => {
          if (!response.ok) throw new Error('Inflated lettering unavailable');
          return response.json();
        }),
        fetch('/models/inflated-type.bin', { signal: abort.signal }).then(response => {
          if (!response.ok) throw new Error('Inflated lettering unavailable');
          return response.arrayBuffer();
        })
      ]),
      document.fonts.load('700 100px "Lab Antonio"')
    ]);
    if (disposed) return;
    const glyphs = decodeInflatedGlyphs(manifest, buffer);
    cleanups.push(() => Object.values(glyphs).forEach(glyph => glyph.geometry.dispose()));
    const css = getComputedStyle(stage);
    const palette = {
      ink: css.getPropertyValue('--ink').trim(), forest: css.getPropertyValue('--forest').trim(),
      lime: css.getPropertyValue('--lime').trim(), paper: css.getPropertyValue('--paper').trim()
    };

    // Each canvas inherits its word's existing slide, clipping and scroll transforms.
    // Neither typography geometry nor the portrait's coordinate system changes.
    const views = words.map(word => {
      const canvas = document.createElement('canvas');
      canvas.className = 'type-sculpture';
      canvas.setAttribute('aria-hidden', 'true');
      const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
      if (!context) throw new Error('WebGL unavailable');
      const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
      cleanups.push(() => { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); });
      renderer.debug.onShaderError = () => { throw new Error('Headline material unavailable'); };
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new THREE.Scene();
      const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
      const environment = (() => {
        try { return pmrem.fromScene(room, .025); }
        finally { room.dispose(); pmrem.dispose(); }
      })();
      scene.environment = environment.texture;
      scene.environmentRotation.set(0, .35, 0);
      cleanups.push(() => environment.dispose());
      scene.add(new THREE.HemisphereLight(palette.paper, palette.forest, .55));
      const key = new THREE.DirectionalLight(palette.paper, 1.8);
      key.position.set(-3, 5, 6); scene.add(key);
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 2000);
      camera.position.z = 1000;
      const geometry = inflatedWord(glyphs, word.textContent!.trim().toUpperCase());
      const material = inflatedTypeMaterial(palette.forest);
      cleanups.push(() => { geometry.dispose(); material.dispose(); });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'inflated-headline';
      const size = geometry.boundingBox!.getSize(new THREE.Vector3());
      scene.add(mesh);
      let width = 0, height = 0;
      const resize = () => {
        width = word.clientWidth; height = word.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.left = -width / 2; camera.right = width / 2;
        camera.top = height / 2; camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
        const em = parseFloat(getComputedStyle(word).fontSize);
        const scale = inflatedWordScale(size, width, em);
        mesh.scale.set(scale.x, scale.y, scale.z);
      };
      const lost = () => dispose();
      canvas.addEventListener('webglcontextlost', lost);
      cleanups.push(() => canvas.removeEventListener('webglcontextlost', lost));
      word.append(canvas);
      resize();
      return { word, renderer, scene, camera, mesh, resize };
    });
    if (disposed) return;
    let time = 0, visible = false, running = false;
    let paused = stage.dataset.ambientPaused === 'true';
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const draw = () => {
      const pose = typePose(time, pointer.x, pointer.y);
      views.forEach(view => {
        // Pitch before yaw: keep the long baseline level and inside its original cell.
        view.mesh.rotation.set(pose.x, pose.y, 0, 'YXZ');
        view.renderer.render(view.scene, view.camera);
      });
    };
    const tick = (_time: number, delta: number) => {
      const dt = Math.min(delta / 1000, .05);
      time += dt;
      const damp = 1 - Math.exp(-3.5 * dt);
      pointer.x += (pointer.targetX - pointer.x) * damp;
      pointer.y += (pointer.targetY - pointer.y) * damp;
      draw();
    };
    const sync = () => {
      const next = visible && !paused && !disposed && document.visibilityState === 'visible';
      if (running !== next) {
        running = next;
        if (next) gsap.ticker.add(tick); else gsap.ticker.remove(tick);
      }
      stage.dataset.typeRunning = String(running);
    };
    const on = (target: EventTarget, event: string, listener: EventListener) => {
      target.addEventListener(event, listener, { passive: true });
      cleanups.push(() => target.removeEventListener(event, listener));
    };
    on(stage, 'pointermove', ((event: PointerEvent) => {
      if (paused || event.pointerType !== 'mouse') return;
      const rect = stage.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.targetY = (event.clientY - rect.top) / rect.height * 2 - 1;
    }) as EventListener);
    on(stage, 'pointerleave', () => { pointer.targetX = pointer.targetY = 0; });
    on(stage, 'hero:motion', event => { paused = (event as CustomEvent<{ paused: boolean }>).detail.paused; sync(); });
    on(document, 'visibilitychange', sync);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(stage.querySelector('[data-row-back]')!);
    const resize = new ResizeObserver(() => { views.forEach(view => view.resize()); draw(); });
    words.forEach(word => resize.observe(word));
    cleanups.push(() => { observer.disconnect(); resize.disconnect(); gsap.ticker.remove(tick); });
    draw();
    // Hide only the visual fallback after both renderers have drawn successfully.
    words.forEach(word => { word.dataset.sculpted = ''; });
    stage.dataset.typeReady = '';
    sync();
  })().catch(() => { dispose(); }); // Keep original type if enhancement is unavailable.
  return dispose;
}
