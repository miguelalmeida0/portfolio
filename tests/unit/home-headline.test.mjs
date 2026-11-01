import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { patchHomeNav } from '../../scripts/patch-home-nav.mjs';
import { patchHomeMobile } from '../../scripts/patch-home-mobile.mjs';
import { patchHomeHeadline } from '../../scripts/patch-home-headline.mjs';

const source = readFileSync(new URL('../../release/home.html', import.meta.url), 'utf8');
const headline = "I build the interfaces teams rely on when seconds matter.";

test('production desktop and mobile use the selected value headline', () => {
  const html = patchHomeHeadline(patchHomeMobile(patchHomeNav(source)));
  assert.ok(html.includes('<p class="hero-role">' + headline + '</p>'));
  assert.match(html, /<h1 class="mobile-role"><span class="role-pair">I build the interfaces<\/span>/);
  assert.ok(html.includes('<span class="role-pair">when seconds matter.</span>'));
  assert.match(html, /id="home-value-headline-style"/);
  assert.match(html, /\\.hero \\.mobile-role \\.role-pair\\{white-space:normal\\}/);
  assert.match(html, /<meta name="description" content="I build the interfaces teams rely on when seconds matter\\./);
  assert.match(html, /<h1 aria-label="Miguel Almeida">/);
  assert.match(html, /data-sheet-statement>At F24, I built the original Svelte frontend/);
});

test('homepage headline patch fails closed if the release source has drifted', () => {
  assert.throws(() => patchHomeHeadline('<html><head></head></html>'), /Unexpected homepage source/);
  const html = patchHomeHeadline(patchHomeMobile(patchHomeNav(source)));
  assert.throws(() => patchHomeHeadline(html), /Unexpected homepage source/);
});
