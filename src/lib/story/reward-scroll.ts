import { resetScrollMotion, scrollToPosition } from '$lib/motion/smooth-scroll';

/** Catch downward momentum at the desktop summary without adding a scroll container. */
export function installRewardScroll(root: HTMLElement, enabled: () => boolean, reduced: () => boolean) {
  let reachedAt = 0;
  let lastInput = 0;
  let released = false;

  function advance(delta: number, event: WheelEvent | KeyboardEvent) {
    if (!enabled() || document.documentElement.classList.contains('ask-present')) return;
    const ending = root.querySelector<HTMLElement>('.story-ending');
    if (!ending) return;
    const destination = scrollY + ending.getBoundingClientRect().top - 86;
    if (scrollY < destination - 400) { reachedAt = 0; released = false; }
    // Upward input, direct links, scrollbar dragging and End retain their native behavior.
    if (delta <= 0) { if (reachedAt) released = true; return; }
    if (released || scrollY > destination + 8) return;
    if (scrollY + delta < destination - 240) return;

    const now = performance.now();
    const freshGesture = now - lastInput > 180;
    lastInput = now;
    if (reachedAt && now - reachedAt >= (reduced() ? 500 : 1900) && freshGesture) {
      released = true;
      return;
    }
    if (!event.cancelable) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    resetScrollMotion();
    if (reachedAt) {
      // A continuing gesture becomes responsive again after the reveal; it cannot
      // hold the page indefinitely when a mouse sends an uninterrupted stream.
      if (now - reachedAt > 2600) { released = true; scrollToPosition(scrollY + Math.min(delta * .25, 120), 0); }
      return;
    }
    const next = Math.min(destination, scrollY + Math.min(delta * .28, 180));
    scrollToPosition(next, 0);
    if (next >= destination - 1) reachedAt = now;
  }

  function wheel(event: WheelEvent) {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    // Let genuinely scrollable answers and the summary consume their own input.
    let element = event.target instanceof Element ? event.target : null;
    while (element && element !== document.body) {
      if (element instanceof HTMLElement && /auto|scroll/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 1) {
        if (event.deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1 || event.deltaY < 0 && element.scrollTop > 0) return;
      }
      element = element.parentElement;
    }
    advance(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1), event);
  }
  function key(event: KeyboardEvent) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || (event.target as Element)?.closest('input,textarea,select,button,a,[contenteditable="true"],[role="scrollbar"]')) return;
    if (event.key === 'PageDown' || event.key === ' ') advance(innerHeight * .85, event);
    else if (event.key === 'ArrowDown') advance(48, event);
    else if (['ArrowUp', 'PageUp', 'Home', 'End'].includes(event.key)) released = true;
  }
  window.addEventListener('wheel', wheel, { capture: true, passive: false });
  window.addEventListener('keydown', key, true);
  return () => {
    window.removeEventListener('wheel', wheel, true);
    window.removeEventListener('keydown', key, true);
  };
}
