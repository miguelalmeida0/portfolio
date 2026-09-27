import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=ts.transpileModule(fs.readFileSync('src/lib/experience/voice-bridge.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const { VoiceBridge }=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const origin='https://secondvoice-ai.vercel.app';
function setup(t) {
  const frames=[],sent=[];
  const previous={window:globalThis.window,document:globalThis.document};
  globalThis.window=new EventTarget();
  globalThis.document={createElement:()=>({setAttribute(){},remove(){this.removed=true;},contentWindow:{postMessage:(data,target)=>sent.push({data,target})}}),body:{append:frame=>frames.push(frame)}};
  const bridge=new VoiceBridge();
  t.after(()=>{bridge.destroy();globalThis.window=previous.window;globalThis.document=previous.document;});
  function receive(data,options={}){window.dispatchEvent(Object.assign(new Event('message'),{data,origin,source:frames[0].contentWindow,...options}));}
  return {bridge,frames,sent,receive};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('foreign origins and windows cannot start a rewrite or inject its result',async t=>{
  const {bridge,sent,receive}=setup(t);
  const work=bridge.rewrite({text:'A private draft.',author:'tolkien',mood:52});
  const ready={type:'second-voice:controller-ready',version:2};
  receive(ready,{origin:'https://attacker.test'});receive(ready,{source:{}});receive({...ready,version:1});
  await flush();assert.equal(sent.length,0);
  receive(ready);await flush();assert.equal(sent.length,1);assert.equal(sent[0].target,origin);
  const response={type:'second-voice:result',version:2,id:sent[0].data.id,text:'A confirmed result.',remaining:2};
  let settled=false;work.then(()=>settled=true);
  receive(response,{origin:'https://attacker.test'});receive({...response,id:'unrelated'});receive({...response,text:'x'.repeat(20001)});
  await flush();assert.equal(settled,false);
  receive(response);assert.deepEqual(await work,{text:'A confirmed result.',remaining:2});
});
test('closing the connection rejects pending work and removes the frame',async t=>{
  const {bridge,frames,receive,sent}=setup(t);
  const work=bridge.rewrite({text:'Keep me.',author:'hemingway',mood:0});
  const rejected=assert.rejects(work,/closed/);
  receive({type:'second-voice:controller-ready',version:2});await flush();assert.equal(sent.length,1);
  bridge.destroy();await rejected;assert.equal(frames[0].removed,true);
});
test('only one generation is dispatched and service errors remain bounded',async t=>{
  const {bridge,receive,sent}=setup(t);
  const work=bridge.rewrite({text:'One request.',author:'stephenking',mood:100});
  const rejected=assert.rejects(work,error=>error.message.length===400);
  receive({type:'second-voice:controller-ready',version:2});await flush();
  await assert.rejects(bridge.rewrite({text:'Duplicate.',author:'tolstoy',mood:50}),/already in progress/);
  assert.equal(sent.length,1);
  receive({type:'second-voice:error',version:2,id:sent[0].data.id,message:'x'.repeat(1000)});await rejected;
});
