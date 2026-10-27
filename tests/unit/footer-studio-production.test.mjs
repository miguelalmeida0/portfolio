import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';

test('the footer portrait source is intact and transparent', () => {
  const encoded = readFileSync('scripts/assets/footer-studio-20261027.webp.base64', 'utf8').trim();
  const bytes = Buffer.from(encoded, 'base64');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '0ce2cd2dfcb66f0510a720b42c871533acd4372e9779f12aadbc2c53d19471ff');
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 16), 'WEBPVP8X');
  assert.ok((bytes[20] & 0x10) !== 0);
  assert.equal(bytes.readUIntLE(24, 3) + 1, 1024);
  assert.equal(bytes.readUIntLE(27, 3) + 1, 1536);
  assert.ok(bytes.length < 250000);
});

test('the production installer installs the replacement portrait', () => {
  const installer = readFileSync('scripts/install-portfolio-home.mjs', 'utf8');
  assert.ok(installer.includes('footer-studio-20261027.webp.base64'));
  assert.ok(installer.includes('images/miguel-footer-studio.webp'));
  assert.ok(installer.includes('studio-20261027'));
});
