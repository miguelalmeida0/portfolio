import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {patchCaseNavigation,caseStudyDocument} from '../../scripts/patch-case-navigation.mjs';
const original=(await Promise.all(Array.from({length:17},(_,i)=>readFile(`release/optical-index/${String(i).padStart(2,'0')}.txt`,'utf8')))).join('');
const controller='export function createCaseNavigation(){return {start(){},enter(){return true;},leave(){return false;}};}';

test('case links have real routes and a visible back chevron',()=>{
 const html=patchCaseNavigation(original,controller);
 assert.match(html, /class="media-link cs-open" data-case="1" href="\/case\/morrow\/"/);
 assert.match(html, /id="csBack" href="\/#work"[^>]*><span aria-hidden="true">&lt;<\/span> Back to home/);
});
test('modified executable scripts remain covered by the strict CSP',()=>{
 const html=patchCaseNavigation(original,controller);
 const policy=html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
 for(const [,attrs,body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if(attrs.includes('application/json')||attrs.includes('src='))continue;
  const digest=createHash('sha256').update(body).digest('base64');
  assert.ok(policy.includes('sha256-'+digest),'Executable script must be permitted without unsafe-inline');
 }
 assert.ok(!policy.split('style-src')[0].includes('unsafe-inline'));
});
test('patching twice does not duplicate history handling',()=>{
 const once=patchCaseNavigation(original,controller);
 assert.equal(patchCaseNavigation(once,controller),once);
});
test('direct case documents identify their canonical route',()=>{
 const html='<head><title>Home</title><link rel="canonical" href="https://miguelalmeida.is-a.dev/"><meta property="og:url" content="https://miguelalmeida.is-a.dev/"><meta property="og:title" content="Home"></head>';
 const page=caseStudyDocument(html,{id:'morrow',shortName:'Morrow'});
 assert.match(page,/<title>Morrow · Miguel Almeida<\/title>/);
 assert.match(page,/rel="canonical" href="https:\/\/miguelalmeida.is-a.dev\/case\/morrow\/"/);
 assert.match(page,/property="og:url" content="https:\/\/miguelalmeida.is-a.dev\/case\/morrow\/"/);
});
