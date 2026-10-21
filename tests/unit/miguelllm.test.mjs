import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { buildFallbackAnswer } = await loadLocalTs('src/lib/miguel-llm/fallbackAnswers.ts');
const { retrieveMiguelContext } = await loadLocalTs('src/lib/miguel-llm/retrieve.ts');
const { currentGuideProjects } = await loadLocalTs('src/lib/miguel-llm/currentPortfolio.ts');
const { resolveProject } = await loadLocalTs('src/lib/miguel-llm/projectContext.ts');
const { publicSources } = await loadLocalTs('src/lib/miguel-llm/publicSources.ts');
const { POST } = await loadLocalTs('src/routes/api/miguel-llm/+server.ts', {
  stubs: { '$env/dynamic/private': 'export const env = { MIGUEL_LLM_PROVIDER: "local-fallback" };' }
});
const ask = (question, projectSlug) => buildFallbackAnswer(question, 'recruiter', [], projectSlug);
test('removed Mirror AI cannot reappear as a guide project or source destination', () => {
  assert.equal(resolveProject('Tell me about Mirror AI'), undefined);
  assert.equal(resolveProject('What did he build?', 'mirror-ai'), undefined);
  assert.ok(publicSources(['Mirror AI|/work/mirror-ai']).every(source => !source.includes('/work/mirror-ai')));
  assert.ok(retrieveMiguelContext('Mirror AI', 'recruiter', 20).every(chunk => !/mirror-ai|Mirror AI/.test(JSON.stringify(chunk))));
});
let client = 0;
const request = (body, address = `guide-test-${client++}`) => POST({
  request: new Request('http://localhost/api/miguel-llm', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  }), getClientAddress: () => address
});

test('current projects retain source ownership, stack and evidence limits in retrieval and fallback', () => {
  for (const project of currentGuideProjects) {
    const question = `What did Miguel build in ${project.name}?`;
    assert.equal(resolveProject(question), project.slug);
    const answer = ask(question);
    assert.ok(answer.bullets.includes(project.ownership));
    assert.ok(answer.sources.includes(`${project.name}|/work/${project.slug}`));
    const evidence = ask(`What evidence supports ${project.name}?`);
    assert.equal(evidence.shortAnswer, project.outcome);
    assert.ok(evidence.bullets.includes(project.limitation));
    const chunks = retrieveMiguelContext(question, 'recruiter', 5, project.slug);
    assert.ok(chunks.some(chunk => chunk.id === `project-${project.slug}-current` && chunk.content.includes(project.limitation)));
    assert.match(ask(`What is the stack for ${project.name}?`).shortAnswer, new RegExp(project.stack[0]));
  }
  assert.equal(resolveProject('How do your workflows work?'), undefined);
  assert.equal(resolveProject('Tell me about Second Voice'), 'second-voice-ai');
  assert.equal(resolveProject('Tell me about Flow', 'leu'), 'flow');
});

test('default suggestions and ownership describe current work and production Svelte plus React', () => {
  const start = ask('Which project should I start with?');
  for (const name of ['Second Voice', 'F24', 'Flow', 'Leu']) assert.ok(start.shortAnswer.includes(name));
  assert.doesNotMatch(start.shortAnswer, /Camera Harness|July/);
  assert.match(ask('What production frontend experience does he have?').shortAnswer, /Svelte.*React/);
  assert.match(ask('What did Miguel personally build?').shortAnswer, /Second Voice AI, Flow and Leu/);
  assert.equal(ask('How many patents does Miguel hold?').confidence, 'low');
  assert.match(ask('What is Miguel’s salary?').shortAnswer, /contact Miguel directly/);
  assert.equal(publicSources(['Run|javascript:alert(1)'])[0], 'About Miguel|/story');
});

test('retired legacy endpoint rejects all questions without reading input', async () => {
  for (const body of [null, [], { question: 42 }, { question: 'What is Leu?' }, { question: 'x'.repeat(32000) }]) {
    const response = await request(body);
    assert.equal(response.status, 410);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { error: 'The portfolio assistant has been removed.' });
  }
});
