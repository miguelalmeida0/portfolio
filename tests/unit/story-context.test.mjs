import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

test('interactive introduction preserves every authored sentence in chapter order', async () => {
  const { introSteps } = await loadLocalTs('src/lib/story/intro.ts');
  const story = JSON.parse(await readFile('src/lib/story/story.json', 'utf8'));
  assert.equal(introSteps.map(step => step.copy).join(' '), story.editorial.intro);
  assert.deepEqual(introSteps.map(step => step.title), story.shortVersion.chapters.map(step => step.title));
  assert.equal(new Set(introSteps.map(step => step.area)).size, 3);
});

test('CV metrics and Story introduction topics resolve authored evidence', async () => {
  const { pageAreas } = await loadLocalTs('src/lib/ask/page-areas.ts');
  for (const id of ['cv-role', ...[0,1,2,3].map(i => `cv-highlight-${i}`), ...[0,1,2].map(i => `story-intro-${i}`)]) {
    const area = pageAreas.find(area => area.id === id);
    assert.ok(area, `Missing contextual topic: ${id}`);
    assert.ok(area.text.length > 20);
    assert.ok(area.sources.length);
  }
});
