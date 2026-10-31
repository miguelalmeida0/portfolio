import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import {patchHomeNav} from '../../scripts/patch-home-nav.mjs';
import {patchHomeMobile} from '../../scripts/patch-home-mobile.mjs';

const source=readFileSync(new URL('../../release/mobile-project-films.js',import.meta.url),'utf8');
const {mobileFilmFrame:frame,mobileFilmPlayback:play,mobileFilmReducedFrame:reducedFrame}=runInNewContext(source+';({mobileFilmFrame,mobileFilmPlayback,mobileFilmReducedFrame})');
const ready={mobile:true,reduced:false,hidden:false,dialog:false,ratios:[.2,.8,0,0]};
test('every visible mobile preview receives an autoplay clock, including tied coverage',()=>{
 assert.deepEqual(Array.from(play(ready)),[0,1]);
 assert.deepEqual(Array.from(play({...ready,ratios:[0,1,1,0]})),[1,2]);
 assert.deepEqual(Array.from(play({...ready,ratios:[0,0,0,0]})),[]);
 assert.deepEqual(Array.from(play({...ready,ratios:[.1,.17,0,0]})),[]);
 for(const state of [{mobile:false},{hidden:true},{dialog:true}])assert.deepEqual(Array.from(play({...ready,...state})),[]);
});
test('reduced motion changes the composition without blocking mobile autoplay',()=>{
 const gentle={...ready,reduced:true};
 assert.deepEqual(Array.from(play(gentle)),[0,1]);
 for(const state of [{mobile:false},{hidden:true},{dialog:true}])assert.deepEqual(Array.from(play({...gentle,...state})),[]);
});
test('four films tell different stories and reproduce the same frame exactly',()=>{
 for(const id of ['needle','f24','second-voice','leu']){
  assert.deepEqual(frame(id,3.2),frame(id,3.2));
  assert.notDeepEqual(frame(id,0),frame(id,3.2));
 }
 assert.equal(frame('needle',0).typed,0);
 assert.equal(frame('f24',0).typed,0);
 assert.equal(frame('f24',7.6).typed,20);
 assert.ok(frame('f24',4.6).error>.9);
 assert.ok(frame('f24',7.6).saved>.9);
 assert.ok(frame('second-voice',4.6).words.every(v=>v>.95));
 assert.equal(frame('leu',4).rain.length,24);
 assert.notDeepEqual(frame('leu',4).rain,frame('leu',4.5).rain);
});
test('Needle types a real search, reveals its gallery and holds the artwork inspector',()=>{
 for(const gentle of [false,true]){
  assert.equal(frame('needle',0,gentle).typed,0);
  assert.equal(frame('needle',2.5,gentle).typed,20);
  assert.equal(frame('needle',4.8,gentle).gallery,1);
  for(const t of [7.5,8.5,9.2])assert.equal(frame('needle',t,gentle).details,1);
  assert.equal(frame('needle',10.8,gentle).details,0);
 }
});
test('Needle keeps reduced-motion submit geometry static while full motion presses',()=>{
 assert.equal(frame('needle',2.511,true).enterScale,1);
 assert.ok(frame('needle',2.511,false).enterScale<1);
});
test('reduced-motion UI previews retain their stories through distinct fades',()=>{
 assert.equal(reducedFrame('f24',0).fieldOpacity,0);
 assert.equal(reducedFrame('f24',.2).fieldOpacity,1);
 assert.equal(reducedFrame('f24',.4).recipientOpacity,1);
 assert.ok(reducedFrame('second-voice',0).words.every(alpha=>alpha===0));
 assert.equal(reducedFrame('second-voice',.15).words[0],1);
 assert.equal(reducedFrame('second-voice',.15).words[12],0);
 assert.ok(reducedFrame('second-voice',.5).words.every(alpha=>alpha===1));
 for(const id of ['f24','second-voice'])assert.deepEqual(reducedFrame(id,0),reducedFrame(id,1));
});
test('all scene values stay finite through multiple cycles and loop without a jump',()=>{
 const durations={needle:12.4,f24:8.4,'second-voice':8.8,leu:10};
 const numbers=value=>typeof value==='number'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(numbers):[];
 for(const [id,duration] of Object.entries(durations)){
  for(let t=0;t<duration*3;t+=.037){
   for(const gentle of [false,true])assert.ok(numbers(frame(id,t,gentle)).every(Number.isFinite));
   if(id==='f24'||id==='second-voice')assert.ok(numbers(reducedFrame(id,t/duration)).every(n=>Number.isFinite(n)&&n>=0&&n<=1));
  }
  for(const gentle of [false,true])assert.deepEqual(frame(id,0,gentle),frame(id,duration,gentle));
 }
});
test('the shipping mobile branch starts films after resetting the desktop scene',()=>{
 const html=patchHomeMobile(patchHomeNav(readFileSync(new URL('../../release/home.html',import.meta.url),'utf8')));
 assert.match(html,/projectScenes\.reset\(true\);mobileFilms\.sync\(\)/);
 assert.match(html,/function setupMotion\(\)\{\s+mobileFilms\.stop\(\)/);
 assert.equal(patchHomeMobile(html),html);
});

test('scene clocks start without a playback button and retain their project durations',()=>{
 const durations=[];
 const host={querySelectorAll:()=>[],querySelector:()=>null};
 const panels=['leu','needle'].map(id=>({id,querySelector:()=>host}));
 const gsap={to(clock,options){durations.push(options.duration);return {pause(){},paused(){}};}};
 const document={querySelector:()=>({open:false}),addEventListener(){}};
 const IntersectionObserver=class{observe(){}};
 const create=runInNewContext(source+';createMobileProjectFilms',{
  document,window:{gsap,IntersectionObserver},gsap,IntersectionObserver,
  matchMedia:()=>({matches:false,addEventListener(){}}),
  location:{search:''},URLSearchParams,MutationObserver:class{observe(){}},addEventListener(){},
 });
 create(panels);assert.deepEqual(durations,[10,12.4]);
});
