import { tick } from 'svelte';
import { motionOwner } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';

// Fit the visible artwork, not its differently padded source/destination boxes.
// This also accounts for the portfolio's existing desktop CSS zoom.
function artworkBounds(image: HTMLImageElement) {
  const box = image.getBoundingClientRect(), css = getComputedStyle(image);
  const zoom = box.width / image.offsetWidth;
  const left = parseFloat(css.paddingLeft) * zoom, right = parseFloat(css.paddingRight) * zoom;
  const top = parseFloat(css.paddingTop) * zoom, bottom = parseFloat(css.paddingBottom) * zoom;
  const width = box.width - left - right, height = box.height - top - bottom;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
  return { left: box.left + left + (width - w) / 2, top: box.top + top + (height - h) / 2, width: w, height: h };
}

/** Selection owns the state. This disposable visual layer only carries identity. */
export function artworkMotion(node: HTMLElement) {
  return motionOwner(node, 'artwork-selection', ({ gsap }, context, { desktop, fine }) => {
    let alive = true, version = 0;
    let stop = () => {};
    let frame = 0, finishFrame = () => {};
    const clearFrame = () => { cancelAnimationFrame(frame); finishFrame(); frame = 0; finishFrame = () => {}; };
    let flip: typeof import('gsap/Flip').Flip | undefined;
    void import('gsap/Flip').then(({ Flip }) => { if (alive) { gsap.registerPlugin(Flip); flip = Flip; } });
    const select = async (event: MouseEvent) => {
      const card = (event.target as Element).closest<HTMLButtonElement>('.artwork-card');
      if (!card || card.getAttribute('aria-pressed') === 'true') return;
      const source = card.querySelector('img');
      const box = source?.complete && source.naturalWidth ? artworkBounds(source) : undefined;
      const request = ++version;
      stop();
      clearFrame();
      // Svelte delegates clicks above this native listener. Wait until that
      // event has finished before reading the selected image, then decode it.
      await new Promise<void>(resolve => {
        finishFrame = resolve;
        frame = requestAnimationFrame(() => { frame = 0; finishFrame = () => {}; resolve(); });
      });
      await tick();
      if (!alive || request !== version) return;
      const target = node.querySelector<HTMLImageElement>('.inspector-image img');
      if (!target) return;
      // A reused <img> can still report the previous artwork's intrinsic size
      // immediately after Svelte updates src. Measure only its decoded selection.
      try { await target.decode(); } catch { return; }
      if (!alive || request !== version) return;
      const destination = target.getBoundingClientRect();
      if (destination.bottom < 0 || destination.top > innerHeight) return;
      context.add(() => {
        if (!desktop || !fine || !flip || !source || !box || !source.complete || !target.complete || !target.naturalWidth) {
          const settle = gsap.fromTo(target, { opacity: .7 }, { opacity: 1, duration: motion.micro, ease: motion.secondary, clearProps: 'opacity' });
          stop = () => settle.revert();
          return;
        }
        const layer = source.cloneNode() as HTMLImageElement;
        layer.alt = ''; layer.setAttribute('aria-hidden', 'true'); layer.dataset.artworkFlight = '';
        layer.style.cssText = `position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;max-width:none;object-fit:contain;pointer-events:none;z-index:70;margin:0;padding:0;mix-blend-mode:multiply;`;
        const fitted = artworkBounds(target);
        const destination = document.createElement('div');
        destination.setAttribute('aria-hidden', 'true');
        destination.style.cssText = `position:fixed;left:${fitted.left}px;top:${fitted.top}px;width:${fitted.width}px;height:${fitted.height}px;visibility:hidden;pointer-events:none;`;
        document.body.append(layer, destination);
        const originalOpacity = target.style.opacity;
        target.style.opacity = '0';
        let flight: gsap.core.Tween | undefined;
        const finish = () => { layer.remove(); destination.remove(); target.style.opacity = originalOpacity; };
        flight = flip.fit(layer, destination, { scale: true, duration: motion.cinematic, ease: motion.primary, onComplete: finish, onInterrupt: finish }) as gsap.core.Tween;
        stop = () => { flight?.kill(); finish(); };
      });
    };
    const cancel = () => { version++; clearFrame(); stop(); };
    node.addEventListener('click', select);
    window.addEventListener('resize', cancel, { passive: true });
    window.addEventListener('scroll', cancel, { passive: true });
    return () => { alive = false; cancel(); node.removeEventListener('click', select); window.removeEventListener('resize', cancel); window.removeEventListener('scroll', cancel); };
  });
}
