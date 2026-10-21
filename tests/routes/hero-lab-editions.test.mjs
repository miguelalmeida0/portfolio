import assert from 'node:assert/strict';
import { test } from 'node:test';

// Experimental home directions share the supported typographic Story and CV.
const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';
const slugs = ['editorial-poster', 'kinetic-story', 'experimental'];
const get = async path => {
  const response = await fetch(new URL(path, baseURL), { signal: AbortSignal.timeout(15_000) });
  return { status: response.status, html: await response.text() };
};
const decode = html => html.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"').replaceAll('&nbsp;', ' ').replaceAll('\u00a0', ' ');
const heroStrings = ['Hi, I’m Miguel.', '4+ years building production software.', 'Built a product used by hundreds of companies.', 'View CV', 'Get in touch'];

for (const slug of slugs) {
  const home = `/hero-lab/${slug}`;
  const links = ['/hero-lab/typographic/story', '/hero-lab/typographic/cv'];

  test(`${home}: the real hero, portrait, navigation and portfolio`, async () => {
    const { status, html: raw } = await get(home);
    assert.equal(status, 200);
    const html = decode(raw);
    for (const text of heroStrings) assert.ok(html.includes(text), `missing ${text}`);
    assert.ok(html.includes('React · TypeScript · Svelte · JavaScript'), 'stack line');
    assert.match(html, /<h1[^>]*id="intro-heading"[^>]*aria-label="Frontend engineer & product designer\."|<h1[^>]*aria-label="Frontend engineer & product designer\."[^>]*id="intro-heading"/);
    assert.ok(html.includes('>Berlin<') || html.includes('Berlin'), 'Berlin');
    assert.ok(html.includes('/images/wind-full-720.avif 720w, /images/wind-full-1086.avif 1086w'), 'portrait sources');
    assert.match(html, /<img[^>]*alt="Miguel Almeida"/);
    assert.doesNotMatch(html, /data-ask-trigger|data-ask-id/);
    assert.ok(html.includes('data-identity-home'), 'identity home link');
    assert.ok(html.includes('id="work"') && html.includes('Selected Work'), 'Selected Work');
    for (const name of ['F24', 'Needle', 'Second Voice', 'Leu']) assert.ok(html.includes(name), name);
    assert.ok(html.includes('id="contact"'), 'contact footer');
    assert.ok(html.includes('name="robots" content="noindex"'));
    assert.ok(!/<header[^>]*class="wind-header/.test(html), 'own navigation, not the production header');
    assert.equal((html.match(/id="intro-heading"/g) || []).length, 1);
    for (const href of [...links, '#work', '#contact']) assert.ok(html.includes(`href="${href}"`), `link ${href}`);
    assert.ok(html.includes('href="/hero-lab/typographic/cv"'), 'View CV opens the supported CV');
    for (const href of links) assert.equal((await get(href)).status, 200, `linked destination ${href}`);
  });

  for (const page of ['story', 'cv']) {
    test(`${home}/${page}: legacy URL redirects to the supported profile and keeps its query`, async () => {
      const response = await fetch(new URL(`${home}/${page}?from=edition`, baseURL), {
        redirect: 'manual', signal: AbortSignal.timeout(15_000)
      });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get('location'), `/hero-lab/typographic/${page}?from=edition`);
      const destination = await get(response.headers.get('location'));
      assert.equal(destination.status, 200);
      assert.equal((destination.html.match(/<h1[\s>]/g) || []).length, 1);
      assert.ok(destination.html.includes(`data-d1-page="${page}"`));
      assert.ok(destination.html.includes('aria-current="page"'));
      assert.ok(destination.html.includes('href="/"'), 'destination has a real home link');
    });
  }

}

test('Direction 01 and production pages retain their route identity', async () => {
  for (const path of ['/hero-lab/typographic', '/hero-lab/typographic/story', '/hero-lab/typographic/cv']) {
    const { status, html } = await get(path);
    assert.equal(status, 200, path);
    assert.ok(html.includes('data-direction="typographic"'), path);
  }
  for (const path of ['/', '/story', '/cv']) {
    const { status, html } = await get(path);
    assert.equal(status, 200, path);
    assert.ok(html.includes('data-direction="typographic"'), `${path} renders production`);
  }
});
