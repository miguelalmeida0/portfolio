# Production deployments

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
PDF endpoints for downloads and existing external links. Regenerating the PDF
automatically updates the reader; it renders the actual file, not a separate CV.
