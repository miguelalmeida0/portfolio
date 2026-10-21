import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { chapterGeometry, chapterScroll } = await loadLocalTs('src/lib/hero-lab/typographic/chapter-scroll.ts', {
  stubs: { '$lib/motion/smooth-scroll': 'export function resetScrollMotion() {} export function syncScrollPosition() {}' }
});

test('deck fit uses physical height under desktop zoom and leaves nav clearance', () => {
  const g = chapterGeometry(900, 88, .8, [800, 900, 850, 720]);
  assert.equal(g.fits, true);
  assert.equal(g.top, 104);
  assert.equal(g.topCss, 130);
  assert.equal(g.availableCss * .8, 772);
  assert.equal(g.travelCss * .8, 1291);
});

test('a fully arrived project survives an ordinary wheel gesture before the next enters', () => {
  for (const viewport of [700, 800, 900, 1080]) {
    const g = chapterGeometry(viewport, 88, .8, [500, 520]);
    // The existing host multiplies a 200px wheel gesture by 1.8.
    const incomingTopAfterWheel = g.top + g.travelCss * .8 - 360;
    assert.ok(incomingTopAfterWheel >= viewport,
      `incoming card must stay offscreen at ${viewport}px, got ${incomingTopAfterWheel}`);
  }
});

test('one tall chapter or a short viewport disables the whole deck', () => {
  assert.equal(chapterGeometry(600, 88, .8, [800, 900]).fits, false);
  assert.equal(chapterGeometry(900, 88, .8, [800, 1100]).fits, false);
  assert.equal(chapterGeometry(900, 88, 1, [800, 700]).fits, false);
  assert.equal(chapterGeometry(900, 88, .8, []).fits, false);
  assert.equal(chapterGeometry(900, 88, .8, [800]).fits, false);
});

function harness() {
  const listeners = new Map(), styles = new Map(), frames = new Map();
  const style = () => ({ setProperty: (k, v) => styles.set(k, v), removeProperty: k => styles.delete(k) });
  const rows = [800, 900, 850, 720].map(offsetHeight => ({ offsetHeight, querySelector: () => ({}) }));
  const shells = rows.map(row => ({ querySelector: () => row, style: style() }));
  const root = { dataset: {}, style: style(), querySelectorAll: () => shells, closest: () => null,
    addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  let disconnects = 0, reversions = 0, refreshes = 0, scrolled = 0;
  const timelines = [];
  global.innerHeight = 900; global.innerWidth = 1440;
  global.getComputedStyle = () => ({ zoom: '.8' });
  global.document = { querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 88 }) }) };
  global.window = { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  global.requestAnimationFrame = fn => { frames.set(1, fn); return 1; };
  global.cancelAnimationFrame = id => frames.delete(id);
  global.ResizeObserver = class { observe() {} disconnect() { disconnects++; } };
  global.HTMLElement = class {
    visible = true;
    closest() { return shells[0]; }
    matches() { return this.visible; }
    scrollIntoView() { scrolled++; }
  };
  const gsap = {
    context(fn) { fn(); return { revert() { reversions++; } }; },
    timeline(config) { timelines.push(config); return { fromTo() { return this; } }; }
  };
  const ScrollTrigger = { refresh() { refreshes++; } };
  return { root, gsap, ScrollTrigger, listeners, styles, frames, timelines, rows, shells,
    stats: () => ({ disconnects, reversions, refreshes, scrolled }) };
}

test('native deck owns only three exchanges measured from static incoming shells', () => {
  const f = harness(); const dispose = chapterScroll(f.root, f.gsap, f.ScrollTrigger, false);
  assert.equal(f.listeners.size, 0); dispose();
  const stop = chapterScroll(f.root, f.gsap, f.ScrollTrigger, true);
  assert.equal(f.root.dataset.chapterMode, 'stacked');
  assert.equal(f.timelines.length, 3);
  f.timelines.forEach((t, i) => {
    assert.equal(t.scrollTrigger.trigger, f.shells[i + 1]);
    assert.equal(t.scrollTrigger.pin, undefined);
    assert.equal(t.scrollTrigger.scrub, true);
  });
  stop();
  assert.equal(f.root.dataset.chapterMode, undefined);
  assert.equal(f.styles.size, 0); assert.equal(f.listeners.size, 0);
  assert.equal(f.stats().disconnects, 1); assert.equal(f.stats().reversions, 1);
});

test('keyboard focus releases overlapping chapters, pointer focus preserves click geometry', () => {
  const f = harness(); const dispose = chapterScroll(f.root, f.gsap, f.ScrollTrigger, true);
  const target = new HTMLElement(); target.visible = false;
  f.listeners.get('focusin')({ target });
  assert.equal(f.root.dataset.chapterMode, 'stacked');
  target.visible = true;
  f.listeners.get('focusin')({ target });
  assert.equal(f.root.dataset.chapterMode, undefined);
  assert.equal(f.stats().scrolled, 1);
  f.listeners.get('resize')();
  assert.equal(f.frames.size, 0);
  dispose();
});

test('resize that makes a film too tall returns every chapter to normal flow', () => {
  const f = harness(); const dispose = chapterScroll(f.root, f.gsap, f.ScrollTrigger, true);
  f.rows[1].offsetHeight = 1400;
  f.listeners.get('loadedmetadata')(); f.listeners.get('resize')();
  assert.equal(f.frames.size, 1);
  f.frames.get(1)();
  assert.equal(f.root.dataset.chapterMode, undefined);
  assert.equal(f.styles.size, 0);
  assert.equal(f.stats().reversions, 1);
  dispose();
});
