import type { gsap as GSAP } from 'gsap';

/** One decorative scene, driven by the existing GSAP owner. The photo stays DOM. */
export function mountPortraitSurround(stage: HTMLElement, gsap: typeof GSAP) {
  const photo = stage.querySelector<HTMLImageElement>('[data-portrait-surface] img');
  if (!photo) return Object.assign(() => {}, { refresh: () => {} });
  let disposed = false;
  const cleanups: Array<() => void> = [];
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cleanups.reverse().forEach(fn => fn());
    delete stage.dataset.surroundReady;
    delete stage.dataset.surroundRunning;
  };
  // The existing scrubbed exit calls this to keep paused depth aligned to the photo.
  dispose.refresh = () => {};

  void (async () => {
    const [THREE, { RoomEnvironment }, { ribbonGeometry, surroundPose }] = await Promise.all([
      import('three'), import('three/addons/environments/RoomEnvironment.js'), import('./surround-geometry')
    ]);
    if (disposed) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!context) return;
    canvas.className = 'portrait-surround';
    canvas.setAttribute('aria-hidden', 'true');
    const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    cleanups.push(() => { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); });
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 5000);
    camera.position.z = 2000;
    const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .025);
    pmrem.dispose(); room.dispose(); scene.environment = environment.texture;
    cleanups.push(() => environment.dispose());
    scene.add(new THREE.HemisphereLight(0xffffff, 0x142a22, 2));
    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    key.position.set(-400, 600, 800); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 2.2);
    rim.position.set(500, -100, 400); scene.add(rim);
    const css = getComputedStyle(stage);
    const colour = (name: string) => css.getPropertyValue(name).trim();
    const materials = [
      new THREE.MeshPhysicalMaterial({ color: colour('--forest'), metalness: .58, roughness: .24, clearcoat: .9, clearcoatRoughness: .18, envMapIntensity: 1.8 }),
      new THREE.MeshPhysicalMaterial({ color: colour('--plum'), metalness: .4, roughness: .27, clearcoat: .85, envMapIntensity: 1.65 })
    ];
    // Keep the approved copy clear even when a ribbon approaches its column.
    const copy = [...stage.querySelectorAll<HTMLElement>('[data-col], [data-row-back] .cell')].slice(0, 4);
    const copyRects = Array.from({ length: 4 }, () => new THREE.Vector4(-10000, -10000, 0, 0));
    materials.forEach(material => {
      material.transparent = true;
      material.alphaTest = .01;
      material.onBeforeCompile = shader => {
        shader.uniforms.uCopyRects = { value: copyRects };
        shader.uniforms.uPixelRatio = { value: renderer.getPixelRatio() };
        shader.fragmentShader = 'uniform vec4 uCopyRects[4];\nuniform float uPixelRatio;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <alphatest_fragment>', `
          for (int i = 0; i < 4; i++) {
            vec2 delta = abs(gl_FragCoord.xy / uPixelRatio - uCopyRects[i].xy) - uCopyRects[i].zw;
            float outside = length(max(delta, 0.0)) + min(max(delta.x, delta.y), 0.0);
            diffuseColor.a *= smoothstep(0.0, 18.0, outside);
          }
          #include <alphatest_fragment>
        `);
      };
    });
    const geometries = [ribbonGeometry(4.6, .065, .009), ribbonGeometry(2, .035, .008)];
    cleanups.push(() => { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); });
    const frame = new THREE.Group(), ellipse = new THREE.Group();
    frame.add(ellipse); scene.add(frame);
    const ribbons = geometries.map((geometry, i) => {
      const mesh = new THREE.Mesh(geometry, materials[i]);
      if (i) mesh.scale.setScalar(.85);
      ellipse.add(mesh); return mesh;
    });

    // Depth-only cutout: original DOM photograph never disappears or becomes 3D.
    const mask = await new THREE.TextureLoader().loadAsync(photo.currentSrc || photo.src);
    if (disposed) { mask.dispose(); return; }
    cleanups.push(() => mask.dispose());
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: mask, alphaTest: .42, colorWrite: false, depthWrite: true });
    const occluder = new THREE.Mesh(planeGeometry, planeMaterial);
    occluder.renderOrder = -100; scene.add(occluder);
    cleanups.push(() => { planeGeometry.dispose(); planeMaterial.dispose(); });

    let width = 0, height = 0, time = 0, visible = false, running = false;
    let paused = stage.dataset.ambientPaused === 'true';
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const intro = { amount: 0 };
    let entrance: gsap.core.Tween | undefined;
    const layout = () => {
      const box = stage.getBoundingClientRect(), image = photo.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0 || image.height <= 0) return false;
      if (width !== box.width || height !== box.height) {
        width = box.width; height = box.height;
        renderer.setSize(Math.round(width), Math.round(height), false);
        camera.left = -width / 2; camera.right = width / 2;
        camera.top = height / 2; camera.bottom = -height / 2; camera.updateProjectionMatrix();
      }
      const x = image.left - box.left + image.width / 2 - width / 2;
      const y = height / 2 - (image.top - box.top + image.height / 2);
      occluder.position.set(x, y, 0); occluder.scale.set(image.width, image.height, 1);
      frame.position.set(x, y - image.height * .055, 0);
      const scale = image.width * (matchMedia('(max-width: 1023px)').matches ? .59 : .68);
      frame.scale.setScalar(scale * (.86 + intro.amount * .14));
      ellipse.scale.set(1, 1, .72);
      copy.forEach((element, i) => {
        const rect = element.getBoundingClientRect();
        copyRects[i].set(rect.left - box.left + rect.width / 2, height - (rect.top - box.top + rect.height / 2), rect.width / 2 + 8, rect.height / 2 + 8);
      });
      return true;
    };
    const draw = () => {
      if (!layout()) return;
      const pose = surroundPose(time, pointer.x, pointer.y);
      frame.rotation.set(pose.tiltX, 0, pose.tiltZ);
      ribbons[0].rotation.y = pose.primary; ribbons[1].rotation.y = pose.accent;
      // Draw range unfurls the geometry without fading/shifting the photograph.
      geometries.forEach(g => g.setDrawRange(0, Math.floor(g.index!.count * intro.amount / 6) * 6));
      renderer.render(scene, camera);
    };
    dispose.refresh = () => { if (paused && !disposed) draw(); };
    const tick = (_time: number, delta: number) => {
      const dt = Math.min(delta / 1000, .05);
      time += dt;
      const ease = 1 - Math.exp(-4 * dt);
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;
      draw();
    };
    const sync = () => {
      const next = visible && !paused && !disposed && document.visibilityState === 'visible';
      if (next !== running) {
        running = next;
        if (running) gsap.ticker.add(tick); else gsap.ticker.remove(tick);
      }
      stage.dataset.surroundRunning = String(running);
      entrance?.paused(!next);
    };
    const on = (target: EventTarget, event: string, listener: EventListener) => {
      target.addEventListener(event, listener, { passive: true });
      cleanups.push(() => target.removeEventListener(event, listener));
    };
    on(stage, 'pointermove', ((event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || paused) return;
      const rect = stage.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.targetY = (event.clientY - rect.top) / rect.height * 2 - 1;
    }) as EventListener);
    on(stage, 'pointerleave', () => { pointer.targetX = pointer.targetY = 0; });
    on(stage, 'hero:motion', (event => { paused = (event as CustomEvent<{ paused: boolean }>).detail.paused; sync(); }));
    on(document, 'visibilitychange', sync);
    on(canvas, 'webglcontextlost', () => dispose());
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(photo);
    const resize = new ResizeObserver(draw); resize.observe(stage); resize.observe(photo);
    cleanups.push(() => { observer.disconnect(); resize.disconnect(); gsap.ticker.remove(tick); });
    stage.append(canvas); draw(); stage.dataset.surroundReady = '';
    entrance = gsap.to(intro, { amount: 1, duration: 1.7, paused: true, ease: 'power3.inOut', onUpdate: draw });
    cleanups.push(() => entrance?.kill());
    sync();
  })().catch(error => { if (!disposed) console.warn('Decorative portrait motion unavailable; photograph retained.', error); dispose(); });
  return dispose;
}
