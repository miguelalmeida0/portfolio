const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

let activeScrollFrame = 0;

export const smoothScrollTo = (targetY: number, duration = 180): void => {
  if (typeof window === 'undefined') return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  if (activeScrollFrame) {
    window.cancelAnimationFrame(activeScrollFrame);
  }

  const startY = window.scrollY;
  const diff = targetY - startY;

  if (Math.abs(diff) < 2) return;
  if (duration <= 0) {
    window.scrollTo(0, targetY);
    return;
  }

  let start: number | null = null;
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';

  const step = (timestamp: number) => {
    if (start === null) start = timestamp;

    const elapsed = timestamp - start;
    const progress = Math.min(1, elapsed / duration);

    window.scrollTo(0, startY + diff * easeOutQuart(progress));

    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(step);
    } else {
      activeScrollFrame = 0;
      root.style.scrollBehavior = previousScrollBehavior;
    }
  };

  activeScrollFrame = requestAnimationFrame(step);
};

export const scrollToHash = (hash: string, offset = 96, duration = 180): void => {
  if (typeof window === 'undefined' || !hash.startsWith('#')) return;

  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - offset;
  smoothScrollTo(y, duration);
};
