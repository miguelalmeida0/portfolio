import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Independently extracted with git show from the approved October 26 source:
// e83d6b114def7732bc72002497b996d0068ce8c8:release/home.html.
// The original remains the body/hand source. The owner-approved close-up is
// placed over the head and neck without replacing or moving those pixels.
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

test('footer embeds the exact October 26 portrait bytes', async () => {
  const html = await readFile('release/home.html', 'utf8');
  const asset = html.match(/<image id="footer-person-asset" href="data:image\/png;base64,([^"]+)"/);
  assert.ok(asset, 'The approved portrait must remain embedded, without a replacement asset');
  const bytes = Buffer.from(asset[1], 'base64');
  assert.equal(sha256(bytes), 'ca017729915b1c7bd15eab325f46011bd7c963fb00e3a5093ab8b3e4b9ad770d');
  const metadata = await sharp(bytes).metadata();
  assert.equal(metadata.width, 1024);
  assert.equal(metadata.height, 1536);
  assert.equal(metadata.hasAlpha, true);
});

test('footer preserves the approved hand masks, fold layers and contact controls exactly', async () => {
  const html = await readFile('release/home.html', 'utf8');
  const start = html.indexOf('<footer class="human-contact fold-contact"');
  const end = html.indexOf('</footer>', start);
  assert.ok(start >= 0 && end > start);
  const originalFooter = html.slice(start, end + '</footer>'.length)
    .replace(/\s*<!-- approved-footer-texture:start -->[\s\S]*?<!-- approved-footer-texture:end -->/g, '');
  assert.equal(sha256(originalFooter),
    'b843ee1cac7ac9875d755641dd48e7bb98b7e6979c236ea129ac7b031ed802bf');
});

test('footer uses the exact approved close-up without replacing the original hands', async () => {
  const html = await readFile('release/home.html', 'utf8');
  assert.match(html, /class="footer-portrait-retouch"/);
  const bytes = await readFile('static/images/miguel-footer-approved-texture.png');
  assert.equal(sha256(bytes), 'e390a388fab29368981c6640e180fe367d6bdf498dc198c1d6ec31cc9936da28');
  assert.match(html, /href="\/images\/miguel-footer-approved-texture\.png"/);
  assert.match(html, /class="footer-person footer-person-hands"[^>]*><use href="#footer-person-asset" clip-path="url\(#footer-hands-clip\)"/);
});

test('rendered retouch changes the head while preserving every lower portrait pixel', async () => {
  const html = await readFile('release/home.html', 'utf8');
  const approved = await readFile('static/images/miguel-footer-approved-texture.png');
  const original = html.match(/<svg class="footer-person footer-person-body"[\s\S]*?<\/svg>/)[0];
  const overlay = html.match(/<svg class="footer-person footer-person-retouch"[\s\S]*?<\/svg>/)[0]
    .replace('/images/miguel-footer-approved-texture.png', `data:image/png;base64,${approved.toString('base64')}`);
  const frame = content => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536">${content}</svg>`;
  const render = svg => sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
  const [before, after] = await Promise.all([render(frame(original)), render(frame(original + overlay))]);
  assert.notDeepEqual(after.subarray(0, 600 * 1024 * 4), before.subarray(0, 600 * 1024 * 4), 'approved texture must actually render');
  assert.deepEqual(after.subarray(650 * 1024 * 4), before.subarray(650 * 1024 * 4), 'body and hand pixels must remain identical');
});
