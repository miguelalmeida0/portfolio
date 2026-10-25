import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import {patchHomeNav} from '../../scripts/patch-home-nav.mjs';
import {patchHomeMobile} from '../../scripts/patch-home-mobile.mjs';

const source=readFileSync(new URL('../../release/mobile-project-films.js',import.meta.url),'utf8');
const {mobileFilmFrame:frame,mobileFilmPlayback:play}=runInNewContext(source+';({mobileFilmFrame,mobileFilmPlayback})');
const ready={mobile:true,reduced:false,hidden:false,dialog:false,paused:false,ratios:[.2,.8,0,0]};
test('every visible mobile preview receives an autoplay clock, including tied coverage',()=>{
 assert.deepEqual(Array.from(play(ready)),[0,1]);
 assert.deepEqual(Array.from(play({...ready,ratios:[0,1,1,0]})),[1,2]);
 assert.deepEqual(Array.from(play({...ready,ratios:[0,0,0,0]})),[]);
 assert.deepEqual(Array.from(play({...ready,ratios:[.1,.17,0,0]})),[]);
 for(const state of [{mobile:false},{reduced:true},{hidden:true},{dialog:true},{paused:true}])assert.deepEqual(Array.from(play({...ready,...state})),[]);
});
test('explicit permission plays mobile previews with reduced motion while retaining suspension guards',()=>{
 const allowed={...ready,reduced:true,motionAllowed:true};
 assert.deepEqual(Array.from(play(allowed)),[0,1]);
 for(const state of [{mobile:false},{hidden:true},{dialog:true},{paused:true}])assert.deepEqual(Array.from(play({...allowed,...state})),[]);
});
test('four films tell different stories and reproduce the same frame exactly',()=>{
 for(const id of ['needle','f24','second-voice','leu']){
  assert.deepEqual(frame(id,3.2),frame(id,3.2));
  assert.notDeepEqual(frame(id,0),frame(id,3.2));
 }
 assert.equal(frame('needle',0).cards.length,3);
 assert.equal(frame('f24',0).typed,0);
 assert.equal(frame('f24',7.6).typed,20);
 assert.ok(frame('f24',4.6).error>.9);
 assert.ok(frame('f24',7.6).saved>.9);
 assert.ok(frame('second-voice',4.6).words.every(v=>v>.95));
 assert.ok(frame('leu',4).leaf < -160);
});
test('all scene values stay finite through multiple cycles and loop without a jump',()=>{
 const durations={needle:8.8,f24:8.4,'second-voice':8.8,leu:10};
 const numbers=value=>typeof value==='number'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(numbers):[];
 for(const [id,duration] of Object.entries(durations)){
  for(let t=0;t<duration*3;t+=.037)assert.ok(numbers(frame(id,t)).every(Number.isFinite));
  assert.deepEqual(frame(id,0),frame(id,duration));
 }
});
test('the shipping mobile branch starts films after resetting the desktop scene',()=>{
 const html=patchHomeMobile(patchHomeNav(readFileSync(new URL('../../release/home.html',import.meta.url),'utf8')));
 assert.match(html,/projectScenes\.reset\(true\);mobileFilms\.sync\(\)/);
 assert.match(html,/function setupMotion\(\)\{\s+mobileFilms\.stop\(\)/);
 assert.match(html,/data-film-toggle[^>]*hidden/);
 assert.equal(patchHomeMobile(html),html);
});
