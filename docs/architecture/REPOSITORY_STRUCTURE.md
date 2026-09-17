# Repository structure

**Repository role:** SvelteKit portfolio application

The public root is product-first: runtime code, framework configuration,
tests, project docs and legal metadata stay visible. Agent runtime material,
historical planning and generated QA output live in explicit internal
namespaces.

## Rules

1. Product/runtime architecture owns the root.
2. Claude/Codex/agent material lives under `docs/internal/automation/` or `tooling/`.
3. Local agent conventions are recreated with `scripts/dev/bootstrap-local-tooling.sh`.
4. Generated output is not a root architectural concept.
5. Historical material lives under `docs/archive/`.
6. Framework-required configuration stays at root.

## Moved

- `.design-os` -> `docs/internal/design-system`
- `performance-qa-artifacts` -> `docs/qa/performance`

## Notes

- None.

## Root before

```text
.design-os/
.env.example
.github/
.gitignore
.node-version
.tmp/
README.md
_headers
docs/
package-lock.json
package.json
performance-qa-artifacts/
playwright.config.ts
scripts/
src/
static/
svelte.config.js
tailwind.css
tests/
tsconfig.json
vite.config.ts
wrangler.jsonc
```

## Root after

```text
.env.example
.github/
.gitignore
.node-version
README.md
_headers
docs/
package-lock.json
package.json
playwright.config.ts
scripts/
src/
static/
svelte.config.js
tailwind.css
tests/
tsconfig.json
vite.config.ts
wrangler.jsonc
```
