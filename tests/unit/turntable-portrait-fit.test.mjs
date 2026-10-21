import assert from 'node:assert/strict';
import test from 'node:test';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { portraitPlacement } = await loadLocalTs('src/lib/hero-lab/typographic/turntable/src/portrait-frame.ts');

test('full portrait keeps its proportions and hands inside the turn frame', () => {
  const p = portraitPlacement('engineer', 1086, 1448);
  assert.ok(Math.abs(p.width / p.height - 1086 / 1448) < 1e-6);
  assert.ok(p.x >= 0 && p.y >= 0);
  assert.ok(p.x + p.width <= 1016 && p.y + p.height <= 1065);
  assert.equal(p.y + p.height, 1065);
});

test('existing registered back keeps its original frame', () => {
  assert.deepEqual(portraitPlacement('designer', 1016, 1065), { x: 0, y: 0, width: 1016, height: 1065 });
});
