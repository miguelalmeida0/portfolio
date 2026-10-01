import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync('src/lib/components/experience/hero/wind.ts','utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const { glyphStyle, WIND, installWind } = await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));

test('wind has bounded displacement, a cold other line and a strict hot threshold', () => {
  assert.equal(glyphStyle(1,8,{line:1,pos:8}).transform, 'translateX(0px) skewX(0deg) scaleY(0.985)');
  assert.equal(glyphStyle(1,8,{line:1,pos:8}).color, 'color-mix(in srgb, var(--plum) 100%, var(--ink))');
  for(const index of [0,16,17]) assert.equal(glyphStyle(1,index,{line:1,pos:8}).transform,'none');
  assert.equal(glyphStyle(0,8,{line:1,pos:8,live:true}).transform,'none');
  assert.equal(WIND.graceMs,1400);
  assert.equal(WIND.passMs,8000);
  assert.equal(WIND.radius,8);
  assert.equal(WIND.translate,1.5);
  assert.equal(WIND.skew,4);
  assert.equal(WIND.hotThreshold,0.72);
  for (const index of [3, 13]) {
    assert.notEqual(glyphStyle(1,index,{line:1,pos:8}).transform,'none');
    assert.equal(glyphStyle(1,index,{line:1,pos:8}).color,'var(--ink)');
  }
  assert.equal(glyphStyle(1,8,{line:1,pos:8,strength:0}).transform,'none');
});

test('one frame owner pauses on invisibility and hidden documents and cleans all listeners', t => {
  const listeners = new Map(), frames = new Map(); let id=0, intersection, disconnected=false;
  const previous = Object.fromEntries(['requestAnimationFrame','cancelAnimationFrame','IntersectionObserver','document'].map(k=>[k,globalThis[k]]));
  globalThis.requestAnimationFrame = callback => { frames.set(++id,callback); return id; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  globalThis.IntersectionObserver = class { constructor(callback) { intersection=callback; } observe() {} disconnect() { disconnected=true; } };
  globalThis.document = { hidden:false, addEventListener:(type,fn)=>listeners.set(type,fn), removeEventListener:type=>listeners.delete(type) };
  t.after(()=>Object.assign(globalThis,previous));
  const node = { querySelectorAll:()=>[], closest:()=>null, addEventListener:(type,fn)=>listeners.set(type,fn), removeEventListener:type=>listeners.delete(type) };
  const dispose = installWind(node);
  assert.equal(frames.size,0);
  intersection([{isIntersecting:true}]); assert.equal(frames.size,1);
  intersection([{isIntersecting:true}]); assert.equal(frames.size,1);
  document.hidden=true; listeners.get('visibilitychange')(); assert.equal(frames.size,0);
  document.hidden=false; listeners.get('visibilitychange')(); assert.equal(frames.size,1);
  intersection([{isIntersecting:false}]); assert.equal(frames.size,0);
  dispose(); assert.equal(listeners.size,0); assert.equal(frames.size,0); assert.equal(disconnected,true);
});
