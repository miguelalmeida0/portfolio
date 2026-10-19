import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.ROUTE_HEALTH_BASE_URL||'http://127.0.0.1:4273';
const get=async path=>{const r=await fetch(base+path);assert.equal(r.status,200,path);return r.text();};
test('CV evidence fragment exists on the actual destination',async()=>{
 const cv=await get('/hero-lab/typographic/cv');
 const target=cv.match(/href="(\/work\/f24#[^"]+)"/)?.[1];assert.ok(target);
 const [path,id]=target.split('#');assert.ok((await get(path)).includes('id="'+id+'"'),target);
});
test('case endings cover all five projects without a loop then return to Work',async()=>{
 let path='/work/f24';const seen=[];
 for(let i=0;i<5;i++){
  assert.ok(!seen.includes(path),'repeated project '+path);seen.push(path);
  const html=await get(path);const nav=html.match(/<nav[^>]*class="next[^"]*"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,path);path=nav.match(/href="([^"]+)"/)?.[1];assert.ok(path);
 }
 assert.deepEqual(seen,['/work/f24','/work/needle','/work/second-voice','/work/leu','/work/flow']);
 assert.equal(path,'/#work');
});
test('all cases render real chapter options and the shutter starts hidden',async()=>{
 for(const slug of ['f24','needle','second-voice','leu','flow']){
  const html=await get('/work/'+slug);
  assert.match(html,/<select[^>]*aria-label="Case study chapter"/);
  for(const [,id] of html.matchAll(/<option[^>]*value="([^"]+)"/g))assert.ok(html.includes('id="'+id+'"'),slug+'#'+id);
  assert.match(html,/<div[^>]*data-route-shutter[^>]*hidden[^>]*aria-hidden="true"/);
 }
});

