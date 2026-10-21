# Release safeguards and optional remote-answer budget

No repository settings, provider settings or infrastructure were changed by this work. Main still auto-deploys through the existing Cloudflare Pages integration. Never run a parallel site deployment.

## Promotion

1. Configure the GitHub `main` branch rule to require a reviewed pull request, the current CI `validate` check, up-to-date acceptance, and no direct pushes or bypasses. Preserve the repository's branch restrictions. These settings require owner application; a source patch alone cannot prevent a failing main push from deploying.
2. Run the candidate's check, unit tests, production build, route checks and current Chromium/WebKit release suite against the built Cloudflare worker. Record the full candidate SHA. Add keyboard, responsive and screen-reader acceptance. Do not use Vite results as Cloudflare acceptance.
3. For local bookkeeping, `npm run verify:promotion -- /absolute/path/acceptance.json` checks a clean test checkout, exact proof SHA, reviewed flag, production-build environment and all required results. It does not authenticate the author of that JSON, enforce GitHub rules, merge, push or deploy. Only use a proof assembled from actual successful runs.
4. Before an authorized promotion, verify there is no unique remote test work being overwritten. The current local test differs from origin/test; do not force-push it. Reconcile through the permitted workflow with preservation and review.
5. After an authorized main push, wait for Cloudflare Pages, then compare public HTML `portfolio-build` with `/version.json` and the accepted commit. `dirty` must be false. Preserve both PDF hashes.

Proof shape (false values are intentionally blocking, not a certificate):
```json
{"commit":"FULL_ACCEPTED_SHA","environment":"cloudflare-production-build","reviewed":false,"checks":{"types":false,"unit":false,"build":false,"routes":false,"chromium":false,"webkit":false,"accessibility":false,"responsive":false}}
```

## Public API protections

Both endpoints share a bounded in-instance burst limiter (12 accepted requests per minute per client, at most 2,000 active buckets). This is local burst protection, not a distributed quota. Bodies are limited to 32,000 actual UTF-8 bytes, including chunked input. Deadline/cancellation reaches body reads and model calls. Provider responses are limited to 128,000 bytes and output to 420 tokens. Rejected rate requests include Retry-After; responses use no-store.

Provider keys alone no longer enable public spending. Remote calls require all of:
- `MIGUEL_REMOTE_ENABLED=true` (explicit operator opt-in).
- A random private `MIGUEL_BUDGET_SALT` (never publish or print it).
- A `PORTFOLIO_BUDGET` Durable Object namespace binding.
- Admission from the single named `portfolio-model-budget-v1` object.

Missing configuration, budget failure, timeout or rejection retains local authored answers. No paid request is started. Accepted reservations are not refunded after failure or cancellation, avoiding uncertain-outcome double spending. Per-client keys are salted, daily-rotating hashes; raw addresses never leave Pages for the budget.

The optional `workers/provider-budget.ts` keeps one transactional daily counter and a maximum of DAILY_CALL_LIMIT hashes. Default: 100 requests per UTC day shared across both endpoints and all workers, plus 6 per client per minute. Maximum supported daily setting: 1,000. This is a request/token ceiling, not a dollar guarantee; use a dedicated provider project/key and a provider-enforced spend cap appropriate to the chosen model and input budget. Never claim a provider budget is enforced merely because an alert exists.

The optional Worker configuration is supplied for owner review; it is not referenced by the site's production build and has not been deployed. Cloudflare Pages needs an existing separately deployed Durable Object worker. If an existing edge/shared-budget facility already provides these guarantees, integrate that rather than duplicating it. Inspect current Cloudflare and provider settings before activation.

Reviewed activation proposal:
1. Verify existing protections, actual legacy callers and provider hard limits with the owner.
2. Review/deploy the private budget worker using `workers/provider-budget.wrangler.jsonc` only when authorized. Its public fetch returns 404 and workers.dev is disabled.
3. Add the existing namespace binding to Pages, specifying name PORTFOLIO_BUDGET, class_name PortfolioBudget, script_name portfolio-provider-budget. Keep this separate backend-resource change from the single Pages site deployment path.
4. Configure the private salt and opt-in only after the budget is bound. Exercise normal, exhausted, missing-binding and unavailable-budget cases with a mocked provider first, then one authorized low-cost live request.
5. Confirm exact production limits and provider spending cap. Without these checks, remote activation remains unverified.

Sources: https://developers.cloudflare.com/pages/functions/bindings/ ; https://developers.cloudflare.com/pages/functions/wrangler-configuration/ ; https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/ .
