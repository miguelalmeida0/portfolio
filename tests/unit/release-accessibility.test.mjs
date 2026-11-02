import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { patchHomeNav } from '../../scripts/patch-home-nav.mjs';
import { patchHomeMobile } from '../../scripts/patch-home-mobile.mjs';
import { patchHomeGalleryPacing } from '../../scripts/patch-home-gallery-pacing.mjs';
import { patchCaseClose } from '../../scripts/patch-case-close.mjs';
import { patchMorrowPortfolio } from '../../scripts/patch-home-morrow.mjs';
import { patchHomeHeadline } from '../../scripts/patch-home-headline.mjs';
import { patchHomeEntrance } from '../../scripts/patch-home-entrance.mjs';
import { patchHomeAccessibility } from '../../scripts/patch-home-accessibility.mjs';

const html = patchHomeAccessibility(patchHomeEntrance(patchHomeHeadline(patchMorrowPortfolio(patchCaseClose(patchHomeGalleryPacing(patchHomeMobile(patchHomeNav(readFileSync('release/home.html', 'utf8')))))))));
for (const id of ['f24', 'second-voice', 'leu', 'needle', 'bollard', 'morrow']) {
  test(`${id}: case action name includes the visible phrase`, () => {
    const control = [...html.matchAll(/<(?:button|a)\b[^>]*>/g)].map(m => m[0]).find(tag => tag.includes(`data-case="${id}"`) && tag.includes('class="button"'));
    assert.ok(control, 'Published case action exists');
    const name = control.match(/aria-label="([^"]*)"/)?.[1];
    assert.ok(name?.includes('Read case study'), `Visible label missing from accessible name: ${name}`);
  });
}
test('app action names retain the contiguous visible Open app phrase', () => {
  const labels = [...html.matchAll(/aria-label="(Open [^"]*app[^"]*)"/g)].map(m => m[1]);
  assert.ok(labels.length >= 5);
  for (const label of labels) assert.ok(label.includes('Open app'), label);
});
