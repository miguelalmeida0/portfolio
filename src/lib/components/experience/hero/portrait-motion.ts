import { motionOwner, refreshMotion } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';

export function portraitMotion(node: HTMLElement) {
  return motionOwner(node, 'portrait-depth', (runtime, context, { desktop, fine }) => {
    if (!desktop || !fine) return;
    const picture = node.querySelector('picture');
    if (!picture) return;
    let alive = true, started = false;
    let cleanup = () => {};
    const start = () => {
      if (!alive || started || document.documentElement.dataset.presentation !== 'complete') return;
      started = true;
      context.add(() => {
        const x = runtime.gsap.quickTo(picture, 'x', { duration: motion.standard, ease: motion.pointer });
        const move = (event: PointerEvent) => {
          const box = node.getBoundingClientRect();
          x(((event.clientX - box.left) / box.width - .5) * motion.pointerPx * 2);
        };
        const leave = () => x(0);
        node.addEventListener('pointermove', move, { passive: true });
        node.addEventListener('pointerleave', leave);
        node.addEventListener('pointercancel', leave);
        const visibility = () => { if (document.hidden) x.tween.progress(1).pause(); };
        document.addEventListener('visibilitychange', visibility);
        cleanup = () => {
          node.removeEventListener('pointermove', move);
          node.removeEventListener('pointerleave', leave);
          node.removeEventListener('pointercancel', leave);
          document.removeEventListener('visibilitychange', visibility);
        };
        refreshMotion(runtime);
      });
    };
    const presentation = new MutationObserver(start);
    presentation.observe(document.documentElement, { attributes: true, attributeFilter: ['data-presentation'] });
    start();
    return () => { alive = false; presentation.disconnect(); cleanup(); };
  });
}
