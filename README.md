# Miguel Almeida — Portfolio

**Frontend engineer building ambitious interactive systems across voice, AI, operational data, native learning, and design tooling.**

<p align="center">
  <img src="./docs/readme/previews/desktop-viewport.png" alt="Portfolio — desktop viewport excerpt" width="960">
</p>

**Live:** https://miguelalmeida.is-a.dev

This repository is the engineering layer behind my portfolio. The site is deliberately closer to an editorial product story than a generic project-card grid: the work is presented through interaction, technical decisions, constraints, and verifiable artifacts.

## Selected work

The portfolio brings together work across:

- **voice-first interaction** and conversational state;
- **crisis intelligence** and geospatial operational interfaces;
- **native iOS learning** and document interaction;
- **local-first multimodal UI**;
- **design systems and AI-agent tooling**;
- production frontend architecture, performance, accessibility and QA.

## Experience flow

```mermaid
flowchart LR
    A[Landing] --> B[Selected work]
    B --> C[Project story]
    C --> D[Technical decisions]
    D --> E[Evidence / constraints]
    E --> F[Contact / CV]
```

## Stack

- SvelteKit 2 / Svelte 5
- TypeScript
- Tailwind CSS 4
- Vite
- Cloudflare Pages / Functions
- Playwright
- server-generated PDF CV

## Architecture

```text
src/lib/content/
├── folio.ts                 profile / experience / navigation
├── case-studies.ts          typed project narratives + claim status
└── project-media.ts         approved visual assets

src/lib/components/
└── case-study/              reusable editorial presentation

src/routes/
├── work/[slug]/             project case studies
├── api/miguel-llm/          bounded server-side assistant route
└── cv / portfolio.pdf       shared resume output

docs/qa/                     visual + production verification
```

## Claim discipline

Project claims carry explicit status instead of being flattened into marketing language:

- verified;
- partial;
- historical;
- synthetic;
- proposed;
- not implemented.

That matters because several projects involve AI, perception, or operational systems where a polished UI can otherwise imply more certainty than the implementation supports.

## Responsive preview

The desktop preview above and the phone excerpt below are shown separately. Each is cropped to one viewport; the original full-page captures are retained.

<details>
<summary>View the mobile viewport</summary>

<p align="center">
  <img src="./docs/readme/previews/mobile-viewport.png" alt="Portfolio — mobile viewport excerpt" width="360">
</p>

</details>

[Capture provenance](./docs/readme/previews/PROVENANCE.json)

## Engineering priorities

### Performance

Offscreen media is lazy, client work is bounded, layouts are designed to avoid horizontal overflow, and visual QA is separated from production runtime artifacts.

### Accessibility

The implementation targets semantic landmarks, keyboard-operable navigation/dialogs, visible focus, useful touch targets, reduced-motion behavior, and readable supporting text.

### Security

Provider secrets remain server-side. Public AI-assisted surfaces use bounded input/output, rate limiting, and deterministic fallbacks rather than exposing provider credentials in the browser.

### Content architecture

Case studies are structured data instead of scattered page copy, allowing the web portfolio and PDF/CV surfaces to share factual source material.

## Run locally

```bash
git clone https://github.com/miguelalmeida0/portfolio-new.git
cd portfolio-new
git checkout portfolio
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
npm run e2e
```

## A note on professional work

F24 appears as professional experience, not as a fabricated public case study. Private employer implementation details, customer information, screenshots, and internal metrics are intentionally excluded.

---

Designed and built by [Miguel Almeida](https://github.com/miguelalmeida0).

[Repository guide](./docs/START_HERE.md)

<!-- repository-presentation-repair:1 -->
