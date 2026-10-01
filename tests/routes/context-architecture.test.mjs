import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';

const base = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';
const bridge = await readFile(new URL('../../src/lib/experience/voice-bridge.ts', import.meta.url), 'utf8');
const liveURL = bridge.match(/SECOND_VOICE_URL = '([^']+)'/)[1];

function position(html, marker) {
  const index = html.indexOf(marker);
  assert.notEqual(index, -1, `Missing current page contract: ${marker}`);
  return index;
}

test('homepage provides the current hero, four project choices and canonical CTAs', async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(!html.includes('One passage. Four voices. Compare the changes.'));
  assert.ok(!html.includes('An AI writing product for exploring distinct author voices'));
  const hero = html.match(/<section\b[^>]*aria-labelledby="intro-heading"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(hero, 'The current homepage hero must render');
  for (const href of ['/cv', '#contact']) assert.ok(hero.includes(`href="${href}"`), href);
  const work = html.slice(position(html, 'id="work"'), position(html, '</main>'));
  assert.ok(work.includes(`href="${liveURL}"`));
  assert.ok(work.includes('Open app'));
  assert.equal((work.match(/<button\b[^>]*data-project-row/g) || []).length, 4, 'Four selectable projects');
  const fallback = work.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
  assert.ok(fallback, 'Projects remain available without JavaScript');
  assert.equal((fallback.match(/<article\b/g) || []).length, 4);
  for (const slug of ['second-voice-ai', 'f24', 'flow', 'leu']) assert.ok(fallback.includes(`href="/work/${slug}"`), slug);
  for (const text of ['Second Voice AI', 'F24', 'Flow', 'Leu', 'React', 'Svelte', 'TypeScript', 'Playwright']) assert.ok(work.includes(text), text);
  assert.ok(!html.includes('id="experience"'));
  // The current first paint intentionally includes the body-of-name landing.
  assert.ok(html.includes('data-pixel-intro'));
  assert.ok(html.includes('data-intro-body'));
  assert.ok(html.includes('MIGUEL ALMEIDA ·'));
  assert.ok(html.includes('data-landing-target'));
});

for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
  test(`${slug}: current hero, demo or media, and architecture follow the project hierarchy`, async () => {
    const response = await fetch(`${base}/work/${slug}`);
    assert.equal(response.status, 200);
    const html = (await response.text()).match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(html, 'The route must render its main content');
    const hero = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
    assert.ok(hero, 'The project hero must render');
    assert.match(hero, /<h1\b/);
    assert.ok(hero.includes(`data-ask-id="project-${slug}"`), 'The hero identifies the current project');
    const architecture = position(html, 'id="architecture"');
    assert.equal((html.match(/id="architecture"/g) || []).length, 1);
    assert.match(html, /<section\b[^>]*id="architecture"[^>]*>[\s\S]*?<h2\b/);
    assert.ok(position(html, '</header>') < architecture, 'Architecture follows the hero');
    if (slug === 'f24') {
      const decision = position(html, 'id="production-decision"');
      assert.ok(position(html, 'id="product-purpose"') < decision);
      assert.ok(architecture < decision);
      assert.ok(architecture < position(html, 'id="activity-history"'));
      assert.ok(position(html, 'id="activity-history"') < decision);
      assert.ok(position(html, 'id="dry-run"') > decision);
      assert.ok(html.search(/<(?:figure|video)\b/) > position(html, 'id="engineering-proof"'), 'Team media follows engineering proof');
      for (const label of ['Problem', 'Decision', 'Tradeoff', 'Result']) assert.ok(html.includes(label));
    } else if (slug === 'second-voice-ai') {
      // The prepared writing interface replaces the historical hero film.
      const demo = position(html, 'id="writing-demo"');
      assert.ok(position(html, '</header>') < demo && demo < architecture);
      const demoHTML = html.slice(demo, architecture);
      assert.ok(demoHTML.includes('data-project="second-voice"'));
      assert.ok(demoHTML.includes('role="tablist"'));
      assert.ok(demoHTML.includes('role="tabpanel"'));
      assert.ok(hero.includes('href="#writing-demo"'));
      assert.ok(hero.includes(`href="${liveURL}"`));
      assert.ok(architecture < position(html, 'id="decisions-title"'));
    } else {
      // These investigations introduce architecture before the product film.
      const video = html.match(/<video\b[^>]*>[\s\S]*?<\/video>/);
      assert.ok(video, 'The case study must render its product film');
      assert.ok(architecture < video.index, 'Architecture precedes the product film');
      // SSR renders the poster; hydration attaches playback sources lazily.
      const poster = video[0].match(/\bposter="([^\"]+)"/)?.[1];
      assert.ok(poster?.startsWith(`/projects/${slug}/`), 'The film poster belongs to this project');
      assert.ok(architecture < position(html, slug === 'leu' ? 'id="failure-log"' : 'id="investigations"'));
    }
  });
}
