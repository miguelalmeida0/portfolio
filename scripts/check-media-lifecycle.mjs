import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Execute the actual component controller with DOM/video boundaries mocked.
// This verifies lifecycle decisions, not browser decoding or playback.
const source = await readFile('src/lib/components/work/VideoLoop.svelte', 'utf8');
const script = source.match(/<script lang="ts">([\s\S]*?)<\/script>/)[1]
  .replace(/^\s*import .*;$/gm, '').replace(/export let/g, 'let');
const js = ts.transpileModule(script + '\n globalThis.controller = { setVideo(v) { video = v; }, togglePlayback, setPlaying(v) { playing = v; } };', {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None }
}).outputText;

function fixture({ delayTick = false } = {}) {
  let mount, cleanup, observe, finishTick;
  const listeners = {};
  const motion = { matches: false, addEventListener() {}, removeEventListener() {} };
  const document = { hidden: false, addEventListener(k, fn) { listeners[k] = fn; }, removeEventListener(k) { delete listeners[k]; } };
  const video = { loads: 0, plays: 0, pauses: 0, load() { this.loads++; }, play() { this.plays++; return Promise.resolve(); }, pause() { this.pauses++; } };
  const context = vm.createContext({ document, window: { matchMedia: () => motion },
    onMount(fn) { mount = fn; }, tick: () => delayTick ? new Promise(resolve => { finishTick = resolve; }) : Promise.resolve(),
    IntersectionObserver: class { constructor(fn) { observe = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(js, context);
  context.controller.setVideo(video);
  cleanup = mount();
  return { video, document, controller: context.controller, cleanup,
    visible(ratio) { observe([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    release() { finishTick?.(); }, listeners };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const threshold = fixture();
threshold.visible(0.1); await settle();
assert.equal(threshold.video.loads, 0, 'Do not load films at less than 25% visibility');
threshold.visible(0.25); await settle();
assert.equal(threshold.video.loads, 1);
assert.equal(threshold.video.plays, 1);
threshold.controller.setPlaying(true);
await threshold.controller.togglePlayback();
threshold.visible(0); threshold.visible(1); await settle();
assert.equal(threshold.video.plays, 1, 'User pause survives leaving and re-entering viewport');
threshold.cleanup();
assert.equal(Object.keys(threshold.listeners).length, 0);
for (const state of ['hidden', 'offscreen', 'destroyed']) {
  const pending = fixture({ delayTick: true });
  pending.visible(1);
  if (state === 'hidden') pending.document.hidden = true;
  if (state === 'offscreen') pending.visible(0);
  if (state === 'destroyed') pending.cleanup();
  pending.release(); await settle();
  assert.equal(pending.video.plays, 0, `Do not start playback after becoming ${state}`);
  if (state !== 'destroyed') pending.cleanup();
}
console.log('PASS video visibility threshold, user pause, async hide/scroll/unmount races, listener cleanup (mocked media boundary).');
