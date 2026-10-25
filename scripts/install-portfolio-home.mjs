import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { patchHomeNav } from './patch-home-nav.mjs';
import { patchHomeMobile } from './patch-home-mobile.mjs';
const output = '.svelte-kit/cloudflare';
const html = patchHomeMobile(patchHomeNav(await readFile('release/home.html', 'utf8')));
assert.ok(html.includes('id="contact"') && html.includes('sv-world') && html.includes('leu-nook-world'), 'Expected the reviewed Human Input portfolio');
assert.ok(!html.includes('src="/workspace/'), 'Local asset paths cannot be published');
await writeFile(`${output}/index.html`, html);
const path = `${output}/_routes.json`;
const routes = JSON.parse(await readFile(path, 'utf8'));
// Only the homepage bypasses the Svelte worker. CV, PDF, APIs and legacy
// case-study routes continue through the existing application unchanged.
routes.exclude = [...new Set([...routes.exclude.filter(rule => !rule.startsWith('/fonts/') && !rule.startsWith('/images/') && !rule.startsWith('/projects/') && !rule.startsWith('/models/')), '/fonts/*', '/images/*', '/projects/*', '/models/*', '/'])];
assert.ok(routes.include.length + routes.exclude.length <= 100, 'Cloudflare routing limit exceeded');
await writeFile(path, JSON.stringify(routes, null, 2) + '\n');
await writeFile(`${output}/_headers`, (await readFile(`${output}/_headers`, 'utf8')) + '\n/\n  Cache-Control: no-cache, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n\n');
console.log('Installed reviewed static homepage; existing worker routes preserved.');
