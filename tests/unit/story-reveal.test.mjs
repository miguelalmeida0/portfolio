import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup(top) {
  const observers = [];
  const source = ts.transpileModule(
    fs.readFileSync('src/lib/motion/actions/reveal.ts', 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }
  ).outputText;
  const node = {
    dataset: {},
    getBoundingClientRect: () => ({ top }),
  };
  class Observer {
    constructor(onChange) { this.onChange = onChange; observers.push(this); }
    observe(value) { assert.equal(value, node); }
    disconnect() { this.disconnected = true; }
    enter() { this.onChange([{ isIntersecting: true }]); }
  }
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require: () => ({ motionSnapshot: () => ({ reduced: false }) }),
    window: { innerHeight: 900 },
    requestAnimationFrame: (callback) => callback(),
    IntersectionObserver: Observer,
    setTimeout,
    clearTimeout,
  });
  return { node, observers, reveal: exports.reveal };
}

test('a Story section already on screen stays readable on mount', () => {
  const { node, observers, reveal } = setup(100);
  reveal(node, { variant: 'settle', skipInitialViewport: true });
  assert.equal(node.dataset.reveal, 'in');
  assert.equal(observers.length, 0);
});

test('an offscreen Story section reveals once when it enters the viewport', () => {
  const { node, observers, reveal } = setup(2000);
  const action = reveal(node, { variant: 'frame', skipInitialViewport: true });
  assert.equal(node.dataset.reveal, 'pending');
  assert.equal(observers.length, 1);
  observers[0].enter();
  assert.equal(node.dataset.reveal, 'in');
  assert.equal(observers[0].disconnected, true);
  action.destroy();
});

test('legacy reveal action still animates initially visible content without the opt-out', () => {
  const { node, observers, reveal } = setup(100);
  reveal(node, { variant: 'settle' });
  assert.equal(observers.length, 1);
  assert.equal(node.dataset.reveal, 'in');
});
