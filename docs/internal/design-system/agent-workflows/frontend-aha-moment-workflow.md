# Frontend Aha Moment Workflow

Use when building a new product UI, MVP shell, demo, or dogfood target.

## Goal

Make the first local frontend version feel like a real product teaser before backend work begins.

## Rules

- Local/mock data is allowed.
- Mock data must be truthful, clearly scoped, domain-specific, and plausible for the business.
- Mock data belongs in dedicated files such as `data/mock.ts`, `data/mock.js`, or `src/data/mock-*`, not buried in components.
- Before implementation, define a Domain Content Contract: business type, users, core entities, real pages/routes, route jobs, mock data schema, realistic records, units/ranges/statuses/source labels, and banned generic terms.
- Every visible interaction must work locally.
- No backend until the frontend loop is compelling unless Migi explicitly requests backend first.
- Stop and ask before backend if backend was not requested.
- The first version must prove the product loop, not just the visual shell.
- For landing, portfolio, or marketing MVPs, the first version must pass anti-AI-tell preflight before extra sections are added.
- For motion-heavy MVPs, the first version must define a motion purpose and reduced-motion behavior.
- If the frontend aha moment depends on real photography, source images through `skills/unsplash-asset-sourcing/SKILL.md` before implementation.
- Real images need roles, source metadata, alt text, crop strategy, palette relationship, and product-truth notes.

## Frontend Aha Loop

1. Identify the main local loop.
2. Define the Domain Content Contract.
3. Define the mock data and where it lives.
3. Define image roles and source plan when real imagery is part of the loop or visual promise.
4. Build only the frontend surface needed to prove the loop.
5. Make all visible controls work locally.
6. Add local persistence only if truthfully represented.
7. Generate or export a useful local artifact when the product implies output.
8. Screenshot QA.
9. Report what is mock, what works locally, and what backend would replace.

## Interaction Proof

Before handoff, verify:

- primary CTA
- selection
- filters/search
- form submit
- export/copy/download if visible
- local state changes
- empty/loading/error states

## Blockers

- visible dead button
- mock data hidden inside component body
- mock data uses random values, abstract metrics, generic sections, or unjustified `mission control` / `topology` / `traces` labels
- no Domain Content Contract for a product UI
- backend implied but not implemented
- "live" or "AI" claims with no local truth
- no core-loop proof
- real-image promise with no image source/manifest
- stock imagery used as factual product proof
- frontend looks good but product loop is hollow
