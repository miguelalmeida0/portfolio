# Miguel Almeida — Frontend & Design Engineering

**A portfolio of interactive systems, product interfaces and engineering decisions.** Built with Svelte 5, SvelteKit, TypeScript and Tailwind CSS.

[Visit the portfolio](https://miguelalmeida.xyz/) · [Deployment contract](DEPLOYMENT.md) · [Engineering guide](docs/README.md) · [Contributing](CONTRIBUTING.md)

## Selected work

| Project | What to inspect |
| --- | --- |
| [Needle](https://needle.miguelalmeida.xyz/) | Semantic artwork search over a prepared 10,000-work museum corpus, with a [case study](/work/needle) |
| [Second Voice](https://secondvoice-ai.vercel.app/second-voice) | Writing interactions, editorial typography and honest prepared-versus-live states |
| [Flow](https://miguelalmeida0.github.io/flow/) | Voice-driven actions in a directly editable personal computing workspace |
| [Leu](https://leu-desktop.vercel.app/) | Local-first reading and source-linked learning, with a separate native iOS implementation |
| F24 | Public-safe production engineering case study; private employer source and deployment are not linked |

Case studies live at `/work/needle`, `/work/second-voice-ai`, `/work/f24`, `/work/flow`, `/work/leu` and `/work/mirror-ai`. Supporting routes include `/cv`, `/story` and `/portfolio.pdf`. The Second Voice interaction distinguishes **prepared examples** from live inference; a demo state is never presented as a verified paid-provider response.

## Develop

Requires Node.js 22.12+ or Node.js 24+.

```bash
npm ci
npm run dev
```

The development server uses `http://localhost:4173`.

## Verify

```bash
npm run check
npm run test:unit
npm run test:routes
npm run test:dev-watch
npm run build
npm run e2e
```

The Playwright suite covers Chromium, Firefox and WebKit, including mobile profiles. **The commands above are the required checks, not a claim that they passed on this commit.** Read actual CI output and record skipped browser coverage.

## Code navigation

| Path | Responsibility |
| --- | --- |
| `src/routes/` | SvelteKit pages, data and navigation |
| `src/lib/components/experience/` | Portfolio surfaces, case-study entrypoints and selected-work interactions |
| `src/lib/case-studies/` | Project narratives and source-grounded engineering evidence |
| `src/lib/ask/` | Guided question planning and state |
| `src/lib/motion/` | Interaction choreography, reduced-motion behavior and cleanup |
| `tests/unit/`, `tests/routes/`, `tests/e2e/` | Deterministic and browser regression coverage |
| `static/` | Published fonts, project footage and downloadable files |
| `scripts/` | Release, quality checks and media utilities |

For source-of-truth deployment and CV handling, read [`DEPLOYMENT.md`](DEPLOYMENT.md) and [`RECOVERY.md`](RECOVERY.md) **before publishing**. Do not regenerate the preserved CV PDF or deploy an older local checkout over production. [Documentation index](docs/README.md) separates active contracts from historical design records.

## Scope

Films and screenshots demonstrate recorded interactions, not current third-party service availability. F24 examples are intentionally bounded to publicly shareable decisions and outcomes. Source references and prepared examples are labeled where they differ from production behavior.

Maintained by [Miguel Almeida](https://github.com/miguelalmeida0).
