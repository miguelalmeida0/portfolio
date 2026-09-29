# Repository architecture

The repository is a SvelteKit portfolio with a deliberately small set of boundaries.

```text
src/
  lib/
    components/      reusable UI and project presentation
    content/         portfolio content and release copy
    experience/      project models, case-study systems and motion helpers
  routes/            public routes and route-specific composition

static/
  projects/          public project media grouped by project

tests/
  unit/              fast deterministic checks
  e2e/
    fixtures/        shared browser test data
    helpers/         navigation and test utilities
    specs/           user-facing browser journeys

scripts/             one-off QA and verification tooling
docs/                engineering and product documentation
.github/             CI, ownership and contribution contract
```

## Boundaries

### Routes compose; library code owns reusable behavior

Route files should stay focused on page composition, metadata and route-specific sequencing. Reusable UI, data shaping and interaction logic belongs under `src/lib`.

### Project data stays typed and centralized

Selected-work metadata and case-study systems live in `src/lib/experience` and `src/lib/content`. A project page should consume those models instead of duplicating facts in multiple routes.

### Static media is grouped by product

Public images and video live under `static/projects/<project>/`. Keep only assets referenced by the shipped experience or retained for a documented fallback.

### Tests follow product behavior

Unit tests cover deterministic helpers and content contracts. Playwright covers public routes, browser behavior, responsive layouts, accessibility-sensitive interactions, reduced motion and product-film playback.

### Infrastructure is explicit

- `.node-version` pins the local/CI Node line.
- `package-lock.json` is the dependency source of truth.
- `svelte.config.js` owns the Cloudflare adapter.
- `wrangler.jsonc` owns local Pages runtime configuration.
- `.github/workflows/ci.yml` is the release quality gate.

Avoid adding a second tool for a concern the repository already owns.
