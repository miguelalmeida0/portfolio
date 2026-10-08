# Contributing and release process

The portfolio is a public-facing product with protected `main` and `test` branches and an approved `dev` exception. No additional branches are allowed. Read [`AGENTS.md`](AGENTS.md) and [`DEPLOYMENT.md`](DEPLOYMENT.md) first.

## Ownership

- Keep case-study source and project evidence inside `src/lib/case-studies/`; shared components and motion primitives must not embed private client data.
- Case-study videos and CV assets are externally visible. Preserve existing file URLs and posters when changing presentation.
- Maintain reduced-motion fallbacks, keyboard access, responsive layouts, and explicit prepared-versus-live labels.
- Avoid global animation, scroll or CSS changes without profiling route transitions and teardown.

## Gate before release

```bash
npm ci
npm run check
npm run test:unit
npm run test:routes
npm run test:dev-watch
npm run build
npm run e2e
```

Record which browsers actually ran. Use `DEPLOYMENT.md` to identify the authoritative production checkout; do not overwrite the preserved production tree from an older worktree or run the legacy CV generator against the edited PDF.

Commit only the intended change. Never force-push or bypass branch protection for documentation or presentation cleanup.
