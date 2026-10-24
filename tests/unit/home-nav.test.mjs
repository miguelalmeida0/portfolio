import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import { patchHomeNav } from '../../scripts/patch-home-nav.mjs';

const original = readFileSync(new URL('../../release/home.html', import.meta.url), 'utf8');
const patched = patchHomeNav(original);
const declaration = patched.match(/ function shouldShowNavSurface\(pinkBottom, navBottom, handHeight, handsVisible\)\{[\s\S]*?\n \}/);
assert.ok(declaration, 'Patched homepage must expose the navbar visibility rule');
const shouldShow = runInNewContext('(' + declaration[0].trim() + ')');

test('navbar stays transparent while hands are below the masthead', () => {
  assert.equal(shouldShow(700, 86, 340, true), false);
});

test('navbar becomes solid before the hands obscure navigation', () => {
  const navBottom = 86, handHeight = 340;
  const boundary = navBottom + handHeight * .79 + 32;
  assert.equal(shouldShow(boundary + 1, navBottom, handHeight, true), false);
  assert.equal(shouldShow(boundary, navBottom, handHeight, true), true);
});

test('navbar remains solid after sheet clears and reverses with scroll', () => {
  assert.equal(shouldShow(-10, 86, 340, true), true);
  assert.equal(shouldShow(800, 86, 340, true), false);
});

test('reduced motion uses sheet boundary rather than invisible hands', () => {
  assert.equal(shouldShow(113, 112, 340, false), false);
  assert.equal(shouldShow(112, 112, 340, false), true);
});

test('published desktop and mobile surfaces are white, bordered and animated', () => {
  assert.match(patched, /\.nav-scrolled \.nav\{background:#fff;border-color:var\(--line\)\}/);
  assert.match(patched, /\.nav-scrolled \.nav\{background:#fff\}/);
  assert.match(patched, /body:not\(\.nav-scrolled\) \.nav\{background:transparent;border-bottom-color:transparent\}/);
  assert.doesNotMatch(patched, /body:not\(\.nav-scrolled\) \.nav\{[^}]*transition:none/);
  assert.match(patched, /classList\.toggle\('nav-scrolled',shouldShowNavSurface\(pinkBottom,navigation\.getBoundingClientRect\(\)\.bottom,layout\.handHeight,motion\)\)/);
});

test('build patch is idempotent and fails closed on source drift', () => {
  assert.equal(patchHomeNav(patched), patched);
  assert.throws(() => patchHomeNav('unrelated homepage'), /Unexpected homepage nav source/);
});
