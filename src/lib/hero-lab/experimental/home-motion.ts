import { curves, type LabSetup } from '$lib/hero-lab/runtime';

/** Resting stagger of the eight strips, as a share of the strip height. */
// The two strips carrying his face move least, so he stays recognisable at rest.
export const STAGGER = [-.05, .035, -.022, .012, -.01, .028, -.055, .04];

/**
 * Direction C — the photograph and the role, cut into the same eight strips.
 * Open: the hairline grid drops in, each strip opens from the floor, outward
 * from his face, and its two letters rise into place.
 * Pointer: strips near the pointer close their offset, so a wave of alignment
 * follows it across the photograph; leave and the rhythm returns.
 * Scroll: the strips align and close their gaps — the whole photograph and the
 * two words assemble as you leave for Selected Work.
 *
 * Owners: col → resting stagger + scroll, move → pointer, tile → opening.
 */
export const homeMotion: LabSetup = (root, { desktop, fine }, { gsap }) => {
  const q = gsap.utils.selector(root);
  const stage = q('[data-xh-stage]')[0] as HTMLElement;
  const cols = q('[data-x-col]') as HTMLElement[];
  const moves = q('[data-x-move]') as HTMLElement[];
  const height = () => cols[0]?.offsetHeight ?? 0;
  const gap = () => {
    if (cols.length < 2) return 0;
    return cols[1].offsetLeft - cols[0].offsetLeft - cols[0].offsetWidth;
  };
  const amp = desktop ? 1 : .6;
  const base = (i: number) => STAGGER[i % STAGGER.length] * height() * amp;
  gsap.set(cols, { y: (i: number) => base(i) });

  // lazy: false writes start states synchronously, before the browser can paint.
  const intro = gsap.timeline({ defaults: { ease: curves.settle, lazy: false } });
  intro
    .from(q('[data-grid-line]'), { scaleY: 0, transformOrigin: '50% 0%', duration: 1, ease: curves.shutter, stagger: .04 }, 0)
    .from(q('[data-x-tile]'), { clipPath: 'inset(100% 0% 0% 0%)', duration: .95, stagger: { each: .07, from: 'center' } }, .1)
    .from(q('[data-letter]'), { yPercent: 112, duration: .8, stagger: { each: .035, from: 'center' } }, .45)
    .from(q('[data-front-word]'), { yPercent: 112, duration: .85, stagger: .08 }, .75)
    .from(q('[data-meta]'), { y: 16, opacity: 0, duration: .7, stagger: .06 }, .3);

  const cleanups: Array<() => void> = [];
  if (desktop && fine) {
    const pull = moves.map(move => gsap.quickTo(move, 'y', { duration: .75, ease: 'power3.out' }));
    const move = (event: PointerEvent) => {
      const reach = cols[0].offsetWidth * 1.9;
      cols.forEach((col, i) => {
        const r = col.getBoundingClientRect();
        const dx = (event.clientX - (r.left + r.width / 2)) / reach;
        const proximity = Math.exp(-dx * dx);
        // Cancel this strip's current resting offset in proportion to closeness.
        pull[i](-(gsap.getProperty(col, 'y') as number) * proximity);
      });
    };
    const leave = () => pull.forEach(p => p(0));
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', leave);
    cleanups.push(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave); });
  }

  // Hand-off: everything aligns, the gaps close, then the side column lifts away.
  const hold = { immediateRender: false };
  const mid = (cols.length - 1) / 2;
  const exit = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: desktop ? stage : q('[data-figure]')[0], start: desktop ? 'top top' : 'top 30%', end: desktop ? 'bottom 35%' : 'bottom 40%', scrub: .6, invalidateOnRefresh: true }
  });
  exit.fromTo(cols, { y: (i: number) => base(i), x: 0 }, {
    y: 0, x: (i: number) => (mid - i) * gap(), duration: .6, ease: curves.dolly, stagger: { each: .02, from: 'center' }, ...hold
  }, 0);
  if (desktop) exit.fromTo(q('[data-xh-side]'), { y: 0 }, { y: () => -stage.clientHeight * .12, duration: 1, ...hold }, 0);

  return () => cleanups.forEach(fn => fn());
};
