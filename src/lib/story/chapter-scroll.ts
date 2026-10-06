import gsap from 'gsap';
import { motion } from '$lib/motion/tokens';
import { resetScrollMotion, syncScrollPosition } from '$lib/motion/smooth-scroll';

export const REWARD_HOLD_MS = 2200;
const GESTURE_GAP_MS = 180;
const STEP_INTERVAL_MS = 850;
const TOP = 64;
const BOTTOM = 100;

/** One scroll owner, scoped to Story. Input advances a chapter, never a fraction
 * of a wheel delta. Tall mobile chapters retain readable steps within the chapter.
 * Scrollbar, navigation links, reverse input and Escape always provide an exit. */
export function installChapterScroll(root: HTMLElement, options: {
  index: () => number;
  reduced: () => boolean;
  settled: (index: number) => void;
  holding: (value: boolean) => void;
}) {
  let tween: gsap.core.Tween | undefined;
  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let holding = false;
  let rewarded = false;
  let lastInput = 0;
  let lastStep = -Infinity;
  let lastDirection = 0;
  let targetIndex = options.index();
  let touchY = 0;
  let touchHandled = false;
  let touchIgnored = false;
  let disposed = false;
  const sections = () => [...root.querySelectorAll<HTMLElement>('[data-story-section]')];
  const usable = () => Math.max(160, innerHeight - TOP - BOTTOM);
  const center = () => TOP + usable() / 2;
  const clamp = (y: number) => Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight));
  function release() {
    clearTimeout(holdTimer);
    holding = false;
    options.holding(false);
  }
  function cancel() { tween?.kill(); tween = undefined; release(); syncScrollPosition(); }
  function hold() {
    if (rewarded || options.reduced()) return;
    rewarded = true;
    holding = true;
    options.holding(true);
    holdTimer = setTimeout(release, REWARD_HOLD_MS);
  }
  function travel(y: number, index: number, focus = false) {
    tween?.kill();
    resetScrollMotion();
    targetIndex = index;
    const position = { y: scrollY };
    const finish = () => {
      tween = undefined;
      if (disposed) return;
      syncScrollPosition();
      options.settled(index);
      if (index < 8) rewarded = false;
      if (index === 8) hold();
      if (focus) {
        const section = sections()[index];
        section?.setAttribute('tabindex', '-1');
        section?.focus({ preventScroll: true });
      }
    };
    if (options.reduced()) { window.scrollTo({ top: clamp(y), behavior: 'instant' }); finish(); return; }
    tween = gsap.to(position, { y: clamp(y), duration: motion.cinematic, ease: 'power3.inOut',
      onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }), onComplete: finish });
  }
  function go(index: number, focus = true) {
    release();
    const next = Math.max(0, Math.min(8, index));
    const section = sections()[next];
    if (!section) return;
    const box = section.getBoundingClientRect();
    const y = scrollY + box.top - (box.height > usable() + 2 ? TOP : center() - box.height / 2);
    lastStep = performance.now();
    travel(y, next, focus);
  }
  function advance(direction: number) {
    if (holding && direction > 0) return;
    if (direction < 0) release();
    const index = tween ? targetIndex : options.index();
    const section = sections()[index];
    if (!section) return;
    const box = section.getBoundingClientRect();
    // Let a long answer/inline scene be read before moving to another chapter.
    if (box.height > usable() + 2 && index < 8) {
      const start = scrollY + box.top - TOP;
      const end = scrollY + box.bottom - innerHeight + BOTTOM;
      if (direction > 0 && scrollY < end - 4) { travel(Math.min(end, scrollY + usable() * .8), index); return; }
      if (direction < 0 && scrollY > start + 4) { travel(Math.max(start, scrollY - usable() * .8), index); return; }
    }
    if (index === 8 && direction > 0) {
      // After the reveal, continue through the summary/contact at native speed.
      return;
    }
    go(index + direction, false);
  }
  function owns(direction: number, target: EventTarget | null) {
    if (document.documentElement.classList.contains('ask-present')) return false;
    if (target instanceof Element && target.closest('input,textarea,select,[contenteditable="true"],[role="slider"],#story-chapters')) return false;
    const box = root.getBoundingClientRect();
    if (box.bottom < innerHeight * .5 || box.top > innerHeight * .6) return false;
    if (options.index() === 8 && direction > 0 && !holding && !tween) return false;
    if (options.index() === 0 && direction < 0 && !tween) return false;
    return true;
  }
  function consume(event: Event) { if (event.cancelable) event.preventDefault(); event.stopImmediatePropagation(); }
  function wheel(event: WheelEvent) {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
    const direction = Math.sign(event.deltaY);
    if (!owns(direction, event.target)) return;
    consume(event);
    const now = performance.now();
    const fresh = now - lastInput > GESTURE_GAP_MS;
    const reverse = direction !== lastDirection;
    lastInput = now;
    if (reverse || (!tween && (fresh || now - lastStep > STEP_INTERVAL_MS))) {
      lastDirection = direction; lastStep = now; advance(direction);
    }
  }
  function key(event: KeyboardEvent) {
    if (event.key === 'Escape') { cancel(); return; }
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || (event.target instanceof Element && event.target.closest('input,textarea,select,button,a,[contenteditable="true"],[role="scrollbar"]'))) return;
    if (event.key === 'Home' || event.key === 'End') { cancel(); return; }
    const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
    if (!direction || !owns(direction, event.target)) return;
    consume(event);
    if (!event.repeat || !tween && performance.now() - lastStep > STEP_INTERVAL_MS) { lastStep = performance.now(); advance(direction); }
  }
  function touchStart(event: TouchEvent) {
    touchY = event.touches[0]?.clientY ?? 0; touchHandled = false;
    touchIgnored = event.touches.length !== 1;
  }
  function touchMove(event: TouchEvent) {
    if (touchIgnored || event.touches.length !== 1) return;
    const delta = touchY - event.touches[0].clientY;
    if (Math.abs(delta) < 12) return;
    const direction = Math.sign(delta);
    if (!touchHandled && !owns(direction, event.target)) return;
    consume(event);
    if (!touchHandled && Math.abs(delta) > 36) { touchHandled = true; advance(direction); }
  }
  function pointer(event: PointerEvent) {
    // A direct navigation choice or scrollbar drag always overrides choreography.
    if (event.target instanceof Element && event.target.closest('a,button,[role="scrollbar"]') || event.clientX >= document.documentElement.clientWidth) cancel();
  }
  function resize() { cancel(); }
  window.addEventListener('wheel', wheel, { capture: true, passive: false });
  window.addEventListener('keydown', key, true);
  window.addEventListener('touchstart', touchStart, { capture: true, passive: true });
  window.addEventListener('touchmove', touchMove, { capture: true, passive: false });
  window.addEventListener('pointerdown', pointer, true);
  window.addEventListener('resize', resize);
  return { go, release, animating: () => Boolean(tween),
    preference: () => { if (options.reduced()) { tween?.progress(1); release(); } },
    arrived: (index: number) => { if (index < 8) rewarded = false; else if (!tween) hold(); },
    destroy() {
      disposed = true; cancel();
      window.removeEventListener('wheel', wheel, true);
      window.removeEventListener('keydown', key, true);
      window.removeEventListener('touchstart', touchStart, true);
      window.removeEventListener('touchmove', touchMove, true);
      window.removeEventListener('pointerdown', pointer, true);
      window.removeEventListener('resize', resize);
    }
  };
}
