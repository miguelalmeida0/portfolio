import assert from 'node:assert/strict';
import { test } from 'node:test';
const base = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';

test('homepage serves F24 and four independent projects with SSR posters and destinations', async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  const work = html.slice(html.indexOf('id="work"'), html.indexOf('</main>'));
  assert.equal((work.match(/data-f24-feature/g) || []).length, 1);
  assert.deepEqual([...work.matchAll(/data-selected-project="([^"]+)"/g)].map(x => x[1]), ['needle', 'second-voice-ai', 'leu', 'flow']);
  for (const slug of ['needle', 'second-voice-ai', 'f24', 'flow', 'leu']) assert.ok(work.includes(`href="/work/${slug}"`));
  assert.equal((work.match(/<img\b/g) || []).length, 6, 'SSR retains two photographs and four project posters');
  assert.ok(work.includes('Pause project videos'));
  assert.ok(work.includes('href="https://leu-desktop.vercel.app/"'));
  assert.ok(!work.includes('https://miguelalmeida0.github.io'));
  assert.ok(html.includes('data-pixel-intro'));
});

for (const slug of ['needle', 'second-voice', 'f24', 'leu', 'flow']) {
  test(`${slug}: literal case study retains its narrative and persistent product navigation`, async () => {
    const response = await fetch(`${base}/work/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes('id="pnav"'));
    assert.ok(html.includes('href="/#work"'));
    assert.ok(html.includes('id="try"'), 'Interactive demonstration remains available');
  });
}

test('historical slugs preserve redirects and unknown projects return 404', async () => {
  for (const slug of ['ghostwriter', 'second-voice-ai']) {
    const response = await fetch(`${base}/work/${slug}`, { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), '/work/second-voice');
  }
  for (const slug of ['camera-harness', 'vigia', 'does-not-exist']) assert.equal((await fetch(`${base}/work/${slug}`)).status, 404);
});
