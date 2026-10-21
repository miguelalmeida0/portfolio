import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {writable,get} from 'svelte/store';
import {loadLocalTs} from '../../scripts/lib/load-local-ts.mjs';
const {initialView}=await loadLocalTs('src/lib/ask/view.ts');
const answers=await loadLocalTs('src/lib/miguel-llm/askConversation.ts');
function setup({reduced=false,animateAnswer=false}={}){
 let now=0,id=0,motion=reduced,focus='',registry=0;
 const jobs=new Map(),listeners=new Map(),subscribers=new Set(),view=writable(initialView());
 const document={documentElement:{classList:{add(){},remove(){}}},
  querySelector(selector){return selector.includes('input')?{focus(){focus='input';}}:null;},
  querySelectorAll(selector){return selector.includes('trigger')?[{getClientRects:()=>[{}],focus(){focus='trigger';}}]:[];},
  addEventListener(name,fn){listeners.set(name,fn);},removeEventListener(name){listeners.delete(name);}};
 const modules={svelte:{tick:async()=>{}},'svelte/store':{writable},'./view':{askView:view,initialView},
  './shortcut':{isAskShortcut:()=>false},'./plan':{areaPlan:()=>undefined},
  './registry':{activateRegistry(){registry++;return()=>registry--;},sourceMap:()=>({})},
  './heartbeat':{heartbeat:()=>({stop(){},silence(){},cancelSways(){}})},'./proximity':{proximity:()=>()=>{}},
  './answer':{clearQuotes(){},answerSequence(_s,_f,_r,update){update([],!animateAnswer||_r);return()=>{};}},
  './portrait':{positionAskPortrait:()=>()=>{}},'$lib/miguel-llm/askConversation':answers,
  '$lib/motion/policy':{motionSnapshot:()=>({reduced:motion}),motionState:{subscribe(fn){subscribers.add(fn);fn({reduced:motion});return()=>subscribers.delete(fn);}}}
 };
 const timeout=(fn,ms)=>{const key=++id;jobs.set(key,{at:now+ms,fn});return key;};
 const context={exports:{},require:name=>{assert.ok(name in modules,name);return modules[name];},document,
  window:{addEventListener(){},removeEventListener(){},dispatchEvent(){}},location:{pathname:'/'},
  matchMedia:()=>({get matches(){return motion;},addEventListener(_n,fn){subscribers.add(()=>fn());},removeEventListener(){}}),
  setTimeout:timeout,clearTimeout:key=>jobs.delete(key),AbortController,AbortSignal,
  fetch:()=>new Promise(resolve=>{pendingResponse=resolve;})};
 let pendingResponse;
 const compile=p=>ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const timerContext={...context,exports:{}};vm.runInNewContext(compile('src/lib/ask/timers.ts'),timerContext);modules['./timers']=timerContext.exports;
 vm.runInNewContext(compile(process.env.ASK_STATE_SOURCE||'src/lib/ask/state.ts'),context);
 const controller=context.exports.createAskController();
 return {controller,read:()=>get(view),focus:()=>focus,registry:()=>registry,listeners,
  advance(ms){const end=now+ms;for(;;){const next=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;now=next[1].at;jobs.delete(next[0]);next[1].fn();}now=end;},
  restrict(){motion=true;subscribers.forEach(fn=>fn({reduced:true}));},
  respond(question){pendingResponse({ok:true,json:async()=>({steps:[],knowledge:answers.assembleAskAnswer(answers.prepareAskAnswer(question,[]))})});}
 };
}
test('normal Ask dismissal finishes at 220ms with focus restored once',async()=>{
 const h=setup();try{await h.controller.open();h.advance(2400);h.controller.close();h.advance(219);assert.equal(h.read().state,'closing');h.advance(1);assert.equal(h.read().state,'idle');assert.equal(h.focus(),'trigger');assert.equal(h.registry(),0);}finally{h.controller.destroy();}
});
test('immediate reopen cancels obsolete exit and focus restoration',async()=>{
 const h=setup();try{await h.controller.open();h.controller.close();await h.controller.open();assert.equal(h.focus(),'input');assert.notEqual(h.read().state,'closing');h.advance(3000);assert.equal(h.read().state,'ready');assert.equal(h.focus(),'input');assert.equal(h.registry(),1);}finally{h.controller.destroy();}
});
test('restricting motion while closing settles immediately',async()=>{
 const h=setup();try{await h.controller.open();h.controller.close();h.restrict();assert.equal(h.read().state,'idle');assert.equal(h.focus(),'trigger');}finally{h.controller.destroy();}
});
test('late response from a closed interaction cannot populate the reopened guide',async()=>{
 const h=setup();try{await h.controller.open();const old=h.controller.free('What is your stack?');h.controller.close();await h.controller.open();h.respond('What is your stack?');await old;h.advance(3000);assert.equal(h.read().knowledge,null);assert.equal(h.focus(),'input');assert.equal(h.read().loading,false);}finally{h.controller.destroy();}
});

test('restricting motion settles answer decoration without losing the completed answer',async()=>{
 const h=setup({animateAnswer:true});try{
  await h.controller.open();const pending=h.controller.free('What is your stack?');h.respond('What is your stack?');await pending;
  assert.equal(h.read().complete,false);const knowledge=h.read().knowledge;assert.ok(knowledge);
  h.restrict();assert.equal(h.read().complete,true);assert.equal(h.read().knowledge,knowledge);
 }finally{h.controller.destroy();}
});
test('reopening before the first mount tick cannot activate a second registry owner',async()=>{
 const h=setup();try{const first=h.controller.open();h.controller.close();const next=h.controller.open();await Promise.all([first,next]);assert.equal(h.registry(),1);h.advance(3000);assert.equal(h.focus(),'input');}finally{h.controller.destroy();assert.equal(h.registry(),0);}
});
test('destroying before the mount tick leaves no panel owner or late focus',async()=>{
 const h=setup();const pending=h.controller.open();h.controller.destroy();await pending;h.advance(3000);assert.equal(h.registry(),0);assert.equal(h.read().state,'idle');assert.notEqual(h.focus(),'input');
});
