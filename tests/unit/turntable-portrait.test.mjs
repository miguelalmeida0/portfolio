import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { gsap } from 'gsap';

const compile = path => ts.transpileModule(fs.readFileSync(path, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const config = {};
vm.runInNewContext(compile('src/lib/hero-lab/typographic/turntable/src/config.ts'), { exports: config });
const renderer = {};
vm.runInNewContext(compile(process.env.TURNTABLE_RENDERER_SOURCE ?? 'src/lib/hero-lab/typographic/turntable/src/turn-renderer.ts'), {
  exports: renderer,
  require: name => ({ gsap: { gsap }, './config': config, './silhouette': {}, './turn-shader': {} })[name],
  window: { devicePixelRatio: 2 }
});

// Exercise the real renderer lifecycle and GSAP completion; the WebGL drawing
// boundary is inert here. This does not claim shader or visual verification.
function setup() {
  const classes = new Set();
  const box = {
    dataset: {},
    classList: { add: value => classes.add(value), remove: value => classes.delete(value) },
    getBoundingClientRect: () => ({ width: 400, height: 420 })
  };
  const gl = Object.fromEntries(['viewport', 'clearColor', 'clear', 'uniform1f', 'drawArrays'].map(name => [name, () => {}]));
  gl.getExtension = () => null;
  const canvas = { width: 400, height: 420 };
  const instance = new renderer.TurnRenderer(gl, canvas, box, {});
  return { instance, box, canvas, classes };
}

test('portrait returns to the original image after each turn, including reverse and instant selection', async () => {
  const { instance, box, classes } = setup();
  try {
    instance.set('engineer');
    assert.equal(box.dataset.restRole, 'engineer');
    assert.equal(classes.has('is-turning'), false);
    for (const role of ['designer', 'engineer']) {
      const finished = instance.turnTo(role);
      assert.equal(classes.has('is-turning'), true);
      instance.tween.progress(1);
      await finished;
      assert.equal(classes.has('is-turning'), false);
      assert.equal(box.dataset.restRole, role);
    }
    instance.set('designer');
    assert.equal(box.dataset.restRole, 'designer');
    assert.equal(classes.has('is-turning'), false);
  } finally { instance.destroy(); }
});

test('retina turns render at twice the displayed size', () => {
  const { instance, canvas } = setup();
  try {
    instance.resize();
    assert.equal(canvas.width, 800);
    assert.equal(canvas.height, 840);
  } finally { instance.destroy(); }
});
