import test from 'node:test';
import assert from 'node:assert/strict';
import { stat, readFile } from 'node:fs/promises';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { needleImageSample: sample, needleSources, needleRevision } = await loadLocalTs('src/lib/content/needle-investigation.ts');
const { resolveProject } = await loadLocalTs('src/lib/miguel-llm/projectContext.ts');
test('published derivative sizes match the actual media and source links are pinned', async () => {
  assert.equal((await stat(`static${sample.tile}`)).size, sample.tileBytes);
  assert.equal((await stat(`static${sample.detail}`)).size, sample.detailBytes);
  assert.equal((await stat('static/projects/needle/queen-louise-original.jpg')).size, sample.originalBytes);
  for (const href of Object.values(needleSources)) assert.ok(href.includes(`/blob/${needleRevision}/`));
  assert.equal(resolveProject('What did Miguel build in Needle?'), 'needle');
});
test('the authored case study excludes unverified before/after timings', async () => {
  const route = await readFile('src/lib/case-studies/needle/NeedlePage.svelte', 'utf8');
  for (const unavailable of ['8.31', '12.014', '14.76', '17.76', '44.6×']) assert.ok(!route.includes(unavailable));
});
