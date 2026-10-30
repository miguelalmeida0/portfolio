import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { patchHomeNav } from './patch-home-nav.mjs';
import { patchHomeMobile } from './patch-home-mobile.mjs';
import { patchHomeGalleryPacing } from './patch-home-gallery-pacing.mjs';
import { patchCaseClose } from './patch-case-close.mjs';
import { patchMorrowPortfolio } from './patch-home-morrow.mjs';
import { motionDiagnosticsPage } from './motion-diagnostics.mjs';
const output = '.svelte-kit/cloudflare';
const html = patchCaseClose(patchHomeGalleryPacing(patchHomeMobile(patchHomeNav(await readFile('release/home.html', 'utf8')))));
const homepage = patchMorrowPortfolio(html);
assert.ok(homepage.includes('id="contact"') && homepage.includes('sv-world') && homepage.includes('leu-nook-world') && homepage.includes('id="morrow"'), 'Expected the reviewed Human Input portfolio');
assert.ok(!homepage.includes('src="/workspace/'), 'Local asset paths cannot be published');
await writeFile(`${output}/index.html`, homepage);
await mkdir(`${output}/motion-debug`,{recursive:true});
await writeFile(`${output}/motion-debug/index.html`,motionDiagnosticsPage(homepage));
const path = `${output}/_routes.json`;
const routes = JSON.parse(await readFile(path, 'utf8'));
// The homepage and its diagnostic copy bypass the Svelte worker. CV, PDF, APIs and legacy
// case-study routes continue through the existing application unchanged.
routes.exclude = [...new Set([...routes.exclude.filter(rule => !rule.startsWith('/fonts/') && !rule.startsWith('/images/') && !rule.startsWith('/projects/') && !rule.startsWith('/models/')), '/fonts/*', '/images/*', '/projects/*', '/models/*', '/', '/motion-debug', '/motion-debug/*'])];
assert.ok(routes.include.length + routes.exclude.length <= 100, 'Cloudflare routing limit exceeded');
await writeFile(path, JSON.stringify(routes, null, 2) + '\n');
await writeFile(`${output}/_headers`, (await readFile(`${output}/_headers`, 'utf8')) + '\n/\n  Cache-Control: no-cache, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n\n');
await writeFile(`${output}/_headers`,(await readFile(`${output}/_headers`,'utf8'))+'\n/motion-debug\n  Cache-Control: no-store\n  X-Robots-Tag: noindex, nofollow\n\n/motion-debug/*\n  Cache-Control: no-store\n  X-Robots-Tag: noindex, nofollow\n');
console.log('Installed reviewed static homepage; existing worker routes preserved.');
