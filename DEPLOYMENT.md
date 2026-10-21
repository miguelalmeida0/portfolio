# Current release workflow

As of 19 October 2026, GitHub main contains the reviewed typographic portfolio
from the October 15 current-state recovery, including its October 16-19 work.
It was reconciled in a clean checkout from main, validated on local test, then
promoted by fast-forward. The older dirty production checkout was preserved.

The published routes are /, /story and /cv, plus the five /work case studies.
The opening/loading overlay is removed. The FRONTEND / DESIGNER header
animation remains. The older /hero-lab/typographic URLs remain available as
non-indexed aliases whose navigation points to the canonical pages.

Canonical site: https://miguelalmeida.is-a.dev/
Cloudflare Pages project: miguelalmeida-portfolio. Production branch: main.
Push validated main to GitHub and wait for the Cloudflare Pages check. Do not
run a parallel direct deployment. Always verify the public domain afterward.

Use a fresh main-based checkout for future release preparation. Never deploy
an older outer workspace or overwrite divergent work in a historical checkout.
Read docs/qa/portfolio-release-2026-10-19.md for the verification commands.
The historical recovery notes below document the earlier source location and
assets that must continue to be preserved.

# Historical production recovery

Production source is this checkout, `.cache/leu-flow-pages` under the portfolio
workspace. The workspace root is an older checkout and must never be deployed.

On 4 October 2026 this checkout was recovered from GitHub `main` at `6ffe791`.
It retains the Needle release, including the later palette update `1a32264`, and restores the four Claude case studies from
the 1 October handoffs and their reviewed integration. The comparison deployment
for the case studies and desktop sizing is `1ed04fb5`; the Needle baseline is
`52a1008d`.

Cloudflare Pages project: `miguelalmeida-portfolio`. Production branch: `main`.
The former `portfolio` branch is no longer the production target.

Before publishing:

1. Check this checkout's dirty state and read `RECOVERY.md`.
2. Compare the candidate with the current live site, including Needle.
3. Run `npm run check`, `npm run build`, and the case-study recovery checks.
4. Deploy `.svelte-kit/cloudflare` with `wrangler pages deploy`, explicitly
   targeting project `miguelalmeida-portfolio` and branch `main`.
5. Verify the public domain, desktop sizing, and all four case-study routes.

Keep the recovered source and tests in Git. Do not publish a branch that omits
`src/lib/case-studies` or `src/styles/desktop-density.css`.

On 6 October, the completed 5 October reconciliation, Selected Work cards,
supplied Needle/Second Voice loops and posters, hero experience line, and CV
updates were recovered from the saved handoff into this checkout. The original
temporary preview checkout no longer exists. The CV PDF also includes Leu's
verified desktop app URL. Preserve these files together in future releases.

GitHub `main` pushes automatically deploy to the same Cloudflare Pages project.
Use one deployment path per release and wait for its Cloudflare Pages check
before verifying the public domain. Do not run a parallel direct deployment.

CV reading links use `/cv/pdf`, a dedicated PDF.js reader whose PDF annotations
open in new tabs. Keep `/portfolio.pdf` and `/files/miguel-almeida-cv.pdf` as raw
PDF endpoints for downloads and existing external links. The production file is
based on the user-supplied `Miguel_Almeida_CV_OPEN.pdf` from 6 October 2026. At the
user's request, its four contact cards and matching link rectangles were moved
up 19.5 PDF points to center the stack within the green header, with equal
15.5-point top and bottom margins. All text, link destinations and artwork
outside the contact area are preserved. `scripts/align-cv-contact-cards.py`
records this guarded edit. Preserve the revised PDF; do not run the legacy
generator over it. The web CV mirrors its authored information, and the reader
renders the actual PDF.
