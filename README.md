# Miguel Almeida — Portfolio

Frontend developer and design engineer portfolio built with **Svelte 5, SvelteKit, TypeScript and Tailwind CSS**, deployed with the Cloudflare Pages adapter.

The site contains selected work across Second Voice, F24, Leu, Flow and Mirror AI, plus CV and story routes. Product films, responsive behavior, reduced motion and cross-browser journeys are treated as part of the shipped experience.

## Local development

Requires the Node version declared in `.node-version`.

```bash
npm ci
npm run dev
```

Local development runs at `http://localhost:4173`.

## Quality gate

Fast release verification:

```bash
npm run verify
```

Full browser verification:

```bash
npm run e2e
```

The Playwright suite covers Chromium, Firefox and WebKit across desktop and mobile profiles, including responsive layouts from 320px through 2560px.

## Branch model

The repository has two long-lived branches:

- **`main`** — production source of truth
- **`test`** — integration/staging line for the next release

Changes are verified on `test` and promoted to `main` through a release PR. See [repository governance](docs/REPOSITORY_GOVERNANCE.md).

## Main routes

- `/`
- `/work/second-voice-ai`
- `/work/f24`
- `/work/leu`
- `/work/flow`
- `/work/mirror-ai`
- `/cv`
- `/story`
- `/portfolio.pdf`

## Stack

- Svelte 5 / SvelteKit
- TypeScript
- Tailwind CSS
- GSAP, Motion and Lenis
- Playwright
- Cloudflare Pages / Wrangler

## Repository map

See [repository architecture](docs/ARCHITECTURE.md) for ownership boundaries and [repository governance](docs/REPOSITORY_GOVERNANCE.md) for the release model.
