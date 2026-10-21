import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {gsap} from 'gsap';

const compile=path=>ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const config={};vm.runInNewContext(compile('src/lib/hero-lab/typographic/turntable/src/config.ts'),{exports:config});
const sweep={};vm.runInNewContext(compile('src/lib/hero-lab/typographic/turntable/src/sweep.ts'),{exports:sweep,require:name=>({'gsap':{gsap},'./config':config})[name]});
function setup(){
 const writes=[];
 const root={clientWidth:1000,style:{setProperty:(...args)=>writes.push(args)},classList:{add:(...args)=>writes.push(args),remove(){}}};
 const room={style:new Proxy({},{set(target,key,value){writes.push([key,value]);target[key]=value;return true;}})};
 const controller=new AbortController();
 const before=new Set(gsap.globalTimeline.getChildren());
 const run=()=>sweep.runSweep({root,room,oldField:'#fff',newField:'#000',toDesigner:true,items:[{x:800,run:()=>writes.push('crossed')}],signal:controller.signal});
 const dispose=()=>{for(const tween of gsap.globalTimeline.getChildren())if(!before.has(tween))tween.kill();gsap.ticker.sleep();};
 return {controller,run,writes,dispose};
}

// Regression: ENG-06 — cancellation must settle without late detached-node writes.
// Found by /qa on 2026-10-21. Report: implementation-evidence/progress.md
test('aborting a sweep settles its completion without waiting for decoration',async()=>{
 const h=setup();try{
  let settled=false;h.run().then(()=>settled=true);
  h.controller.abort();await Promise.resolve();
  assert.equal(settled,true);
 }finally{h.dispose();}
});
test('a canceled sweep never paints or crosses another item',async()=>{
 const h=setup();try{
  const finished=h.run();h.controller.abort();const count=h.writes.length;
  gsap.globalTimeline.time(gsap.globalTimeline.time()+2);
  await Promise.resolve();
  assert.equal(h.writes.length,count);
  await finished;
 }finally{h.dispose();}
});
test('an already canceled sweep does not touch its former DOM',async()=>{
 const h=setup();try{h.controller.abort();await h.run();assert.equal(h.writes.length,0);}
 finally{h.dispose();}
});
