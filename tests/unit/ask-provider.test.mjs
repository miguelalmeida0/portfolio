import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const plans = JSON.parse(await readFile('src/lib/ask/question-plans.json', 'utf8'));
const stubs = {
  '$app/environment': 'export const dev = false;',
  './question-plans.json': `export default ${JSON.stringify(plans)}`,
  './miguel-provider': `export const selectedProvider = () => 'cerebras'; export async function requestStructured(input) { return globalThis.askProviderFixture(JSON.parse(input)); }`
};
const { buildAskPlan } = await loadLocalTs('src/lib/server/ask-plan.ts', { stubs });

test('configured provider receives context and can select only approved facts; failure falls back', async () => {
  let calls = 0;
  globalThis.askProviderFixture = input => {
    calls++;
    assert.match(input.resolvedQuestion, /Flow/);
    assert.deepEqual(input.recentQuestions, ['Tell me about Flow']);
    return { factIds: ['flow:event-loss:change', 'flow:event-loss:evidence'] };
  };
  const selected = await buildAskPlan('What went wrong?', {}, undefined, { history: ['Tell me about Flow'] });
  assert.equal(calls, 1);
  assert.match(selected.knowledge.paragraphs[0], /clone the document/);
  assert.equal(selected.knowledge.paragraphs.length, 2);
  globalThis.askProviderFixture = () => ({ factIds: ['invented'], paragraphs: ['He has ten million users'] });
  const rejected = await buildAskPlan('What went wrong in Flow?', {});
  assert.match(rejected.knowledge.paragraphs[0], /flexible events/);
  assert.doesNotMatch(JSON.stringify(rejected), /ten million/);
  globalThis.askProviderFixture = () => { throw new Error('Provider unavailable'); };
  const unavailable = await buildAskPlan('What went wrong in Flow?', {});
  assert.deepEqual(unavailable.knowledge, rejected.knowledge);
  const greeting = await buildAskPlan('hello', {});
  assert.equal(greeting.knowledge.conversational, true);
  const controller = new AbortController(); controller.abort();
  assert.equal((await buildAskPlan('What went wrong in Flow?', {}, controller.signal)).knowledge, null);
  delete globalThis.askProviderFixture;
});
