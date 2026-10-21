import test from 'node:test';
import assert from 'node:assert/strict';
import { buildIdentity, assertPromotion } from '../../scripts/lib/release-identity.mjs';
const sha='a'.repeat(40);
test('build identity uses the exact checkout and rejects a contradictory deployment revision',()=>{
  const info=buildIdentity({sha,dirty:false,now:new Date('2026-10-21T12:00:00Z'),deploymentSha:sha});
  assert.equal(info.commit,sha);assert.equal(info.builtAt,'2026-10-21T12:00:00.000Z');assert.equal(info.dirty,false);
  assert.throws(()=>buildIdentity({sha,dirty:false,deploymentSha:'b'.repeat(40)}),/does not match/);
  assert.throws(()=>buildIdentity({sha:'main',dirty:false}),/full commit/);
});
test('local promotion verification rejects stale, incomplete, dirty or development-only acceptance',()=>{
  const proof={commit:sha,environment:'cloudflare-production-build',checks:{types:true,unit:true,build:true,routes:true,chromium:true,webkit:true,accessibility:true,responsive:true},reviewed:true};
  assert.doesNotThrow(()=>assertPromotion({head:sha,test:sha,dirty:false,proof}));
  for(const change of [{dirty:true},{test:'b'.repeat(40)},{proof:{...proof,commit:'b'.repeat(40)}},{proof:{...proof,environment:'vite-development'}},{proof:{...proof,checks:{...proof.checks,webkit:false}}},{proof:{...proof,reviewed:false}}]) assert.throws(()=>assertPromotion({head:sha,test:sha,dirty:false,proof,...change}));
});

test('server and client config loads reuse one build identity within the same process',async()=>{
 const {currentBuildIdentity}=await import('../../scripts/lib/release-identity.mjs');
 const server=currentBuildIdentity();const client=currentBuildIdentity();
 assert.equal(client,server,'the build timestamp and revision must be captured once');
});
