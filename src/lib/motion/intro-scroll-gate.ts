/** Consume only the gesture that opens the portfolio, including its inertial tail. */
export function introScrollGate(onIntent: () => void) {
  let started: number | undefined;
  let lastInput = 0;
  let touching = false;
  let touchY: number | undefined;
  let released = false;
  let timer: ReturnType<typeof setTimeout>;
  const release = () => {
    released = true;
    clearTimeout(timer);
    window.removeEventListener('wheel', wheel, true);
    window.removeEventListener('touchstart', touchstart, true);
    window.removeEventListener('touchmove', touchmove, true);
    window.removeEventListener('touchend', touchend, true);
    window.removeEventListener('touchcancel', touchend, true);
    window.removeEventListener('keydown', keydown, true);
  };
  const settle = () => {
    if (released || started === undefined) return;
    const now = performance.now();
    // Bounded grace period: never leave a scroll trap if a device keeps emitting events.
    if (now - started >= 1800 || (!touching && now - started >= 700 && now - lastInput >= 180)) release();
    else timer = setTimeout(settle, 50);
  };
  const consume = (event: Event) => {
    if (released || !event.isTrusted) return;
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation(); // Lenis must not accumulate the dismissed gesture.
    lastInput = performance.now();
    if (started === undefined) {
      started = lastInput;
      timer = setTimeout(settle, 700);
      onIntent();
    }
  };
  const wheel = (event: WheelEvent) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) > Math.abs(event.deltaX)) consume(event);
  };
  const touchstart = (event: TouchEvent) => {
    if (!event.isTrusted) return;
    touching = event.touches.length === 1;
    touchY = touching ? event.touches[0].clientY : undefined;
  };
  const touchmove = (event: TouchEvent) => {
    if (touchY !== undefined && event.touches.length === 1 && Math.abs(event.touches[0].clientY - touchY) > 8) consume(event);
  };
  const touchend = () => { touching = false; touchY = undefined; lastInput = performance.now(); };
  const keydown = (event: KeyboardEvent) => {
    if (!event.isTrusted || (event.repeat && started === undefined)) return;
    if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
    if ((event.target as Element)?.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) consume(event);
  };
  window.addEventListener('wheel', wheel, { capture: true, passive: false });
  window.addEventListener('touchstart', touchstart, { capture: true, passive: true });
  window.addEventListener('touchmove', touchmove, { capture: true, passive: false });
  window.addEventListener('touchend', touchend, { capture: true, passive: true });
  window.addEventListener('touchcancel', touchend, { capture: true, passive: true });
  window.addEventListener('keydown', keydown, true);
  return release;
}
