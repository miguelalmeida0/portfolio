import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { createRequestLimiter, readJsonBody, reserveRemoteCall } = await loadLocalTs('src/lib/server/request-safety.ts');

test('one bounded request limiter aggregates endpoints, expires and never evicts an active allowance', () => {
  let now = 0;
  const limit = createRequestLimiter({ max: 2, capacity: 2, now: () => now });
  assert.equal(limit('client').allowed, true);
  assert.equal(limit('client').allowed, true);
  assert.deepEqual(limit('client'), { allowed: false, retryAfter: 60 });
  assert.equal(limit('other').allowed, true);
  assert.equal(limit('overflow').allowed, false);
  now = 60_000;
  assert.equal(limit('overflow').allowed, true);
});

test('JSON reads enforce actual UTF-8 bytes, chunk limits and cancellation without trusting content length', async () => {
  const req = body => new Request('https://local.invalid', { method: 'POST', body });
  assert.deepEqual(await readJsonBody(req('{"q":"ok"}'), 12), { q: 'ok' });
  await assert.rejects(readJsonBody(req('{"q":"ééé"}'), 12), error => error.status === 413);
  let cancelled = false;
  const stream = new ReadableStream({ pull(controller) { controller.enqueue(new Uint8Array(20)); }, cancel() { cancelled = true; } });
  await assert.rejects(readJsonBody(new Request('https://local.invalid', { method: 'POST', body: stream, duplex: 'half' }), 10), error => error.status === 413);
  assert.equal(cancelled, true);
  const abort = new AbortController();
  const waiting = readJsonBody(new Request('https://local.invalid', {method:'POST', body:new ReadableStream({cancel(){cancelled=true;}}), duplex:'half'}), 32, abort.signal);
  abort.abort();
  await assert.rejects(waiting, error => error.name === 'AbortError');
});

test('remote admission fails closed without opt-in, namespace or salt and shares a single budget identity', async () => {
  let calls = 0, client;
  const namespace = {idFromName(name) {assert.equal(name, 'portfolio-model-budget-v1'); return name;}, get() { return {async fetch(_url, init) {calls++; client=JSON.parse(init.body).client; return Response.json({allowed:true});}};}};
  assert.equal(await reserveRemoteCall({ namespace, client:'203.0.113.4' }, {}), false);
  assert.equal(await reserveRemoteCall({ namespace, client:'203.0.113.4' }, {MIGUEL_REMOTE_ENABLED:'true'}), false);
  assert.equal(calls, 0);
  const env={MIGUEL_REMOTE_ENABLED:'true', MIGUEL_BUDGET_SALT:'test-salt'};
  assert.equal(await reserveRemoteCall({namespace, client:'203.0.113.4'},env),true);
  assert.match(client,/^[a-f0-9]{64}$/);assert.doesNotMatch(client,/203/);
  namespace.get=()=>({fetch:async()=>{throw new Error('unavailable');}});
  assert.equal(await reserveRemoteCall({namespace,client:'203.0.113.4'},env),false);
});

test('the durable budget serializes independent workers and endpoints, persists a daily ceiling and rejects malformed clients', async () => {
  const { PortfolioBudget } = await loadLocalTs('workers/provider-budget.ts');
  const entries = new Map(); let chain = Promise.resolve();
  const storage={get:async key=>structuredClone(entries.get(key)),put:async(key,value)=>entries.set(key,structuredClone(value)),transaction(fn){const next=chain.then(()=>fn(storage));chain=next.catch(()=>{});return next;}};
  const budget = new PortfolioBudget({storage}, {DAILY_CALL_LIMIT:'3'});
  const call=client=>budget.fetch(new Request('https://budget.invalid', {method:'POST',body:JSON.stringify({client})}));
  const results=await Promise.all(Array.from({length:10},(_,i)=>call(i.toString().padStart(64,'a')).then(r=>r.json())));
  assert.equal(results.filter(r=>r.allowed).length,3);
  const restarted = new PortfolioBudget({storage}, {DAILY_CALL_LIMIT:'3'});
  assert.equal((await (await restarted.fetch(new Request('https://budget.invalid',{method:'POST',body:JSON.stringify({client:'b'.repeat(64)})}))).json()).allowed,false);
  assert.equal((await call('raw-ip')).status,400);
});

async function endpoints(env = {MIGUEL_LLM_PROVIDER:'local-fallback'}) {
  return loadLocalTs('tests/fixtures/portfolio-api-handlers.ts', {stubs:{
    '$app/environment':'export const dev = false;',
    './question-plans.json': `export default ${await readFile('src/lib/ask/question-plans.json','utf8')};`,
    '$env/dynamic/private':`export const env = ${JSON.stringify(env)};`
  }});
}
function event(path, body, client = 'shared-api-client') {
  return {request:new Request(`https://local.invalid/api/${path}`,{method:'POST',body:JSON.stringify(body)}),getClientAddress:()=>client};
}
test('both real handlers share the burst allowance and return Retry-After and no-store', async () => {
  const api=await endpoints();
  for(let i=0;i<12;i++) {
    const response=await (i%2?api.legacy:api.ask)(event('test',{question:'What is his stack?',areas:{}}));
    assert.equal(response.status,200);
  }
  for(const handler of [api.ask,api.legacy]) {
    const response=await handler(event('test',{question:'What is his stack?',areas:{}}));
    assert.equal(response.status,429);assert.match(response.headers.get('retry-after'),/^\d+$/);
    assert.equal(response.headers.get('cache-control'),'no-store');
  }
});
test('both real handlers reject oversized bodies and aborted requests before doing work',async()=>{
  const api=await endpoints();
  for(const handler of [api.ask,api.legacy]) {
    assert.equal((await handler(event('test',{question:'hello',areas:{},padding:'x'.repeat(32_000)}))).status,413);
    const controller=new AbortController();controller.abort();
    const input=event('test',{question:'hello',areas:{}});
    input.request=new Request(input.request,{signal:controller.signal});
    assert.equal((await handler(input)).status,408);
  }
});
test('configured provider keys alone cannot cause either public endpoint to spend',async()=>{
  const api=await endpoints({MIGUEL_LLM_PROVIDER:'openai',OPENAI_API_KEY:'test-key',MIGUEL_LLM_MODEL:'test-model'});
  let calls=0;const original=globalThis.fetch;
  globalThis.fetch=async()=>{calls++;return Response.json({output_text:'{"shortAnswer":"model text"}'});};
  try {
    await api.legacy(event('miguel-llm',{question:'How do you approach frontend design?'},'remote-client'));
    await api.ask(event('ask',{question:'What went wrong in Flow?',areas:{}},'remote-client'));
    assert.equal(calls,0);
  } finally {globalThis.fetch=original;}
});

test('remote admission rejection, malformed reply and cancellation never permit a provider call',async()=>{
 const env={MIGUEL_REMOTE_ENABLED:'true',MIGUEL_BUDGET_SALT:'test'};
 const namespace={idFromName:name=>name,get:()=>({fetch:async()=>Response.json({allowed:'true'})})};
 assert.equal(await reserveRemoteCall({namespace,client:'fixture'},env),false);
 namespace.get=()=>({fetch:async()=>Response.json({allowed:false})});
 assert.equal(await reserveRemoteCall({namespace,client:'fixture'},env),false);
 namespace.get=()=>({fetch:()=>new Promise(()=>{})});
 const abort=new AbortController();const pending=reserveRemoteCall({namespace,client:'fixture'},env,abort.signal);
 const timer=setTimeout(()=>abort.abort(),10);
 try{assert.equal(await pending,false);}finally{clearTimeout(timer);}
});

test('an admitted remote call has cancellation, output limits and a bounded response stream',async()=>{
 const {requestStructured}=await loadLocalTs('src/lib/server/miguel-provider.ts',{stubs:{'$env/dynamic/private':`export const env={MIGUEL_LLM_PROVIDER:'openai',OPENAI_API_KEY:'fixture',MIGUEL_LLM_MODEL:'fixture',MIGUEL_REMOTE_ENABLED:'true',MIGUEL_BUDGET_SALT:'fixture'};`}});
 const namespace={idFromName:name=>name,get:()=>({fetch:async()=>Response.json({allowed:true})})};
 const original=globalThis.fetch;let cancelled=false;
 globalThis.fetch=async(_url,init)=>{
  assert.ok(init.signal instanceof AbortSignal);assert.equal(JSON.parse(init.body).max_output_tokens,420);
  return new Response(new ReadableStream({pull(controller){controller.enqueue(new Uint8Array(128_001));},cancel(){cancelled=true;}}));
 };
 try{await assert.rejects(requestStructured('input','prompt',10_000,undefined,{namespace,client:'fixture'}),error=>error.status===413);assert.equal(cancelled,true);}finally{globalThis.fetch=original;}
});

test('durable client allowance resets each minute while the total resets only on a new UTC day',async()=>{
 const {PortfolioBudget}=await loadLocalTs('workers/provider-budget.ts');
 const entries=new Map();const storage={get:async key=>structuredClone(entries.get(key)),put:async(key,value)=>entries.set(key,structuredClone(value)),transaction:fn=>fn(storage)};
 const now=Date.now;let time=Date.UTC(2026,9,21,12,0);Date.now=()=>time;
 const gate=new PortfolioBudget({storage},{DAILY_CALL_LIMIT:'8'});
 const call=async()=> (await gate.fetch(new Request('https://local.invalid',{method:'POST',body:JSON.stringify({client:'a'.repeat(64)})}))).json();
 try{
  for(let i=0;i<6;i++)assert.equal((await call()).allowed,true);
  assert.equal((await call()).allowed,false);
  time+=60_000;assert.equal((await call()).allowed,true);assert.equal((await call()).allowed,true);assert.equal((await call()).allowed,false);
  time+=86_400_000;assert.equal((await call()).allowed,true);
  assert.equal(entries.size,1);
 }finally{Date.now=now;}
});

for(const path of ['advertised','chunked','aborted']) test(`body rejection stays bounded when ${path} stream cancellation never settles`,async()=>{
 const controller=new AbortController();
 let cancelled=false;
 const stream=new ReadableStream({start(c){if(path!=='aborted')c.enqueue(new Uint8Array(20));},cancel(){cancelled=true;return new Promise(()=>{});}});
 const request=new Request('https://local.invalid',{method:'POST',body:stream,duplex:'half',headers:path==='advertised'?{'content-length':'20'}:{}});
 const pending=readJsonBody(request,10,controller.signal).then(()=> 'unexpected-success',error=>error.status??error.name);
 if(path==='aborted')controller.abort();
 let timer;const result=await Promise.race([pending,new Promise(resolve=>timer=setTimeout(()=>resolve('cleanup-stalled'),50))]);clearTimeout(timer);
 assert.equal(result,path==='aborted'?'AbortError':413);assert.equal(cancelled,true);
});
