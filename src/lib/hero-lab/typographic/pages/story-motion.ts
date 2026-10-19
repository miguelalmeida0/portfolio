import { curves, type LabSetup } from '$lib/hero-lab/runtime';
import { mastIntro, opening, readingMotion } from './motion';
import { currentScroll } from '../current-scroll';
import { readingChapters } from '../reading-chapters';

/** Journey typography and a documentary photograph; no repeated cutout scene. */
export const storyMotion: LabSetup = (root, { desktop }, { gsap, ScrollTrigger }) => {
  const q = gsap.utils.selector(root);
  const entrance = opening(root, gsap);
  mastIntro(entrance.timeline, q);
  entrance.timeline
    .from(q('[data-meta]'), { y: 12, opacity: .4, duration: .7 }, .08)
    .from(q('[data-story-photo]'), { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.1, ease: curves.shutter }, .1)
    .from(q('[data-story-line]'), { yPercent: 105, duration: 1, stagger: .12 }, .08)
    .from(q('[data-j-word]'), { yPercent: 104, duration: .9, stagger: .1 }, .16)
    .from(q('[data-j-label]'), { opacity: .3, x: -6, duration: .5, stagger: .1 }, .26)
    .from(q('[data-band] [data-rise-word]'), { yPercent: 104, duration: .8, stagger: .05 }, .38)
    .from(q('.band-link'), { opacity: .4, x: -8, duration: .6 }, .48);

  // Move the complete photograph, never crop a subject or compete with touch input.
  if (desktop) {
    gsap.fromTo(q('[data-story-photo]'), { y: 0 }, {
      y: -24, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: q('[data-s-stage]')[0], start: 'top top', end: 'bottom top', scrub: .4, invalidateOnRefresh: true }
    });
  }
  const releaseReading = readingMotion(root, gsap);
  const releaseCurrent = currentScroll(root, gsap, desktop);
  const releaseChapters = readingChapters(root, gsap, ScrollTrigger, desktop, 'story');
  return () => { entrance.dispose(); releaseReading(); releaseCurrent(); releaseChapters(); };
};
