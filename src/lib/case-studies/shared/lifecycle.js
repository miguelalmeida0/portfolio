export function lifecycle() {
  const timers = new Set(), frames = new Set(), cleanups = [];
  let alive = true;
  const reduce = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function later(fn, ms) { const id = setTimeout(() => { timers.delete(id); if (alive) fn(); }, ms); timers.add(id); return id; }
  function cancel(id) { clearTimeout(id); timers.delete(id); }
  function frame(fn) { const id = requestAnimationFrame(() => { frames.delete(id); if (alive) fn(); }); frames.add(id); return id; }
  function listen(target, type, fn) { target.addEventListener(type, fn); cleanups.push(() => target.removeEventListener(type, fn)); }
  function observe(observer, elements) { elements.forEach(el => observer.observe(el)); cleanups.push(() => observer.disconnect()); }
  function destroy() { alive = false; timers.forEach(clearTimeout); frames.forEach(cancelAnimationFrame); cleanups.forEach(fn => fn()); }
  return { reduce, later, cancel, frame, listen, observe, destroy, get alive() { return alive; } };
}
