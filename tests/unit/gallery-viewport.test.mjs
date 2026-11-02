import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { patchHomeMobile } from '../../scripts/patch-home-mobile.mjs';
test('short landscape uses vertical projects while laptop gallery stays active', () => {
  const html=patchHomeMobile(readFileSync('release/home.html','utf8'));
  const query=html.match(/wide=matchMedia\('([^']+)'\)/)[1];
  const minWidth=Number(query.match(/min-width:(\d+)px/)[1]);
  const minHeight=Number(query.match(/min-height:(\d+)px/)?.[1] || 0);
  const usesPinned=(w,h)=>w>=minWidth&&h>=minHeight;
  assert.equal(usesPinned(844,390),false);
  assert.equal(usesPinned(768,1024),true);
  assert.equal(usesPinned(1440,900),true);
  assert.equal(usesPinned(1366,650),true);
  assert.equal(usesPinned(1536,690),true);
  assert.equal(usesPinned(390,844),false);
});
