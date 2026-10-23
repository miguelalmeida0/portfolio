# Human Input portfolio release — 23 October 2026

Replaces the canonical homepage with the owner-reviewed HTML portfolio. Preserves
existing Svelte source, case studies, Story, CV, PDF reader, raw PDF and APIs.

`release/home.html` is the reviewed source. After the normal Svelte build and
integrity checks, `scripts/install-portfolio-home.mjs` writes it to the Pages
output index and excludes only `/` from worker routing. Static asset prefixes
are consolidated to stay within Cloudflare's 100-rule limit. Root HTML is
revalidated, and retains the security headers applicable to a static document.

The new homepage includes the MA monogram, F24 outcomes and AI frontend
leadership, animated Second Voice and Leu previews, existing GSAP scrolling,
and contact footer. The existing portrait is retained: generated restorations
still contained skin artifacts and were rejected.

The current browser CI acceptance config is human-input-release.config.ts.
Historical typographic homepage acceptance remains available in
portfolio-release.config.ts; its removed hero assertions are not acceptance
criteria for the replacement. Existing PDF and interactive case-demo browser
tests remain in the current release gate.

Rollback: revert this release commit through a normal forward commit. No DNS,
Cloudflare project settings, repository branches or existing assets are removed.
