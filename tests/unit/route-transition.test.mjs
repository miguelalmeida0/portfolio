import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('src/lib/motion/routeTransition.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

function setup({ reduced = false, mobile = true } = {}) {
  const animations = [], events = [], hooks = {}, frames = [];
  const navigation = deferred();
  const element = () => ({ hidden: true, style: {}, dataset: {}, animate(keyframes, options) {
    const done = deferred(); const animation = { ...done, keyframes, options, finished: done.promise, cancel() {} };
    animations.push(animation); return animation;
  } });
  const veil = element();
  const menu = element();
  const link = { href: 'https://portfolio.test/work/leu', download: '', target: '', dataset: {}, parentElement: menu };
  const body = {};
  const document = { body, activeElement: body, visibilityState: 'visible', documentElement: { dataset: {} },
    querySelectorAll: () => [], getElementById: () => null };
  const modules = {
    '$app/navigation': {
      beforeNavigate: fn => hooks.before = fn, onNavigate: fn => hooks.on = fn,
      preloadData: async () => events.push('preload'),
      goto: url => {
        events.push('goto');
        hooks.before({ type: 'goto', willUnload: false, cancel() { throw Error('own navigation cancelled'); } });
        hooks.on({ type: 'goto', from: { url: new URL('https://portfolio.test/') }, to: { url }, complete: navigation.promise });
        return navigation.promise;
      }
    },
    svelte: { onDestroy: fn => hooks.destroy = fn, tick: async () => { events.push('tick'); } },
    'svelte/store': { writable: initial => { let state = initial; return { set(value) { state = value; }, subscribe(fn) { fn(state); return () => {}; }, get value() { return state; } }; } },
    './policy': { motionSnapshot: () => ({ reduced }) },
    './smooth-scroll': { resetScrollMotion() {}, syncScrollPosition: () => events.push('scroll-synced') }
  };
  const exports = {};
  vm.runInNewContext(source, { exports, require: name => modules[name], document, URL,
    location: { origin: 'https://portfolio.test', hash: '' }, matchMedia: () => ({ matches: mobile }),
    requestAnimationFrame: fn => frames.push(fn), window: {} });
  const owner = exports.installRouteTransitions(() => veil);
  const click = (fields = {}) => ({ currentTarget: link, button: 0, defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; }, ...fields });
  return { owner, hooks, animations, frames, veil, events, navigation, click,
    close: () => { assert.equal(veil.style.opacity, '1'); events.push('close'); } };
}

test('menu stays mounted until opaque; reveal waits for navigation, tick and frame', async () => {
  const s = setup();
  const work = s.owner.navigateFromMenu(s.click(), s.close);
  assert.equal(s.owner.mobileState.value, 'covering');
  assert.equal(s.events.includes('close'), false);
  assert.equal(s.events.includes('goto'), false);
  s.animations.forEach(a => a.resolve());
  await flush();
  assert.equal(s.owner.mobileState.value, 'covered');
  assert.deepEqual(s.events.filter(e => ['close', 'goto'].includes(e)), ['close', 'goto']);
  assert.equal(s.veil.style.opacity, '1');
  assert.equal(s.frames.length, 0);
  s.navigation.resolve();
  await flush();
  assert.equal(s.owner.mobileState.value, 'covered');
  assert.equal(s.frames.length, 1);
  s.frames.shift()();
  await flush();
  assert.equal(s.owner.mobileState.value, 'revealing');
  assert.equal(s.veil.hidden, false);
  s.animations.at(-1).resolve();
  await work;
  assert.equal(s.owner.mobileState.value, 'idle');
  assert.equal(s.veil.hidden, true);
});

test('rapid taps cannot create a second goto; browser traversal is locked during reveal', async () => {
  const s = setup();
  const first = s.owner.navigateFromMenu(s.click(), s.close);
  await s.owner.navigateFromMenu(s.click(), s.close);
  s.animations.forEach(a => a.resolve()); await flush();
  await s.owner.navigateFromMenu(s.click(), s.close);
  assert.equal(s.events.filter(e => e === 'goto').length, 1);
  let cancelled = false;
  s.hooks.before({ type: 'popstate', willUnload: false, cancel() { cancelled = true; } });
  assert.equal(cancelled, true);
  s.navigation.resolve(); await flush(); s.frames.shift()(); await flush();
  s.animations.at(-1).resolve(); await first;
});

test('reduced motion has no animation but still awaits route readiness', async () => {
  const s = setup({ reduced: true });
  const work = s.owner.navigateFromMenu(s.click(), s.close);
  await flush();
  assert.equal(s.owner.mobileState.value, 'covered');
  assert.equal(s.veil.hidden, false);
  assert.equal(s.veil.style.opacity, '1');
  assert.equal(s.animations.length, 0);
  s.navigation.resolve(); await flush(); s.frames.shift()(); await work;
  assert.equal(s.veil.hidden, true);
});

test('modified, external, download and desktop links remain native', async () => {
  for (const fields of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
    const s = setup(); const event = s.click(fields);
    await s.owner.navigateFromMenu(event, s.close);
    assert.equal(s.owner.mobileState.value, 'idle');
    assert.equal(s.events.length, 0);
  }
  for (const fields of [{ href: 'https://external.test/' }, { download: 'file' }]) {
    const s = setup(); const event = s.click(); Object.assign(event.currentTarget, fields);
    await s.owner.navigateFromMenu(event, s.close);
    assert.equal(event.defaultPrevented, false);
  }
  const s = setup({ mobile: false }); const event = s.click();
  await s.owner.navigateFromMenu(event, s.close);
  assert.equal(event.defaultPrevented, false);
});

test('new-tab links close the menu without covering or intercepting navigation', async () => {
  const s = setup();
  const event = s.click();
  event.currentTarget.target = '_blank';
  let closeCalls = 0;
  await s.owner.navigateFromMenu(event, () => {
    closeCalls++;
    assert.equal(s.veil.hidden, true);
    assert.equal(s.owner.mobileState.value, 'idle');
  });
  assert.equal(closeCalls, 1);
  assert.equal(event.defaultPrevented, false);
  assert.equal(s.veil.hidden, true);
  assert.equal(s.owner.mobileState.value, 'idle');
  assert.equal(s.animations.length, 0);
  assert.deepEqual(s.events, []);

  const handled = s.click({ defaultPrevented: true });
  handled.currentTarget.target = '_blank';
  await s.owner.navigateFromMenu(handled, () => assert.fail('An already handled click must not close the menu'));
});

test('rejected navigation releases the veil and announces recovery', async () => {
  const s = setup({ reduced: true });
  const work = s.owner.navigateFromMenu(s.click(), s.close);
  await flush(); s.navigation.reject(Error('cancelled')); await flush();
  assert.equal(s.veil.hidden, false);
  s.frames.shift()(); await work;
  assert.equal(s.owner.mobileState.value, 'idle');
  assert.match(s.owner.navigationError.value, /try again/);
});

test('mobile history cover releases the Kit hook before awaiting navigation.complete', async () => {
  const s = setup({ reduced: true });
  await s.hooks.on({ type: 'popstate', from: { url: new URL('https://portfolio.test/work/leu') },
    to: { url: new URL('https://portfolio.test/') }, complete: s.navigation.promise });
  assert.equal(s.owner.mobileState.value, 'covered');
  s.navigation.resolve(); await flush();
  assert.equal(s.owner.mobileState.value, 'covered');
  s.frames.shift()(); await flush();
  assert.equal(s.owner.mobileState.value, 'idle');
});
