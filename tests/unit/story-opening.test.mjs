import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const story = JSON.parse(await readFile('src/lib/story/story.json','utf8'));
const { storyOpening } = await loadLocalTs('src/lib/hero-lab/typographic/pages/story-opening.ts', {
  stubs: { '$lib/story/story.json': `export default ${JSON.stringify(story)}` }
});

test('career tabs add distinct information while retaining stable Ask destinations', () => {
  assert.equal(storyOpening.chapters.length,3);
  for (const [i, chapter] of storyOpening.chapters.entries()) {
    assert.equal(chapter.area,`story-intro-${i}`);
    assert.notEqual(chapter.paragraphs[0],story.questions[i].answer);
    assert.ok(chapter.paragraphs.every(text => text.length > 20));
    assert.equal(chapter.paragraphs.length,2);
    for (const source of chapter.sourceIds) assert.ok(story.questions.some(q => q.id === source));
  }
});
