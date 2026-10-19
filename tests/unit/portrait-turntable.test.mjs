import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { createTurntable } = await loadLocalTs('src/lib/hero-lab/typographic/turntable.ts');

test('turntable has frame-rate-independent idle and drag release motion', () => {
  const run = fps => {
    const turn = createTurntable();
    turn.begin(); turn.drag(.5,.1); turn.end();
    for(let i=0;i<fps*8;i++) turn.step(1/fps);
    return turn.yaw;
  };
  assert.ok(Math.abs(run(30)-run(120))<1e-10);
  const turn = createTurntable();
  for(let i=0;i<60*28;i++) turn.step(1/60);
  assert.ok(Math.abs(turn.yaw-Math.PI*2)<1e-10);
});

test('drag owns rotation until release; reset restores the reviewed view', () => {
  const turn=createTurntable(.3);
  turn.begin(); turn.drag(.7,.1);
  const yaw=turn.yaw;
  assert.equal(turn.step(.016),yaw);
  turn.end(); assert.notEqual(turn.step(.016),yaw);
  turn.nudge(-.15); turn.reset(); assert.equal(turn.yaw,.3);
});

test('returning from a suspended tab cannot produce a large rotation jump', () => {
  const turn=createTurntable();
  assert.ok(turn.step(30)<.02);
});

test('no unreviewed model means no renderer, fetch or fake 3D substitute', async () => {
  const { mountPortrait3D }=await loadLocalTs('src/lib/hero-lab/typographic/portrait-3d.ts', {
    stubs: { './portrait-model': 'export const portraitModel = { url: null, yaw: 0 };' }
  });
  const stage={querySelector:()=>({}),dataset:{}};
  const cleanup=mountPortrait3D(stage,{});
  cleanup();
  assert.deepEqual(stage.dataset,{});
});
