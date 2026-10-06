import assert from 'node:assert/strict';
import { test } from 'node:test';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';

test('homepage renders all four core frontend technologies between the role headline and View CV', async () => {
  const response = await fetch(new URL('/', baseURL), { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const hero = html.match(/<section\b[^>]*aria-labelledby="intro-heading"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero, 'The assertion must target the hero, not stack text elsewhere on the page');
  for (const skill of ["JavaScript", "React", "Svelte", "TypeScript"]) assert.ok(hero.includes(skill), skill);
  assert.match(hero, /aria-label="Frontend engineer &amp; design engineer\."/);
  assert.ok(hero.indexOf("JavaScript") < hero.indexOf("href=\"/cv\""));
});
