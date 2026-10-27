import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { patchHomeNav } from '../../scripts/patch-home-nav.mjs';
import { patchHomeMobile } from '../../scripts/patch-home-mobile.mjs';
import { galleryTravel, patchHomeGalleryPacing } from '../../scripts/patch-home-gallery-pacing.mjs';

const source = readFileSync(new URL('../../release/home.html', import.meta.url), 'utf8');
const installer = readFileSync(new URL('../../scripts/install-portfolio-home.mjs', import.meta.url), 'utf8');

test('the production installer lengthens only the pinned horizontal project gallery', () => {
  const baseline = patchHomeMobile(patchHomeNav(source));
  const updated = patchHomeGalleryPacing(baseline);
  const original = "end:()=>'+='+Math.max(3600,innerHeight*5.2),pin:true,scrub:.55";
  const longer = "end:()=>'+='+Math.max(4800,innerHeight*7),pin:true,scrub:.55";
  assert.equal(baseline.split(original).length - 1, 1);
  assert.equal(updated.split(longer).length - 1, 1);
  assert.ok(!updated.includes(original));
  assert.equal(updated.replace(longer, original), baseline, 'no other HTML or JS changes');
  assert.match(installer, /import \{ patchHomeGalleryPacing \}/);
  assert.match(installer, /const html = patchHomeGalleryPacing\(patchHomeMobile\(/);
});

test('each desktop viewport gains an intentional reading interval without locking scroll', () => {
  for (const height of [650, 700, 800, 900, 1080, 1440]) {
    const oldTravel = Math.max(3600, height * 5.2);
    const newTravel = galleryTravel(height);
    assert.ok(newTravel / oldTravel >= 1.3, 'at least 30% more scroll travel');
    assert.ok(newTravel / 4.68 >= 1000, 'each chapter gets >= 1000px of travel');
  }
});

test('source drift and double patching fail closed', () => {
  assert.throws(() => patchHomeGalleryPacing('<html></html>'), /Unexpected homepage/);
  assert.throws(() => patchHomeGalleryPacing(patchHomeGalleryPacing(source)), /Unexpected homepage/);
});
