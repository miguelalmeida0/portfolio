import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { visitorIntentAnswer } = await loadLocalTs('src/lib/miguel-llm/visitorIntents.ts');
const { prepareAskAnswer, assembleAskAnswer, validateConversationAnswer } =
  await loadLocalTs('src/lib/miguel-llm/askConversation.ts');

const prepare = (question, area) => prepareAskAnswer(question, [], area);
const answer = (question, area) => assembleAskAnswer(prepare(question, area));
const prose = result => [...result.paragraphs, ...result.bullets].join(' ');

const cases = [
  ['What does he do?', 'role'],
  ['What do you do?', 'role'],
  ['What does Miguel do?', 'role'],
  ['What is your role?', 'role'],
  ["What's your job?", 'role'],
  ['What does he actually do?', 'role'],
  ['What kind of engineer are you?', 'role'],
  ['What do you do for a living?', 'role'],
  ['What does he build with?', 'stack'],
  ['What do you build with?', 'stack'],
  ['What technologies do you use?', 'stack'],
  ['What is your stack?', 'stack'],
  ["What's your stack?", 'stack'],
  ['What is his stack?', 'stack'],
  ['Which programming languages do you use?', 'stack'],
  ['What tools do you use?', 'stack'],
  ['What do you code with?', 'stack'],
  ['Where did you study?', 'education'],
  ['Where did Miguel study?', 'education'],
  ['What did he study?', 'education'],
  ['What is your educational background?', 'education'],
  ['Did you get a UX diploma?', 'education'],
  ['How did you learn UX?', 'education'],
  ['How do you make sure it works?', 'quality'],
  ['How does Miguel test his products?', 'quality'],
  ['How do you handle failures?', 'quality'],
  ['What have you worked on?', 'work'],
  ['Which projects have you built?', 'work'],
  ['Show me your projects', 'work'],
  ['What do you do at F24?', 'f24']
];

for (const [question, intent] of cases) {
  test('routes visitor question by meaning: ' + question, () => {
    const route = visitorIntentAnswer(question, undefined, /\bf24\b/i.test(question) ? 'f24' : undefined);
    assert.ok(route, 'Expected a direct question-answer route');
    assert.equal(route.intent, intent);
    const result = answer(question);
    assert.ok(result);
    assert.equal(result.paragraphs.length, 2);
    assert.ok(result.sources.length);
    assert.match(result.paragraphs[0], /\b(I|I'm|I’m|I've|I’ve|my)\b/i);
    assert.doesNotMatch(prose(result), /\bI (?:combines|maintains|builds|works|shapes|uses)\b/i);
    assert.doesNotMatch(prose(result), /Connectivity Hub|internal prompt/i);
    assert.deepEqual(validateConversationAnswer(result, question), result);
  });
}

test('clicked job title answers the job, not an unrelated CV summary', () => {
  const result = answer('What does he do?', 'role');
  const text = prose(result);
  assert.match(text, /frontend engineer and product designer/i);
  assert.match(text, /F24.*critical.communication/i);
  assert.match(text, /Needle.*Second Voice.*Leu.*Flow/s);
  assert.doesNotMatch(text, /UX Design Institute|CareerFoundry|from 2022 to 2023/i);
  assert.equal(result.factIds[0], 'visitor:role:0');
  assert.deepEqual(prepare('What does he do?', 'role').area, 'role');
  assert.deepEqual(result, answer('What does he do?'));
});

test('clicked hero tech stack answers with named technologies before any timeline', () => {
  for (const question of ['What does he build with?', 'What is his stack?']) {
    const result = answer(question, 'stack');
    assert.match(result.paragraphs[0], /^My main frontend stack is React, TypeScript, JavaScript, Svelte/);
    for (const technology of ['Next.js', 'Vite', 'Tailwind', 'Playwright', 'Figma']) assert.ok(prose(result).includes(technology), technology);
    assert.match(prose(result), /SwiftUI.*PDFKit/s);
    assert.doesNotMatch(prose(result), /2022|2023|2025|2026|UX Design Institute|career timeline|mid.level/i);
    assert.equal(prepare(question, 'stack').area, 'stack');
    assert.ok(result.sources.some(source => source.endsWith('/cv#skills')));
    assert.deepEqual(validateConversationAnswer(result, question, [], 'stack'), result);
  }
});

test('education questions give the real institutions, qualifications and dates', () => {
  const result = answer('Where did you study?');
  const text = prose(result);
  assert.match(text, /Professional Diploma in UX Design at the UX Design Institute \(Aug 2021\)/);
  assert.match(text, /Full-Stack Web Development at CareerFoundry \(2021\)/);
  assert.doesNotMatch(text, /Bachelor|Master of Science|Computer Science degree|F24 Frontend Engineer/);
  assert.ok(result.sources.includes('CV · Education|/cv#education'));
  assert.deepEqual(validateConversationAnswer(result, 'Where did you study?'), result);
});

test('area highlighting follows the answer intent rather than triggering history', () => {
  for (const [question, area] of [
    ['What does he do?', 'role'],
    ['What does he build with?', 'stack'],
    ['How do you make sure it works?', 'quality'],
    ['What has he worked on?', 'selwork']
  ]) {
    assert.equal(prepare(question).area, area);
  }
  assert.equal(prepare('Where did you study?').area, undefined);
});

test('the meaning of outside-work and direct source excerpts takes priority', () => {
  assert.equal(visitorIntentAnswer('What does he do outside work?'), undefined);
  assert.equal(visitorIntentAnswer('What does Flow do?', undefined, 'flow'), undefined);
  assert.equal(visitorIntentAnswer('What did Miguel study?', 'cv-education'), undefined);
  assert.equal(visitorIntentAnswer('What do you do at F24?', 'story-f24', 'f24'), undefined);
  const hobbies = answer('What does he do outside work?');
  assert.match(prose(hobbies), /music.*films.*TV/s);
  const clicked = answer('What did Miguel study?', 'cv-education');
  assert.match(prose(clicked), /UX Design Institute.*CareerFoundry/s);
});

test('framework experience and specific projects do not get hijacked by generic intents', () => {
  for (const question of [
    'How much React experience does he have?',
    'How long has he used Svelte?',
    'What did Miguel improve at F24?',
    'What did Miguel own at F24?',
    'What went wrong in Flow?',
    'How does Leu prevent false mastery?',
    'What technologies does Flow use?',
    'Which languages does Miguel speak?',
    'Which project should I inspect first?',
    'What is your favorite tech stack?'
  ]) {
    const selected = visitorIntentAnswer(question, undefined, /flow|leu|f24/i.test(question) ? /flow/i.test(question) ? 'flow' : /leu/i.test(question) ? 'leu' : 'f24' : undefined);
    assert.equal(selected, undefined, 'More specific source handling should win: ' + question);
    assert.ok(answer(question), 'Existing answer remains available: ' + question);
  }
});

test('private or unsupported claims are not filled in from nearby evidence', () => {
  for (const question of ['How old is he?', 'What is his salary?', 'Does he know Kubernetes?']) {
    assert.equal(answer(question), null);
  }
});

test('first-person fallback does not produce incorrect verb conjugation', async () => {
  const { inMyVoice } = await loadLocalTs('src/lib/miguel-llm/firstPersonVoice.ts');
  assert.equal(inMyVoice('Miguel combines design with engineering. He maintains the interface.'),
    'I combine design with engineering. I maintain the interface.');
});
