import { curves, type LabSetup } from '$lib/hero-lab/runtime';
import { charsIn, navIntro } from './motion-kit';

/**
 * Direction B home — the role is set letter by letter, then the short version
 * plays as a held sequence.
 * Open: each character of the role rises and unfolds, line after line; the
 * cabin window opens from its centre line; the facts settle.
 * Pointer: the window frame drifts with the pointer and the view inside moves
 * against it (depth through glass); the role lines shift at their own rates.
 * Scroll (hero): the role folds away upward, word by word.
 * Scroll (journey, sticky stage): a flight path draws across the stage; each
 * chapter's word assembles and then leaves as the next arrives; the rail fills
 * 01 → 03; the portrait's frame changes from cabin window to open frame to the
 * full figure.
 *
 * Ownership — hero: char → opening, line → pointer, word-in → scroll;
 * window-in → opening (clip), window → scroll, window-view → pointer.
 * Journey chars, texts, frame, ground, fill, path → journey timeline only.
 */
export const homeMotion: LabSetup = (root, { desktop, fine }, { gsap }) => {
  const q = gsap.utils.selector(root);
  const heroEl = q('[data-hero]')[0] as HTMLElement;
  const cleanups: Array<() => void> = [];

  const intro = gsap.timeline({ defaults: { ease: curves.settle, lazy: false } });
  navIntro(intro, q);
  const lines = q('[data-line]') as HTMLElement[];
  lines.forEach((line, i) => {
    intro.from(line.querySelectorAll('[data-ks-char]'), { ...charsIn, duration: .9, stagger: .028 }, .12 + i * .12);
  });
  intro
    .from(q('[data-window-in]'), { clipPath: 'inset(50% 0% 50% 0%)', opacity: 1, duration: 1.1, ease: curves.shutter }, .2)
    .from(q('[data-window-view]'), { scale: 1.25, duration: 1.6, ease: curves.dolly }, .2)
    .from(q('[data-meta]'), { y: 16, opacity: 0, duration: .7, stagger: .06 }, .55);

  if (desktop && fine) {
    const frame = { x: gsap.quickTo(q('[data-window]'), 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(q('[data-window]'), 'y', { duration: 1, ease: 'power3.out' }) };
    const view = { x: gsap.quickTo(q('[data-window-view]'), 'x', { duration: 1.2, ease: 'power3.out' }), y: gsap.quickTo(q('[data-window-view]'), 'y', { duration: 1.2, ease: 'power3.out' }) };
    const shifts = lines.map((line, i) => gsap.quickTo(line, 'x', { duration: .9 + i * .1, ease: 'power3.out' }));
    const move = (event: PointerEvent) => {
      const nx = event.clientX / innerWidth - .5, ny = event.clientY / innerHeight - .5;
      frame.x(nx * 14); frame.y(ny * 10);
      view.x(nx * -26); view.y(ny * -16);
      shifts.forEach((x, i) => x(nx * -(6 + i * 5)));
    };
    const leave = () => { frame.x(0); frame.y(0); view.x(0); view.y(0); shifts.forEach(x => x(0)); };
    heroEl.addEventListener('pointermove', move);
    heroEl.addEventListener('pointerleave', leave);
    cleanups.push(() => { heroEl.removeEventListener('pointermove', move); heroEl.removeEventListener('pointerleave', leave); });
  }

  const hold = { immediateRender: false };
  // Hero hand-off: the role folds away, word by word, as the page lifts.
  const exit = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true } });
  exit.fromTo(q('[data-line] [data-ks-word-in]'), { yPercent: 0 }, { yPercent: -112, duration: .5, stagger: .07, ease: 'power2.in', ...hold }, 0);
  if (desktop) {
    exit.fromTo(q('[data-window]'), { yPercent: 0 }, { yPercent: -18, duration: 1, ...hold }, 0)
      .fromTo(q('[data-facts]'), { y: 0 }, { y: -80, duration: .6, ...hold }, 0);
  }

  // ——— Journey ———
  const journey = q('[data-journey]')[0] as HTMLElement;
  const chapters = q('[data-j-chapter]') as HTMLElement[];
  const stops = q('[data-j-stop]') as HTMLElement[];
  const path = root.querySelector<SVGPathElement>('[data-j-path]');
  const frameEl = q('[data-j-frame]')[0] as HTMLElement;
  const ground = q('[data-j-ground]')[0] as HTMLElement;
  const charsOf = (i: number) => chapters[i].querySelectorAll('[data-ks-char]');
  const textOf = (i: number) => chapters[i].querySelector('[data-j-text]');

  // Frames per chapter, as insets of the portrait box: a cabin window on the
  // head, an open working frame, then nothing between him and the page.
  const masks = desktop
    ? ['inset(4% 24% 48% 24% round 46% / 30%)', 'inset(6% 4% 18% 4% round 0% / 0%)', 'inset(0% 0% 0% 0% round 0% / 0%)']
    : ['inset(6% 22% 46% 22% round 46% / 30%)', 'inset(6% 4% 16% 4% round 0% / 0%)', 'inset(0% 0% 0% 0% round 0% / 0%)'];

  const setActive = (index: number) => stops.forEach((stop, i) => stop.classList.toggle('on', i === index));
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: journey, start: desktop ? 'top 55%' : 'top 65%', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onUpdate: () => setActive(Math.min(2, Math.floor(Math.max(0, tl.time() - .2) / 1)))
    }
  });
  const fill = q('[data-j-fill]');
  gsap.set(chapters.slice(1).flatMap(c => [...c.querySelectorAll('[data-ks-char]')]), { yPercent: 110 });
  gsap.set(chapters.slice(1).map(c => c.querySelector('[data-j-text]')), { opacity: 0, y: 24 });

  tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3, ...hold }, 0)
    .fromTo(fill, { [desktop ? 'scaleY' : 'scaleX']: 0 }, { [desktop ? 'scaleY' : 'scaleX']: 1, duration: 2.4, ...hold }, .2)
    .fromTo(charsOf(0), { yPercent: 110, rotationX: -70, transformOrigin: '50% 100%' }, { yPercent: 0, rotationX: 0, duration: .45, stagger: .03, ease: 'power2.out', ...hold }, 0)
    .fromTo(textOf(0), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .3, ...hold }, .25)
    .fromTo(frameEl, { clipPath: 'inset(30% 50% 70% 50% round 46% / 30%)' }, { clipPath: masks[0], duration: .5, ease: 'power2.out', ...hold }, 0);

  // Chapter changes at 1 and 2: the outgoing word leaves upward, the next rises.
  [1, 2].forEach(next => {
    const at = next * 1.0;
    tl.to(charsOf(next - 1), { yPercent: -110, rotationX: 60, duration: .3, stagger: .02, ease: 'power2.in' }, at)
      .to(textOf(next - 1), { opacity: 0, y: -20, duration: .2 }, at)
      .fromTo(charsOf(next), { yPercent: 110, rotationX: -70, transformOrigin: '50% 100%' }, { yPercent: 0, rotationX: 0, duration: .4, stagger: .025, ease: 'power2.out', ...hold }, at + .22)
      .fromTo(textOf(next), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .25, ...hold }, at + .42)
      .to(frameEl, { clipPath: masks[next], duration: .55, ease: 'power2.inOut' }, at + .05);
  });
  // The last frame drops its ground: he stands on the page itself.
  tl.to(ground, { opacity: 0, duration: .35 }, 2.15)
    .to({}, { duration: .5 }, 3);

  // Static sequence styling is reverted with the context; release the active stop too.
  cleanups.push(() => setActive(0));
  return () => cleanups.forEach(fn => fn());
};
