import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

const controllerSource = ts.transpileModule(readFileSync('src/lib/components/experience/work/preview-controller.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;

function fixture(initial = {}) {
  let policy = { reduced: false, saveData: false, ...initial }, notify, intersect;
  let released = false, disconnected = false, pausedState;
  const frames = [], calls = [], timers = new Map();
  class Video extends EventTarget {
    dataset = { projectPreview: 'needle' }; paused = true; readyState = 2; error = null;
    frame = { dataset: { previewStatus: 'poster' } };
    source = Object.assign(new EventTarget(), { dataset: { src: '/real-loop.mp4' }, src: '' });
    closest() { return this.frame; }
    querySelectorAll() { return [this.source]; }
    getBoundingClientRect() { return { top: 3000, bottom: 3600, left: 0, right: 600 }; }
    load() { calls.push('load'); }
    play() { calls.push('play'); this.paused = false; return Promise.resolve(); }
    pause() { this.paused = true; }
  }
  const video = new Video(), document = Object.assign(new EventTarget(), { hidden: false });
  const window = Object.assign(new EventTarget(), { innerHeight: 844, innerWidth: 1440 });
  const context = { exports: {}, console, Error, document, window, HTMLMediaElement: { HAVE_CURRENT_DATA: 2 },
    setTimeout(fn) { const id = timers.size + 1; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); },
    IntersectionObserver: class { constructor(fn) { intersect = fn; } observe(v) { frames.push(v); } disconnect() { disconnected = true; } },
    require: id => { assert.equal(id, '$lib/motion/policy'); return {
      motionSnapshot: () => policy,
      motionState: { subscribe(fn) { notify = fn; fn(policy); return () => { released = true; }; } }
    }; }
  };
  vm.runInNewContext(controllerSource, context);
  const controller = context.exports.createPreviewController({ querySelectorAll: () => [video] }, [{ id: 'needle' }], () => {}, value => { pausedState = value; });
  return { controller, video, calls, document, timers,
    visible(value) { intersect?.([{ target: video, isIntersecting: value }]); },
    policy(value) { policy = { ...policy, ...value }; notify?.(policy); },
    stats: () => ({ released, disconnected, pausedState }) };
}

test('offscreen previews do not fetch or play; entering and leaving controls playback', async () => {
  const f = fixture();
  try {
    assert.deepEqual(f.calls, []);
    assert.equal(f.video.source.src, '');
    f.visible(true); await Promise.resolve();
    assert.deepEqual(f.calls, ['load', 'play']);
    assert.equal(f.video.source.src, '/real-loop.mp4');
    f.visible(false); assert.equal(f.video.paused, true);
    f.visible(true); await Promise.resolve();
    assert.deepEqual(f.calls, ['load', 'play', 'play']);
  } finally { f.controller.destroy(); }
});

for (const preference of ['reduced', 'saveData']) test(`${preference} suppresses automatic source attachment; explicit Play permits the visible loop`, async () => {
  const f = fixture({ [preference]: true });
  try {
    f.visible(true); assert.deepEqual(f.calls, []);
    assert.equal(f.stats().pausedState, true);
    f.controller.setPaused(false); await Promise.resolve();
    assert.deepEqual(f.calls, ['load', 'play']);
    assert.equal(f.stats().pausedState, false);
    f.controller.setPaused(true); assert.equal(f.video.paused, true);
    f.visible(false); f.visible(true); assert.equal(f.video.paused, true);
  } finally { f.controller.destroy(); }
});

test('a new restrictive preference stops active loops and clears explicit-play consent', async () => {
  const f = fixture();
  try {
    f.visible(true); await Promise.resolve(); assert.equal(f.video.paused, false);
    f.policy({ reduced: true }); assert.equal(f.video.paused, true);
    f.controller.setPaused(false); await Promise.resolve(); assert.equal(f.video.paused, false);
    f.policy({ saveData: true }); assert.equal(f.video.paused, true);
  } finally { f.controller.destroy(); }
});

test('hidden tabs and disposal stop playback without leaking observers, policy listeners or retries', async () => {
  const f = fixture();
  f.visible(true); await Promise.resolve();
  f.document.hidden = true; f.document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(f.video.paused, true);
  f.document.hidden = false; f.document.dispatchEvent(new Event('visibilitychange')); await Promise.resolve();
  assert.equal(f.video.paused, false);
  f.controller.destroy();
  assert.equal(f.video.paused, true);
  assert.equal(f.stats().released, true); assert.equal(f.stats().disconnected, true);
  assert.equal(f.timers.size, 0);
});

test('all failed source candidates expose the unavailable poster state', () => {
  const f = fixture();
  try {
    f.visible(true); f.video.source.dispatchEvent(new Event('error'));
    assert.equal(f.video.frame.dataset.previewStatus, 'unavailable');
  } finally { f.controller.destroy(); }
});

test('an error on a dormant source cannot permanently disable a later visible preview', async () => {
  const f = fixture();
  try {
    f.video.source.dispatchEvent(new Event('error'));
    assert.equal(f.video.frame.dataset.previewStatus, 'poster');
    f.visible(true); await Promise.resolve();
    assert.deepEqual(f.calls, ['load', 'play']);
  } finally { f.controller.destroy(); }
});

test('retry is an explicit play gesture even after policy reduction or global pause', async () => {
  const f = fixture();
  try {
    f.video.play = () => Promise.reject(Object.assign(new Error('Blocked'), { name: 'NotAllowedError' }));
    f.visible(true); await new Promise(setImmediate);
    assert.equal(f.video.frame.dataset.previewStatus, 'blocked');
    f.policy({ reduced: true }); f.controller.setPaused(true);
    f.video.play = () => { f.calls.push('retry-play'); f.video.paused = false; return Promise.resolve(); };
    f.controller.retryAll(); await Promise.resolve();
    assert.equal(f.video.paused, false);
    assert.equal(f.stats().pausedState, false);
    assert.deepEqual(f.calls, ['load', 'retry-play']);
  } finally { f.controller.destroy(); }
});

test('server-rendered previews keep media URLs dormant and retain failure selectors in compiled CSS', async () => {
  const source = readFileSync('src/lib/components/experience/work/PreviewMedia.svelte', 'utf8');
  const compiled = compile(source, { filename: 'PreviewMedia.svelte', generate: 'server' });
  mkdirSync('.cache/preview-tests', { recursive: true });
  const dir = mkdtempSync('.cache/preview-tests/ssr-');
  try {
    const file = path.resolve(dir, 'preview.mjs'); writeFileSync(file, compiled.js.code);
    const { default: Preview } = await import(pathToFileURL(file).href);
    const html = render(Preview, { props: { project: { id: 'needle', initialAspectRatio: 16/9, poster: '/poster.png', alt: 'Artwork search', sources: [{ src: '/loop.mp4', type: 'video/mp4' }] } } }).body;
    assert.doesNotMatch(html, /<video[^>]*\bautoplay\b/);
    assert.doesNotMatch(html, /<source[^>]*\ssrc=/);
    assert.match(html, /data-src="\/loop.mp4"/);
    assert.match(html, /preload="none"/);
    const css = compiled.css.code.replace(/\/\*[\s\S]*?\*\//g, '');
    assert.match(css, /preview-status=['"]?unavailable/);
    assert.match(css, /preview-status=['"]?blocked/);
    assert.equal(compiled.warnings.filter(w => ['css_unused_selector', 'state_referenced_locally'].includes(w.code)).length, 0);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
