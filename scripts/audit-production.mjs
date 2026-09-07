import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { Server } from '../.svelte-kit/output/server/index.js';
import { manifest } from '../.svelte-kit/output/server/manifest.js';
import { loadLocalTs } from './lib/load-local-ts.mjs';

// Exercise the built SvelteKit server without a browser, provider call, or deployment.
const server = new Server(manifest);
await server.init({ env: {} });
const origin = 'http://portfolio.test';
const routes = ['/', '/cv', '/story', '/work/camera-harness', '/work/ghostwriter', '/work/mirror-ai', '/work/atlas', '/work/creature-app', '/out/linkedin'];
const pages = new Map();
const report = { scope: 'Built server and files; no browser paint, hydration, or viewport measurements', pages: [], assets: [], errors: [] };
async function respond(path) {
  return server.respond(new Request(origin + path), { getClientAddress: () => '127.0.0.1' });
}
for (const route of routes) {
  const times = [];
  let html;
  for (let run = 0; run < 4; run++) {
    const start = performance.now();
    const response = await respond(route);
    assert.equal(response.status, 200, route);
    html = await response.text();
    times.push(Math.round((performance.now() - start) * 10) / 10);
  }
  pages.set(route, html);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${route}: one H1`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${route}: unique IDs`);
  report.pages.push({ route, coldMs: times[0], warmMs: times.slice(1), htmlGzipBytes: gzipSync(html).length });
}
const assets = new Set();
for (const [route, html] of pages) {
  for (const match of html.matchAll(/\b(?:src|poster|href)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value.startsWith('/') && !value.startsWith('#') && !value.startsWith('.')) continue;
    const url = new URL(value, origin + route);
    if (pages.has(url.pathname)) {
      if (url.hash && !pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) report.errors.push(`${route}: missing anchor ${value}`);
    } else if (url.pathname === '/portfolio.pdf') continue;
    else if (!url.pathname.startsWith('/_app/')) assets.add(url.pathname);
  }
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const item of match[1].split(',')) assets.add(item.trim().split(/\s+/)[0]);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(match[0])) report.errors.push(`${route}: missing image alt`);
    if (!/\bwidth=/.test(match[0]) || !/\bheight=/.test(match[0])) report.errors.push(`${route}: missing image dimensions`);
  }
}
for (const path of assets) {
  try { report.assets.push({ path, bytes: (await stat('static' + decodeURIComponent(path))).size }); }
  catch { report.errors.push(`Missing asset ${path}`); }
}
assert.equal((await respond('/work/does-not-exist')).status, 404);
assert.equal((await respond('/sitemap.xml')).status, 200);
const pdf = await respond('/portfolio.pdf');
assert.equal(pdf.status, 200);
const pdfBytes = Buffer.from(await pdf.arrayBuffer());
assert.match(pdfBytes.toString(), /Spanish \| Fluent/);
assert.doesNotMatch(pdfBytes.toString(), /Connectivity Hub|German \|/);
await mkdir('output/pdf', { recursive: true });
await writeFile('output/pdf/miguel-almeida-cv.pdf', pdfBytes);
const { homepageProjectTiles } = await loadLocalTs('src/lib/content/project-media.ts');
report.videoAssets = [];
for (const tile of homepageProjectTiles) {
  for (const path of [tile.media?.mp4, tile.media?.webm].filter(Boolean)) {
    report.videoAssets.push({ path, bytes: (await stat('static' + path)).size, loading: 'Sources mounted on intersection; not in initial HTML' });
  }
}
const webmanifest = JSON.parse(await readFile('static/site.webmanifest', 'utf8'));
for (const icon of webmanifest.icons) assert.ok((await stat('static' + icon.src)).size > 0);
const redirect = await respond('/lab');
assert.equal(redirect.status, 307);
assert.equal(redirect.headers.get('location'), '/#work');
report.assets.sort((a, b) => b.bytes - a.bytes);
await mkdir('docs/qa', { recursive: true });
await writeFile('docs/qa/final-production-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
assert.deepEqual(report.errors, []);
