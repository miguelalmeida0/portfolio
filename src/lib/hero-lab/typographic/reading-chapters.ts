import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

export type ReadingKind = 'story' | 'cv' | 'case';
export function readingGeometry(viewport: number, mast: number, subnav: number, zoom: number, height: number, desktop: boolean) {
  const scale = zoom > 0 ? zoom : 1;
  const top = mast + subnav + 16;
  return { topCss: top / scale, held: desktop && viewport >= 680 && height > 0 && height * scale < (viewport - top - 24) * .7 };
}

/** A reading rhythm shared across pages; product controls/media never transform.
 * Caller owns GSAP context, preference policy and route teardown.
 */
export function readingChapters(root: HTMLElement, gsap: typeof GSAP, ScrollTrigger: typeof ST, desktop: boolean, kind: ReadingKind) {
  const selectors = {
    story: ['.story-question', ':scope > .story-copy'],
    cv: ['.c-main > section', ':scope > [data-rise-title]'],
    case: ['main > .chapter', ':scope > .head']
  }[kind];
  const entries = [...root.querySelectorAll<HTMLElement>(selectors[0])].flatMap(section => {
    const head = section.querySelector<HTMLElement>(selectors[1]);
    if (!head) return [];
    section.dataset.readerSection = kind;
    head.dataset.readerHead = kind;
    const arrival = gsap.fromTo(head, { x: desktop ? -28 : 0, y: desktop ? 44 : 18 }, {
      x: 0, y: 0, ease: 'none', scrollTrigger: {
        id: `reading-arrival-${kind}`, trigger: section, start: 'top 92%',
        end: () => `+=${Math.min(innerHeight * .32, 280)}`, scrub: true, invalidateOnRefresh: true
      }
    });
    gsap.fromTo(head, { '--reader-progress': 0 }, { '--reader-progress': 1, ease: 'none', scrollTrigger: {
      id: `reading-progress-${kind}`, trigger: section, start: 'top 55%', end: 'bottom 40%', scrub: true, invalidateOnRefresh: true
    } });
    return [{ section, head, arrival }];
  });
  let frame = 0, disposed = false;
  const fit = () => {
    frame = 0;
    if (disposed) return;
    const zoom = parseFloat(getComputedStyle(root.closest('#portfolio-content') ?? root).zoom || '1');
    const mast = document.querySelector('[data-mast]')?.getBoundingClientRect().height ?? 88;
    const nav = kind === 'case' ? root.querySelector<HTMLElement>('.pnav') : null;
    const subnav = nav ? nav.offsetHeight * zoom : 0;
    entries.forEach(({ head }) => {
      const geometry = readingGeometry(innerHeight, mast, subnav, zoom, head.offsetHeight, desktop);
      head.toggleAttribute('data-reader-held', kind !== 'case' && geometry.held);
      head.style.setProperty('--reader-top', `${geometry.topCss}px`);
    });
    ScrollTrigger.refresh();
  };
  const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(fit); };
  const observer = new ResizeObserver(schedule);
  entries.forEach(({ head }) => observer.observe(head));
  const focus = (event: FocusEvent) => {
    entries.forEach(({ section, arrival }) => {
      if (section.contains(event.target as Node)) {
        arrival.scrollTrigger?.disable(false);
        arrival.progress(1);
      }
    });
  };
  root.addEventListener('focusin', focus);
  window.addEventListener('resize', schedule);
  fit();
  return () => {
    disposed = true;
    observer.disconnect(); cancelAnimationFrame(frame);
    root.removeEventListener('focusin', focus);
    window.removeEventListener('resize', schedule);
    entries.forEach(({ section, head }) => {
      delete section.dataset.readerSection; delete head.dataset.readerHead;
      head.removeAttribute('data-reader-held'); head.style.removeProperty('--reader-top');
    });
  };
}
