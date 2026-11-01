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
  const attributes = new Set(), events = new Map(), mediaEvents = new Map();
  const scope = {
    document: {
      documentElement: {setAttribute: name => attributes.add(name), removeAttribute: name => attributes.delete(name)},
      addEventListener: (name, handler) => events.set(name, handler), removeEventListener: name => events.delete(name),
    },
    window: {addEventListener: (name, handler) => events.set(name, handler), removeEventListener: name => events.delete(name)},
    sessionStorage: {getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value)},
    matchMedia: () => ({matches: reduced, addEventListener: (name, handler) => mediaEvents.set(name, handler), removeEventListener: name => mediaEvents.delete(name)}),
    performance: {getEntriesByType: () => [{type}]}, location: {hash}, setTimeout() {}, clearTimeout() {},
  };
  runInNewContext(entrance, scope);
  return {attributes, events, mediaEvents};
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
  for (const action of ['wheel','touchstart','pointerdown','keydown','resize','pagehide']) {
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

test('publishing rejects a missing or duplicate entrance anchor', () => {
  assert.throws(() => patchHomeEntrance(source.replace('data-sheet-drift="-8"', 'data-sheet-drift="-9"')), /Unexpected homepage entrance source/);
  assert.throws(() => patchHomeEntrance(patchHomeEntrance(source)), /Unexpected homepage entrance source/);
});
