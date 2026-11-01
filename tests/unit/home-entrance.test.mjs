import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import {patchHomeEntrance} from '../../scripts/patch-home-entrance.mjs';

const source = readFileSync(new URL('../../release/home.html', import.meta.url), 'utf8');
const measure = patchHomeEntrance(source).match(/ function measureHero\(\)\{[\s\S]*?\n \}/)[0];
const entrance = readFileSync(new URL('../../release/landing-entrance.js', import.meta.url), 'utf8');

for (const [w, h, left, width, nameHeight] of [[1440, 900, 432, 576, 292], [1512, 682, 362.88, 786.24, 232]]) {
  test(`hand measurements preserve the first-paint text column at ${w} × ${h}`, () => {
    const properties = new Map();
    const style = { removeProperty: key => properties.delete(key), setProperty: (key, value) => properties.set(key, value) };
    const content = { style, offsetLeft: left, offsetWidth: width, offsetTop: 131, offsetHeight: nameHeight + 112 };
    const scope = {
      hero: { clientWidth: w, clientHeight: h }, layout: {}, mobileLayout: {matches:false},
      $: selector => selector === '.hero-content' ? content : { offsetTop: 0, offsetHeight: nameHeight },
      matchMedia: () => ({ matches: true }), hands: [{ style: {} }, { style: {} }],
      stage: { clientWidth: w, style }, alignHeroInk() {}, sheet: { setAttribute() {} }, renderSheet() {}, heroProgress: 0,
    };
    runInNewContext('(' + measure.trim() + ')()', scope);
    assert.equal(properties.has('--hero-left'), false, 'Measuring hands must not move the text after first paint');
    assert.equal(properties.has('--hero-width'), false, 'Measuring hands must not resize the title after first paint');
    const handEnd = w * scope.layout.grip + scope.layout.handWidth * .09;
    assert.ok(handEnd + 47 <= left, 'Hands leave at least 47px around the text column');
  });
}

function visit({storage = new Map(), reduced = false, hash = '', type = 'navigate'} = {}) {
  const attributes = new Set(), attributeValues = new Map(), events = new Map(), mediaEvents = new Map(), frames = [], timers = new Map();
  let nextTimer = 0, resolveFonts;
  const fontsReady = new Promise(resolve => { resolveFonts = resolve; });
  const scope = {
    document: {
      documentElement: {setAttribute: (name, value) => { attributes.add(name); attributeValues.set(name, value); }, removeAttribute: name => { attributes.delete(name); attributeValues.delete(name); }},
      fonts: {ready: fontsReady},
      addEventListener: (name, handler) => events.set(name, handler), removeEventListener: name => events.delete(name),
    },
    window: {addEventListener: (name, handler) => events.set(name, handler), removeEventListener: name => events.delete(name)},
    sessionStorage: {getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value)},
    matchMedia: () => ({matches: reduced, addEventListener: (name, handler) => mediaEvents.set(name, handler), removeEventListener: name => mediaEvents.delete(name)}),
    performance: {getEntriesByType: () => [{type}]}, location: {hash},
    setTimeout: handler => {const id = ++nextTimer; timers.set(id, handler); return id;},
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: callback => frames.push(callback),
  };
  runInNewContext(entrance, scope);
  return {attributes, attributeValues, events, mediaEvents, frames, timers, resolveFonts};
}

test('the entrance plays only on the first landing in a session', () => {
  const storage = new Map();
  assert.ok(visit({storage}).attributes.has('data-landing-enter'));
  assert.equal(visit({storage}).attributes.has('data-landing-enter'), false);
});

test('deep links, history restoration and reduced motion show settled content', () => {
  for (const options of [{hash:'#work'}, {hash:'#case/leu'}, {type:'back_forward'}, {reduced:true}]) {
    assert.equal(visit(options).attributes.size, 0);
  }
});

test('interaction immediately settles the entrance and removes its listeners', () => {
  for (const action of ['wheel','touchstart','pointerdown','keydown','pagehide']) {
    const {attributes,events,mediaEvents} = visit();
    events.get(action)();
    assert.equal(attributes.size, 0);
    assert.equal(events.size, 0);
    assert.equal(mediaEvents.size, 0);
  }
});

test('enabling reduced motion during the entrance settles immediately', () => {
  const {attributes,events,mediaEvents} = visit();
  mediaEvents.get('change')();
  assert.equal(attributes.size, 0);
  assert.equal(events.size, 0);
});


test('the landing reveal waits for fonts and two layout frames before playing once', async () => {
  const {attributeValues,events,frames,resolveFonts} = visit();
  assert.equal(attributeValues.get('data-landing-enter'), 'pending');
  events.get('DOMContentLoaded')();
  resolveFonts();
  await new Promise(setImmediate);
  assert.equal(attributeValues.get('data-landing-enter'), 'pending');
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(attributeValues.get('data-landing-enter'), 'pending');
  frames.shift()();
  assert.equal(attributeValues.get('data-landing-enter'), 'playing');
  assert.equal(frames.length, 0, 'No second animation scheduled');
});

test('bootstrap resize does not truncate the first reveal', async () => {
  const {attributeValues,events,frames,resolveFonts} = visit();
  events.get('resize')?.();
  assert.equal(attributeValues.get('data-landing-enter'), 'pending');
  events.get('DOMContentLoaded')();
  resolveFonts();
  await new Promise(setImmediate);
  frames.shift()(); frames.shift()();
  assert.equal(attributeValues.get('data-landing-enter'), 'playing');
});

test('user interaction cancels pending animation without restarting on fonts readiness', async () => {
  const {attributes,events,frames,resolveFonts} = visit();
  events.get('DOMContentLoaded')();
  events.get('pointerdown')();
  resolveFonts();
  await new Promise(setImmediate);
  assert.equal(attributes.has('data-landing-enter'), false);
  assert.equal(frames.length, 0);
});

test('font stalls reveal the title without leaving it masked', () => {
  const {attributes,events,timers} = visit();
  events.get('DOMContentLoaded')();
  const guard = [...timers.values()][0];
  assert.equal(typeof guard, 'function');
  guard();
  assert.equal(attributes.has('data-landing-enter'), false);
});

test('the pending animation is CSS-paused during scroll pinning', () => {
  const css = readFileSync(new URL('../../release/landing-entrance.css', import.meta.url), 'utf8');
  assert.match(css, /html\[data-landing-enter="pending"\][\s\S]*animation-play-state:\s*paused/);
});

test('publishing rejects a missing or duplicate entrance anchor', () => {
  assert.throws(() => patchHomeEntrance(source.replace('data-sheet-drift="-8"', 'data-sheet-drift="-9"')), /Unexpected homepage entrance source/);
  assert.throws(() => patchHomeEntrance(patchHomeEntrance(source)), /Unexpected homepage entrance source/);
});
