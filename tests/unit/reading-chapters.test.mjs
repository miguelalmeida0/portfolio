import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { readingGeometry, readingChapters } = await loadLocalTs('src/lib/hero-lab/typographic/reading-chapters.ts');

test('reading headings clear both navigation bars under desktop zoom', () => {
  assert.deepEqual(readingGeometry(1000, 88, 64, .8, 300, true), { topCss: 210, held: true });
  assert.equal(readingGeometry(1000, 88, 0, .8, 300, true).topCss, 130);
  assert.equal(readingGeometry(1000, 88, 0, 0, 300, true).topCss, 104);
});

test('long headings, short screens and mobile remain in natural flow', () => {
  for (const args of [[1000,88,64,.8,900,true], [640,88,64,.8,200,true], [844,68,0,1,200,false], [1000,88,0,1,0,true]]) {
    assert.equal(readingGeometry(...args).held, false);
  }
});

function harness() {
  const listeners = new Map(), styles = new Map(), attrs = new Set(), frames = new Map(), calls = [];
  let disconnected = false, refreshes = 0, completed = false, disabled = false;
  const head = { dataset: {}, offsetHeight: 240,
    toggleAttribute(k,v) { v ? attrs.add(k) : attrs.delete(k); }, removeAttribute(k) { attrs.delete(k); },
    style: { setProperty: (k,v) => styles.set(k,v), removeProperty: k => styles.delete(k) } };
  const control = {};
  const section = { dataset: {}, querySelector: () => head, contains: node => node === control };
  const root = { querySelectorAll: () => [section], querySelector: () => ({ offsetHeight: 80 }), closest: () => null,
    addEventListener: (k,v) => listeners.set(k,v), removeEventListener: k => listeners.delete(k) };
  global.innerHeight = 1000;
  global.getComputedStyle = () => ({ zoom: '.8' });
  global.document = { querySelector: () => ({ getBoundingClientRect: () => ({ height: 88 }) }) };
  global.window = { addEventListener: (k,v) => listeners.set(k,v), removeEventListener: k => listeners.delete(k) };
  global.requestAnimationFrame = fn => { frames.set(1,fn); return 1; };
  global.cancelAnimationFrame = id => frames.delete(id);
  global.ResizeObserver = class { observe() {} disconnect() { disconnected = true; } };
  const gsap = { fromTo(target, from, to) { calls.push({target,from,to}); return {
    scrollTrigger: { disable() { disabled = true; } }, progress(v) { completed = v === 1; }
  }; } };
  const ScrollTrigger = { refresh() { refreshes++; } };
  return { root, head, section, control, listeners, styles, attrs, frames, calls, gsap, ScrollTrigger,
    stats: () => ({disconnected,refreshes,completed,disabled}) };
}

test('all page kinds animate editorial heads from static sections, never product controls', () => {
  for (const kind of ['story','cv','case']) {
    const f = harness(); const stop = readingChapters(f.root,f.gsap,f.ScrollTrigger,true,kind);
    assert.equal(f.section.dataset.readerSection,kind);
    assert.equal(f.head.dataset.readerHead,kind);
    assert.equal(f.calls.length,2);
    for (const call of f.calls) {
      assert.equal(call.target,f.head); assert.notEqual(call.target,f.control);
      assert.equal(call.to.scrollTrigger.trigger,f.section);
      assert.equal(call.to.scrollTrigger.pin,undefined);
      assert.equal(call.to.scrollTrigger.scrub,true);
    }
    stop();
  }
});

test('focus completes a chapter arrival; resize and route cleanup leave no observers or sticky attrs', () => {
  const f = harness(); const stop = readingChapters(f.root,f.gsap,f.ScrollTrigger,true,'story');
  assert.equal(f.styles.get('--reader-top'),'130px');
  assert.equal(f.attrs.has('data-reader-held'),true);
  f.listeners.get('focusin')({target:f.control});
  assert.equal(f.stats().completed,true); assert.equal(f.stats().disabled,true);
  f.head.offsetHeight = 1400;
  f.listeners.get('resize')(); f.listeners.get('resize')();
  assert.equal(f.frames.size,1);
  f.frames.get(1)();
  assert.equal(f.attrs.has('data-reader-held'),false);
  stop();
  assert.equal(f.stats().disconnected,true);
  assert.equal(f.listeners.size,0); assert.equal(f.styles.size,0); assert.equal(f.attrs.size,0);
  assert.equal(f.section.dataset.readerSection,undefined); assert.equal(f.head.dataset.readerHead,undefined);
});

test('case headings never become a second sticky layer above interactive content', () => {
  const f = harness(); const stop = readingChapters(f.root,f.gsap,f.ScrollTrigger,true,'case');
  assert.equal(f.attrs.has('data-reader-held'),false);
  stop();
});
