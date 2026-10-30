import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {patchMorrowPortfolio} from '../../scripts/patch-home-morrow.mjs';
const source=readFileSync(new URL('../../release/home.html',import.meta.url),'utf8');
const installer=readFileSync(new URL('../../scripts/install-portfolio-home.mjs',import.meta.url),'utf8');
test('Morrow is sixth, preserves the existing projects and enters the case tour',()=>{
 const p=patchMorrowPortfolio(source);
 assert.equal((p.match(/<article class="project" id=/g)||[]).length,6);
 assert.equal((p.match(/data-project="5"/g)||[]).length,1);
 assert.match(p,/CASE_DATA.bollard.next="morrow";CASE_DATA.morrow=/);
 assert.match(p,/data-case="morrow"/);
 assert.match(p,/morrow\.miguelalmeida\.xyz/);
 assert.match(p,/F24 and five independent projects/);
 assert.match(installer,/const homepage = patchMorrowPortfolio\(html\)/);
});
test('reel is responsive, scroll-visible, paused offscreen and accessible',()=>{
 const p=patchMorrowPortfolio(source);
 for(const f of ['morrow-loop-1600.mp4','morrow-loop-mobile.mp4','morrow-poster.webp'])assert.ok(p.includes('/projects/morrow/'+f));
 for(const part of ['muted loop playsinline','preload="none"','prefers-reduced-motion:reduce','document.hidden','IntersectionObserver','video.pause()','data-playing'])assert.ok(p.includes(part),part);
 assert.match(p,/Play Morrow preview/);
 assert.equal((p.match(/id="morrow-motion-controller"/g)||[]).length,1);
 assert.throws(()=>patchMorrowPortfolio(p),/Expected exactly one Morrow integration anchor/);
});
test('Morrow declares response collection out of scope and makes no unsupported test-count promise',()=>{
 const p=patchMorrowPortfolio(source);
 const start=p.indexOf('id="morrow"');
 assert.match(p.slice(start,start+2400),/not response collection/);
 assert.ok(!p.slice(start,start+2400).includes('105 passing'));
});