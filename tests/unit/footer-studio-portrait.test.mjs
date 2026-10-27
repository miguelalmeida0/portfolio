import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const photo = 'static/images/miguel-footer-hands-20261027.webp';

test('footer portrait keeps the new full-resolution transparent photo', async () => {
  const [metadata, file] = await Promise.all([sharp(photo).metadata(), stat(photo)]);
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1536);
  assert.equal(metadata.hasAlpha, true);
  assert.ok(file.size < 250_000, 'do not regress to a megabyte-scale embedded photo');
});

test('contact footer places both hands above the blue panel and preserves its actions', async () => {
  const html = await readFile('release/home.html', 'utf8');
  const start = html.indexOf('<footer class="human-contact fold-contact"');
  const end = html.indexOf('</footer>', start);
  assert.ok(start >= 0 && end > start);
  const footer = html.slice(start, end);
  assert.match(footer, /<image href="\/images\/miguel-footer-hands-20261027\.webp"/);
  assert.equal((footer.match(/miguel-footer-hands-20261027\.webp/g) || []).length, 1, 'photo should be painted only once');
  assert.match(html, /\.fold-contact \.footer-person-body \{ z-index: 4; \}/);
  assert.match(html, /\.fold-contact \.footer-front \{ z-index: 3; \}/);
  assert.match(footer, /class="footer-person footer-person-body"/);
  assert.doesNotMatch(footer, /footer-person-hands|footer-hands-clip/, 'no clipped foreground copy that can introduce a blue seam');
  assert.match(footer, /class="footer-front"/);
  assert.match(footer, /class="footer-paper"/);
  assert.doesNotMatch(footer, /data:image\/(?:png|jpeg|webp);base64,/);
  for (const selector of ['id="contact-heading"', 'class="footer-email"', 'class="copy-email"', 'class="footer-pro-links"', 'class="footer-back-top']) {
    assert.ok(footer.includes(selector), selector);
  }
});
