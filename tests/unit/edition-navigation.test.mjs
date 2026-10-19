import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { editionRoutes, editionHref, editionNavigation, editionPageOf } = await loadLocalTs('src/lib/hero-lab/editions/site.ts');

for (const slug of ['editorial-poster', 'kinetic-story', 'experimental']) {
  test(`${slug}: profile actions lead to the supported typographic pages`, () => {
    assert.equal(editionRoutes(slug).story, '/hero-lab/typographic/story');
    assert.equal(editionRoutes(slug).cv, '/hero-lab/typographic/cv');
    assert.equal(editionHref(slug, 'home', '/cv'), '/hero-lab/typographic/cv');
    assert.deepEqual(editionNavigation(slug, 'home').map(({ href }) => href), [
      '#work', '/hero-lab/typographic/story', '/hero-lab/typographic/cv', '#contact'
    ]);
    assert.equal(editionHref(slug, 'home', '/'), `/hero-lab/${slug}`);
    assert.equal(editionHref(slug, 'home', '/work/f24'), '/work/f24');
  });

  test(`${slug}: outgoing edition transitions do not claim another layout or legacy redirect`, () => {
    assert.equal(editionPageOf(slug, `/hero-lab/${slug}/`), 'home');
    for (const path of ['/hero-lab/typographic/story', '/hero-lab/typographic/cv', `/hero-lab/${slug}/story`, `/hero-lab/${slug}/cv`, '/cv']) {
      assert.equal(editionPageOf(slug, path), undefined, path);
    }
  });

  for (const page of ['story', 'cv']) {
    test(`${slug}/${page}: legacy loader redirects permanently and preserves the query`, async () => {
      const { load } = await loadLocalTs(`src/routes/hero-lab/${slug}/${page}/+page.server.ts`);
      assert.throws(() => load({ url: new URL(`https://portfolio.example/hero-lab/${slug}/${page}?from=bookmark`) }), error => {
        assert.equal(error.status, 308);
        assert.equal(error.location, `/hero-lab/typographic/${page}?from=bookmark`);
        return true;
      });
    });
  }
}
