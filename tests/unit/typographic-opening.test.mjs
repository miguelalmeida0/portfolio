import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { gsap } from 'gsap';

const sourceRoot = process.env.TYPOGRAPHIC_SOURCE_ROOT ?? '.';
const source = ts.transpileModule(fs.readFileSync(`${sourceRoot}/src/lib/hero-lab/typographic/pages/motion.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;

class Events extends EventTarget {
  listeners = new Map();
  scrollY = 0;
  dataset = {};
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
    this.listeners.set(type, listener);
  }
  removeEventListener(type, listener, options) {
    super.removeEventListener(type, listener, options);
    this.listeners.delete(type);
  }
}

function setup() {
  const window = new Events(), root = new Events();
  const exports = {};
  vm.runInNewContext(source, { exports, window, queueMicrotask, require: () => ({ curves: { settle: 'power3.out', shutter: 'power3.inOut' } }) });
  assert.equal(typeof exports.opening, 'function', 'the opening must yield to reader intent');
  return { window, root, opening: exports.opening };
}

for (const type of ['wheel', 'touchstart', 'scroll', 'keydown', 'focusin']) {
  test(`opening settles immediately on ${type} and releases listeners`, () => {
    const { window, root, opening } = setup();
    const { timeline } = opening(root, gsap);
    const portrait = { position: 6 }, typePlane = { position: 104 };
    timeline.to(portrait, { position: 0, duration: 1 }).to(typePlane, { position: 0, duration: 1 }, .2).pause();
    timeline.progress(.25);
    assert.ok(portrait.position > 0 && typePlane.position > 0);
    const event = new Event(type);
    if (type === 'keydown') Object.defineProperty(event, 'key', { value: 'Tab' });
    if (type === 'scroll') window.scrollY = 100;
    (type === 'focusin' ? root : window).dispatchEvent(event);
    assert.equal(portrait.position, 0);
    assert.equal(typePlane.position, 0);
    assert.equal(window.listeners.size + root.listeners.size, 0);
    timeline.kill();
  });
}

test('returning to a page shortens the opening without changing its final state', () => {
  const { root, opening } = setup();
  const first = opening(root, gsap);
  const initial = { y: 6 };
  first.timeline.to(initial, { y: 0, duration: 1 }).progress(1);
  first.dispose();
  const second = opening(root, gsap);
  const returning = { y: 6 };
  second.timeline.to(returning, { y: 0, duration: 1 }).pause();
  assert.ok(second.timeline.duration() / second.timeline.timeScale() < first.timeline.duration() / first.timeline.timeScale());
  second.timeline.progress(1);
  assert.equal(returning.y, initial.y);
  second.dispose(); first.timeline.kill(); second.timeline.kill();
});

test('teardown removes all input listeners without completing the outgoing timeline', () => {
  const { window, root, opening } = setup();
  const { timeline, dispose } = opening(root, gsap);
  const state = { y: 6 };
  timeline.to(state, { y: 0, duration: 1 }).pause();
  dispose(); dispose();
  window.dispatchEvent(new Event('wheel'));
  assert.equal(state.y, 6);
  assert.equal(window.listeners.size + root.listeners.size, 0);
  timeline.kill();
});

test('an opening mounted at restored scroll settles after its tweens are constructed', async () => {
  const { window, root, opening } = setup();
  window.scrollY = 300;
  const { timeline } = opening(root, gsap);
  const state = { y: 6 };
  timeline.to(state, { y: 0, duration: 1 }).pause();
  await Promise.resolve();
  assert.equal(state.y, 0);
  assert.equal(window.listeners.size + root.listeners.size, 0);
  timeline.kill();
});

test('disposal cancels the deferred restored-scroll check', async () => {
  const { window, root, opening } = setup();
  window.scrollY = 300;
  const { timeline, dispose } = opening(root, gsap);
  const state = { y: 6 };
  timeline.to(state, { y: 0, duration: 1 }).pause();
  dispose();
  await Promise.resolve();
  assert.equal(state.y, 6);
  timeline.kill();
});
