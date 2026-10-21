import type { gsap as GSAP } from 'gsap';

/** Direction 03, adapted to real reading distances rather than fixture heights. */
export function currentRange(height: number, viewport: number, compact: boolean) {
  const view = Math.max(1, viewport);
  return Math.round(Math.max(96, Math.min(height * .65, view * (compact ? .28 : .42))));
}

/**
 * Called INSIDE the host's GSAP context. No scroll driver, pin, input capture,
 * matchMedia or RAF animation loop. Host reduced-motion and route cleanup revert
 * all animation styles. Each motif owns a different wrapper.
 */
export function currentScroll(root: HTMLElement, gsap: typeof GSAP, desktop: boolean) {
  const timelines = new Map<HTMLElement, gsap.core.Timeline>();
  const select = (selector: string) => [...root.querySelectorAll<HTMLElement>(selector)];
  const scene = (node: HTMLElement, kind: string, start = 'top 88%') => {
    const timeline = gsap.timeline({ scrollTrigger: {
      id: `current-${kind}`, trigger: node, start,
      end: () => `+=${currentRange(node.getBoundingClientRect().height, window.innerHeight, !desktop)}`,
      scrub: true, invalidateOnRefresh: true
    } });
    timelines.set(node, timeline);
    return timeline;
  };

  for (const node of select('[data-current-narrative]')) {
    const words = node.querySelectorAll('[data-current-word]');
    if (!words.length) continue;
    scene(node, 'narrative').fromTo(words, {
      xPercent: (i: number) => (i % 2 ? 1 : -1) * (desktop ? 24 : 10),
      rotation: (i: number) => desktop ? (i % 2 ? 4 : -4) : 0,
      transformOrigin: '50% 50%'
    }, { xPercent: 0, rotation: 0, stagger: .08, ease: 'none' });
  }
  for (const node of select('[data-current-assembly]')) {
    const pieces = node.querySelectorAll('[data-current-piece]');
    if (!pieces.length) continue;
    scene(node, 'assembly').fromTo(pieces, {
      x: (i: number) => (i % 2 ? 1 : -1) * (desktop ? 48 : 12),
      y: (i: number) => (desktop ? 36 : 14) + i * (desktop ? 18 : 6),
      rotation: (i: number) => (i % 2 ? 1 : -1) * (desktop ? 5 : 1.5),
      transformOrigin: '50% 85%'
    }, { x: 0, y: 0, rotation: 0, stagger: .12, ease: 'none' });
  }
  for (const node of select('[data-current-reveal]')) {
    // Chapter deck surfaces exchange as complete objects; no competing crop.
    if (desktop && node.closest('[data-project-chapter]')) continue;
    const art = node.querySelectorAll('[data-current-art]');
    const counter = node.querySelectorAll('[data-current-counter]');
    if (!art.length && !counter.length) continue;
    const timeline = scene(node, 'reveal');
    if (art.length) timeline.fromTo(art, {
      clipPath: desktop ? 'inset(18% 8% round 24%)' : 'inset(8% 3% round 12%)',
      scale: desktop ? .9 : .96
    }, { clipPath: 'inset(0% 0% round 0%)', scale: 1, ease: 'none' }, 0);
    if (counter.length) timeline.fromTo(counter, {
      x: node.classList.contains('reversed') ? 18 : -18,
      y: desktop ? 30 : 12
    }, { x: 0, y: 0, ease: 'none' }, 0);
  }
  // Reading surfaces settle into place; no fading, distortion or clipping of copy.
  for (const node of select('[data-current-reading]')) {
    const surface = node.querySelector('[data-current-surface]');
    if (surface) scene(node, 'reading', 'top 94%').fromTo(surface,
      { y: desktop ? 24 : 10 }, { y: 0, ease: 'none' });
  }

  const focus = (event: FocusEvent) => {
    for (const [node, timeline] of timelines) {
      if (!node.contains(event.target as Node)) continue;
      // Focus wins over choreography, including tabbing into an unrevealed film.
      timeline.scrollTrigger?.disable(false);
      timeline.progress(1);
    }
  };
  root.addEventListener('focusin', focus);

  // Intrinsic film ratios may settle after setup. Refresh only our live scenes,
  // coalesced on media load, never on scroll or every rendered frame.
  let frame = 0;
  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      timelines.forEach(timeline => timeline.scrollTrigger?.refresh());
    });
  };
  root.addEventListener('loadedmetadata', refresh, true);
  root.addEventListener('load', refresh, true);
  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener('focusin', focus);
    root.removeEventListener('loadedmetadata', refresh, true);
    root.removeEventListener('load', refresh, true);
    // The calling context owns reversion, including dynamic reduced motion.
  };
}
