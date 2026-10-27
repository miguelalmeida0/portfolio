import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const baseURL = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173';
const directions = ['typographic', 'cinematic', 'kinetic'];
const get = async path => {
  const response = await fetch(new URL(path, baseURL), { signal: AbortSignal.timeout(15_000) });
  return { status: response.status, html: await response.text() };
};
const decode = html => html.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&nbsp;', ' ');

// The production hero is the source of truth for every string a direction shows.
const productionHero = readFileSync('src/lib/components/experience/Hero.svelte', 'utf8');
const exact = [
  'Hi, I’m Miguel.',
  '4+ years building production software.',
  'Built a product used by hundreds of companies.',
  'View CV',
  'Get in touch'
];

test('every lab string is the production hero string', () => {
  for (const text of exact) assert.ok(productionHero.includes(text), `production hero no longer says: ${text}`);
  assert.ok(productionHero.includes('React&nbsp;· TypeScript&nbsp;· Svelte&nbsp;· JavaScript'));
  const lab = readFileSync('src/lib/hero-lab/content.ts', 'utf8');
  for (const text of exact) assert.ok(lab.includes(text), `lab content drifted: ${text}`);
  assert.ok(lab.includes("'React\\u00a0· TypeScript\\u00a0· Svelte\\u00a0· JavaScript'"));
  assert.match(readFileSync('src/lib/components/experience/hero/wind.ts', 'utf8'), /\['Frontend engineer', '& product designer\.'\]/);
});

for (const slug of directions) {
  test(`/hero-lab/${slug} keeps the real hero, portrait, links and portfolio`, async () => {
    const { status, html: raw } = await get(`/hero-lab/${slug}`);
    assert.equal(status, 200);
    const html = decode(raw);
    for (const text of slug === 'typographic' ? exact.slice(1) : exact) assert.ok(html.includes(text), `${slug}: missing ${text}`);
    if (slug === 'typographic') {
      for (const tech of ['React', 'TypeScript', 'Svelte', 'JavaScript']) assert.ok(html.includes(`<li>${tech}</li>`), `Turntable stack: ${tech}`);
      assert.match(html, /<h1 id="intro-heading"[^>]*>Miguel Almeida, frontend engineer and product designer in Berlin<\/h1>/);
    } else {
      assert.ok(html.includes('React · TypeScript · Svelte · JavaScript'), `${slug}: stack line`);
      assert.match(html, /<h1 id="intro-heading"[^>]*aria-label="Frontend engineer & product designer\."/);
    }
    assert.ok(html.includes('MIGUEL ALMEIDA') || html.includes('Miguel Almeida'), `${slug}: name`);
    assert.ok(html.includes('>Berlin<'), `${slug}: Berlin`);
    // Each direction retains its supplied portrait and accessible name.
    if (slug === 'typographic') {
      for (const asset of ['miguel-front-contour.webp', 'miguel-back-repaired.webp', 'room.jpg']) assert.ok(html.includes(`/turntable-header/${asset}`), `Turntable asset: ${asset}`);
      assert.match(html, /role="img" aria-label="Miguel Almeida\./);
    } else {
      assert.ok(html.includes('/images/wind-full-720.avif 720w, /images/wind-full-1086.avif 1086w'), `${slug}: portrait sources`);
      assert.match(html, /<img[^>]*alt="Miguel Almeida"/);
    }
    // Functional destinations. Direction 01 is previewed as a whole site, so its
    // Story and CV links stay inside the direction.
    const cv = '/cv';
    const story = '/story';
    assert.ok(new RegExp(`href="${cv}"[^>]*data-ask-id="cv"|data-ask-id="cv"[^>]*href="${cv}"`).test(html), `${slug}: View CV`);
    assert.match(html, /href="#contact"[^>]*data-ask-id="touch"|data-ask-id="touch"[^>]*href="#contact"/);
    for (const href of ['#work', story, cv, '#contact']) assert.ok(html.includes(`href="${href}"`), `${slug}: nav ${href}`);
    assert.ok(html.includes('data-ask-trigger'), `${slug}: Ask MiguelLLM control`);
    // The unchanged portfolio below the hero.
    const workHeading = html.match(/<h2\b[^>]*id="work-title"[^>]*>([\s\S]*?)<\/h2>/)?.[1];
    assert.ok(html.includes('id="work"'), `${slug}: Work anchor`);
    assert.equal(workHeading?.replace(/<!--[\s\S]*?-->|<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), 'Selected Work', `${slug}: Selected Work heading`);
    for (const name of ['F24', 'Needle', 'Second Voice AI', 'Leu', 'Flow']) assert.ok(html.includes(name), `${slug}: ${name}`);
    for (const href of ['/work/f24', '/work/needle', '/work/second-voice-ai', '/work/leu', '/work/flow']) assert.ok(html.includes(`href="${href}"`), `${slug}: ${href}`);
    assert.ok(html.includes('id="contact"'), `${slug}: contact footer`);
    assert.ok(html.includes('name="robots" content="noindex"'), `${slug}: noindex`);
    // Exactly one heading-level identity and one main navigation per prototype.
    assert.equal((html.match(/id="intro-heading"/g) || []).length, 1);
    assert.equal((html.match(/aria-label="Main navigation"/g) || []).length, 1, `${slug}: one main navigation`);
  });
}

const storyData = JSON.parse(readFileSync('src/lib/story/story.json', 'utf8'));
const folio = readFileSync('src/lib/content/folio.ts', 'utf8');

test('/hero-lab/typographic/story keeps every Story chapter in Direction 01', async () => {
  const { status, html: raw } = await get('/hero-lab/typographic/story');
  assert.equal(status, 200);
  const html = decode(raw);
  assert.match(html, /<h1[^>]*id="story-title"/);
  const title = html.match(/<h1[^>]*id="story-title"[^>]*>([\s\S]*?)<\/h1>/)?.[1];
  assert.equal(title?.replace(/<!--[\s\S]*?-->|<[^>]+>/g, ''), 'Frontend engineer.UX background.');
  assert.match(html, /I’m based in Berlin\./, 'current biographical opening');
  assert.equal((html.match(/role="tab"/g) || []).length, 3, 'three career chapters');
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 3, 'three chapter panels');
  assert.ok(html.includes(storyData.shortVersion.compactIntro), 'short version');
  for (const question of storyData.questions) {
    assert.ok(html.includes(`id="story-${question.id}"`), question.id);
    assert.ok(html.includes(question.answer), `${question.id} answer`);
    assert.ok(html.includes(`data-story-scene="${question.id}"`), `${question.id} scene`);
  }
  assert.ok(html.includes(storyData.ending.answer), 'ending');
  // The whole site moves together: Story and CV link to each other inside the direction.
  for (const href of ['/cv', '/#work', '/', '#contact']) assert.ok(html.includes(`href="${href}"`), href);
  assert.match(html, /aria-current="page"[^>]*>|data-ask-id="nav-story"/);
  assert.equal((html.match(/aria-label="Main navigation"/g) || []).length, 1);
  assert.ok(!/<header[^>]*class="wind-header/.test(html), 'production header replaced by the D1 masthead');
  assert.match(html, /src="\/projects\/f24\/hackathon-team.webp"/, 'documentary Story photo');
  assert.doesNotMatch(html, /wind-full-|lab-portrait/, 'Home cutout is reserved for Home');
  assert.ok(html.includes('id="contact"'), 'contact footer');
  assert.ok(html.includes('name="robots" content="noindex"'));
});

test('/hero-lab/typographic/cv keeps the full CV in Direction 01', async () => {
  const { status, html: raw } = await get('/hero-lab/typographic/cv');
  assert.equal(status, 200);
  const html = decode(raw);
  const name = html.match(/<h1[^>]*id="cv-name"[^>]*>([\s\S]*?)<\/h1>/)?.[1];
  assert.equal(name?.replace(/<!--[\s\S]*?-->|<[^>]+>/g, '').trim(), 'Experience.');
  assert.match(html, /data-cv-intro/);
  assert.doesNotMatch(html, /wind-full-|lab-portrait|data-figure/);
  // Every field of the CV data the production page renders.
  const cvData = folio.slice(folio.indexOf('export const cvHighlights'), folio.indexOf('export const cvStack'))
    + folio.slice(folio.indexOf('export const cvSkills'), folio.indexOf('export const cvCta'));
  assert.ok(cvData.length > 500);
  for (const [, text] of cvData.matchAll(/(?:value|label|title|detail|role|place|year|years|company|location|name|quote): '([^']+)'/g)) {
    assert.ok(html.includes(decode(text)), `CV text: ${text}`);
  }
  for (const href of ['/cv/pdf', '/files/Miguel_Almeida_CV.pdf', '/work/f24#migration', '/story', '/work/needle', '/work/leu'])
    assert.ok(html.includes(`href="${href}"`), href);
  const cvProjects = readFileSync('src/lib/content/cv-projects.ts', 'utf8');
  for (const [, text] of cvProjects.matchAll(/(?:name|description): '([^']+)'/g)) assert.ok(html.includes(decode(text)), `project: ${text}`);
  for (const id of ['cv-summary', 'cv-job-0', 'cv-job-1', 'cv-skills', 'cv-education', 'cv-languages', 'cv-recommendation']) assert.ok(html.includes(`data-ask-id="${id}"`), id);
  assert.equal((html.match(/aria-label="Main navigation"/g) || []).length, 1);
  assert.ok(html.includes('name="robots" content="noindex"'));
});

test('the selected Story and CV are published on their canonical routes', async () => {
  for (const path of ['/story', '/cv']) {
    const { status, html } = await get(path);
    assert.equal(status, 200);
    assert.ok(html.includes('data-direction="typographic"'), `${path} must not render a lab direction`);
    assert.doesNotMatch(html, /<header[^>]*class="wind-header/, `${path} keeps the production header`);
  }
});

test('/hero-lab links all three live directions', async () => {
  const { status, html } = await get('/hero-lab');
  assert.equal(status, 200);
  for (const slug of directions) assert.ok(html.includes(`href="/hero-lab/${slug}"`), slug);
});

test('the production homepage publishes the approved paper-fold header', async () => {
  const { status, html } = await get('/');
  assert.equal(status, 200);
  assert.match(html, /<body\b[^>]*data-direction="pink"/);
  assert.match(html, /<section\b[^>]*id="home"[^>]*data-sheet-hero[^>]*aria-label="Introduction"/);
  assert.match(html, /<nav\b[^>]*aria-label="Main navigation"/);
  for(const href of ['#work','#about','https://miguelalmeida.is-a.dev/cv/pdf'])
    assert.ok(html.includes(`href="${href}"`), `homepage navigation: ${href}`);
});
