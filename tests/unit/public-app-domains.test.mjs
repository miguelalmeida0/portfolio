import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');

test('public app links retain their domains and portfolio uses its requested canonical domain', () => {
  const projects = read('src/lib/experience/projects.ts');
  const bridge = read('src/lib/experience/voice-bridge.ts');
  const cv = read('src/lib/content/cv-projects.ts');
  const site = read('src/lib/config/site.ts');
  const readme = read('README.md');

  assert.match(projects, /https:\/\/needle\.miguelalmeida\.xyz/);
  assert.match(projects, /https:\/\/leu\.miguelalmeida\.xyz\//);
  assert.match(bridge, /SECOND_VOICE_URL = 'https:\/\/secondvoice\.miguelalmeida\.xyz\/'/);
  assert.match(cv, /https:\/\/secondvoice\.miguelalmeida\.xyz\//);
  assert.match(cv, /https:\/\/leu\.miguelalmeida\.xyz\//);
  assert.match(site, /SITE_ORIGIN = 'https:\/\/miguelalmeida\.is-a\.dev'/);
  assert.match(readme, /https:\/\/secondvoice\.miguelalmeida\.xyz\//);
  assert.match(readme, /https:\/\/leu\.miguelalmeida\.xyz\//);
  assert.doesNotMatch(readme, /secondvoice-ai\.vercel\.app|leu-desktop\.vercel\.app/);
  for (const text of [projects, bridge, cv]) {
    assert.doesNotMatch(text, /secondvoice-ai\.vercel\.app|leu-desktop\.vercel\.app|miguelalmeida\.is-a\.dev/);
  }
});
