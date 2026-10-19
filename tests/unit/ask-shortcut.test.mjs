import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { isAskShortcut } = await loadLocalTs('src/lib/ask/shortcut.ts');

test('an active native modal owns Ctrl/Cmd+/ until it closes', () => {
  let modal = {};
  const target = { closest: () => null, ownerDocument: { querySelector: selector => selector === 'dialog:modal' ? modal : null } };
  for (const modifier of ['ctrlKey', 'metaKey']) {
    modal = {};
    assert.equal(isAskShortcut({ key: '/', [modifier]: true, target }), false);
    modal = null;
    assert.equal(isAskShortcut({ key: '/', [modifier]: true, target }), true);
  }
});

test('shadow-root editable controls keep the shortcut even when the event target is their host', () => {
  const host = { closest: () => null };
  const input = { closest: () => input };
  assert.equal(isAskShortcut({ key: '/', ctrlKey: true, target: host, composedPath: () => [input, host] }), false);
});
