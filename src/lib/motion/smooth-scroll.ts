import Lenis from 'lenis';
import { pushState } from '$app/navigation';
import { motionState, prefersReducedMotion } from './policy';

let lenis: Lenis | undefined;
let cancelJourney: (() => void) | undefined;
export const PROJECT_TRANSITION_MS = 280;
export const SCROLL_TRANSITION_MS = 320;
const easeTravel = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

/** One scroll owner for wheel input, project changes, and in-page links. */
export function installSmoothScroll({ smoothWheel = true } = {}) {
  const unsubscribe = motionState.subscribe(({ reduced }) => {
    cancelJourney?.();
    if (reduced) { lenis?.destroy(); lenis = undefined; return; }
    lenis ??= new Lenis({
      // Gentle wheel response with a short, controlled settling tail.
      autoRaf: true, smoothWheel, syncTouch: false, lerp: 0.18,
      wheelMultiplier: 0.9,
      anchors: false, stopInertiaOnNavigate: true, allowNestedScroll: true,
      prevent: node => ['TEXTAREA', 'SELECT'].includes(node.tagName) || node.hasAttribute('data-scroll-native')
    });
  });
  const click = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.hasAttribute('data-mobile-route-link') || link.download || link.target && link.target !== '_self') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let target: HTMLElement | null;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    if (location.hash !== url.hash) pushState(url, {});
    scrollToElement(target, { focus: true, duration: target.id === 'main' ? 0 : undefined });
  };
  // Native keyboard scrolling must take ownership immediately, even halfway
  // through a wheel tween. Otherwise its next frame restores the wheel target.
  const keyboard = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input,textarea,select,[contenteditable="true"],[role="slider"],[role="scrollbar"]')) return;
    if (event.key === ' ' && target?.closest('button,a')) return;
    resetScrollMotion();
  };
  document.addEventListener('click', click, true);
  window.addEventListener('keydown', keyboard, true);
  return () => {
    cancelJourney?.(); unsubscribe(); lenis?.destroy(); lenis = undefined;
    document.removeEventListener('click', click, true);
    window.removeEventListener('keydown', keyboard, true);
  };
}

function focusTarget(target: HTMLElement) {
  if (!target.isConnected) return;
  if (!target.matches('a,button,input,select,textarea,[tabindex]')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}

export function scrollToPosition(top: number, duration = SCROLL_TRANSITION_MS, onComplete?: () => void) {
  cancelJourney?.();
  const destination = Math.max(0, top);
  if (!lenis || prefersReducedMotion() || duration === 0) {
    window.scrollTo({ top: destination, behavior: 'instant' });
    onComplete?.(); return () => {};
  }
  const owner = lenis;
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
  let finished = false;
  const cleanup = () => {
    events.forEach(type => window.removeEventListener(type, cancel, true));
    if (cancelJourney === cancel) cancelJourney = undefined;
  };
  const cancel = () => {
    if (finished) return;
    finished = true; cleanup();
    owner.scrollTo(window.scrollY, { immediate: true, force: true });
  };
  cancelJourney = cancel;
  events.forEach(type => window.addEventListener(type, cancel, { passive: true, capture: true }));
  owner.resize();
  owner.scrollTo(destination, { duration: duration / 1000, lerp: 0, easing: easeTravel,
    onComplete: () => { if (finished) return; finished = true; cleanup(); onComplete?.(); }
  });
  return cancel;
}

export function scrollToElement(target: HTMLElement, options: { offset?: number; duration?: number; focus?: boolean } = {}) {
  // Honor case-study sticky navigation while keeping the homepage's 40px inset.
  const pageInset = Math.max(40, parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
  const top = window.scrollY + target.getBoundingClientRect().top - (options.offset ?? pageInset);
  // Time the actual reachable distance, including pages shorter than the viewport.
  const destination = Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  const duration = options.duration ?? Math.min(1250, Math.max(650, Math.abs(destination - window.scrollY) * 0.65));
  return scrollToPosition(destination, duration, options.focus ? () => focusTarget(target) : undefined);
}

/** Stop the outgoing page's inertia before SvelteKit restores the next position. */
export function resetScrollMotion() {
  cancelJourney?.();
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}

export function syncScrollPosition() {
  lenis?.resize();
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}
