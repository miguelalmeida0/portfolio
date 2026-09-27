import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('src/lib/motion/intro-scroll-gate.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const { introScrollGate } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const bootstrap = fs.readFileSync('src/app.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];

function eventTarget() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    emit(type, fields = {}) {
      const event = { type, isTrusted: true, cancelable: true, defaultPrevented: false, stopped: false,
        target: { closest: () => null }, deltaX: 0, deltaY: 0, touches: [],
        preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...fields };
      for (const fn of [...(listeners.get(type) ?? [])]) fn(event);
      return event;
    }
  };
}

function setup(t) {
  const previous = globalThis.window;
  const target = eventTarget();
  globalThis.window = target;
  let now = 0;
  t.mock.method(performance, 'now', () => now);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let intents = 0;
  const release = introScrollGate(() => intents++);
  t.after(() => { release(); globalThis.window = previous; });
  return { target, count: () => intents, release, advance(ms) { now += ms; t.mock.timers.tick(ms); } };
}

test('scroll and resize notifications are never input gestures', t => {
  const { target, count } = setup(t);
  for (const type of ['scroll', 'resize', 'load', 'pageshow']) target.emit(type);
  assert.equal(count(), 0);
});

test('synthetic wheel, keyboard and touch events cannot request a shortcut', t => {
  const { target, count } = setup(t);
  target.emit('wheel', { isTrusted: false, deltaY: 100 });
  target.emit('keydown', { isTrusted: false, key: 'PageDown' });
  target.emit('touchstart', { isTrusted: false, touches: [{ clientY: 100 }] });
  target.emit('touchmove', { isTrusted: false, touches: [{ clientY: 40 }] });
  assert.equal(count(), 0);
});

test('a genuine wheel gesture starts once even when the clock begins at zero', t => {
  const { target, count, advance } = setup(t);
  for (let i = 0; i < 3; i++) {
    const event = target.emit('wheel', { deltaY: 100 });
    assert.equal(event.defaultPrevented, true);
    assert.equal(event.stopped, true);
  }
  assert.equal(count(), 1);
  advance(1900);
  assert.equal(target.emit('wheel', { deltaY: 100 }).defaultPrevented, false);
  assert.equal(count(), 1);
});

test('horizontal gestures, zoom, repeats and editable controls do not skip', t => {
  const { target, count } = setup(t);
  target.emit('wheel', { deltaX: 100, deltaY: 1 });
  target.emit('wheel', { deltaY: 100, ctrlKey: true });
  target.emit('keydown', { key: 'PageDown', repeat: true });
  target.emit('keydown', { key: 'PageDown', target: { closest: () => ({}) } });
  target.emit('keydown', { key: 'r', metaKey: true });
  assert.equal(count(), 0);
});

test('a deliberate scroll key is consumed and release removes every listener', t => {
  const { target, count, release } = setup(t);
  assert.equal(target.emit('keydown', { key: 'PageDown' }).defaultPrevented, true);
  assert.equal(count(), 1);
  release(); release();
  assert.equal([...target.listeners.values()].some(listeners => listeners.size), false);
});

test('a single-finger swipe needs movement, not merely contact or a pinch', t => {
  const { target, count } = setup(t);
  target.emit('touchstart', { touches: [{ clientY: 100 }] });
  target.emit('touchmove', { touches: [{ clientY: 96 }] });
  assert.equal(count(), 0);
  target.emit('touchmove', { touches: [{ clientY: 80 }] });
  assert.equal(count(), 1);
});

function boot(options = {}) {
  const root = { dataset: {} };
  const window = eventTarget();
  const history = { scrollRestoration: 'auto' };
  const timers = [];
  window.scrollTo = () => {};
  vm.runInNewContext(bootstrap, {
    window, history, document: { documentElement: root, querySelector: () => null },
    location: { pathname: '/', hash: '', ...options.location },
    localStorage: { getItem: () => null }, navigator: {},
    matchMedia: () => ({ matches: Boolean(options.reduced) }),
    performance: { now: () => 10, getEntriesByType: () => [{ type: options.type ?? 'navigate' }] },
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); }
  });
  return { root, window, history, timers };
}

test('pre-hydration startup ignores synthetic events and unrelated clicks', () => {
  const { root, window, history } = boot();
  assert.equal(root.dataset.presentation, 'pending');
  assert.equal(history.scrollRestoration, 'manual');
  window.emit('wheel', { isTrusted: false, deltaY: 120 });
  window.emit('keydown', { isTrusted: false, key: 'PageDown' });
  window.emit('click', { button: 0 });
  assert.equal(root.dataset.presentation, 'pending');
});

test('a stalled bundle still releases the introduction without a shortcut', () => {
  const { root, history, timers } = boot();
  timers.find(timer => timer.ms === 6000).fn();
  assert.equal(root.dataset.presentation, 'complete');
  assert.equal(history.scrollRestoration, 'auto');
});

for (const [name, options] of [ ['deep link', { location: { hash: '#work' } }], ['history navigation', { type: 'back_forward' }], ['reduced motion', { reduced: true }] ]) {
  test(`${name} does not acquire an introduction or a scroll lock`, () => {
    const { root, history } = boot(options);
    assert.equal(root.dataset.presentation, undefined);
    assert.equal(history.scrollRestoration, 'auto');
  });
}
