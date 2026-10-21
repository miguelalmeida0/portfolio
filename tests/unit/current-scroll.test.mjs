import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { currentScroll, currentRange } = await loadLocalTs('src/lib/hero-lab/typographic/current-scroll.ts');

function fixture() {
  const names = ['narrative', 'assembly', 'reveal', 'reading'];
  const scenes = names.map(name => ({
    name, classList: { contains: () => false }, closest: () => null,
    getBoundingClientRect: () => ({ height: 600 }),
    querySelectorAll: () => [{}], querySelector: () => ({}),
    contains: target => target === name
  }));
  const events = new Map(), frames = new Map(), timelines = [];
  global.window = { innerHeight: 900 };
  global.requestAnimationFrame = callback => { frames.set(1, callback); return 1; };
  global.cancelAnimationFrame = id => frames.delete(id);
  const root = {
    querySelectorAll: selector => scenes.filter(scene => selector === `[data-current-${scene.name}]`),
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: name => events.delete(name)
  };
  const gsap = { timeline(options) {
    const timeline = {
      options, steps: [], progressValue: 0, disabled: false, refreshes: 0,
      fromTo(targets, from, to) { this.steps.push({ targets, from, to }); return this; },
      progress(value) { this.progressValue = value; return this; },
      scrollTrigger: {
        disable(revert) { timeline.disabled = true; assert.equal(revert, false); },
        refresh() { timeline.refreshes++; }
      }
    };
    timelines.push(timeline); return timeline;
  } };
  return { root, gsap, timelines, events, frames };
}

test('short scenes never produce inverted or excessive scroll ranges', () => {
  for (const height of [0, 48, 300, 900, 6000]) {
    for (const viewport of [320, 844, 1080]) {
      for (const compact of [false, true]) {
        const range = currentRange(height, viewport, compact);
        assert.ok(range >= 96);
        assert.ok(range <= Math.max(96, Math.ceil(viewport * (compact ? .28 : .42))));
      }
    }
  }
});

test('all motifs use host timelines, reversible scrub and positive ranges without pins', () => {
  const f = fixture(); const dispose = currentScroll(f.root, f.gsap, true);
  assert.equal(f.timelines.length, 4);
  for (const t of f.timelines) {
    assert.equal(t.options.scrollTrigger.scrub, true);
    assert.match(t.options.scrollTrigger.end(), /^\+=\d+$/);
    assert.equal(t.options.scrollTrigger.pin, undefined);
    assert.equal(t.options.scrollTrigger.snap, undefined);
    for (const step of t.steps) assert.equal(step.from.opacity, undefined);
  }
  dispose();
});

test('keyboard focus completes just its own scene and disables subsequent scrubbing', () => {
  const f = fixture(); const dispose = currentScroll(f.root, f.gsap, true);
  f.events.get('focusin')({ target: 'reveal' });
  assert.equal(f.timelines[2].progressValue, 1);
  assert.equal(f.timelines[2].disabled, true);
  assert.equal(f.timelines[0].progressValue, 0);
  assert.equal(f.timelines[2].steps[0].to.clipPath, 'inset(0% 0% round 0%)');
  dispose();
});

test('media refresh is coalesced and teardown removes pending work and all listeners', () => {
  const f = fixture(); const dispose = currentScroll(f.root, f.gsap, true);
  f.events.get('loadedmetadata')(); f.events.get('load')();
  assert.equal(f.frames.size, 1);
  f.frames.get(1)();
  assert.ok(f.timelines.every(t => t.refreshes === 1));
  f.events.get('load')(); dispose(); dispose();
  assert.equal(f.frames.size, 0); assert.equal(f.events.size, 0);
});

test('mobile reduces assembly travel, rotation and aperture crop', () => {
  const f = fixture(); const dispose = currentScroll(f.root, f.gsap, false);
  const assembly = f.timelines[1].steps[0];
  assert.equal(Math.abs(assembly.from.x(0)), 12);
  assert.equal(Math.abs(assembly.from.rotation(1)), 1.5);
  assert.equal(f.timelines[2].steps[0].from.clipPath, 'inset(8% 3% round 12%)');
  dispose();
});

test('empty roots are complete no-ops with safe cleanup', () => {
  const f = fixture(); f.root.querySelectorAll = () => [];
  const dispose = currentScroll(f.root, f.gsap, true);
  assert.equal(f.timelines.length, 0); dispose();
});
