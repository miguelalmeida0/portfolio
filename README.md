# Miguel Almeida — Portfolio

Frontend developer and design engineer portfolio built with Svelte 5, SvelteKit, TypeScript and Tailwind CSS.

The homepage pairs an inspectable Second Voice writing demo with F24 production work and Flow’s validated calendar actions. Leu adds native work; Mirror remains in the case-study archive. The demo uses labelled prepared examples and preserves the original draft. The F24 case explains a progressive Svelte-to-React evolution and a bounded activity-history contribution.

## Run locally

Requires Node.js 22.12+ or Node.js 24+.

```bash
npm ci
npm run dev
```

Local development runs at `http://localhost:4173`.

## Quality checks

```bash
npm run check
npm run test:unit
npm run build
npm run test:routes
npm run test:dev-watch
npm run e2e
```

The Playwright suite is configured for Chromium, Firefox and WebKit across desktop and mobile profiles. Configuration is not a passing run; current results and limits are recorded in [the implementation report](artifacts/recruiter-audit-implementation/README.md).

## Where to inspect the engineering

- `src/lib/components/experience/F24Proof.svelte`: public-safe production decision and contribution boundaries.
- `src/lib/components/experience/EngineeringEvidence.svelte`: immutable public source/test references and version limits.
- `src/lib/components/experience/Studio.svelte`: selected versus submitted settings, prior-result preservation and prepared/live state.
- `src/lib/experience/text-diff.ts` and `tests/unit/text-diff.test.mjs`: bounded comparison and exact-text reconstruction.
- `src/lib/motion/routeTransition.ts`: navigation ownership, cleanup and history behavior; focused regression tests live under `tests/unit` and `tests/e2e`.

The public Second Voice app opened during this pass, but its sample generation returned “Request blocked.” The prepared portfolio interaction works independently. Films do not certify live provider, microphone or native-release behavior. Employer implementation remains private. The downloaded CV has an older project selection; see the amendment plan in the implementation artifacts.

## Main routes

- `/`
- `/work/second-voice-ai`
- `/work/f24`
- `/work/flow`
- `/work/leu`
- `/work/mirror-ai`
- `/cv`
- `/story`
- `/portfolio.pdf`

## Stack

- Svelte 5
- SvelteKit
- TypeScript
- Tailwind CSS
- Playwright
- Cloudflare Pages adapter
