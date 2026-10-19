import { motionOwner } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';
import { currentScroll } from '$lib/hero-lab/typographic/current-scroll';
import { chapterScroll } from '$lib/hero-lab/typographic/chapter-scroll';

export function workMotion(node: HTMLElement, current = false) {
  return motionOwner(node, 'selected-work', ({ gsap, ScrollTrigger }, context, { fine, desktop }) => {
    const cleanups: (() => void)[] = [];
    if (current) cleanups.push(currentScroll(node, gsap, desktop));
    if (current) cleanups.push(chapterScroll(node, gsap, ScrollTrigger, desktop));
    for (const article of node.querySelectorAll<HTMLElement>('[data-selected-project]')) {
      const arrow = article.querySelector<HTMLElement>('[data-project-arrow]');
      if (!arrow) continue;
      // Keep the full film visible: directional cues move, recorded UI pixels do not.
      const arrowX = gsap.quickTo(arrow, 'x', { duration: motion.micro, ease: motion.secondary });
      const arrowY = gsap.quickTo(arrow, 'y', { duration: motion.micro, ease: motion.secondary });
      const activate = () => { arrowX(3); arrowY(-3); };
      const release = () => { arrowX(0); arrowY(0); };
      const focusOut = (event: FocusEvent) => { if (!article.contains(event.relatedTarget as Node)) release(); };
      article.addEventListener('focusin', activate);
      article.addEventListener('focusout', focusOut);
      if (fine) {
        article.addEventListener('pointerenter', activate);
        article.addEventListener('pointerleave', release);
      }
      cleanups.push(() => {
        article.removeEventListener('focusin', activate);
        article.removeEventListener('focusout', focusOut);
        article.removeEventListener('pointerenter', activate);
        article.removeEventListener('pointerleave', release);
      });
    }
    return () => cleanups.forEach(dispose => dispose());
  });
}
