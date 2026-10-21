import test from 'node:test';
import assert from 'node:assert/strict';

const origin = process.env.ROUTE_HEALTH_BASE_URL || 'http://127.0.0.1:4273';
// Baseline parity is local opt-in, so the normal route suite needs only one server.
const baseline = process.env.TYPOGRAPHIC_BASELINE_URL;
const root = '/hero-lab/typographic';
async function get(path, server = origin) {
  const response = await fetch(new URL(path, server), { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200, `${server}${path}`);
  return response.text();
}
const content = html => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'server-rendered main content');
  return {
    text: main.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    destinations: [...main.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]),
    images: [...main.matchAll(/<(?:img|source)\b[^>]*\b(?:src|srcset)="([^"]+)"/g)].map(match => match[1])
  };
};

for (const suffix of ['', '/story', '/cv']) {
  test(`approved Typographic ${suffix || 'home'} keeps real content and connected routes`, async () => {
    const html = await get(root + suffix);
    assert.match(html, /data-direction="typographic"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    if (!suffix) assert.match(html, /role="img" aria-label="Miguel Almeida\./);
    if (suffix === '/story') {
      assert.match(html, /src="\/projects\/f24\/hackathon-team.webp"/);
      assert.doesNotMatch(html, /wind-full-|lab-portrait/);
    }
    if (suffix === '/cv') {
      assert.doesNotMatch(html, /wind-full-|lab-portrait|data-figure|data-curtain/);
      assert.doesNotMatch(html, /aria-label="On this page"|id="d1-sheet-sections"/);
      assert.match(html, /data-cv-intro/);
      assert.match(html, /id="experience"/);
    }
    for (const destination of ['/story', '/cv']) assert.ok(html.includes(`href="${destination}"`), destination);
    if (suffix) assert.ok(html.includes(`href="/"`));
    for (const [, fragment] of html.matchAll(/href="#([^"#]+)"/g)) {
      assert.ok(html.includes(`id="${fragment}"`), `real anchor target: ${fragment}`);
    }
    if (baseline) {
      const original = await get(root + suffix, baseline);
      if (!suffix) assert.deepEqual(content(html), content(original), 'Home remains unchanged');
      else {
        const removedCvLinks = ['#cv-highlights', '#experience', '#projects', '#skills', '#education'];
        const expected = content(original).destinations.filter(href => suffix !== '/cv' || !removedCvLinks.includes(href)).map(href => href === '/work/f24#production-decision' ? '/work/f24#migration' : href);
        assert.deepEqual(content(html).destinations.slice().sort(), expected.sort(), 'destinations retained except explicitly removed CV section navigation');
        const marker = suffix === '/story' ? '<article' : '<section class="c-summary';
        const bodyText = source => source.slice(source.indexOf(marker)).replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        assert.equal(bodyText(html).split('Take Line M')[0].replace('Read about the Svelte-to-React migration', 'Read about my work at F24'), bodyText(original).split('Take Line M')[0], 'existing résumé/narrative content retained');
      }
    }
  });
}

test('CV download remains an actual PDF', async () => {
  const response = await fetch(new URL('/files/miguel-almeida-cv.pdf', origin));
  assert.equal(response.status, 200);
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert.equal(new TextDecoder().decode(bytes.slice(0, 5)), '%PDF-');
});
