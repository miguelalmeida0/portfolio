# Portfolio regression and performance audit — 7 September 2026

Audited the current working tree after the recent portfolio, Story, project-page, contact, and CV revisions. No deployment or commit was made.

## Fixes made during this audit

- Video visibility: the observer previously treated any intersection as visible even though its threshold was 25%. Autoplay now requires at least 25% visibility.
- Video lifecycle: recheck visibility, user pause, reduced motion, and document visibility after source mounting; stop pending work after component destruction. This prevents playback beginning after scrolling away, hiding the page, or navigating away during the asynchronous update.
- Camera image selection: the compact gallery is capped at 36rem, but its `sizes` attribute advertised 52vw at every desktop width. Corrected that hint and made the second example lazy. At a wide desktop viewport with DPR 1, the browser can select the 720px image instead of the 1600px version (gesture: 22 KB versus 57 KB).
- Navigation: preserve Command/Ctrl/Shift-click browser behavior; synchronize the active route after client navigation; constrain keyboard Tab focus to the open mobile menu and return focus to its toggle on Escape.
- Updated stale browser-test expectations for Story labels/headings, CV sections, PDF revalidation, Camera video framing, and ambiguous project-link selectors. Added checks for the CV midpoint, overflow across six routes at ten widths (320–2560px), adjacent copy-button placement, and mobile menu focus.

## Executed validation

| Check | Result |
| --- | --- |
| Svelte diagnostics | 0 errors, 0 warnings |
| Production build | Passed with Cloudflare adapter |
| Built SvelteKit server | Nine page routes returned 200; one H1 and unique IDs per page |
| Links and assets | Referenced local assets and page anchors resolved, including favicon and manifest icons |
| Error and utility routes | Missing case study returned 404; sitemap and PDF returned 200; `/lab` redirected to `/#work` |
| Recruiter guide | All 17 isolated checks passed; no provider calls |
| Media controller | Visibility threshold, persistent user pause, async hide/scroll/unmount races, and listener cleanup passed against mocked browser/media boundaries |
| Served development pages | Existing page-content and asset assertions passed |
| PDF | Regenerated from the production handler and rendered for inspection; one A4 page, Spanish below English, no German language or unexplained internal product name; no visible clipping |
| Browser suite discovery | 65 tests in 12 files loaded successfully with `--list`; tests were not executed |
| Whitespace/error markers | Scoped `git diff --check` passed |

## Performance evidence

Initial client dependency graph, following static imports and counting shared files once per route:

| Route | JavaScript, gzip | CSS, gzip |
| --- | ---: | ---: |
| Home | 57.7 KiB | 23.5 KiB |
| CV | 45.4 KiB | 20.1 KiB |
| Story | 45.7 KiB | 18.7 KiB |
| Project pages | 66.4 KiB | 23.6 KiB |

These are compressed build-file sizes, not actual network-transfer captures. External fonts, images, video, and HTTP headers are excluded. HTML itself is approximately 2–7 KB gzipped per route. The hero portrait variants are 6.9 KB and 16.8 KB.

Built-server timings are recorded in `final-production-audit.json`. Warm renders were single-digit milliseconds locally; the first home request includes module initialization. They are **not** deployed TTFB, Lighthouse results, LCP, CLS, or INP. The slower cold development requests include Vite compilation.

Homepage films use `preload="none"` and no media source URLs in initial HTML. Selected encodings are approximately 0.56–1.80 MB each and mount on intersection. Film posters still have a loading cost. Project detail pages for Ghostwriter and Mirror AI use screenshots rather than film. The 3.55 MB original Story PNG listed in the asset report is a picture fallback; AVIF/WebP-capable browsers use the responsive versions (roughly 17–61 KB for that photo).

## Verification limits

The saved local-preview browser restriction remains in effect. No browser was launched or controlled. Responsive layout, real keyboard behavior, clipboard operation, video decoding, hydration, browser console output, and Core Web Vitals therefore remain unverified in a browser. The new browser checks are ready to run, but their discovery is not a passing test result. No production-host/CDN or live model-provider performance was measured. The local build emits a Node module-register deprecation notice; it does not fail validation.

Commands: `npm run check`, `npm run build`, `node scripts/audit-production.mjs`, `node scripts/check-media-lifecycle.mjs`, `node scripts/check-recruiter-guide.mjs`, `node scripts/check-served-portfolio.mjs`, and `TMPDIR="$PWD/.cache/tmp" npx playwright test --list`.
