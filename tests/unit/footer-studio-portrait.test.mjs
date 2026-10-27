import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

const photo = 'static/images/miguel-footer-studio.webp';

test('footer studio portrait has a compact, transparent, full-resolution asset', async () => {
  const [metadata, file] = await Promise.all([sharp(photo).metadata(), stat(photo)]);
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1536);
  assert.equal(metadata.hasAlpha, true);
  assert.ok(file.size < 250_000, 'do not regress to a megabyte-scale embedded photo');
});

test('contact footer keeps its hand occlusion and all contact actions', async () => {
  const html = await readFile('release/home.html', 'utf8');
  const start = html.indexOf('<footer class="human-contact fold-contact"');
  const end = html.indexOf('</footer>', start);
  assert.ok(start >= 0 && end > start);
  const footer = html.slice(start, end);
  assert.match(footer, /id="footer-person-asset" href="\/images\/miguel-footer-studio\.webp"/);
  assert.match(footer, /class="footer-person footer-person-body"/);
  assert.match(footer, /class="footer-person footer-person-hands"/);
  assert.match(footer, /clip-path="url\(#footer-hands-clip\)"/);
  assert.match(footer, /class="footer-front"/);
  assert.match(footer, /class="footer-paper"/);
  assert.doesNotMatch(footer, /data:image\/(?:png|jpeg|webp);base64,/);
  for (const selector of ['id="contact-heading"', 'class="footer-email"', 'class="copy-email"', 'class="footer-pro-links"', 'class="footer-back-top']) {
    assert.ok(footer.includes(selector), selector);
  }
});
