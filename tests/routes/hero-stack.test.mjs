import assert from 'node:assert/strict';
import { test } from 'node:test';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';

test('homepage keeps its experience strip and direct app launch in server-rendered HTML', async () => {
  const response = await fetch(new URL('/', baseURL), { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const hero = html.match(/<section\b[^>]*class="mah"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero, 'The assertion must target the hero, not stack text elsewhere on the page');
  const facts = html.match(/<ul[^>]*class="hero-facts"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
  assert.ok(facts, 'The experience strip remains readable without JavaScript');
  for (const skill of ['React', 'Svelte', 'TypeScript', 'Playwright']) assert.ok(facts.includes(skill), skill);
  assert.match(hero, /Miguel Almeida, frontend engineer and product designer in Berlin/);
  const launch = hero.match(/<a\b[^>]*class="mah-featured-project"[^>]*>/)?.[0];
  assert.ok(launch, 'The featured project must be a native link');
  assert.match(launch, /href="https:\/\/needle\.miguelalmeida\.xyz"/);
  assert.match(launch, /target="_blank"/);
  assert.match(launch, /rel="noopener noreferrer"/);
  assert.match(hero, /href="#work"/);
  assert.match(hero, /href="\/cv"/);
  assert.doesNotMatch(html, /data-selected-project="flow"/);
  for (const id of ['needle', 'second-voice-ai', 'leu']) {
    const video = html.match(new RegExp(`<video[^>]*data-project-preview="${id}"[^>]*>`))?.[0];
    assert.ok(video, `${id}: original preview remains mounted`);
    assert.match(video, /\bmuted\b/);
    assert.match(video, /\bloop\b/);
    assert.match(video, /\bplaysinline\b/);
    assert.ok(html.includes(`href="/work/${id}"`), `${id}: case study link`);
  }
});
