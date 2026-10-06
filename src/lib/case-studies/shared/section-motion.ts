import { motionOwner, refreshMotion } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';

export function sectionMotion(node: HTMLElement) {
  return motionOwner(node, 'section-navigation', ({ gsap, ScrollTrigger }, context, { desktop, fine }) => {
    const list = node.querySelector('ul');
    const indicator = node.querySelector<HTMLElement>('[data-section-indicator]');
    const progress = node.querySelector<HTMLElement>('[data-reading-progress]');
    const main = node.parentElement?.querySelector('main');
    if (!list || !indicator || !progress || !main) return;
    node.dataset.navMotion = '';
    gsap.set(list, { position: 'relative' });
    gsap.set(indicator, { position: 'absolute', left: 0, top: 0, opacity: 0, pointerEvents: 'none' });
    const x = gsap.quickTo(indicator, 'x', { duration: motion.standard, ease: motion.primary });
    const width = gsap.quickTo(indicator, 'width', { duration: motion.standard, ease: motion.primary });
    let initial = true;
    const update = () => {
      const target = list.querySelector<HTMLElement>('a[aria-current="true"]') ?? list.querySelector<HTMLElement>('a');
      if (!target || !target.offsetWidth) { indicator.style.opacity = '0'; return; }
      indicator.style.opacity = '1';
      indicator.style.height = `${target.offsetHeight}px`;
      indicator.style.top = `${target.offsetTop}px`;
      if (initial) {
        gsap.set(indicator, { x: target.offsetLeft, width: target.offsetWidth });
        initial = false;
      } else { x(target.offsetLeft); width(target.offsetWidth); }
    };
    const observer = new MutationObserver(update);
    observer.observe(list, { attributes: true, subtree: true, attributeFilter: ['aria-current'] });
    const resize = new ResizeObserver(update);
    resize.observe(list);
    gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: main, start: 'top top', end: 'bottom bottom', scrub: desktop && fine ? motion.scrub : true } });
    update();
    refreshMotion({ gsap, ScrollTrigger });
    return () => { observer.disconnect(); resize.disconnect(); delete node.dataset.navMotion; indicator.removeAttribute('style'); };
  });
}
