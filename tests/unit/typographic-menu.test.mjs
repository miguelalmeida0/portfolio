import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { gsap } from 'gsap';

const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const source = fs.readFileSync('src/lib/hero-lab/typographic/TypographicNav.svelte', 'utf8').match(/<script lang="ts">([\s\S]*?)<\/script>/)[1];
const sheetSource = compile(fs.readFileSync('src/lib/hero-lab/sheet.ts', 'utf8'));

function setup() {
  const actions = [], hooks = {}, timelines = [], listeners = new Map();
  const window = { scrollY: 0, innerHeight: 844, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const target = { isConnected: true };
  const location = new URL('http://localhost/hero-lab/typographic/story');
  const navigation = { beforeNavigate: fn => { hooks.before = fn; }, pushState: () => actions.push('history') };
  const scroll = { scrollToElement: () => actions.push('scroll'), smoothScrollInstance: () => undefined };
  const sheetExports = {};
  const document = { getElementById: () => target, documentElement: { style: {} } };
  vm.runInNewContext(sheetSource, { exports: sheetExports, URL, location, document, require: name => ({
    '$app/navigation': navigation, '$lib/motion/smooth-scroll': scroll, '$lib/ask/state': {}, 'svelte/store': { get: () => undefined }
  })[name] });
  const exports = {};
  const modules = {
    svelte: { getContext: () => undefined, tick: async () => {}, onMount: fn => { hooks.mount = fn; } },
    '$app/navigation': navigation,
    '$lib/hero-lab/content': {},
    './site': { d1Navigation: () => [], d1Routes: { home: '/hero-lab/typographic' } },
    '$lib/hero-lab/sheet': { ...sheetExports, toggleAsk: () => actions.push('ask') },
    '$lib/motion/smooth-scroll': scroll,
    '$lib/ask/state': {}, '$lib/motion/policy': { motionState: { subscribe: () => () => {} } },
    '$lib/hero-lab/runtime': { curves: { shutter: 'power3.inOut', settle: 'power3.out' } },
    gsap: { gsap: { ...gsap, timeline: options => { const timeline = gsap.timeline({ ...options, paused: true }); timelines.push(timeline); return timeline; } } }
  };
  vm.runInNewContext(compile(source + '\nexports.api = { hide, travel, closed, setTrigger: value => { trigger = value; }, setDialog: value => { dialog = value; }, requestAsk: typeof requestAsk === "function" ? requestAsk : undefined };'), {
    exports, require: name => { assert.ok(name in modules, name); return modules[name]; },
    $props: () => ({}), $state: value => value, $derived: value => value, $effect: () => {},
    $motionState: { reduced: false }, document, location, URL, window,
    ResizeObserver: class { observe() {} disconnect() {} }, IntersectionObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: () => 1, cancelAnimationFrame() {}
  });
  exports.api.setDialog({ open: true, clipPath: 'inset(0 0 0% 0)', close() { this.open = false; } });
  const event = { button: 0, currentTarget: { href: location.href + '#story-summary' }, preventDefault() {} };
  return { ...exports.api, actions, hooks, event, listeners, finish: () => timelines.at(-1).progress(1) };
}
const flush = async () => { for (let i = 0; i < 4; i++) await Promise.resolve(); };

test('leaving the route during menu close cancels the queued section jump', async () => {
  const menu = setup();
  menu.travel(menu.event);
  menu.hooks.before();
  await flush();
  assert.deepEqual(menu.actions, []);
});

test('a completed menu close still performs the requested section jump', async () => {
  const menu = setup();
  menu.travel(menu.event);
  menu.finish();
  await flush();
  assert.deepEqual(menu.actions, ['history', 'scroll']);
});

test('leaving the route during menu close cancels the queued Ask action', async () => {
  const menu = setup();
  assert.equal(typeof menu.requestAsk, 'function');
  const pending = menu.requestAsk();
  menu.hooks.before();
  await pending;
  assert.deepEqual(menu.actions, []);
});

test('a completed menu close still opens Ask', async () => {
  const menu = setup();
  assert.equal(typeof menu.requestAsk, 'function');
  const pending = menu.requestAsk();
  menu.finish();
  await pending;
  assert.deepEqual(menu.actions, ['ask']);
});

test('Ask focus restoration returns to visible Index and unregisters on navigation teardown', () => {
  const menu = setup();
  let focused = 0;
  const trigger = { getClientRects: () => [{}], focus: () => { focused++; } };
  menu.setTrigger(trigger);
  const cleanup = menu.hooks.mount();
  menu.listeners.get('ask:restore-trigger')?.();
  assert.equal(focused, 1, 'mobile Index receives focus after Ask closes');
  trigger.getClientRects = () => [];
  menu.listeners.get('ask:restore-trigger')?.();
  assert.equal(focused, 1, 'a hidden Index must not receive focus');
  cleanup();
  assert.equal(menu.listeners.has('ask:restore-trigger'), false);
});

test('the delayed native close event cannot steal focus from the opened Ask input', async () => {
  const menu = setup();
  let focused = 0;
  menu.setTrigger({ focus: () => { focused++; } });
  const pending = menu.requestAsk();
  menu.finish(); await pending;
  menu.closed();
  assert.deepEqual(menu.actions, ['ask']);
  assert.equal(focused, 0);
});
