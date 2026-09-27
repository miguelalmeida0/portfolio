import { introScrollGate } from './intro-scroll-gate';
import { resetScrollMotion } from './smooth-scroll';
import { shortcutStairs } from './shortcut-stairs';
import { motionState, prefersReducedMotion } from './policy';
import type { gsap as Gsap } from 'gsap';
import type { SplitText as Split } from 'gsap/SplitText';

/** A brief presentation over the existing layout. The opening gesture reveals the hero before normal scrolling resumes. */
export function pixelIntroduction(node: HTMLElement) {
  const root = document.documentElement;
  const site = document.getElementById('portfolio-content');
  if (root.dataset.presentation !== 'pending') return {};
  const restoreScroll = () => {
    if (root.dataset.introRestoration) {
      history.scrollRestoration = root.dataset.introRestoration as ScrollRestoration;
      delete root.dataset.introRestoration;
    }
  };
  if (!site || prefersReducedMotion()) {
    root.dataset.presentation = 'complete';
    restoreScroll();
    return {};
  }
  root.dataset.introHydrated = 'true';
  // Only fresh, non-deep-linked homepage introductions reach this branch.
  window.scrollTo({ top: 0, behavior: 'instant' });
  resetScrollMotion();

  let done = false;
  let dismissing = false;
  let dismissal: Animation | undefined;
  let removeShortcut: (() => void) | undefined;
  let releaseScroll = () => {};
  let context: ReturnType<typeof Gsap.context> | undefined;
  let timeline: ReturnType<typeof Gsap.timeline> | undefined;
  let split: Split | undefined;
  let frameRequest = 0;
  let elapsed = 0;
  let lastFrame: number | undefined;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  let unsubscribe = () => {};
  const canPlay = () => !document.hidden && !(document as Document & { prerendering?: boolean }).prerendering;
  const hadInert = site.inert;
  // Block focus/interaction behind the overlay, including while its bundle loads.
  site.inert = true;
  const positionEvents = ['scroll', 'resize', 'pageshow', 'load'] as const;
  const lifecycleEvents = ['popstate', 'pagehide'] as const;
  const visibilityEvents = ['visibilitychange', 'prerenderingchange'] as const;
  const finish = () => {
    if (done) return;
    done = true;
    const focusedInside = node.contains(document.activeElement);
    root.dataset.presentation = 'complete';
    delete root.dataset.introHydrated;
    dismissal?.cancel();
    removeShortcut?.();
    site.inert = hadInert;
    timeline?.kill();
    cancelAnimationFrame(frameRequest);
    context?.revert();
    split?.revert();
    restoreScroll();
    clearTimeout(deadline);
    lifecycleEvents.forEach(type => window.removeEventListener(type, finish, true));
    releaseScroll();
    window.removeEventListener('keydown', keydown, true);
    positionEvents.forEach(type => window.removeEventListener(type, pinStart));
    node.removeEventListener('click', exit);
    visibilityEvents.forEach(type => document.removeEventListener(type, visibility));
    unsubscribe();
    if (focusedInside) site.querySelector<HTMLAnchorElement>('[data-identity-home]')?.focus({ preventScroll: true });
  };
  // Interruption keeps the current pose; its opening gesture is consumed by the scroll gate.
  // Never seek the transfer timeline or restore its styles while it is visible.
  const dismiss = (preserveScrollJourney = false) => {
    if (done || dismissing) return;
    if (prefersReducedMotion()) { finish(); return; }
    dismissing = true;
    if (!preserveScrollJourney) resetScrollMotion();
    node.dataset.stage = 'dismissing';
    timeline?.kill();
    cancelAnimationFrame(frameRequest);
    clearTimeout(deadline);
    site.inert = hadInert;
    node.style.pointerEvents = 'none';
    removeShortcut = shortcutStairs(node);
    dismissal = node.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 320, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards'
    });
    // The overlay clears quickly; the non-interactive joke completes over the page.
    deadline = setTimeout(finish, 1550);
  };
  const keydown = (event: KeyboardEvent) => {
    if (event.isTrusted && (event.key === 'Tab' || event.key === 'Escape')) finish();
  };
  const exit = (event: MouseEvent) => {
    if (!event.isTrusted || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const control = (event.target as Element).closest('[data-intro-exit]');
    if (!control) return;
    releaseScroll();
    // The document's anchor handler has already started View work's scroll journey.
    dismiss(control instanceof HTMLAnchorElement);
  };
  // Count only visible playback. A background tab or prerender must not spend
  // the introduction before its visitor sees the page.
  const advance = (now: number) => {
    if (done || dismissing || !canPlay()) return;
    if (lastFrame !== undefined) elapsed += now - lastFrame;
    lastFrame = now;
    timeline?.totalTime(elapsed / 1000);
    if (!done && !dismissing) frameRequest = requestAnimationFrame(advance);
  };
  const visibility = () => {
    if (done) return;
    if (dismissing) { if (!canPlay()) finish(); return; }
    cancelAnimationFrame(frameRequest);
    clearTimeout(deadline);
    lastFrame = undefined;
    if (!canPlay()) return;
    // Retain the fail-open safeguard, but never let it expire off-screen.
    deadline = setTimeout(finish, 6500);
    if (timeline) frameRequest = requestAnimationFrame(advance);
  };
  // Scroll restoration, hydration and viewport changes are not user intent.
  // Stop pinning immediately on an intentional exit so View work can reach its anchor.
  const pinStart = () => {
    if (done || dismissing || (window.scrollX === 0 && window.scrollY === 0)) return;
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    resetScrollMotion();
  };
  lifecycleEvents.forEach(type => window.addEventListener(type, finish, { passive: true, capture: true }));
  releaseScroll = introScrollGate(dismiss);
  window.addEventListener('keydown', keydown, { capture: true });
  positionEvents.forEach(type => window.addEventListener(type, pinStart, { passive: true }));
  node.addEventListener('click', exit);
  visibilityEvents.forEach(type => document.addEventListener(type, visibility));
  unsubscribe = motionState.subscribe(({ reduced }) => { if (reduced) finish(); });

  async function start() {
    try {
      const [{ gsap }, { SplitText }] = await Promise.all([
        import('gsap'), import('gsap/SplitText'),
        document.fonts.ready
      ]);
      if (done || dismissing) return;
      if (root.dataset.presentation !== 'pending') { finish(); return; }
      gsap.registerPlugin(SplitText);

      const first = node.querySelector<HTMLElement>('[data-intro-first]')!;
      const last = node.querySelector<HTMLElement>('[data-intro-last]')!;
      const portrait = node.querySelector<HTMLElement>('[data-intro-portrait]')!;
      const avatar = node.querySelector<HTMLElement>('[data-intro-avatar]')!;
      const reaction = node.querySelector<HTMLElement>('[data-intro-reaction]')!;
      const mouth = node.querySelector<HTMLElement>('[data-intro-mouth]')!;
      const reactionImage = node.querySelector<HTMLImageElement>('[data-intro-reaction-image]')!;
      let canReact = false;
      void reactionImage.decode().then(() => { canReact = true; }).catch(() => {});
      const frame = node.querySelector<HTMLElement>('[data-intro-frame]')!;
      const tiles = [...node.querySelectorAll<HTMLElement>('[data-intro-tile]')];
      const backdrop = node.querySelector<HTMLElement>('[data-intro-backdrop]')!;
      const secondary = [...node.querySelectorAll<HTMLElement>('[data-intro-secondary]')];
      const still = import.meta.env.DEV && new URLSearchParams(location.search).get('intro') === 'still';
      root.dataset.presentation = still ? 'preview' : 'running';
      if (still) return;

      context = gsap.context(() => {
        split = SplitText.create([first, last], { type: 'chars', tag: 'span', charsClass: 'intro-letter', aria: 'none' });
        gsap.set(split.chars, { opacity: 0, yPercent: 24, willChange: 'transform, opacity' });
        node.dataset.stage = 'typing';
        timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: finish });
        // Reserve the full name's layout; reveal each glyph without moving its neighbours.
        timeline.to(split.chars, {
          opacity: 1, yPercent: 0, duration: .55,
          stagger: index => index * .12 + (index >= 6 ? .18 : 0)
        }, .24);
        timeline.set(split.chars, { clearProps: 'willChange' }, 2.45);
        timeline.call(() => { node.dataset.stage = 'hold'; }, [], 2.45);
        // Four crops of the original image assemble; the underlying portrait is untouched.
        timeline.to(tiles, { x: 0, y: 0, duration: .85, stagger: .06 }, .3);
        timeline.set(avatar, { opacity: 1 }, 1.34);
        timeline.set(tiles, { opacity: 0 }, 1.35);
        timeline.fromTo(frame, { scale: 1.06, opacity: .4 }, { scale: 1, opacity: 1, duration: .65 }, .45);
        // Blend only the selected eyes and smile; preserve the original silhouette.
        timeline.call(() => {
          node.dataset.stage = 'reaction';
          gsap.set([reaction, mouth], { visibility: canReact ? 'visible' : 'hidden' });
        }, [], 2.49);
        timeline.to(reaction, { opacity: 1, duration: .22, ease: 'sine.inOut' }, 2.49);
        timeline.to(mouth, { opacity: 1, duration: .24, ease: 'sine.inOut' }, 2.57);
        timeline.addLabel('transfer', 3.25);
        timeline.call(() => { node.dataset.stage = 'transfer'; }, [], 'transfer');
        timeline.to(secondary, { opacity: 0, y: -5, duration: .2, stagger: .025 }, 'transfer');
        timeline.to(frame, { opacity: 0, scale: .94, duration: .18 }, 'transfer');
        timeline.to(backdrop, { yPercent: -100, duration: .9, ease: 'power3.inOut' }, 'transfer+=.08');
        // Reveal the existing header without transforming or replacing its identity.
        timeline.to([first, last, portrait], {
          y: -32, opacity: 0, duration: .42, ease: 'power2.in'
        }, 'transfer');
      }, node);
      visibility();
    } catch (error) { if (import.meta.env.DEV) console.warn('Introduction settled without animation:', error); finish(); }
  }
  visibility();
  void start();
  return { destroy: finish };
}
