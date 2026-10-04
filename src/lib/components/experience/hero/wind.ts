export const LINES = ['Frontend developer', '& design engineer.'] as const;
export const WIND = {
  radius: 8, translate: 1.5, skew: 4, scaleYFloor: 0.985, hotThreshold: 0.72,
  graceMs: 1400, start: -8, span: 38, passMs: 8000, ease: 0.08
} as const;
export type Wind = { line: number; pos: number; strength?: number };
const smoothstep = (value: number) => value * value * (3 - 2 * value);
export function glyphStyle(line: number, index: number, wind: Wind) {
  const d = line === wind.line ? index - wind.pos : Infinity;
  const mag = Math.max(0, 1 - Math.abs(d) / WIND.radius);
  const eased = smoothstep(mag) * (wind.strength ?? 1);
  // Continuous direction avoids a flip as the pointer crosses a glyph center.
  const dir = Math.max(-1, Math.min(1, d));
  const plum = smoothstep(Math.max(0, (mag - WIND.hotThreshold) / (1 - WIND.hotThreshold))) * (wind.strength ?? 1);
  return {
    transform: eased > 0.001
      ? `translateX(${dir * WIND.translate * eased}px) skewX(${-dir * WIND.skew * eased}deg) scaleY(${1 - (1 - WIND.scaleYFloor) * eased})`
      : 'none',
    color: plum > 0 ? `color-mix(in srgb, var(--plum) ${plum * 100}%, var(--ink))` : 'var(--ink)'
  };
}

/** Pointer events only set targets. This is the sole frame owner and style writer. */
export function installWind(node: HTMLElement, debugPos?: { line: number; pos: number }) {
  const glyphs = [...node.querySelectorAll<HTMLElement>('[data-glyph]')];
  let targetPos: number = WIND.start, currentPos: number = WIND.start;
  let targetLine = 1, live = false, strength = 0;
  let frame = 0, visible = false, elapsed = 0, previous = 0, graceUntil = 0;
  function tick(now: number) {
    frame = 0;
    if (!visible || document.hidden) return;
    const delta = previous ? Math.min(now - previous, 50) : 16.67;
    previous = now;
    const ambient = !live && now >= graceUntil;
    if (ambient) {
      // Begin outside the text after the calm period or a completed pass;
      // never sweep backwards through the headline when the cycle wraps.
      if (elapsed === 0 || elapsed % WIND.passMs + delta >= WIND.passMs) {
        currentPos = WIND.start;
        strength = 0;
      }
      elapsed += delta;
      targetLine = 1;
      targetPos = WIND.start + (elapsed % WIND.passMs) / WIND.passMs * WIND.span;
    }
    // Normalize to 60Hz so high-refresh screens retain the same softness.
    const ease = 1 - Math.pow(1 - WIND.ease, delta / (1000 / 60));
    currentPos += (targetPos - currentPos) * ease;
    const release = 1 - Math.exp(-delta / 55);
    strength += ((live ? 1 : ambient ? 0.45 : 0) - strength) * (live || ambient ? ease : release);
    if (!live && !ambient && strength < 0.08) strength = 0;
    const wind: Wind = debugPos ?? { line: targetLine, pos: currentPos, strength };
    for (const glyph of glyphs) {
      const style = glyphStyle(Number(glyph.dataset.line), Number(glyph.dataset.glyph), wind);
      glyph.style.transform = style.transform;
      glyph.style.color = style.color;
    }
    if (!debugPos) frame = requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function move(event: PointerEvent) {
    const line = (event.target as HTMLElement).closest<HTMLElement>('.line');
    if (!line || debugPos) return;
    // Read stable layout boxes, not the bending glyph under the pointer.
    const rect = line.getBoundingClientRect();
    const children = [...line.querySelectorAll<HTMLElement>('[data-glyph]')];
    // Pointer coordinates are physical pixels; offsets use unzoomed CSS pixels.
    const scale = rect.width / line.offsetWidth || 1;
    const x = (event.clientX - rect.left) / scale;
    const origin = children[0]?.offsetLeft ?? 0;
    const glyph = children.find(g => x < g.offsetLeft - origin + g.offsetWidth) ?? children.at(-1);
    if (!glyph) return;
    const f = Math.max(0, Math.min(1, (x - (glyph.offsetLeft - origin)) / Math.max(1, glyph.offsetWidth)));
    targetLine = Number(glyph.dataset.line);
    targetPos = Number(glyph.dataset.glyph) + f - 0.5;
    live = true;
  }
  function leave() {
    live = false; elapsed = 0; graceUntil = performance.now() + WIND.graceMs;
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  observer.observe(node.closest('.wind-hero') ?? node);
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', resume);
  return () => {
    cancelAnimationFrame(frame); observer.disconnect();
    node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave);
    document.removeEventListener('visibilitychange', resume);
  };
}
