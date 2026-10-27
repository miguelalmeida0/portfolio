import assert from 'node:assert/strict';
import { test } from 'node:test';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';

test('homepage introduction renders the engineering role, location and current technology stack', async () => {
  const response = await fetch(new URL('/', baseURL), { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const hero = html.match(/<section\b[^>]*id="home"[^>]*data-sheet-hero[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero, 'The assertion must target the hero, not stack text elsewhere on the page');
  const stack=hero.match(/class="hero-stack"[^>]*>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(stack, 'Technology names belong to the hero stack');
  for (const skill of ['React', 'Svelte', 'TypeScript']) assert.ok(stack.includes(skill), skill);
  assert.match(hero, /Frontend engineer &amp; design engineer/);
  assert.match(hero, /Berlin, Germany/);
  assert.ok(hero.indexOf('hero-role') < hero.indexOf('hero-stack'));
});
