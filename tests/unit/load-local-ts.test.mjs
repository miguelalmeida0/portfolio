import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

async function fixture(t) {
  await mkdir('.cache', { recursive: true });
  const directory = await mkdtemp(path.resolve('.cache/loader-input-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(path.join(directory, 'dependency.ts'), "export { value } from 'fixture-value';");
  const entry = path.join(directory, 'entry.ts');
  await writeFile(entry, "import { value } from './dependency'; export const readValue = () => value;");
  return entry;
}

test('successive loads of the same module use their own dependency stubs', async t => {
  const entry = await fixture(t);
  const first = await loadLocalTs(entry, { stubs: { 'fixture-value': 'export const value = "first";' } });
  const second = await loadLocalTs(entry, { stubs: { 'fixture-value': 'export const value = "second";' } });
  assert.equal(first.readValue(), 'first');
  assert.equal(second.readValue(), 'second');
});

test('concurrent loads keep complete, independent dependency graphs', async t => {
  const entry = await fixture(t);
  const values = ['alpha', 'bravo', 'charlie', 'delta'];
  const modules = await Promise.all(values.map(value => loadLocalTs(entry, {
    stubs: { 'fixture-value': `export const value = ${JSON.stringify(value)};` }
  })));
  assert.deepEqual(modules.map(module => module.readValue()), values);
});
