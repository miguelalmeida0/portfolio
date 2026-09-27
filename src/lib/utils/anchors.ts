import { SCROLL_TRANSITION_MS, scrollToElement, scrollToPosition } from '$lib/motion/smooth-scroll';

export const smoothScrollTo = (top: number, duration = SCROLL_TRANSITION_MS) => {
  if (typeof window !== 'undefined') scrollToPosition(top, duration);
};
export const scrollToHash = (hash: string, offset = 40, duration?: number) => {
  if (typeof document === 'undefined' || !hash.startsWith('#')) return;
  let target: HTMLElement | null;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
  if (target) scrollToElement(target, { offset, duration });
};
