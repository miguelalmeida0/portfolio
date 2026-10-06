import { motionOwner } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';

export function workMotion(node: HTMLElement) {
  return motionOwner(node, 'selected-work', ({ gsap }, context, { fine }) => {
    const cleanups: (() => void)[] = [];
    for (const article of node.querySelectorAll<HTMLElement>('[data-selected-project]')) {
      const frame = article.querySelector<HTMLElement>('[data-preview]');
      const plane = article.querySelector<HTMLElement>('[data-preview-plane]');
      const arrow = article.querySelector<HTMLElement>('h3 span');
      if (!frame || !plane) continue;
      // Fixed outer frame/hit target. Only the media plane and directional cue move.
      const shift = gsap.quickTo(plane, 'x', { duration: motion.standard, ease: motion.pointer });
      const scaleX = gsap.quickTo(plane, 'scaleX', { duration: motion.standard, ease: motion.secondary });
      const scaleY = gsap.quickTo(plane, 'scaleY', { duration: motion.standard, ease: motion.secondary });
      const scale = (value: number) => { scaleX(value); scaleY(value); };
      const arrowX = arrow && gsap.quickTo(arrow, 'x', { duration: motion.micro, ease: motion.secondary });
      const arrowY = arrow && gsap.quickTo(arrow, 'y', { duration: motion.micro, ease: motion.secondary });
      const activate = () => { scale(1.018); arrowX?.(3); arrowY?.(-3); };
      const release = () => { shift(0); scale(1); arrowX?.(0); arrowY?.(0); };
      const move = (event: PointerEvent) => {
        const box = frame.getBoundingClientRect();
        shift(((event.clientX - box.left) / box.width - .5) * 4);
      };
      const focusOut = (event: FocusEvent) => { if (!article.contains(event.relatedTarget as Node)) release(); };
      article.addEventListener('focusin', activate);
      article.addEventListener('focusout', focusOut);
      if (fine) {
        article.addEventListener('pointerenter', activate);
        article.addEventListener('pointerleave', release);
        frame.addEventListener('pointermove', move, { passive: true });
      } else {
        article.addEventListener('pointerdown', activate, { passive: true });
        article.addEventListener('pointerup', release, { passive: true });
        article.addEventListener('pointercancel', release);
      }
      cleanups.push(() => {
        article.removeEventListener('focusin', activate); article.removeEventListener('focusout', focusOut);
        article.removeEventListener('pointerenter', activate); article.removeEventListener('pointerleave', release);
        frame.removeEventListener('pointermove', move);
        article.removeEventListener('pointerdown', activate); article.removeEventListener('pointerup', release); article.removeEventListener('pointercancel', release);
      });
    }
    return () => cleanups.forEach(dispose => dispose());
  });
}
