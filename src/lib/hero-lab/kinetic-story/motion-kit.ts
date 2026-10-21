import { curves } from '$lib/hero-lab/runtime';
import type { gsap as GSAP } from 'gsap';

type Gsap = typeof GSAP;
type Select = (selector: string) => Element[];

/** The kinetic entrance: characters rise and unfold from below their line. */
export const charsIn = { yPercent: 118, rotationX: -70, transformOrigin: '50% 100%', opacity: 0 };

/** Nav arrival, identical on every page of the direction. */
export function navIntro(timeline: gsap.core.Timeline, q: Select) {
  timeline
    .from(q('[data-ks-nav] [data-arm]'), { y: -14, opacity: 0, duration: .6, stagger: .05, ease: curves.settle }, 0)
    .from(q('[data-ks-nav-rule]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: curves.shutter }, 0);
}

/**
 * Reading beats below the fold, shared by Story and CV.
 * - `[data-ks-scrub]` headings: characters assemble as the heading travels up
 *   the viewport (scrubbed, so scrolling back takes them apart again).
 * - `[data-ks-in]`: copy settles once.
 * - `[data-ks-count]`: a printed figure counts up once; the printed value stays
 *   in the accessible text.
 */
export function readingBeats(root: HTMLElement, gsap: Gsap) {
  const q = gsap.utils.selector(root);
  (q('[data-ks-scrub]') as HTMLElement[]).forEach(heading => {
    const chars = heading.querySelectorAll('[data-ks-char]');
    gsap.fromTo(chars, { yPercent: 105, rotationX: -60, opacity: .2, transformOrigin: '50% 100%' }, {
      yPercent: 0, rotationX: 0, opacity: 1, ease: 'none', stagger: { each: .02 },
      scrollTrigger: { trigger: heading, start: 'top 92%', end: 'top 58%', scrub: .5, invalidateOnRefresh: true }
    });
  });
  (q('[data-ks-in]') as HTMLElement[]).forEach(node => {
    gsap.from(node, { y: 26, opacity: 0, duration: .8, ease: curves.settle, scrollTrigger: { trigger: node, start: 'top 90%', once: true } });
  });
  const counters = q('[data-ks-count]') as HTMLElement[];
  counters.forEach(node => {
    const match = (node.dataset.ksCount ?? '').match(/^(\D*)([\d,.]+)(.*)$/);
    if (!match) return;
    const target = Number(match[2].replaceAll(',', ''));
    const grouped = match[2].includes(',');
    const state = { v: 0 };
    const print = (v: number) => match[1] + (grouped ? Math.round(v).toLocaleString('en-US') : String(Math.round(v))) + match[3];
    node.textContent = print(0);
    gsap.to(state, { v: target, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 92%', once: true }, onUpdate: () => { node.textContent = print(state.v); } });
  });
  return () => counters.forEach(node => { node.textContent = node.dataset.ksCount ?? ''; });
}
