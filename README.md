# Miguel Almeida Portfolio

A Svelte 5 / SvelteKit portfolio for Miguel Almeida, a frontend engineer working across production product UI, design systems, browser architecture, reliability, and experimental multimodal interfaces.

The site is intentionally editorial rather than a generic project grid. Camera Harness is the flagship engineering case study; Ghostwriter, Atlas, Creature App, and Mirror AI provide supporting reliability, architecture, interaction, and evidence stories. F24 appears as factual professional context, including production Svelte work and ongoing React delivery, rather than a fabricated company case study.

## Svelte implementation

This repository is also an inspectable Svelte project, not only a container for portfolio content. The current application uses Svelte 5 components and SvelteKit routing/server endpoints across the homepage, CV, case studies, motion layer, and MiguelLLM interface.

## Stack

- SvelteKit 2 and Svelte 5
- TypeScript
- Tailwind CSS 4 plus component-scoped CSS
- Vite
- Cloudflare adapter and Pages Functions
- Playwright
- Server-generated PDF resume

## Local Development

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

The development server uses a strict, explicit address:

```text
http://127.0.0.1:3010
```

Useful commands:

```bash
npm run lint
npm run build
npm run e2e
npm run preview
npm run qa:capture-revamp
```

`qa:capture-revamp` expects the production preview on port `4173` and writes the revamp screenshots and before/after comparisons under `docs/qa/screenshots/portfolio-content-revamp-2026-09-05/`.

## Hero Animation

The homepage uses `@shadergradient/react` for slow red folds drawn from the existing hero palette. A lazy React island owns only the decorative WebGL canvas; routing, content, and interactions remain Svelte. The preset lives in `src/lib/graphics/hero-gradient/preset.ts`, and the colours live beside the existing tokens in `src/app.css`.

`HeroGradient.svelte` follows the shared motion policy. It skips the renderer for reduced motion and Save-Data, pauses GPU rendering offscreen or in a hidden tab, and releases the canvas on navigation. A static red/black composition remains available during loading, without JavaScript, or after a WebGL failure. The renderer adds approximately 340 KB gzip, deferred until after the hero's initial paint; it uses local lighting without external HDR assets.

`tests/e2e/specs/hero-gradient.spec.ts` covers moving frames, offscreen GPU suspension, the persisted motion preference, Save-Data, context loss, and the mobile layout. Run it with `npm run e2e -- hero-gradient.spec.ts`.

## Project Structure

```text
src/lib/content/folio.ts              profile, navigation, experience, and resume content
src/lib/content/case-studies.ts       typed project and evidence records
src/lib/components/case-study/        reusable case-study presentation components
src/routes/work/[slug]/               all five project case studies
src/lib/content/project-media.ts      approved project media and homepage order
src/data/miguel-llm/                  approved retrieval knowledge
src/lib/miguel-llm/                   retrieval, fallback, guardrails, and response types
src/routes/api/miguel-llm/            provider-agnostic server route
src/lib/server/pdf.ts                  downloadable resume generator
docs/qa/                              verification notes and visual evidence
```

## Content And Evidence

`src/lib/content/case-studies.ts` is the authoritative public project source. Evidence is classified as:

- `verified`: supported by the current implementation or dossier.
- `partial`: implemented in part or missing broader validation.
- `historical`: retained evidence from an earlier commit or integration state.
- `synthetic`: deterministic test evidence, not live model quality.
- `proposed`: an architecture recommendation, not current behavior.
- `not-implemented`: explicitly outside the current product graph.

Optional fields are omitted when no sourced public claim exists. Do not render `TBD`, `Unknown`, empty metrics, unsupported adoption numbers, or promotional estimates.

To add a case study:

1. Add a typed record in `src/lib/content/case-studies.ts`.
2. Add only public-safe links and evidence.
3. Qualify every metric with source, environment, and limitations.
4. Use stable section IDs for evidence links.
5. Add a dedicated route only when the project needs a distinct narrative.

## MiguelLLM

MiguelLLM is an evidence-navigation interface, not a live persona or a local ML infrastructure demo. API keys never enter client code.

Provider order:

1. Cerebras when `CEREBRAS_API_KEY` exists.
2. OpenAI Responses API when `OPENAI_API_KEY` exists.
3. Deterministic local fallback.

Copy `.env.example` to `.env.local` and configure only the providers you intend to use:

```text
CEREBRAS_API_KEY=
OPENAI_API_KEY=
MIGUEL_LLM_PROVIDER=auto
MIGUEL_LLM_MODEL=
```

The interface limits questions per browser session. The server limits input length, retrieval chunks, output length, and request rate, and falls back to deterministic answers when a provider fails.

## Resume

`/cv` and `/portfolio.pdf` draw from the same experience and project content. The PDF prioritizes readable extraction and print layout. It is not claimed to be a fully tagged accessible PDF; that remains a documented limitation.

## Accessibility And Performance Goals

The implementation targets semantic landmarks, visible focus, keyboard-operable navigation and dialogs, reduced-motion support, useful touch targets, readable supporting text, responsive layouts without horizontal overflow, lazy offscreen media, and bounded client work.

These are implementation goals, not a claim of complete WCAG conformance. Record completed checks and remaining limitations in `docs/qa/`.

## Production

The canonical public URL is `https://miguelalmeida.is-a.dev`. Production builds use Node.js 22, `npm run build`, and the `.svelte-kit/cloudflare` output directory; Cloudflare Pages serves that artifact, while GitHub Actions validates release branches. Provider-generated hostnames are infrastructure only and are not the portfolio's public identity.

## Public Claim Rules

- Camera Harness is an experimental system, not a production-ready perception product.
- Current, historical, synthetic, and proposed behavior must remain visibly distinct.
- No private F24 implementation details, customer information, screenshots, or metrics are public.
- No private camera footage belongs in the Camera Harness case study.
- Project repository and demo links are shown only when public, functional, and safe.
- Public technical claims should trace to the Camera Harness dossier, a public repository artifact, or a documented portfolio source.
