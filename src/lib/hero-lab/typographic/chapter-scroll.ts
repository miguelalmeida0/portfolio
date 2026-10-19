import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import { resetScrollMotion, syncScrollPosition } from '$lib/motion/smooth-scroll';

/** All chapters must fit in physical viewport coordinates, including site zoom. */
export function chapterGeometry(viewport: number, navBottom: number, zoom: number, heights: number[]) {
  const top = Math.max(88, navBottom) + 16;
  const available = viewport - top - 24;
  const scale = zoom > 0 ? zoom : 1;
  // First let the complete card arrive. Then reserve a genuine reading
  // interval before its successor even enters the viewport. The host's wheel
  // multiplier can move 360px in one ordinary gesture; that must not bury CTAs.
  const reading = Math.max(360, Math.min(560, viewport * .55));
  return {
    fits: available >= 420 && heights.length > 1 && heights.every(height => height > 0 && height * scale <= available + 1),
    top, topCss: top / scale, availableCss: available / scale,
    travelCss: (viewport - top + reading) / scale
  };
}

/** Native sticky supplies the hold. ScrollTrigger owns only the outgoing surface.
 * Static outer shells are measurement anchors, never the sticky/transformed row.
 * One nested context lets resize/focus release the complete deck atomically.
 */
export function chapterScroll(root: HTMLElement, gsap: typeof GSAP, ScrollTrigger: typeof ST, desktop: boolean) {
  if (!desktop) return () => {};
  const shells = [...root.querySelectorAll<HTMLElement>('[data-project-chapter]')];
  const rows = shells.map(shell => shell.querySelector<HTMLElement>('.project-row')!);
  if (rows.length < 2 || rows.some(row => !row)) return () => {};
  let context: gsap.Context | undefined;
  let frame = 0, disposed = false, keyboard = false, signature = '';
  const release = () => {
    context?.revert(); context = undefined;
    delete root.dataset.chapterMode;
    for (const property of ['--chapter-top', '--chapter-viewport', '--chapter-travel']) root.style.removeProperty(property);
    shells.forEach(shell => {
      shell.style.removeProperty('--chapter-overlap');
      shell.style.removeProperty('--chapter-height');
    });
  };
  const build = () => {
    frame = 0;
    if (disposed || keyboard) return;
    const zoom = parseFloat(getComputedStyle(root.closest('#portfolio-content') ?? root).zoom || '1');
    const navBottom = document.querySelector('[data-mast]')?.getBoundingClientRect().bottom ?? 88;
    const heights = rows.map(row => row.offsetHeight);
    const geometry = chapterGeometry(innerHeight, navBottom, zoom, heights);
    const next = [innerWidth, innerHeight, geometry.top, ...heights].join(':');
    if (next === signature) return;
    signature = next;
    release();
    if (!geometry.fits) { ScrollTrigger.refresh(); return; }
    root.style.setProperty('--chapter-top', `${geometry.topCss}px`);
    root.style.setProperty('--chapter-viewport', `${geometry.availableCss}px`);
    root.style.setProperty('--chapter-travel', `${geometry.travelCss}px`);
    root.dataset.chapterMode = 'stacked';
    // The new chapter begins one reading distance after the last; the preceding
    // surface's height is exactly overlapped, not estimated from vh units.
    shells.forEach((shell, i) => {
      shell.style.setProperty('--chapter-height', `${rows[i].offsetHeight}px`);
      if (i) shell.style.setProperty('--chapter-overlap', `${rows[i - 1].offsetHeight}px`);
    });
    context = gsap.context(() => {
      rows.slice(0, -1).forEach((row, i) => {
        const timeline = gsap.timeline({ scrollTrigger: {
          id: `chapter-exchange-${i}`, trigger: shells[i + 1],
          start: 'top 92%', end: `top ${geometry.top}px`, scrub: true,
          invalidateOnRefresh: true
        } });
        timeline.fromTo(row, { scale: 1, rotationX: 0, y: 0 }, {
          scale: .93, rotationX: -4, y: -28, transformOrigin: '50% 0%', ease: 'none'
        }, 0);
        timeline.fromTo(row.querySelector('[data-chapter-shade]'), { opacity: 0 }, { opacity: .2, ease: 'none' }, 0);
      });
    }, root);
    ScrollTrigger.refresh();
  };
  const schedule = () => {
    if (!disposed && !keyboard && !frame) frame = requestAnimationFrame(build);
  };
  const focus = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement) || !event.target.closest('[data-project-chapter]')) return;
    // Keyboard users get normal source order, never focus beneath another leaf.
    // Pointer activation does not throw the clicked surface out from under them.
    if (!event.target.matches(':focus-visible')) return;
    keyboard = true;
    cancelAnimationFrame(frame); frame = 0;
    resetScrollMotion();
    release(); ScrollTrigger.refresh();
    event.target.scrollIntoView({ block: 'center', behavior: 'instant' });
    syncScrollPosition();
  };
  const observer = new ResizeObserver(schedule);
  rows.forEach(row => observer.observe(row));
  root.addEventListener('focusin', focus);
  window.addEventListener('resize', schedule);
  root.addEventListener('loadedmetadata', schedule, true);
  build();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame); observer.disconnect();
    root.removeEventListener('focusin', focus);
    window.removeEventListener('resize', schedule);
    root.removeEventListener('loadedmetadata', schedule, true);
    release();
  };
}
