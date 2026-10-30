import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { patchCaseClose } from '../../scripts/patch-case-close.mjs';

const original = '<button class="dialog-close" type="button" aria-label="Close case study">Close ×</button>';

test('the published case-study close control aligns a real SVG with the label', async () => {
  const html = await readFile(new URL('../../release/home.html', import.meta.url), 'utf8');
  const output = patchCaseClose(html);
  assert.ok(!output.includes(original));
  assert.match(output, /class="dialog-close"[^>]*><span>Close<\/span><svg[^>]*aria-hidden="true"[^>]*><path[^>]*\/><\/svg><\/button>/);
  assert.match(output, /#case-dialog \.dialog-close \{ display: inline-flex; align-items: center;/);
  assert.match(output, /#case-dialog \.dialog-close > svg \{ display: block; width: 16px; height: 16px; flex: 0 0 16px;/);
  assert.equal(output.split('id="case-close-alignment"').length, 2);
});

test('the patch refuses to silently modify unexpected markup', () => {
  assert.throws(() => patchCaseClose('<html><head></head><body></body></html>'), /exactly one original/);
  assert.throws(() => patchCaseClose(`<html><head></head><body>${original}${original}</body></html>`), /exactly one original/);
});
