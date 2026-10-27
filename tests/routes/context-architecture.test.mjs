import assert from 'node:assert/strict';
import { test } from 'node:test';
const base = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';

test('homepage serves F24 and four independent projects with SSR posters and destinations', async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  const work = html.slice(html.indexOf('id="work"'), html.indexOf('</main>'));
  const projects=[...work.matchAll(/<article class="project" id="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
  assert.deepEqual(projects.map(x=>x[1]), ['f24', 'second-voice', 'leu', 'needle', 'bollard']);
  for(const [,id,card] of projects){
    assert.match(card, /<img\b[^>]*class="project-cover[^\"]*"[^>]*src="[^\"]+"/, `${id} has a server-rendered poster`);
    assert.ok(card.includes(`data-case="${id}"`), `${id} has an interactive case-study action`);
    if(id==='bollard'){
      assert.match(card, /<noscript><details class="bollard-case-fallback">/, 'Bollard has a complete no-script case study');
      assert.ok(card.includes('https://bollard-nine.vercel.app/today'));
      assert.ok(card.includes('Fictional scenario'));
    }else{
      assert.ok(card.includes(`href="https://miguelalmeida.is-a.dev/work/${id}"`), `${id} retains its no-script case link`);
    }
  }
  assert.equal((work.match(/<img\b[^>]*class="project-cover(?:\s[^\"]*)?"/g) || []).length, 5, 'Each project retains its own poster');
  assert.ok(work.includes('aria-label="Pause or play project preview animations"'));
  assert.ok(work.includes('href="https://leu.miguelalmeida.xyz/"'));
  assert.ok(!work.includes('https://miguelalmeida0.github.io'));
  assert.ok(!html.includes('data-pixel-intro'));
});

for (const slug of ['needle', 'second-voice', 'f24', 'leu', 'flow']) {
  test(`${slug}: literal case study retains its narrative and persistent product navigation`, async () => {
    const response = await fetch(`${base}/work/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes('id="pnav"'));
    assert.ok(html.includes('href="/#work"'), 'Work returns to the approved direction');
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
