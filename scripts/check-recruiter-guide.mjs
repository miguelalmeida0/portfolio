import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadLocalTs } from './lib/load-local-ts.mjs';

const { buildFallbackAnswer } = await loadLocalTs('src/lib/miguel-llm/fallbackAnswers.ts');
const { publicSources } = await loadLocalTs('src/lib/miguel-llm/publicSources.ts');
const { projectQuestions } = await loadLocalTs('src/lib/miguel-llm/projectContext.ts');
const { miguelKnowledgeBase } = await loadLocalTs('src/data/miguel-llm/index.ts');
const { POST } = await loadLocalTs('src/routes/api/miguel-llm/+server.ts', {
  stubs: { '$env/dynamic/private': 'export const env = { MIGUEL_LLM_PROVIDER: "local-fallback" };' }
});
let checks = 0;
function check(name, callback) { callback(); checks++; console.log(`PASS ${name}`); }
const answer = (q, project) => buildFallbackAnswer(q, 'engineer', [], project);

check('Ghostwriter contextual ownership does not answer about Camera', () => {
  const a = answer('What did you own?', 'ghostwriter');
  assert.match(a.shortAnswer, /rewrite|private text/i); assert.doesNotMatch(a.shortAnswer, /Camera Harness|registration/i);
});
check('Explicit project overrides current page', () => {
  const a = answer('What did Miguel build in Mirror AI?', 'ghostwriter');
  assert.match(a.shortAnswer, /region|selected subject/i);
  assert.doesNotMatch(a.shortAnswer, /rewrite|paid generation/i);
});
check('Camera measurements preserve synthetic scope', () => {
  const a = answer('What measurements exist?', 'camera-harness');
  assert.match(a.shortAnswer, /100 \/ 100/); assert.match(a.shortAnswer, /synthetic|deterministic/); assert.match(a.shortAnswer, /not a production/i);
});
check('Mirror metrics remain historical replay', () => {
  const a = answer('Show the test results', 'mirror-ai');
  assert.match(a.shortAnswer, /630/); assert.match(a.shortAnswer, /stored|historical|replay/i); assert.match(a.shortAnswer, /not live-model accuracy/i);
});
check('Ghostwriter evidence preserves handoff and mock-test scope', () => {
  const a = answer('What evidence supports Ghostwriter?');
  assert.match(a.shortAnswer, /handoff reports 25/); assert.match(JSON.stringify(a), /mocked/); assert.match(JSON.stringify(a), /not production/i);
});
check('Camera distinguishes proposed provenance and model integration', () => {
  assert.match(answer('Does Ask use the selected object?', 'camera-harness').shortAnswer, /does not use/);
  assert.match(answer('What models did Miguel train?', 'camera-harness').shortAnswer, /not models he trained/);
});
check('Connectivity adoption and ownership match user-supplied facts', () => {
  const a = answer('What did Miguel own in Connectivity Hub?');
  assert.match(a.shortAnswer, /hundreds of companies/); assert.match(a.shortAnswer, /migrated it to React/);
});
check('Aviation does not invent lessons', () => {
  assert.match(answer('What did aviation teach Miguel?').shortAnswer, /do not establish/);
});
check('Unknown details remain unknown', () => {
  assert.equal(answer('How many patents does Miguel hold?').confidence, 'low');
});
check('All project follow-ups are project-specific', () => {
  for (const q of projectQuestions('ghostwriter')) assert.match(q, /Ghostwriter/);
});
const route = await readFile('src/routes/work/[slug]/+page.svelte', 'utf8');
const diagram = await readFile('src/lib/components/case-study/CameraArchitecture.svelte', 'utf8');
const checksSource = await readFile('src/lib/components/case-study/ProjectChecks.svelte', 'utf8');
check('All project knowledge citations resolve to rendered section IDs', () => {
  const sources = miguelKnowledgeBase.flatMap(chunk => publicSources([chunk.source]));
  for (const source of sources) {
    const [, href] = source.split('|'); assert.ok(href?.startsWith('/'));
    const [base, anchor] = href.split('#');
    if (base.startsWith('/work/') && anchor) assert.ok((route + diagram + checksSource).includes(`id="${anchor}"`), source);
  }
});
check('Unsafe source schemes are replaced with public navigation', () => {
  assert.equal(publicSources(['Run|javascript:alert(1)'])[0], 'About Miguel|/story');
});

let requestId = 0;
async function request(body) {
  return POST({ request: new Request('http://test.invalid/api/miguel-llm', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }), getClientAddress: () => `fixture-${requestId++}` });
}
for (const body of [null, [], { question: 42 }, { question: 'x'.repeat(321) }]) {
  assert.equal((await request(body)).status, 400); checks++;
}
const response = await request({ question: 'What was the decision?', mode: 'engineer', projectSlug: 'mirror-ai' });
const payload = await response.json();
check('API preserves current project and safe public citations', () => {
  assert.equal(response.status, 200); assert.match(payload.shortAnswer, /selected subject/); assert.ok(payload.sources.some(source => source.includes('/work/mirror-ai#decisions')));
});
console.log(`${checks} checks passed. Isolated source execution; no browser or provider calls.`);
