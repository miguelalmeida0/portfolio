import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const compiled = ts.transpileModule(fs.readFileSync('src/lib/motion/routeTransition.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
function setup({reduced=false,mobile=false,native=false}={}){
 let now=0,id=0; const timers=new Map(),events=[],animations=[],hooks={},listeners={};
 const schedule=(fn,ms=0)=>{timers.set(++id,{fn,at:now+ms});return id;};
 const advance=async(ms)=>{const end=now+ms;await flush();while(true){const next=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;now=next[1].at;timers.delete(next[0]);next[1].fn();await flush();}now=end;await flush();};
 const element=()=>({hidden:true,style:{},dataset:{},textContent:'',setAttribute(){},removeAttribute(){},hasAttribute(){return false;},addEventListener(){},
 focus(){doc.activeElement=this;},animate(frames,options){const d=deferred();const timer=schedule(d.resolve,options.duration+(options.delay||0));const a={frames,options,finished:d.promise,cancel(){timers.delete(timer);d.resolve();}};animations.push(a);return a;}});
 const strips=Array.from({length:6},element),title=element(),shutter=element(),main=element(),work=element();
 main.id='main';work.id='work';
 shutter.querySelectorAll=()=>strips;shutter.querySelector=()=>title;shutter.showPopover=()=>events.push('popover');shutter.hidePopover=()=>{};
 const doc={body:{},activeElement:null,visibilityState:'visible',documentElement:{dataset:{}},querySelectorAll:()=>[],querySelector:()=>null,getElementById:id=>id==='main'?main:id==='work'?work:null,
 addEventListener:(type,fn)=>listeners[type]=fn,removeEventListener:()=>{}};doc.activeElement=doc.body;
 const location={origin:'https://portfolio.test',pathname:'/',search:'',hash:'',href:'https://portfolio.test/'};
 const navigation=deferred();
 const at=path=>({url:new URL(path,location.origin)});
 const nav=(path,type='link',complete=navigation.promise)=>({type,from:at(location.pathname),to:at(path),complete,willUnload:false,cancel(){events.push('cancel');}});
 const modules={
 '$app/navigation':{beforeNavigate:fn=>hooks.before=fn,onNavigate:fn=>hooks.on=fn,afterNavigate:fn=>hooks.after=fn,preloadData:async()=>events.push('preload'),pushState:url=>events.push('push:'+url.hash),
 goto:async url=>{events.push('goto');const n=nav(url.href,'goto');hooks.before(n);await hooks.on(n);await navigation.promise;location.pathname=url.pathname;location.hash=url.hash;}},
 svelte:{flushSync:fn=>fn(),onMount:fn=>hooks.mount=fn,onDestroy:fn=>hooks.destroy=fn,tick:async()=>{}},
 'svelte/store':{writable:value=>({set(v){value=v;},get value(){return value;}})},
 './policy':{motionSnapshot:()=>({reduced}),motionState:{subscribe:fn=>{hooks.policy=fn;return ()=>{};}}},
 './tokens':{easing:{settle:'ease',shutter:'ease'}},
 './smooth-scroll':{resetScrollMotion:()=>events.push('reset-scroll'),syncScrollPosition:()=>events.push('sync-scroll'),scrollToElement:(target)=>events.push('scroll:'+target.id)},
 '$lib/navigation/destination-label':{destinationLabel:url=>url.pathname==='/story'?'Story':url.pathname==='/cv'?'CV':undefined}
 };
 const exports={};const win={innerWidth:mobile?390:1440,setTimeout:schedule,clearTimeout:key=>timers.delete(key),dispatchEvent:e=>events.push(e.type),addEventListener(){},removeEventListener(){},scrollTo:()=>events.push('scroll-top')};
 vm.runInNewContext(compiled,{exports,require:key=>modules[key],document:doc,window:win,location,URL,innerWidth:win.innerWidth,performance:{now:()=>now},CustomEvent:class{constructor(type){this.type=type;}},setTimeout:schedule,clearTimeout:key=>timers.delete(key),requestAnimationFrame:fn=>schedule(fn,16),matchMedia:()=>({matches:mobile})});
 if(native)doc.startViewTransition=callback=>{events.push('native');const done=Promise.resolve().then(callback);return{ready:Promise.resolve(),finished:done,updateCallbackDone:done,skipTransition(){}};};
 const owner=exports.installRouteTransitions(()=>shutter);hooks.mount?.();
 const click=(path='/story',fields={})=>({button:0,detail:1,clientX:300,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},currentTarget:{href:new URL(path,location.origin).href,target:'',download:'',dataset:{},hasAttribute:()=>false,getBoundingClientRect:()=>({left:200,width:100})},...fields});
 return {owner,hooks,nav,navigation,shutter,title,strips,animations,events,advance,doc,main,work,location,click,listeners};
}
test('forward claim animates immediately, waits for readable label and never takes native snapshot',async()=>{
 const s=setup({native:true});const n=s.nav('/story');s.hooks.before(n);
 assert.equal(s.shutter.hidden,false);assert.equal(s.owner.routeLabel.value,'Story');
 assert.equal(s.animations.length,7);assert.equal(s.animations[0].frames[0].transform,'scaleY(0)');
 let ready=false;const hook=s.hooks.on(n);Promise.resolve(hook).then(()=>ready=true);
 await s.advance(529);assert.equal(ready,false);await s.advance(1);assert.equal(ready,true);
 assert.ok(s.events.includes('route:covered'));assert.ok(!s.events.includes('native'));
 s.navigation.resolve();await s.advance(500);assert.equal(s.shutter.hidden,true);assert.equal(s.owner.mobileState.value,'idle');assert.equal(s.doc.activeElement,s.main);
});
test('cover uses top origin and reveal uses bottom origin with transform-only frames',async()=>{
 const s=setup();const n=s.nav('/cv');s.hooks.before(n);void s.hooks.on(n);
 assert.equal(s.strips[0].style.transformOrigin,'top');
 await s.advance(530);s.navigation.resolve();await s.advance(16);
 assert.equal(s.strips[0].style.transformOrigin,'bottom');
 for(const a of s.animations)for(const f of a.frames)assert.deepEqual(Object.keys(f),['transform']);
 await s.advance(500);
});
test('reduced motion never opens shutter and restores destination focus',async()=>{
 const s=setup({reduced:true});const n=s.nav('/story');s.hooks.before(n);const result=await s.hooks.on(n);s.navigation.resolve();if(typeof result==='function')await result();await s.advance(20);
 assert.equal(s.shutter.hidden,true);assert.equal(s.animations.length,0);assert.equal(s.doc.activeElement,s.main);
});
test('busy owner cancels second navigation and failed completion still uncovers',async()=>{
 const s=setup();const n=s.nav('/story');s.hooks.before(n);void s.hooks.on(n);s.hooks.before(s.nav('/cv'));
 assert.ok(s.events.includes('cancel'));await s.advance(530);s.navigation.reject(Error('aborted'));await s.advance(500);
 assert.equal(s.shutter.hidden,true);assert.equal(s.owner.mobileState.value,'idle');
});
test('four-second failsafe releases abandoned cover and a late completion cannot cover again',async()=>{
 const s=setup();const n=s.nav('/story');s.hooks.before(n);void s.hooks.on(n);await s.advance(4000);
 assert.equal(s.shutter.hidden,true);assert.equal(s.owner.mobileState.value,'idle');
 s.navigation.resolve();await s.advance(500);assert.equal(s.shutter.hidden,true);
});
test('an abort before onNavigate still releases promptly',async()=>{
 const s=setup();const n=s.nav('/story');n.complete.catch(()=>{});s.hooks.before(n);
 s.navigation.reject(Error('aborted before route load'));await s.advance(1000);
 assert.equal(s.shutter.hidden,true);assert.equal(s.owner.mobileState.value,'idle');
});
test('a second link click is blocked even when Kit skips beforeNavigate during loading',async()=>{
 const s=setup();s.hooks.before(s.nav('/story'));const event=s.click('/cv');
 event.target={closest:()=>event.currentTarget};let stopped=false;event.stopImmediatePropagation=()=>stopped=true;
 s.listeners.click(event);assert.equal(event.defaultPrevented,true);assert.equal(stopped,true);
 await s.advance(4000);
});
test('menu closes under cover, allows only its goto and releases focus after render',async()=>{
 const s=setup({mobile:true});const travel=s.owner.navigateFromMenu(s.click(),()=>{assert.equal(s.shutter.hidden,false);s.events.push('close');});
 assert.equal(s.events.includes('close'),false);await s.advance(530);assert.ok(s.events.includes('close'));assert.ok(s.events.includes('goto'));
 s.navigation.resolve();await s.advance(500);await travel;assert.equal(s.shutter.hidden,true);assert.equal(s.doc.activeElement,s.main);
});
test('modified, download, external and PDF links never claim a curtain',async()=>{
 for(const fields of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){
 const s=setup();await s.owner.navigateFromMenu(s.click('/story',fields),()=>{});assert.equal(s.animations.length,0);}
 for(const path of ['/cv/pdf','/out/needle','mailto:hi@example.com','https://other.test/']){
 const s=setup();const e=s.click(path);await s.owner.navigateFromMenu(e,()=>{});assert.equal(e.defaultPrevented,false);assert.equal(s.shutter.hidden,true);}
});
test('same-page hash closes menu and scrolls without a shutter',async()=>{
 const s=setup();await s.owner.navigateFromMenu(s.click('/#work'),()=>s.events.push('close'));
 assert.ok(s.events.includes('scroll:work'));assert.equal(s.shutter.hidden,true);
});
test('mobile history uses an unnamed shutter; desktop history uses native snapshots',async()=>{
 for(const mobile of [true,false]){
 const s=setup({mobile,native:true});const n=s.nav('/story','popstate');s.hooks.before(n);const hook=s.hooks.on(n);await s.advance(530);await hook;
 assert.equal(s.owner.routeLabel.value,'');assert.equal(s.events.includes('native'),!mobile);s.navigation.resolve();await s.advance(500);assert.equal(s.shutter.hidden,true);}
});

test('history waits for an interrupted forward commit even when beforeNavigate is skipped',async()=>{
 const s=setup();const forward=s.nav('/cv');s.hooks.before(forward);void s.hooks.on(forward);
 const back=deferred();let ready=false;
 const history=s.hooks.on(s.nav('/','popstate',back.promise));
 Promise.resolve(history).then(()=>ready=true);
 await s.advance(100);
 assert.equal(s.shutter.hidden,true);assert.equal(s.owner.mobileState.value,'idle');
 assert.equal(ready,false);
 s.navigation.reject(Error('navigation aborted'));await s.advance(30);
 const after=await history;assert.equal(ready,true);
 if(typeof after==='function')after();
 assert.ok(s.events.includes('sync-scroll'));assert.ok(!s.events.includes('cancel'));
 back.resolve();await s.advance(500);assert.equal(s.shutter.hidden,true);
});
