import assert from 'node:assert/strict';
import { test } from 'node:test';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';
const projects = [
  ['leu', 'https://leu-desktop.vercel.app/', 'https://github.com/miguelalmeida0/leu'],
  ['needle', 'https://needle.miguelalmeida.xyz', 'https://github.com/miguelalmeida0/needle-portfolio-release'],
  ['flow', undefined, 'https://github.com/miguelalmeida0/flow'],
  ['second-voice', 'https://secondvoice-ai.vercel.app/second-voice', 'https://github.com/miguelalmeida0/second-voice'],
];

function anchors(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attributes, content]) => ({
    attributes: Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
    label: content.replace(/<[^>]*>/g, '').trim(),
  }));
}

for (const [slug, live, code] of projects) {
  test(`${slug}: the sticky header launches the app and code in new tabs without duplicate product links`, async () => {
    const response = await fetch(new URL(`/work/${slug}`, baseURL), { signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200);
    const html = await response.text();
    const nav = html.match(/<nav\b[^>]*id="pnav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, 'case study has a product header');
    const links = anchors(nav);
    const actions = [['Code', code]];
    if (live) actions.push(['Try it', live]);
    for (const [label, href] of actions) {
      const link = links.find(link => link.label === label);
      assert.ok(link, `${label} is available in the product header`);
      assert.equal(link.attributes.href, href);
      assert.equal(link.attributes.target, '_blank');
      assert.match(link.attributes.rel, /\bnoopener\b/);
      assert.match(link.attributes.rel, /\bnoreferrer\b/);
      assert.equal(anchors(html).filter(link => link.attributes.href === href).length, 1, `${label} is not duplicated in the article`);
    }
    assert.equal(anchors(html).filter(link => link.label === 'Try it').length, live ? 1 : 0, 'embedded demo has its own clear label');
    assert.equal(anchors(html).filter(link => link.attributes.href?.startsWith(code)).length, 1, 'repository links belong in the header');
    if (!live) assert.ok(!links.some(link => link.label === 'Explore demo'), 'Flow has only Code in the action group');
  });
}

test('F24 labels its private-work demonstration honestly', async () => {
  const response = await fetch(new URL('/work/f24', baseURL), { signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200);
  const nav = (await response.text()).match(/<nav\b[^>]*id="pnav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav);
  const links = anchors(nav);
  assert.ok(links.some(link => link.label === 'Explore demo' && link.attributes.href === '#try'));
  assert.ok(!links.some(link => ['Try it', 'Code'].includes(link.label)));
});

test('Flow has no broken app link on the homepage or case study', async () => {
  for (const route of ['/', '/work/flow']) {
    const response = await fetch(new URL(route, baseURL), { signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200);
    assert.ok(!anchors(await response.text()).some(link => link.attributes.href?.startsWith('https://miguelalmeida0.github.io')), route);
  }
});
