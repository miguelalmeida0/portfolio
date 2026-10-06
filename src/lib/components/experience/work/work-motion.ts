import { motionOwner, refreshMotion } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';

export function workMotion(node: HTMLElement) {
  return motionOwner(node, 'selected-work', ({ gsap, ScrollTrigger }, context, { desktop, fine }) => {
    const cleanups: (() => void)[] = [];
    const photo = node.querySelector<HTMLImageElement>('.f24-photo');
    const photoFrame = node.querySelector<HTMLElement>('.f24-photo-link');
    if (photo && photoFrame) {
      const travel = () => Math.min(desktop ? motion.photoTravel : motion.mobilePhotoTravel, photoFrame.clientHeight * .018);
      gsap.fromTo(photo, { scale: 1.06, y: () => -travel() }, {
        scale: 1.04, y: travel, ease: 'none',
        scrollTrigger: { trigger: photoFrame, start: 'top bottom', end: 'bottom top', scrub: desktop ? motion.scrub : true, invalidateOnRefresh: true }
      });
      const loaded = () => refreshMotion({ gsap, ScrollTrigger });
      photo.addEventListener('load', loaded, { once: true });
      cleanups.push(() => photo.removeEventListener('load', loaded));
    }
    for (const article of node.querySelectorAll<HTMLElement>('[data-selected-project]')) {
      const frame = article.querySelector<HTMLElement>('[data-preview]');
      const plane = article.querySelector<HTMLElement>('[data-preview-plane]');
      const arrow = article.querySelector<HTMLElement>('h3 span');
      if (!frame || !plane) continue;
      // Fixed outer frame/hit target. Only the media plane and directional cue move.
      const shift = gsap.quickTo(plane, 'x', { duration: motion.standard, ease: motion.pointer });
      const scale = gsap.quickTo(plane, 'scale', { duration: motion.standard, ease: motion.secondary });
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
