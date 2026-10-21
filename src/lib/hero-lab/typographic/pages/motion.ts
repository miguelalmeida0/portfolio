import { curves } from '$lib/hero-lab/runtime';
import type { gsap as GSAP } from 'gsap';

type Gsap = typeof GSAP;
type Select = (selector: string) => Element[];

const visited = new Set<string>();

/** The opening yields to reading, focus and restored scroll immediately. */
export function opening(root: HTMLElement, gsap: Gsap) {
  const page = root.dataset.d1Page ?? 'home';
  const returning = visited.has(page);
  visited.add(page);
  const timeline = gsap.timeline({ defaults: { ease: curves.settle, lazy: false } });
  if (returning) timeline.timeScale(1.8);
  let active = true;
  const finish = () => { timeline.progress(1); dispose(); };
  const scroll = () => { if (active && window.scrollY > 8) finish(); };
  const key = (event: KeyboardEvent) => {
    if (['Tab', 'PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) finish();
  };
  function dispose() {
    active = false;
    window.removeEventListener('wheel', finish);
    window.removeEventListener('touchstart', finish);
    window.removeEventListener('scroll', scroll);
    window.removeEventListener('keydown', key);
    root.removeEventListener('focusin', finish);
  }
  window.addEventListener('wheel', finish, { passive: true });
  window.addEventListener('touchstart', finish, { passive: true });
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('keydown', key);
  root.addEventListener('focusin', finish);
  timeline.eventCallback('onComplete', dispose);
  // Wait until the caller has appended its tweens, then honor restored scroll.
  queueMicrotask(scroll);
  return { timeline, dispose };
}

/** The masthead arrives the same way on every Direction 01 page. */
export function mastIntro(timeline: gsap.core.Timeline, q: Select) {
  const rules = q('[data-mast-rule]');
  const links = q('[data-mast] [data-nav-arrive]');
  if (rules.length) timeline.from(rules, { scaleX: 0, duration: .95, ease: curves.shutter }, 0);
  // Alternate preview navigation remains static and operable during the opening.
  if (links.length) timeline.from(links, { y: -6, duration: .65, stagger: .045 }, 0);
}

/** Reads "5,500+", "75%" or "10x" as a number with its printed prefix and suffix. */
function parseFigure(text: string) {
  const match = text.match(/^(\D*)([\d,.]+)(.*)$/);
  if (!match) return undefined;
  const value = Number(match[2].replaceAll(',', ''));
  return Number.isFinite(value) ? { before: match[1], value, after: match[3], grouped: match[2].includes(',') } : undefined;
}

/**
 * Reading motion below the hero, shared by Story and CV. Everything fires once
 * as it enters; nothing is pinned or scrubbed against the reader.
 * - `[data-rise-title]`: each word rises from behind its own mask.
 * - `[data-settle]`: copy settles up into place.
 * - `[data-rule]`: a rule draws from the left.
 * - `[data-count]`: a figure counts up to its printed value (the printed value
 *   stays in the accessible text; the counting copy is hidden from it).
 */
export function readingMotion(root: HTMLElement, gsap: Gsap) {
  const q = gsap.utils.selector(root);
  const once = (trigger: Element, start = 'top 86%') => ({ trigger, start, once: true });
  const entrances = new Map<HTMLElement, gsap.core.Tween>();

  (q('[data-rise-title]') as HTMLElement[]).forEach(title => {
    // The hero's own title is choreographed by the hero.
    if (title.closest('[data-hero-stage]')) return;
    entrances.set(title, gsap.from(title.querySelectorAll('[data-rise-word]'), {
      yPercent: 104, duration: .85, ease: curves.settle, stagger: { amount: .18 }, scrollTrigger: once(title)
    }));
  });
  (q('[data-settle]') as HTMLElement[]).forEach(node => {
    // Keep reading copy legible even while a fast scroll catches the entrance.
    entrances.set(node, gsap.from(node, { y: 16, opacity: .35, duration: .7, ease: curves.settle, scrollTrigger: once(node, 'top 94%') }));
  });
  (q('[data-rule]') as HTMLElement[]).forEach(rule => {
    gsap.from(rule, { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, ease: curves.shutter, scrollTrigger: once(rule, 'top 92%') });
  });
  (q('[data-count]') as HTMLElement[]).forEach(node => {
    const figure = parseFigure(node.dataset.count ?? '');
    if (!figure) return;
    const state = { value: 0 };
    const format = (value: number) => {
      const rounded = Math.round(value);
      return figure.before + (figure.grouped ? rounded.toLocaleString('en-US') : String(rounded)) + figure.after;
    };
    node.textContent = format(0);
    gsap.to(state, {
      value: figure.value, duration: 1.6, ease: 'power3.out', scrollTrigger: once(node, 'top 92%'),
      onUpdate: () => { node.textContent = format(state.value); }
    });
  });
  const focus = (event: FocusEvent) => {
    const target = event.target as Node;
    for (const [node, tween] of entrances) {
      if (node.contains(target)) tween.progress(1);
    }
  };
  root.addEventListener('focusin', focus);
  return () => {
    root.removeEventListener('focusin', focus);
    (q('[data-count]') as HTMLElement[]).forEach(node => { node.textContent = node.dataset.count ?? ''; });
  };
}
