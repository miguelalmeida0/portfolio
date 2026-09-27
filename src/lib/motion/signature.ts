import { motionState, prefersReducedMotion } from './policy';

const settle = 'cubic-bezier(.22,1,.36,1)';
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** A passive scroll detail. It never changes scroll distance or page geometry. */
export function workSignature(node: HTMLElement) {
  const rule = node.querySelector<HTMLElement>('[data-work-rule]');
  const title = node.querySelector<HTMLElement>('[data-project-signature]');
  if (!rule || !title) return {};
  let cleanup = () => {};
  const unsubscribe = motionState.subscribe(({ reduced }) => {
    cleanup();
    if (reduced) {
      rule.style.transform = title.style.transform = 'scaleX(1)';
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = node.getBoundingClientRect().top;
      const origin = top + window.scrollY;
      const progress = clamp(window.scrollY / Math.max(1, origin - 80));
      rule.style.transform = `scaleX(${.07 + progress * .93})`;
      title.style.transform = `scaleX(${clamp((progress - .3) / .7)})`;
    };
    const schedule = () => { frame ||= requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
    cleanup = () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  });
  return { destroy() { unsubscribe(); cleanup(); } };
}

/** The contact copy and complete wordmark stay readable throughout their entrance. */
export function contactSignature(node: HTMLElement, wordmark = false) {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return {};
  const animations: Animation[] = [];
  let unsubscribe = () => {};
  const finish = () => {
    animations.forEach(animation => animation.cancel());
    observer.disconnect();
    unsubscribe();
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    if (prefersReducedMotion() || document.hidden) return;
    animations.push(node.animate([
      { opacity: .86, transform: wordmark ? 'translateY(10px) scale(.985)' : 'translateY(8px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: wordmark ? 460 : 380, easing: settle }));
    const rule = node.querySelector<HTMLElement>('[data-contact-rule]');
    if (rule) animations.push(rule.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: 420, easing: settle
    }));
    unsubscribe = motionState.subscribe(({ reduced }) => { if (reduced) finish(); });
    Promise.all(animations.map(animation => animation.finished)).then(finish, finish);
  }, { threshold: wordmark ? .2 : .08 });
  observer.observe(node);
  return { destroy: finish };
}
