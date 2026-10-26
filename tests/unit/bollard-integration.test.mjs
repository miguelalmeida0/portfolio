import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {patchHomeNav} from '../../scripts/patch-home-nav.mjs';
import {patchHomeMobile} from '../../scripts/patch-home-mobile.mjs';
const raw=readFileSync(new URL('../../release/home.html',import.meta.url),'utf8');
test('Bollard joins the shipping gallery without replacing existing projects',()=>{
 const html=patchHomeMobile(patchHomeNav(raw));
 assert.deepEqual([...html.matchAll(/<article class="project" id="([^"]+)"/g)].map(x=>x[1]),['needle','f24','second-voice','leu','bollard']);
 assert.match(html,/data-project="4" aria-controls="bollard"/);
 assert.match(html,/galleryEnd=panels.length-1\+\.68/);
 assert.match(html,/aria-label="Five projects"/);
});
test('Bollard provides the live app, fictional scenario and human decision case study',()=>{
 assert.match(raw,/https:\/\/bollard-nine.vercel.app\/today/);
 const data=JSON.parse(raw.match(/const CASE_DATA=(.*);/)[1]);
 assert.equal(data.leu.next,'bollard');assert.equal(data.bollard.next,'needle');
 const text=JSON.stringify(data.bollard);
 for(const phrase of ['+€62/t','+€23/t','ore, coal, gas, power and carbon','quarterly index','€1.19M','fictional','human'])assert.ok(text.includes(phrase),phrase);
});
test('Bollard film has a poster and accessible independent playback control',()=>{
 assert.match(raw,/<video id="bollard-film"[^>]*muted[^>]*loop[^>]*playsinline[^>]*poster="\/projects\/bollard\/poster.webp"/);
 assert.match(raw,/src="\/projects\/bollard\/negotiation.mp4" type="video\/mp4"/);
 assert.match(raw,/aria-controls="bollard-film"[^>]*>Pause Bollard preview/);
 assert.match(raw,/id="bollard-motion-controller"/);
});

test('Bollard playback pauses offscreen, for reduced motion, hidden tabs, dialogs and user choice',async()=>{
 const {runInNewContext}=await import('node:vm');
 const listeners={},buttonEvents={},mediaEvents={};let intersection,mutation;
 const video={hidden:true,parentElement:{},paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
 const poster={hidden:false},button={hidden:true,setAttribute(k,v){this[k]=v;},addEventListener(k,v){buttonEvents[k]=v;}},dialog={open:false};
 const reduced={matches:false,addEventListener(k,v){mediaEvents[k]=v;}};
 const document={hidden:false,querySelector(s){return s==='#bollard-film'?video:s==='#bollard .project-cover'?poster:s==='[data-bollard-toggle]'?button:dialog;},addEventListener(k,v){listeners[k]=v;}};
 const source=raw.match(/<script id="bollard-motion-controller">([\s\S]*?)<\/script>/)[1];
 runInNewContext(source,{document,matchMedia:()=>reduced,addEventListener(){},IntersectionObserver:class{constructor(fn){intersection=fn;}observe(){}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}});
 assert.equal(video.paused,true);
 const enter=()=>intersection([{isIntersecting:true,intersectionRatio:.9}]);enter();assert.equal(video.paused,false);assert.equal(poster.hidden,true);
 buttonEvents.click();assert.equal(video.paused,true);assert.equal(button.textContent,'Resume Bollard preview');
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
 const document={hidden:false,querySelector(s){return s==='#bollard-film'?video:s==='#bollard .project-cover'?poster:s==='[data-bollard-toggle]'?button:s==='[data-film-toggle]'?global:dialog;},addEventListener(k,v){events[k]=v;}};
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
