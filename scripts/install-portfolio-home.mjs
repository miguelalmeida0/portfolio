import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { patchHomeNav } from './patch-home-nav.mjs';
import { patchHomeMobile } from './patch-home-mobile.mjs';
import { patchHomeGalleryPacing } from './patch-home-gallery-pacing.mjs';
import { patchCaseClose } from './patch-case-close.mjs';
import { patchMorrowPortfolio } from './patch-home-morrow.mjs';
import { patchHomeHeadline } from './patch-home-headline.mjs';
import { patchHomeEntrance } from './patch-home-entrance.mjs';
import { motionDiagnosticsPage } from './motion-diagnostics.mjs';
import { patchHomeAccessibility } from './patch-home-accessibility.mjs';
import { patchHomeHistory } from './patch-home-history.mjs';
import { homepageHeaders } from './home-security.mjs';
import { externalizePointingHand } from './home-media.mjs';
import { patchCaseFocus } from './patch-case-focus.mjs';
import { patchPreviewControls } from './patch-preview-controls.mjs';
const output = '.svelte-kit/cloudflare';
const html = patchCaseClose(patchHomeGalleryPacing(patchHomeMobile(patchHomeNav(await readFile('release/home.html', 'utf8')))));
const homepage = patchMorrowPortfolio(html);
const media = externalizePointingHand(patchHomeHistory(patchHomeAccessibility(patchHomeEntrance(patchHomeHeadline(homepage)))));
const publishedHome = patchPreviewControls(patchCaseFocus(media.html));
await mkdir(`${output}/images`, {recursive:true});
await writeFile(`${output}${media.path}`, media.bytes);
assert.ok(publishedHome.includes('id="contact"') && homepage.includes('sv-world') && homepage.includes('leu-nook-world') && homepage.includes('id="morrow"'), 'Expected the reviewed Human Input portfolio');
assert.ok(!publishedHome.includes('src="/workspace/'), 'Local asset paths cannot be published');
await writeFile(`${output}/index.html`, publishedHome);
await mkdir(`${output}/motion-debug`,{recursive:true});
await writeFile(`${output}/motion-debug/index.html`,motionDiagnosticsPage(publishedHome));
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
await writeFile(`${output}/_headers`, (await readFile(`${output}/_headers`, 'utf8')) + homepageHeaders(publishedHome));


/*
 * Verified standalone optical portfolio (4 Nov 2026).
 * Keep the existing SvelteKit routes and reviewed homepage during CI preview.
 * Promote only after the preview's Chromium/WebKit checks pass.
 */
const opticalSources = Array.from({length: 17}, (_, i) =>
  'release/optical-index/' + String(i).padStart(2, '0') + '.txt'
);
const opticalHtml = (await Promise.all(opticalSources.map(path => readFile(path, 'utf8')))).join('');
const { createHash } = await import('node:crypto');
assert.equal(
  createHash('sha256').update(opticalHtml).digest('hex'),
  '44597bfe6fcfe67df6739f8e058ec6e4876273355a2d3d3f31f8c0cfe07e399c',
  'Optical portfolio source bytes changed'
);
assert.ok(opticalHtml.includes('id="toggle-morrow"') && opticalHtml.includes('id="toggle-leu"')
  && opticalHtml.includes('id="toggle-needle"') && opticalHtml.includes('id="portfolio-data"'),
  'Required optical portfolio project controls are missing');
await mkdir(output + '/optical-preview', {recursive:true});
/* Recover the approved mobile page without modifying the verified optical source.
   The extra assets are same-origin and allowed by the existing CSP. */
assert.ok(opticalHtml.includes('<body class="ready mobile-index">'), 'Optical mobile index source has changed');
const restoredHtml = opticalHtml
  .replace('<body class="ready mobile-index">', '<body class="ready">')
  .replace('</head>', '<link rel="stylesheet" href="/optical-mobile-restoration.css"><script defer src="/optical-ola.js"></script></head>');
assert.ok(restoredHtml.includes('<body class="ready">'), 'Full mobile hero could not be restored');
await writeFile(output + '/optical-mobile-restoration.css', await readFile('release/optical-mobile-restoration.css', 'utf8'));
await writeFile(output + '/optical-ola.js', await readFile('release/optical-ola.js', 'utf8'));
await writeFile(output + '/optical-preview/index.html', restoredHtml);
const opticalRoutesPath = output + '/_routes.json';
const opticalRoutes = JSON.parse(await readFile(opticalRoutesPath, 'utf8'));
opticalRoutes.exclude = [...new Set([...opticalRoutes.exclude, '/optical-preview', '/optical-preview/*', '/optical-mobile-restoration.css', '/optical-ola.js'])];
assert.ok(opticalRoutes.include.length + opticalRoutes.exclude.length <= 100, 'Cloudflare routing limit exceeded');
await writeFile(opticalRoutesPath, JSON.stringify(opticalRoutes, null, 2) + '\n');
const opticalCsp = opticalHtml.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/i)?.[1]?.replaceAll('&#x27;', "'").replaceAll('&amp;', '&');
assert.ok(opticalCsp && opticalCsp.includes("default-src 'none'"), 'Optical portfolio CSP is missing');
await writeFile(output + '/_headers', (await readFile(output + '/_headers', 'utf8'))
  + '\n/optical-preview/*\n  Cache-Control: no-cache, max-age=0, must-revalidate\n'
  + '  Content-Security-Policy: ' + opticalCsp + '\n'
  + '  X-Content-Type-Options: nosniff\n'
  + '  X-Robots-Tag: noindex, nofollow\n');
console.log('Installed content-addressed optical portfolio preview; production homepage unchanged.');

/* Promote the exact reviewed optical source without changing existing worker routes. */
const previousRootPolicy = homepageHeaders(publishedHome);
const promotedRootPolicy = '\n/\n  Strict-Transport-Security: max-age=31536000\n'
  + '  Content-Security-Policy: ' + opticalCsp + '\n'
  + '  X-Portfolio-Revision: optical-2026-11-04-mobile-restored\n';
const originalHeaders = await readFile(output + '/_headers', 'utf8');
assert.ok(originalHeaders.includes(previousRootPolicy), 'Expected previous homepage security headers');
await writeFile(output + '/_headers', originalHeaders.replace(previousRootPolicy, promotedRootPolicy));
await writeFile(output + '/index.html', restoredHtml);
console.log('Promoted optical homepage; existing CV and case-study routes preserved.');
