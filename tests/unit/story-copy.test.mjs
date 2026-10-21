import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync(new URL('../../src/lib/story/story.json', import.meta.url), 'utf8'));

const narrative = [
  story.editorial.title,
  story.editorial.intro,
  story.shortVersion.title,
  story.shortVersion.intro,
  story.shortVersion.outro,
  story.shortVersion.copyText,
  ...story.shortVersion.chapters.flatMap(chapter => [chapter.period, chapter.title, chapter.text]),
  ...story.questions.flatMap(question => [question.question, question.lead, question.answer, question.scene.caption]),
  story.ending.question,
  story.ending.answer
].join('\n');

test('Story opens with a plain-language introduction grounded in the actual career path', () => {
  assert.equal(story.editorial.title, 'A bit about me.');
  assert.match(story.editorial.intro, /computers since I was a kid/i);
  assert.match(story.editorial.intro, /aviation/i);
  assert.match(story.editorial.intro, /UX design/i);
  assert.match(story.editorial.intro, /frontend engineering/i);
  assert.deepEqual(story.shortVersion.chapters.map(chapter => chapter.title), [
    'Aviation', 'UX design', 'Frontend engineering'
  ]);
});

test('Story avoids the specific artificial and unintended wording rejected in review', () => {
  assert.doesNotMatch(narrative, /scenic route|love\s+making|lovemaking|the funny thing is|curious kid|little stories|ideas? i can.t leave alone|unexpected turns/i);
  assert.doesNotMatch(narrative, /\u2014/);
  assert.doesNotMatch(narrative, /\b(poet|poetic|magical journey)\b/i);
});

test('The eight interactive Story scenes keep their stable order and IDs', () => {
  assert.deepEqual(story.questions.map(question => question.id), [
    'hi', 'ux', 'build', 'f24', 'fail', 'own', 'love', 'care'
  ]);
  assert.equal(story.questions.length, 8);
  assert.equal(story.shortVersion.chapters.length, 3);
});
