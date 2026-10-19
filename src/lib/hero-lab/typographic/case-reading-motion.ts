import { motionOwner } from '$lib/motion/runtime';
import { readingChapters } from './reading-chapters';

export function caseReadingMotion(root: HTMLElement) {
  return motionOwner(root, 'case-reading', ({ gsap, ScrollTrigger }, _context, { desktop }) =>
    readingChapters(root, gsap, ScrollTrigger, desktop, 'case'));
}
