import assert from 'node:assert/strict';
import test from 'node:test';

// Exercise the actual route's SSR boundary: a client-only transplant would
// leave the introduction and its destinations absent until JavaScript boots.
test('Turntable introduction preserves the existing navigation and destinations in SSR', async () => {
  const origin = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4288';
  const response = await fetch(`${origin}/hero-lab/typographic`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="mah"/);
  assert.match(html, /Miguel Almeida, frontend engineer and product designer in Berlin/);
  assert.match(html, /class="mah-btn"[^>]*href="\/hero-lab\/typographic\/cv"/);
  assert.match(html, /class="mah-link"[^>]*href="#contact"/);
  assert.equal((html.match(/data-mast[ =>]/g) ?? []).length, 1);
  assert.match(html, /id="work"/);
  assert.match(html, /id="contact"/);
  for (const target of ['role', 'stack', 'f24', 'cv', 'touch']) {
    assert.ok(html.includes(`data-ask-id="${target}"`), `existing Ask target: ${target}`);
  }
  const navbar = html.match(/<header\b[^>]*data-mast[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.ok(navbar.includes('data-mah-tabs'), 'role controls belong in the existing navbar');
  assert.equal((html.match(/data-mah-tabs/g) ?? []).length, 1, 'one role switch only');
  assert.ok(navbar.includes('Pause the role animation'));
  assert.ok(!html.match(/class="mah-copy"[\s\S]*?data-mah-tabs/), 'no duplicate controls in the hero copy');
});
