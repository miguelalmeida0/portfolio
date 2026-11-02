import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
const dir = new URL('../../.cache/a11y-test/', import.meta.url);
await mkdir(dir, { recursive: true });
const compiled = compile(await readFile('src/lib/components/CvZoom.svelte', 'utf8'), { generate: 'server', filename: 'CvZoom.svelte' });
await writeFile(new URL('CvZoom.mjs', dir), compiled.js.code);
const { default: CvZoom } = await import(new URL('CvZoom.mjs', dir));
for (const percent of [25, 100, 175]) test(`zoom ${percent}% is included in its accessible name`, () => {
  const html = render(CvZoom, { props: { ready: true, percent, mode: 'custom', onscale() {} } }).body;
  const name = html.match(/class="zoom-trigger[^>]*aria-label="([^"]+)"/)?.[1];
  assert.ok(name?.includes(`${percent}%`), `Visible ${percent}% absent from ${name}`);
});
