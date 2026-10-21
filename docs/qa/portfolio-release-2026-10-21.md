# Reviewed portfolio release verification — 21 October 2026

The candidate preserves the 89-file reviewed handoff from `d8a106d` and adds
focused production repairs for readable project prose, mobile project navigation,
Flow/Leu action colors, zero-duration reduced-motion transitions, and usable Index
navigation while hero fonts load. The scrollbar retains its original pointer
mapping; correcting undersized prose restores the document's intended scroll range.
Project-title links also retain a physical 44px hit area under desktop scaling.

Existing regression assertions remain unchanged. Additional regressions cover
all project-card prose and opening the desktop Index while fonts are pending.
The release configuration includes `selected-work-approved.spec.ts`, so actual
video playback, looping, fallback, visibility policy, and project navigation run
in CI as well as the public-domain verification.

## Local acceptance

Run these checks from the actual candidate checkout on `test`:

```sh
npm run check
npm run test:unit
npm run build
node node_modules/wrangler/bin/wrangler.js dev --config wrangler.e2e.jsonc --ip 127.0.0.1 --port 4285 --show-interactive-dev-session=false
```

In another terminal:

```sh
ROUTE_HEALTH_BASE_URL=http://127.0.0.1:4285 npm run test:routes
PORTFOLIO_AUDIT_URL=http://127.0.0.1:4285 npx playwright test -c tests/e2e/portfolio-release.config.ts
```

This runs the production-built SvelteKit Cloudflare worker with Workers Assets.
The legacy `pages dev` asset handler returns a whole-file chunked `200` for
uncached byte-range requests, which prevents intercepted WebKit media playback.
See `tests/e2e/BROWSER_RUNTIME.md` for the previously documented server limitation.
Do not alter media assets, assertions, or timeouts to accommodate that handler.
Production continues to use `wrangler.jsonc` and the existing GitHub-to-Cloudflare Pages integration.

The README's development-watcher check requires a running Vite development server:
run `npm run dev`, then `npm run test:dev-watch`. It is separate from production
worker acceptance.

## Promotion and public verification

The original handoff runner requires exact hashes for the original 89 files.
Repairs intentionally change that inventory; do not reapply its patch or remove
its guards. Review the delta and record the final candidate hashes instead.
Preserve all local work and inspect current remote `main` and `test` before
staging the reviewed release paths. Use the owner author and committer identity.

Publish the validated candidate to `test` with a normal push. Require all current
CI jobs, including `validate`, to succeed for that exact SHA. Recheck remote refs
and branch protections before promoting the verified candidate to `main`. Never
force-push, weaken protection, introduce another branch, or deploy directly.

Wait for main CI and Cloudflare Pages. Verify the public HTML build marker and
`/version.json` agree with the accepted SHA and `dirty` is false, then verify
canonical routes, both preserved PDF endpoints, retired assistant endpoints, and
the current browser journeys on `https://miguelalmeida.is-a.dev/`.

These are required checks and release instructions, not a claim that a candidate
has passed CI or been deployed. Record actual results with the final commit.
