import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {readable} from 'svelte/store';
const source=ts.transpileModule(fs.readFileSync('src/lib/motion/policy.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function setup(system=false,stored=false,data=false){
 const reduced=new EventTarget(),pointer=new EventTarget(),connection=new EventTarget();
 reduced.matches=system;pointer.matches=true;connection.saveData=data;
 const storage=new Map([['miguel-motion-preference',stored?'reduced':'system']]);
 const root={dataset:{}};const exports={};
 vm.runInNewContext(source,{exports,require:name=>({'$app/environment':{browser:true},'svelte/store':{readable}})[name],
  document:{documentElement:root},navigator:{connection},window:{matchMedia:q=>q.includes('reduced')?reduced:pointer},
  localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)}});
 const cleanup=exports.initMotionPolicy();return {...exports,reduced,connection,root,cleanup};
}
for(const system of [false,true])for(const stored of [false,true])for(const data of [false,true])
 test(`motion policy combines OS=${system}, stored=${stored}, Save-Data=${data}`,()=>{
  const h=setup(system,stored,data);try{assert.equal(h.motionSnapshot().reduced,system||stored||data);assert.equal(h.root.dataset.motion,system||stored||data?'reduced':'full');}finally{h.cleanup();}
 });
test('live policy subscribers receive stored, system and connection changes without overriding stricter input',()=>{
 const h=setup(),seen=[];const stop=h.motionState.subscribe(s=>seen.push(s.reduced));
 try{
  h.setMotionSetting('reduced');assert.equal(seen.at(-1),true);
  h.reduced.matches=true;h.reduced.dispatchEvent(new Event('change'));h.setMotionSetting('system');assert.equal(seen.at(-1),true);
  h.connection.saveData=true;h.connection.dispatchEvent(new Event('change'));h.reduced.matches=false;h.reduced.dispatchEvent(new Event('change'));assert.equal(seen.at(-1),true);
  h.connection.saveData=false;h.connection.dispatchEvent(new Event('change'));assert.equal(seen.at(-1),false);
  stop();const count=seen.length;h.setMotionSetting('reduced');assert.equal(seen.length,count);
 }finally{stop();h.cleanup();}
});
