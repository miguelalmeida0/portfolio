import { curves, type LabSetup } from '$lib/hero-lab/runtime';
import { mastIntro, opening, readingMotion } from './motion';
import { currentScroll } from '../current-scroll';
import { readingChapters } from '../reading-chapters';

/** Content first: one short typographic arrival, then the real résumé. */
export const cvMotion: LabSetup = (root, { desktop }, { gsap, ScrollTrigger }) => {
  const q = gsap.utils.selector(root);
  const entrance = opening(root, gsap);
  mastIntro(entrance.timeline, q);
  entrance.timeline
    // Action wrappers own arrival; links remain fully legible and own hover/press.
    .from(q('[data-cv-action]'), { y: 18, scale: .96, transformOrigin: '50% 100%', duration: .7, stagger: .1, ease: curves.snap }, .04)
    .from(q('[data-cv-intro] [data-rise-word]'), { yPercent: 105, duration: .85, stagger: .075 }, .06)
    .from(q('[data-cv-intro] [data-meta]'), { y: 10, opacity: .4, duration: .6, stagger: .045 }, .12)
    .from(q('[data-cv-rule]'), { scaleX: 0, duration: .85, ease: curves.shutter }, .12);
  const releaseReading = readingMotion(root, gsap);
  const releaseCurrent = currentScroll(root, gsap, desktop);
  const releaseChapters = readingChapters(root, gsap, ScrollTrigger, desktop, 'cv');
  return () => { entrance.dispose(); releaseReading(); releaseCurrent(); releaseChapters(); };
};
