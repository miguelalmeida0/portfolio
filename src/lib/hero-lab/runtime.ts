import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { motionSnapshot, motionState } from '$lib/motion/policy';
import { driveSmoothScroll, smoothScrollInstance } from '$lib/motion/smooth-scroll';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export type LabCapabilities = { desktop: boolean; fine: boolean; compact: boolean };
export type LabSetup = (
  root: HTMLElement,
  capabilities: LabCapabilities,
  tools: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; ready: () => void }
) => void | (() => void);

/** Named curves shared by the three directions; each direction chooses its own. */
export const curves = {
  // Long editorial settle: fast departure, very soft landing.
  settle: CustomEase.create('lab-settle', '0.16,1,0.3,1'),
  // Shutter: symmetric, decisive mechanical travel.
  shutter: CustomEase.create('lab-shutter', '0.76,0,0.24,1'),
  // Camera: slow start like a dolly gaining weight, long deceleration.
  dolly: CustomEase.create('lab-dolly', '0.65,0.05,0.15,1'),
  // Product response: quick and slightly springy without overshooting layout.
  snap: CustomEase.create('lab-snap', '0.2,0.9,0.25,1')
};

type Inspector = { mode: 'lenis' | 'native-reduced'; lenis: unknown; integration: string; scrollTrigger: typeof ScrollTrigger };
declare global { interface Window { __canonScroll?: Inspector } }

/**
 * One owner per prototype: GSAP's ticker drives Lenis, ScrollTrigger listens to
 * Lenis, and reduced motion or teardown reverts every tween, trigger and listener.
 */
export function labMotion(root: HTMLElement, setup: LabSetup) {
  motionSnapshot();
  const tick = { add: (fn: (t: number) => void) => gsap.ticker.add(fn), remove: (fn: (t: number) => void) => gsap.ticker.remove(fn) };
  const releaseScroll = driveSmoothScroll({ ...tick, onScroll: () => ScrollTrigger.update() });
  gsap.ticker.lagSmoothing(0);

  // QA inspector for the Canon scroll audit; a read-only view of live state.
  const inspector = {
    get mode() { return smoothScrollInstance() ? 'lenis' as const : 'native-reduced' as const; },
    get lenis() { return smoothScrollInstance() ?? null; },
    integration: 'gsap-ticker',
    scrollTrigger: ScrollTrigger
  };
  window.__canonScroll = inspector;

  let media: gsap.MatchMedia | undefined;
  let previous: boolean | undefined;
  let stopped = false;
  const ready = () => { root.dataset.labReady = ''; };

  const unsubscribe = motionState.subscribe(({ reduced }) => {
    if (previous === reduced) return;
    previous = reduced;
    media?.revert();
    media = undefined;
    if (reduced) {
      root.dataset.labMotion = 'static';
      ready();
      return;
    }
    root.dataset.labMotion = 'full';
    media = gsap.matchMedia(root);
    media.add({
      desktop: '(min-width: 1024px)',
      compact: '(max-width: 1023px)',
      fine: '(hover: hover) and (pointer: fine)',
      reduce: '(prefers-reduced-motion: reduce)'
    }, context => {
      const c = context.conditions ?? {};
      if (c.reduce) { ready(); return; }
      // Release the armed CSS first: `from()` tweens read the resting values as
      // their destination. Both happen in this task, so no frame paints between.
      ready();
      const cleanup = setup(root, { desktop: Boolean(c.desktop), fine: Boolean(c.fine), compact: Boolean(c.compact) }, { gsap, ScrollTrigger, ready });
      return () => { cleanup?.(); };
    });
  });

  // Fonts and lazy media change layout once; refresh triggers a single time each.
  const refresh = () => { if (!stopped) ScrollTrigger.refresh(); };
  void document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });

  const covered = () => { stopped = true; unsubscribe(); media?.revert(); media = undefined; releaseScroll(); };
  window.addEventListener('route:covered', covered);
  return {
    destroy() {
      stopped = true;
      window.removeEventListener('route:covered', covered);
      unsubscribe();
      media?.revert();
      window.removeEventListener('load', refresh);
      releaseScroll();
      gsap.ticker.lagSmoothing(500, 33);
      if (window.__canonScroll === inspector) delete window.__canonScroll;
      delete root.dataset.labReady;
      delete root.dataset.labMotion;
    }
  };
}

/** Physical zoom applied to `#portfolio-content` at desktop widths. */
export function contentZoom(node: Element) {
  return parseFloat(getComputedStyle(node.closest('#portfolio-content') ?? node).zoom || '1') || 1;
}
