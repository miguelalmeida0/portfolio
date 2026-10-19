import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as engine from '../../src/lib/case-studies/flow/engine.js';

// Execute the real handlers and engine with controlled lifecycle delays.
// These tests cover state transitions, not Svelte reactivity or rendered UI.
function load(relative, factory, extra = {}) {
  const source = readFileSync(new URL('../../' + relative, import.meta.url), 'utf8')
    .replace(/^import .*;\s*$/gm, '').replace(/export /g, '');
  const deps = {
    $state: value => value,
    flushSync() {},
    onMount: fn => fn(),
    lifecycle: () => ({ reduce: { matches: true }, later: queueMicrotask, frame: fn => fn() }),
    ...extra
  };
  return new Function(...Object.keys(deps), source + '\nreturn ' + factory)(...Object.values(deps));
}

async function settle(demo) {
  for (let i = 0; demo.S.busy && i < 100; i++) await Promise.resolve();
  assert.equal(demo.S.busy, false, 'command finished processing');
}

test('Flow redo drops an obsolete proposal before a new command can be confirmed', async () => {
  const demo = load('src/lib/case-studies/flow/demo.svelte.js', 'createDemo', {
    ...engine, inlineContent: value => value
  })();
  const start = async key => {
    demo.startScenario(engine.SCENARIOS.find(item => item.key === key));
    await settle(demo);
  };
  const yes = async () => {
    const reply = demo.ui.replies.find(item => item.label === 'Yes');
    assert.ok(reply, 'current proposal can be confirmed');
    await reply.run();
    await settle(demo);
  };

  await start('clean');
  await yes();
  assert.equal(engine.byId(demo.S.doc, 'review').start, 810);
  demo.undo();
  assert.equal(engine.byId(demo.S.doc, 'review').start, 600);
  await start('correction');
  assert.deepEqual(demo.S.pending.changes.map(change => change.id), ['lunch0']);

  demo.redo();
  assert.equal(engine.byId(demo.S.doc, 'review').start, 810);
  assert.equal(demo.S.pending, null, 'redo invalidates the old calendar draft');
  assert.equal(demo.ui.replies.length, 0, 'obsolete confirmation controls are removed');
  assert.notEqual(demo.ui.stages.gate.state, 'blocked', 'pipeline no longer asks for obsolete approval');

  await start('correction');
  assert.equal(demo.S.pending, null, 'new lunch request detects the restored review conflict');
  assert.equal(demo.ui.stages['6'].state, 'blocked');
  assert.equal(engine.byId(demo.S.doc, 'lunch0').start, 750, 'conflicting lunch request leaves the calendar unchanged');
  demo.setActive(1);
  await start('correction');
  await yes();
  assert.equal(engine.byId(demo.S.doc, 'review').start, 810, 'fresh lunch command preserves the redone review');
  assert.equal(engine.byId(demo.S.doc, 'lunch1').start, 810);
});

function workspaceWithClock() {
  const timers = [];
  const workspace = load('src/lib/case-studies/second-voice/workspace.svelte.js', 'createWorkspace', {
    lifecycle: () => ({ reduce: { matches: true }, later: fn => timers.push(fn) })
  })();
  return {
    ...workspace,
    async finish(submission) {
      assert.equal(timers.length, 1, 'one request is pending');
      timers.shift()();
      await submission;
    }
  };
}

test('Second Voice consumes one simulated failure and Retry preserves the submitted settings', async () => {
  const workspace = workspaceWithClock();
  workspace.S.controls = { voice: 'spare', strength: 'light' };
  workspace.S.fail = true;
  await workspace.finish(workspace.submit(workspace.S.controls));
  assert.ok(workspace.S.failed);
  assert.equal(workspace.S.result.run, 1, 'failure preserves the last rewrite');
  assert.equal(workspace.S.fail, false, 'next-request failure is consumed');

  workspace.S.controls = { voice: 'lyrical', strength: 'strong' };
  await workspace.finish(workspace.submit(workspace.S.failed.settings));
  assert.equal(workspace.S.failed, null, 'Retry recovers without changing the failure switch');
  assert.equal(workspace.S.result.run, 3);
  assert.deepEqual(workspace.S.result.settings, { voice: 'spare', strength: 'light' });
});

test('Second Voice arming failure during a request affects the next accepted request', async () => {
  const workspace = workspaceWithClock();
  const current = workspace.submit(workspace.S.controls);
  workspace.S.fail = true;
  await workspace.submit(workspace.S.controls); // Busy submissions must not consume the flag.
  await workspace.finish(current);
  assert.equal(workspace.S.failed, null, 'in-flight request keeps its captured outcome');
  assert.equal(workspace.S.result.run, 2);
  assert.equal(workspace.S.fail, true, 'failure stays armed for the next request');

  await workspace.finish(workspace.submit(workspace.S.controls));
  assert.ok(workspace.S.failed);
  assert.equal(workspace.S.fail, false);
  assert.equal(workspace.S.result.run, 2);
});

test('Second Voice changing the switch after submission cannot change the captured failure', async () => {
  const workspace = workspaceWithClock();
  workspace.S.fail = true;
  const current = workspace.submit(workspace.S.controls);
  workspace.S.fail = false;
  await workspace.finish(current);
  assert.ok(workspace.S.failed, 'submitted failure is fixed before the asynchronous delay');
  assert.equal(workspace.S.result.run, 1);
});
