import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { inMyVoice, asFirstPersonAnswer } = await loadLocalTs('src/lib/miguel-llm/firstPersonVoice.ts');
const { workPreferencesKnowledge } = await loadLocalTs('src/data/miguel-llm/work-preferences.ts');
const { prepareAskAnswer, assembleAskAnswer, validateConversationAnswer } =
  await loadLocalTs('src/lib/miguel-llm/askConversation.ts');

const examples = [
  ['Miguel does not want a role without design work.', 'I do not want a role without design work.'],
  ['Miguel loses track of time.', 'I lose track of time.'],
  ['He does not think that way.', 'I do not think that way.'],
  ["He doesn't want a framework chosen for its hype.", "I don't want a framework chosen for its hype."],
  ['He doesn’t expect perfection.', "I don't expect perfection."],
  ['He is a frontend engineer.', 'I am a frontend engineer.'],
  ['He has experience building complex interfaces.', 'I have experience building complex interfaces.'],
  ['Miguel has worked with Svelte.', 'I have worked with Svelte.'],
  ['He works with React.', 'I work with React.'],
  ['Miguel combines design and engineering.', 'I combine design and engineering.'],
  ['He cares about accessibility.', 'I care about accessibility.'],
  ['He enjoys experimenting with AI.', 'I enjoy experimenting with AI.'],
  ['He prefers readable source code.', 'I prefer readable source code.'],
  ['He maintains his frontend systems.', 'I maintain my frontend systems.'],
  ['He studies the production logs.', 'I study the production logs.'],
  ['He catches problems early.', 'I catch problems early.'],
  ['He makes prototypes.', 'I make prototypes.'],
  ['He writes tests.', 'I write tests.'],
  ['He focuses on reliability.', 'I focus on reliability.'],
  ['He watches the release metrics.', 'I watch the release metrics.'],
  ['He can inspect the source.', 'I can inspect the source.'],
  ['Miguel built Leu.', 'I built Leu.'],
  ['He worked with Product and Design.', 'I worked with Product and Design.'],
  ["He's a frontend engineer.", 'I am a frontend engineer.'],
  ['His work covers interface engineering.', 'My work covers interface engineering.'],
  ['Ask Miguel about the project.', 'Ask me about the project.'],
  ['I does not want that.', 'I do not want that.'],
  ['I loses track of time.', 'I lose track of time.'],
  ["I doesn't build that.", "I don't build that."],
  ['I combines design with code.', 'I combine design with code.']
];

for (const [before, after] of examples) {
  test(`grammar: ${before}`, () => assert.equal(inMyVoice(before), after));
}

test('unknown conjugation stays intact instead of creating malformed first person', () => {
  const unknown='He zorchblip the design artifacts.';
  assert.equal(inMyVoice(unknown), unknown);
  assert.equal(asFirstPersonAnswer(unknown, true), 'From my work: ' + unknown);
});

test('source quotations and self-introduction are preserved', () => {
  assert.equal(inMyVoice('A colleague wrote: “Miguel does great work.” He made the UI.'),
    'A colleague wrote: “Miguel does great work.” I made the UI.');
  assert.equal(inMyVoice("I'm Miguel. I like engineering."), "I'm Miguel. I like engineering.");
});

test('work-preference notes use grammatical, positive first-person language', () => {
  for (const record of workPreferencesKnowledge) {
    assert.match(record.content, /\b(I|I'm|I've|my|me)\b/i);
    assert.doesNotMatch(record.content, /\bMiguel\s+(?:is|does|loses|wants)\b/);
    assert.doesNotMatch(record.content, /does not want a role|no possibility to apply|\bI (?:does|loses|wants|combines)\b/i);
  }
});

test('framework questions answer React/Svelte rather than work-role dissatisfaction', () => {
  const questions=[
    'Which framework do you prefer?',
    'What framework do you prefer?',
    'Do you prefer React or Svelte?',
    'React or Svelte?',
    'What is your favorite framework?',
    'Which frameworks do you like most?',
    'Why do you prefer React?',
    'What tech framework do you enjoy using?'
  ];
  for (const question of questions) {
    const prepared=prepareAskAnswer(question);
    const answer=assembleAskAnswer(prepared);
    assert.ok(answer, question);
    assert.equal(prepared.defaults[0], 'visitor:framework-preference:0', question);
    assert.match(answer.paragraphs[0], /I reach for React with TypeScript most often.*soft spot for Svelte/i);
    assert.match(answer.paragraphs[1], /choose based on the product/i);
    assert.doesNotMatch([...answer.paragraphs,...answer.bullets].join(' '),
      /does not want a role|no possibility|loses track|voice chats|image-to-text workflows|\bI (?:does|loses|combines)\b/i);
    assert.ok(answer.sources.some(item=>item.includes('|/cv#skills')));
    assert.deepEqual(validateConversationAnswer(answer, question),answer);
  }
});

test('technical, education and personal questions stay on their own evidence', () => {
  const expectations=[
    ['What does he build with?', /React.*TypeScript.*JavaScript.*Svelte/s],
    ['Where did you study?', /UX Design Institute.*CareerFoundry/s],
    ['What does he do outside work?', /music.*films.*TV/s],
    ['How much React experience does he have?', /2026.*not four years of React/s],
    ['What went wrong in Flow?', /flexible events.*draft.*rollback/s],
    ['Why did Leu replace V36?', /52% to 51%.*V37/s]
  ];
  for(const [question,expected] of expectations){
    const answer=assembleAskAnswer(prepareAskAnswer(question));
    assert.ok(answer, question);
    assert.match([...answer.paragraphs,...answer.bullets].join(' '),expected);
  }
});
