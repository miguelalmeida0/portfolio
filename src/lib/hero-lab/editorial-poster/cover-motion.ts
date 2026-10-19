import { curves, type LabSetup } from '$lib/hero-lab/runtime';

/**
 * Direction A — the cover.
 * Open: the masthead hairline draws, the plum plate opens from a vertical
 * hairline, the masthead rises letter by letter, the portrait settles into the
 * plate and breaks out above it, then the rules draw and the cover lines settle.
 * Pointer: three planes in quiet counter-parallax (field, portrait, masthead).
 * Scroll: the masthead tracks out from its centre and the plate closes back to
 * a narrow column as Selected Work arrives. Scrubbed, never pinned.
 *
 * Ownership: plate-open/letters/figure-in/lines → opening; field-move,
 * figure-move, mast-move → pointer; plate-scroll, mast-scroll, letter masks,
 * picture, lines block → scroll.
 */
export const coverMotion: LabSetup = (root, { desktop, fine }, { gsap }) => {
  const q = gsap.utils.selector(root);
  const cover = q('[data-cover]')[0] as HTMLElement;
  const letters = q('[data-mast-letter]') as HTMLElement[];

  // lazy: false writes start states synchronously, before the browser can paint.
  const intro = gsap.timeline({ defaults: { ease: curves.settle, lazy: false } });
  intro
    .from(q('[data-ep-hair]'), { scaleX: 0, duration: 1.2, ease: curves.shutter }, 0)
    .from(q('[data-ep-bar] [data-arm]'), { opacity: 0, y: -8, duration: .6, stagger: .06 }, .1)
    .from(q('[data-plate-open]'), { clipPath: 'inset(-120% 49.6% 0% 49.6%)', duration: 1.1, ease: curves.shutter }, .05)
    .from(letters, { yPercent: 104, duration: 1, stagger: .035 }, .2)
    .from(q('[data-figure-in]'), { yPercent: 7, opacity: 0, duration: 1.2 }, .45)
    .from(q('[data-h-line]'), { yPercent: 110, duration: .9, stagger: .08 }, .6)
    .from(q('[data-rule]'), { scaleX: 0, duration: 1, ease: curves.shutter, stagger: .08 }, .75)
    .from(q('[data-line]'), { opacity: 0, y: 12, duration: .7, stagger: .05 }, .8);

  const cleanups: Array<() => void> = [];
  if (fine && desktop) {
    const to = (sel: string, prop: string, duration: number) => gsap.quickTo(q(sel), prop, { duration, ease: 'power3.out' });
    const field = { x: to('[data-field-move]', 'x', 1.3), y: to('[data-field-move]', 'y', 1.3) };
    const figure = { x: to('[data-figure-move]', 'x', 1), y: to('[data-figure-move]', 'y', 1) };
    const mast = { x: to('[data-mast-move]', 'x', 1.5) };
    const move = (event: PointerEvent) => {
      const nx = event.clientX / innerWidth - .5, ny = event.clientY / innerHeight - .5;
      field.x(nx * -18); field.y(ny * -10);
      figure.x(nx * 9); figure.y(ny * 5);
      mast.x(nx * -12);
    };
    const leave = () => { field.x(0); field.y(0); figure.x(0); figure.y(0); mast.x(0); };
    cover.addEventListener('pointermove', move);
    cover.addEventListener('pointerleave', leave);
    cleanups.push(() => { cover.removeEventListener('pointermove', move); cover.removeEventListener('pointerleave', leave); });
  }

  const hold = { immediateRender: false };
  const exit = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: cover, start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true }
  });
  const masks = q('.m-mask') as HTMLElement[];
  const centre = (masks.length - 1) / 2;
  const picture = q('[data-figure] .lab-portrait');
  if (desktop) {
    exit
      // Tracking out: each letter leaves the centre in proportion to its distance from it.
      .fromTo(masks, { x: 0 }, { x: (i: number) => (i - centre) * cover.clientWidth * .012, duration: 1, ...hold }, 0)
      .fromTo(q('[data-mast-scroll]'), { yPercent: 0 }, { yPercent: -40, duration: 1, ...hold }, 0)
      .fromTo(q('[data-plate-scroll]'), { clipPath: 'inset(-120% 0% 0% 0%)' }, { clipPath: 'inset(-120% 38% 0% 38%)', duration: .8, ease: curves.dolly, ...hold }, .05)
      .fromTo(picture, { yPercent: 0 }, { yPercent: 12, duration: 1, ...hold }, 0)
      .fromTo(q('[data-lines]'), { y: 0 }, { y: -70, duration: .6, ...hold }, 0);
  } else {
    exit
      .fromTo(q('[data-plate-scroll]'), { clipPath: 'inset(-120% 0% 0% 0%)' }, { clipPath: 'inset(-120% 12% 0% 12%)', duration: 1, ...hold }, 0)
      .fromTo(picture, { yPercent: 0 }, { yPercent: 8, duration: 1, ...hold }, 0);
  }

  return () => cleanups.forEach(fn => fn());
};
