import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function load(file) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
}
const { compareText } = await load('src/lib/experience/text-diff.ts');
const { correctSelection, receiveLabel } = await load('src/lib/experience/correction-state.ts');
const { authors, strengths, sampleFor } = await load('src/lib/experience/samples.ts');
const changed = parts => parts.filter(part => part.changed).map(part => part.text).join('');
test('comparison identifies real insertions and removals without marking unchanged words', () => {
  const diff = compareText('One lamp burned.', 'One small lamp glowed.');
  assert.equal(changed(diff.original), 'burned');
  assert.equal(changed(diff.rewrite), 'smallglowed');
  assert.equal(diff.original.map(p => p.text).join(''), 'One lamp burned.');
  assert.equal(diff.rewrite.map(p => p.text).join(''), 'One small lamp glowed.');
});
test('comparison preserves punctuation, unicode, repeated words and whitespace', () => {
  for (const [source, result] of [['', 'Hello!'], ['Hello!', ''], ['não não…', 'não, sim…'], ['a  b\nc', 'a b\n c'], ['The lamp.', 'The lamp.']]) {
    const diff = compareText(source, result);
    assert.equal(diff.original.map(p => p.text).join(''), source);
    assert.equal(diff.rewrite.map(p => p.text).join(''), result);
  }
  assert.equal(changed(compareText('The lamp.', 'The lamp.').rewrite), '');
});
test('large comparisons remain bounded and retain complete text', () => {
  const source = 'source '.repeat(1100), result = 'result '.repeat(1100);
  const diff = compareText(source, result);
  assert.equal(diff.rewrite.map(p => p.text).join(''), result);
  assert.ok(diff.rewrite.some(p => p.changed));
});
test('every named example retains the character, lamp, winter and twenty-year interval', () => {
  for (const author of authors) {
    const outputs = strengths.map(strength => sampleFor(author, strength));
    assert.equal(new Set(outputs).size, 3);
    for (const text of outputs) {
      for (const fact of [/Elias/, /lamp/i, /winter/i, /twenty years/i, /ship/i]) assert.match(text, fact);
    }
  }
});
test('a correction owns the label when an older model response arrives', () => {
  const initial = { id: 'shark', revision: 0, modelLabel: 'Bird', correction: '' };
  const corrected = correctSelection(initial, 'Shark');
  const reply = receiveLabel(corrected, { selectionId: 'shark', requestRevision: 0, label: 'Bird' });
  assert.equal(reply.accepted, false);
  assert.equal(reply.state.correction, 'Shark');
  assert.equal(reply.state.id, initial.id);
  assert.equal(initial.correction, '');
  assert.equal(receiveLabel(initial, { selectionId: 'different-image', requestRevision: 0, label: 'Cat' }).accepted, false);
  assert.equal(receiveLabel(initial, { selectionId: 'shark', requestRevision: 0, label: 'Shark' }).state.modelLabel, 'Shark');
});

test('playback edits reconstruct both exact documents, including whitespace and every author', () => {
  const pairs = [['', 'Hello!'], ['Hello!', ''], ['a  b\nc', 'a b\n c'], ['não não…', 'não, sim…'], ['The lamp.', 'The lamp.'], ['source '.repeat(1100), 'result '.repeat(1100)]];
  for (const author of authors) for (const strength of strengths) pairs.push(['Every winter, the harbor lights went dark. Elias kept the last lamp burning, though no ship had returned in twenty years.', sampleFor(author, strength)]);
  for (const [source, result] of pairs) {
    const { operations } = compareText(source, result);
    assert.equal(operations.filter(op => op.kind !== 'insert').map(op => op.text).join(''), source);
    assert.equal(operations.filter(op => op.kind !== 'delete').map(op => op.text).join(''), result);
  }
});
