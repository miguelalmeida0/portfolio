import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const photo = 'static/images/miguel-footer-restored-hands.webp';

test('footer cutout retains both complete hands and space below their fingertips', async () => {
  const [metadata, file] = await Promise.all([sharp(photo).metadata(), stat(photo)]);
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1536);
  assert.equal(metadata.hasAlpha, true);
  assert.ok(file.size < 250_000, 'keep the external cutout optimized');

  const { data, info } = await sharp(photo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let lowestVisibleY = 0;
  let leftHand = 0;
  let rightHand = 0;
  for (let y = 1080; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * info.channels + 3];
      if (alpha < 120) continue;
      lowestVisibleY = y;
      if (x >= 450 && x < 620) leftHand++;
      if (x >= 620 && x < 850) rightHand++;
    }
  }
  assert.ok(leftHand > 800, 'left fingers must remain in the cutout');
  assert.ok(rightHand > 800, 'right fingers must remain in the cutout');
  assert.ok(lowestVisibleY < info.height - 80, 'do not crop the fingertips at the bottom boundary');
});

test('contact footer keeps yesterday’s fold and paints both hands above blue', async () => {
  const html = await readFile('release/home.html', 'utf8');
  const start = html.indexOf('<footer class="human-contact fold-contact"');
  const end = html.indexOf('</footer>', start);
  assert.ok(start >= 0 && end > start);
  const footer = html.slice(start, end);
  const body = footer.indexOf('class="footer-person footer-person-body"');
  const fold = footer.indexOf('class="footer-front"');
  const hands = footer.indexOf('class="footer-person footer-person-hands"');
  assert.ok(body >= 0 && body < fold && fold < hands);
  assert.match(html, /\.fold-contact \.footer-person-body \{ z-index: 2; \}/);
  assert.match(html, /\.fold-contact \.footer-front \{ z-index: 3; \}/);
  assert.match(html, /\.fold-contact \.footer-person-hands \{ z-index: 4; \}/);
  assert.match(footer, /id="footer-person-asset" href="\/images\/miguel-footer-restored-hands\.webp"/);
  assert.equal((footer.match(/miguel-footer-restored-hands\.webp/g) || []).length, 1);
  assert.equal((footer.match(/href="#footer-person-asset"/g) || []).length, 2);
  assert.match(footer, /id="footer-hands-clip" clipPathUnits="userSpaceOnUse"/);
  assert.ok(footer.includes('clip-path="url(#footer-hands-clip)"'));
  assert.match(footer, /id="footer-blue-fringe-key" color-interpolation-filters="sRGB"/);
  assert.ok(footer.includes('filter="url(#footer-blue-fringe-key)"'));
  assert.match(footer, /class="footer-paper"/);
  assert.doesNotMatch(footer, /data:image\/(?:png|jpeg|webp);base64,/);
  for (const selector of ['id="contact-heading"', 'class="footer-email"', 'class="copy-email"', 'class="footer-pro-links"', 'footer-back-top']) {
    assert.ok(footer.includes(selector), selector);
  }
});
