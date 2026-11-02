import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {homepageHeaders} from '../../scripts/home-security.mjs';
test('static home CSP authorizes exact scripts without permitting arbitrary inline execution',()=>{
  const body='console.log("portfolio");';
  const headers=homepageHeaders(`<script>${body}</script><script>${body}</script>`);
  const hash=createHash('sha256').update(body).digest('base64');
  assert.ok(headers.includes(`'sha256-${hash}'`));
  assert.equal(headers.split(hash).length,2);
  assert.ok(!headers.includes("script-src 'self' 'unsafe-inline'"));
  assert.ok(headers.includes("object-src 'none'"));
  assert.ok(headers.includes('Strict-Transport-Security: max-age=31536000'));
});
