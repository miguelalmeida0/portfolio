import assert from 'node:assert/strict';
import { test } from 'node:test';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';

test('homepage introduction renders the current headline, location and technology stack', async () => {
  const response = await fetch(new URL('/', baseURL), { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const hero = html.match(/<section\b[^>]*id="home"[^>]*data-sheet-hero[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero, 'The assertion must target the hero, not stack text elsewhere on the page');
  const stack=hero.match(/class="hero-stack"[^>]*>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(stack, 'Technology names belong to the hero stack');
  for (const skill of ['React', 'Svelte', 'TypeScript']) assert.ok(stack.includes(skill), skill);
  assert.match(hero, /<p class="hero-role">I build the interfaces teams rely on when seconds matter\.<\/p>/);
  const mobileHeadline = hero.match(/<h1 class="mobile-role">([\s\S]*?)<\/h1>/)?.[1];
  assert.equal(mobileHeadline?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), 'I build the interfaces teams rely on when seconds matter.', 'Mobile and desktop introductions retain the authored headline');
  assert.match(hero, /Berlin, Germany/);
  assert.ok(hero.indexOf('hero-role') < hero.indexOf('hero-stack'));
});
