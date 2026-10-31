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
test('no-JavaScript Bollard card keeps the live app without advertising a missing case route',()=>{
 const html=patchHomeMobile(patchHomeNav(raw));
 assert.ok(!html.includes('href="https://miguelalmeida.is-a.dev/work/bollard"'));
 assert.match(html,/<noscript><details class="bollard-case-fallback"><summary>Read Bollard case study<\/summary>/);
 for(const id of ['needle','f24','second-voice','leu'])assert.ok(html.includes(`href="https://miguelalmeida.is-a.dev/work/${id}"`));
});


test('fast film source and inline composition stay synchronized at native 6.5-second duration',()=>{
 const film=readFileSync(new URL('../../docs/motion/bollard/film.js',import.meta.url),'utf8');
 const composition=readFileSync(new URL('../../docs/motion/bollard/index.html',import.meta.url),'utf8');
 assert.ok(composition.includes(`<script>${film}</script>`));
 assert.equal([...composition.matchAll(/data-duration="([^"]+)"/g)].length,2);
 assert.ok([...composition.matchAll(/data-duration="([^"]+)"/g)].every(match=>Number(match[1])===6.5));
 assert.match(film,/t:6\.5,duration:6\.5/);
 assert.match(film,/box\(72,252,1056,720,36,C.blue,C.blue\)/);

});
