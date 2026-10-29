import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {patchHomeNav} from '../../scripts/patch-home-nav.mjs';
import {patchHomeMobile} from '../../scripts/patch-home-mobile.mjs';
const raw=readFileSync(new URL('../../release/home.html',import.meta.url),'utf8');
test('Bollard joins the shipping gallery without replacing existing projects',()=>{
 const html=patchHomeMobile(patchHomeNav(raw));
 assert.deepEqual([...html.matchAll(/<article class="project" id="([^"]+)"/g)].map(x=>x[1]),['f24','second-voice','leu','needle','bollard']);
 assert.match(html,/data-project="4" aria-controls="bollard"/);
 assert.match(html,/galleryEnd=panels.length-1\+\.68/);
 assert.match(html,/aria-label="Five projects"/);
});
test('Bollard provides the live app, fictional scenario and human decision case study',()=>{
 assert.match(raw,/https:\/\/bollard-nine.vercel.app\/today/);
 const data=JSON.parse(raw.match(/const CASE_DATA=(.*);/)[1]);
 assert.equal(data.leu.next,'needle');assert.equal(data.needle.next,'bollard');assert.equal(data.bollard.next,'f24');
 const text=JSON.stringify(data.bollard);
 for(const phrase of ['+€62/t','€23/t','ore, coal, gas, power and carbon','quarterly index','€1.19m','fictional','human'])assert.ok(text.includes(phrase),phrase);
});
test('Bollard film has a poster and accessible independent playback control',()=>{
 assert.match(raw,/<video id="bollard-film"[^>]*muted[^>]*loop[^>]*playsinline[^>]*poster="\/projects\/bollard\/approval-v3.webp"/);
 assert.match(raw,/src="\/projects\/bollard\/approval-v3.mp4" type="video\/mp4"/);
 assert.match(raw,/aria-controls="bollard-film"[^>]*aria-label="Pause Bollard preview"[^>]*>Pause/);
 assert.match(raw,/id="bollard-motion-controller"/);
});

test('Bollard playback pauses offscreen, for reduced motion, hidden tabs, dialogs and user choice',async()=>{
 const {runInNewContext}=await import('node:vm');
 const listeners={},buttonEvents={},mediaEvents={};let intersection,mutation;
 const video={hidden:true,parentElement:{},paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
 const poster={hidden:false},button={hidden:true,setAttribute(k,v){this[k]=v;},addEventListener(k,v){buttonEvents[k]=v;}},dialog={open:false};
 const reduced={matches:false,addEventListener(k,v){mediaEvents[k]=v;}};
 const document={hidden:false,querySelector(s){return s==='#bollard-film'?video:s==='#bollard .project-cover'?poster:s==='[data-bollard-toggle]'?button:dialog;},querySelectorAll(){return [];},addEventListener(k,v){listeners[k]=v;}};
 const source=raw.match(/<script id="bollard-motion-controller">([\s\S]*?)<\/script>/)[1];
 runInNewContext(source,{document,matchMedia:()=>reduced,addEventListener(){},IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}});
 assert.equal(video.paused,true);
 const enter=()=>intersection([{isIntersecting:true,intersectionRatio:.9}]);enter();assert.equal(video.paused,false);assert.equal(poster.hidden,true);
 buttonEvents.click();assert.equal(video.paused,true);assert.equal(button.textContent,'Resume');
 intersection([{isIntersecting:false,intersectionRatio:0}]);enter();assert.equal(video.paused,true,'user pause survives re-entry');
 buttonEvents.click();assert.equal(video.paused,false);
 document.hidden=true;listeners.visibilitychange();assert.equal(video.paused,true);document.hidden=false;listeners.visibilitychange();assert.equal(video.paused,false);
 dialog.open=true;mutation();assert.equal(video.paused,true);dialog.open=false;mutation();assert.equal(video.paused,false);
 reduced.matches=true;mediaEvents.change();assert.equal(video.paused,true);assert.equal(video.hidden,true);assert.equal(poster.hidden,false);assert.equal(button.hidden,true);
 reduced.matches=false;mediaEvents.change();assert.equal(video.paused,false);
 intersection([{isIntersecting:false,intersectionRatio:0}]);assert.equal(video.paused,true);
});

test('Bollard ignores interrupted or stale play requests and follows the global mobile pause',async()=>{
 const {runInNewContext}=await import('node:vm');
 let intersection,mutation;const events={},pending=[];
 const video={hidden:true,parentElement:{},paused:true,play(){this.paused=false;return new Promise((resolve,reject)=>pending.push({resolve,reject}));},pause(){this.paused=true;}};
 const poster={},button={setAttribute(){},addEventListener(){}},dialog={open:false},global={getAttribute:()=> 'false'};
 const document={hidden:false,querySelector(s){return s==='#bollard-film'?video:s==='#bollard .project-cover'?poster:s==='[data-bollard-toggle]'?button:s==='[data-film-toggle]'?global:dialog;},querySelectorAll(){return [];},addEventListener(k,v){events[k]=v;}};
 const source=raw.match(/<script id="bollard-motion-controller">([\s\S]*?)<\/script>/)[1];
 runInNewContext(source,{document,matchMedia:s=>({matches:s.includes('max-width'),addEventListener(){}}),addEventListener(){},IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}});
 const enter=()=>intersection([{isIntersecting:true,intersectionRatio:.9}]);
 enter();intersection([{isIntersecting:false,intersectionRatio:0}]);pending[0].reject({name:'AbortError'});await Promise.resolve();enter();assert.equal(video.hidden,false,'offscreen cancellation must permit re-entry');
 const stale=pending.at(-1);dialog.open=true;mutation();dialog.open=false;mutation();stale.reject({name:'NotSupportedError'});await Promise.resolve();assert.equal(video.hidden,false,'obsolete request cannot disable newer playback');
 pending.at(-1).reject({name:'AbortError'});await Promise.resolve();assert.equal(video.hidden,false,'AbortError is never a permanent media failure');
 events['portfolio-preview-pause']({detail:{paused:true,mobile:true}});assert.equal(video.paused,true);assert.equal(poster.hidden,false);
 events['portfolio-preview-pause']({detail:{paused:false,mobile:true}});assert.equal(video.paused,false);
 pending.at(-1).reject({name:'NotSupportedError'});await Promise.resolve();assert.equal(video.hidden,true,'current genuine failure falls back to poster');assert.equal(button.hidden,true);
});

test('shared mobile controller broadcasts its effective pause state',()=>{
 const source=readFileSync(new URL('../../release/mobile-project-films.js',import.meta.url),'utf8');
 assert.match(source,/document\.dispatchEvent\(new CustomEvent\('portfolio-preview-pause',\{detail:\{paused,mobile:mobile\.matches\}\}\)\)/);
});

test('no-JavaScript Bollard card keeps the live app without advertising a missing case route',()=>{
 const html=patchHomeMobile(patchHomeNav(raw));
 assert.ok(!html.includes('href="https://miguelalmeida.is-a.dev/work/bollard"'));
 assert.match(html,/<noscript><details class="bollard-case-fallback"><summary>Read Bollard case study<\/summary>/);
 for(const id of ['needle','f24','second-voice','leu'])assert.ok(html.includes(`href="https://miguelalmeida.is-a.dev/work/${id}"`));
});


test('Bollard offers semantic film-only evidence and approval controls outside the case button',()=>{
 assert.match(raw,/<div[^>]*data-bollard-controls[^>]*role="group"[^>]*aria-label="Try the preview: film only"/);
 for(const [seconds,label] of [[0.8,'Inspect evidence'],[2.5,'Approve preview']])assert.match(raw,new RegExp(`<button[^>]*data-bollard-seek="${seconds}"[^>]*>${label}</button>`));
 assert.ok(raw.indexOf('data-bollard-seek="0.8"')>raw.indexOf('id="bollard-film"'));
});

test('visitor controls seek to evidence and approval, resume local pause and respect reduced motion and global pause',async()=>{
 const {runInNewContext}=await import('node:vm');let intersection;const events={},mediaEvents={},clicks={};
 const video={currentTime:0,parentElement:{},paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
 const pause={setAttribute(){},addEventListener(k,v){clicks.pause=v;}},poster={},dialog={open:false},controls={},global={getAttribute:()=> 'false'};
 const seek=[0.8,2.5].map(seconds=>({dataset:{bollardSeek:String(seconds)},addEventListener(k,v){clicks[seconds]=v;}}));
 const reduced={matches:false,addEventListener(k,v){mediaEvents[k]=v;}};
 const document={hidden:false,querySelector(s){return s==='#bollard-film'?video:s==='#bollard .project-cover'?poster:s==='[data-bollard-toggle]'?pause:s==='[data-bollard-controls]'?controls:s==='[data-film-toggle]'?global:dialog;},querySelectorAll(){return seek;},addEventListener(k,v){events[k]=v;}};
 runInNewContext(raw.match(/<script id="bollard-motion-controller">([\s\S]*?)<\/script>/)[1],{document,matchMedia:s=>s.includes('reduced')?reduced:{matches:true},addEventListener(){},IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},MutationObserver:class{observe(){}}});
 intersection([{isIntersecting:true,intersectionRatio:1}]);clicks.pause();assert.equal(video.paused,true);
 clicks[0.8]();assert.equal(video.currentTime,0.8);assert.equal(video.paused,false);
 clicks[2.5]();assert.equal(video.currentTime,2.5);assert.equal(video.paused,false);
 events['portfolio-preview-pause']({detail:{mobile:true,paused:true}});clicks[0.8]();assert.equal(video.paused,true,'shared pause remains respected');
 reduced.matches=true;mediaEvents.change();assert.equal(controls.hidden,true);video.currentTime=0;clicks[2.5]();assert.equal(video.currentTime,0);assert.equal(video.paused,true);
});

test('zero-range preview fetches one blob, keeps latest seek, respects pause and restores on fetch failure',async()=>{
 const {runInNewContext}=await import('node:vm');
 async function setup(fail=false){
  let intersection,resolveFetch,fetches=0;const events={},clicks={},videoEvents={},revoked=[];
  const video={src:'',currentTime:0,seekable:{length:1,end:()=>0},parentElement:{},paused:true,querySelector(){return {src:'https://example.test/projects/bollard/approval-v3.mp4'};},addEventListener(k,v){videoEvents[k]=v;},removeEventListener(k,v){if(videoEvents[k]===v)delete videoEvents[k];},load(){},play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
  const button={setAttribute(){},addEventListener(k,v){clicks.pause=v;}},poster={},dialog={open:false},controls={},global={getAttribute:()=> 'false'};
  const seek=[0.8,2.5].map(seconds=>({dataset:{bollardSeek:String(seconds)},addEventListener(k,v){clicks[seconds]=v;}}));
  const document={hidden:false,querySelector(s){return s==='#bollard-film'?video:s==='#bollard .project-cover'?poster:s==='[data-bollard-toggle]'?button:s==='[data-bollard-controls]'?controls:s==='[data-film-toggle]'?global:dialog;},querySelectorAll(){return seek;},addEventListener(k,v){events[k]=v;}};
  const reduced={matches:false,addEventListener(){}};
  runInNewContext(raw.match(/<script id="bollard-motion-controller">([\s\S]*?)<\/script>/)[1],{document,matchMedia:s=>s.includes('reduced')?reduced:{matches:true},fetch:()=>{fetches++;return new Promise(resolve=>resolveFetch=resolve);},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(url){revoked.push(url);}},addEventListener(){},IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},MutationObserver:class{observe(){}}});
  intersection([{isIntersecting:true,intersectionRatio:1}]);clicks[0.8]();clicks[2.5]();assert.equal(fetches,1);
  resolveFetch({ok:fail!==true,blob:async()=>({})});for(let i=0;i<8;i++)await Promise.resolve();
  if(fail===true){
   assert.equal(video.src,'');assert.equal(video.paused,false);assert.equal(button.hidden,false);
   clicks[2.5]();assert.equal(fetches,2,'a later explicit action retries failed download');
   resolveFetch({ok:true,blob:async()=>({})});for(let i=0;i<8;i++)await Promise.resolve();videoEvents.loadedmetadata();assert.equal(video.currentTime,2.5);assert.equal(video.paused,false);return;
  }
  if(fail==='media'){
   const staleMetadata=videoEvents.loadedmetadata,staleError=videoEvents.error;videoEvents.error();assert.deepEqual(revoked,['blob:test']);assert.equal(video.src,'https://example.test/projects/bollard/approval-v3.mp4');assert.equal(video.paused,false,'restore original playback after blob load error');
   clicks[0.8]();assert.equal(fetches,2);resolveFetch({ok:true,blob:async()=>({})});for(let i=0;i<8;i++)await Promise.resolve();
   staleMetadata();staleError();assert.equal(video.paused,true,'stale metadata cannot complete a newer load');videoEvents.loadedmetadata();assert.equal(video.currentTime,0.8);assert.equal(video.paused,false);return;
  }
  assert.equal(video.src,'blob:test');assert.equal(video.paused,true,'wait for blob metadata');
  clicks.pause();videoEvents.loadedmetadata();assert.equal(video.currentTime,2.5);assert.equal(video.paused,true,'user pause during fetch/load survives');
  clicks[0.8]();assert.equal(video.currentTime,0.8);assert.equal(fetches,1);assert.equal(video.paused,false);
 }
 await setup();await setup(true);await setup('media');
});

test('fast film source and inline composition stay synchronized at native 6.5-second duration',()=>{
 const film=readFileSync(new URL('../../docs/motion/bollard/film.js',import.meta.url),'utf8');
 const composition=readFileSync(new URL('../../docs/motion/bollard/index.html',import.meta.url),'utf8');
 assert.ok(composition.includes(`<script>${film}</script>`));
 assert.equal([...composition.matchAll(/data-duration="([^"]+)"/g)].length,2);
 assert.ok([...composition.matchAll(/data-duration="([^"]+)"/g)].every(match=>Number(match[1])===6.5));
 assert.match(film,/t:6\.5,duration:6\.5/);
 assert.match(film,/box\(72,252,1056,720,36,C.blue,C.blue\)/);
 for(const target of [...raw.matchAll(/data-bollard-seek="([^"]+)"/g)].map(match=>Number(match[1])))assert.ok(target>0&&target<6.5);
});
