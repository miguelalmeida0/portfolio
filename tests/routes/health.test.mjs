import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { writeFile } from 'node:fs/promises';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';
const routes = [
  ['/', /^Frontend engineer & product designer\b/],
  ['/cv', /^Miguel Almeida\b/],
  ['/story', /^The story behind the work\.$/],
  ['/work/needle', /^From a query to a visible artwork\.$/],
  ['/work/second-voice', /^Choose a literary voice\. See exactly what changes\.$/],
  ['/work/f24', /^From mockup to production system\.$/],
  ['/work/leu', /^Built around the page\.$/],
  ['/work/flow', /^From speech to deterministic state\.$/]
];
const results = [];

for (const [path, expectedHeading] of routes) {
  test(`GET ${path} returns 200 and its own rendered heading`, async () => {
    const response = await fetch(new URL(path, baseURL), {
      redirect: 'manual', signal: AbortSignal.timeout(10_000)
    });
    const html = await response.text();
    const heading = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
      .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    // Route identity survives editorial changes to a heading's subtitle.
    const matchesHeading = expectedHeading.test(heading);
    results.push({ path, status: response.status, heading, expectedHeading: expectedHeading.source, matchesHeading });
    assert.equal(response.status, 200, `${path} HTTP status`);
    assert.match(heading, expectedHeading, `${path} must render its own content, not an error shell`);
  });
}

after(async () => {
  if (process.env.ROUTE_HEALTH_OUTPUT) {
    await writeFile(process.env.ROUTE_HEALTH_OUTPUT, JSON.stringify({
      baseURL, checkedAt: new Date().toISOString(), routes: results,
      passed: results.length === routes.length && results.every(r => r.status === 200 && r.matchesHeading)
    }, null, 2));
  }
});
