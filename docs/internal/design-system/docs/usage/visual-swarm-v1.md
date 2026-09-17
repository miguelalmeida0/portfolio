# Visual Swarm v1

Visual Swarm v1 creates five local instruction agents for moving Miguel Design OS closer to "Lovable inside the repo" without paid tools or external model calls.

The swarm is not a Studio UI and not a screenshot-to-code system. It is a local workflow made of Markdown agents, schemas, templates, and CLI routing.

Weekend Visual Engine v1 adds the local scripts and preview app that give these agents real outputs.

## Flow

1. Inspiration Scout collects references.
2. Art Direction Concept Agent creates 3 rendered visual concepts.
3. Migi approves one rendered concept.
4. Literal Target Copy Agent reconstructs the target if exact copy mode is requested.
5. Visual QA Anti-Slop Agent blocks fake done reports.
6. Productionizer Agent adds interactions only after the visual shell passes.

## Agent Commands

```sh
node tools/design-os.mjs list-agents
node tools/design-os.mjs route-agent --task "Build a cinematic robot character selection app from Pinterest inspiration and a Lovable target"
```

Embedded:

```sh
node docs/internal/design-system/tools/design-os.mjs list-agents
node docs/internal/design-system/tools/design-os.mjs route-agent --task "Build a cinematic robot character selection app from Pinterest inspiration and a Lovable target"
```

## Agent Outputs

### Inspiration Scout

- `inspiration-manifest.local.json`
- local screenshots under `inspiration-library/screenshots/`
- validated inspiration queue from `tools/validate-inspiration-queue.mjs`
- top references, composition patterns, and anti-patterns

### Art Direction Concept Agent

- `visual-concepts.local.json`
- preview routes or static preview HTML
- screenshots at `1440 / 768 / 390`
- local capture via `tools/capture-concepts.mjs`
- approval status pending until Migi chooses

### Literal Target Copy Agent

- `target-copy-report.local.json`
- target/current screenshots
- screenshot comparison report from `tools/compare-screenshots.mjs`
- exact differences
- remaining mismatches

### Visual QA Anti-Slop Agent

- `screenshot-report.local.json`
- `done-report.local.json`
- visual QA markdown report
- visual QA report from `tools/visual-qa.mjs`
- object-swap report from `tools/object-swap-check.mjs` when applicable
- blockers list
- scorecard result

### Productionizer Agent

- files changed
- architecture notes
- interaction checklist
- screenshot QA after product logic
- done report

## Weekend Commands

```sh
node tools/new-inspiration-queue.mjs
node tools/validate-inspiration-queue.mjs inspiration-library/queues/weekend-visual-corpus.queue.json
node tools/capture-concepts.mjs --url http://localhost:5174
node tools/compare-screenshots.mjs --target path/to/target.png --current path/to/current.png --name robotstack-roster
node tools/visual-qa.mjs --url http://localhost:5173 --name robotstack-roster
node tools/object-swap-check.mjs --url http://localhost:5173 --objects "Atlas,Neo,Phoenix,Digit,Figure" --name robotstack-roster
```

## Hard Rules

- No done without evidence.
- Build/lint is not visual QA.
- Text-only concepts fail.
- Visual target screenshots are evidence, not production assets.
- Literal Target Copy Mode requires a target-copy report.
- Production image-led work requires an asset manifest.
- Screenshots are local by default.
- No paid tools, API keys, hosted Lovable, screenshot-to-code generation, Onlook hosted usage, or external model calls.

## Evidence Checklist

Before final handoff on visual work, verify:

- inspiration manifest exists for visual-heavy work
- rendered concepts exist when the Visual Concept Gate applies
- target-copy report exists when Literal Target Copy Mode applies
- asset manifest exists when production imagery is used
- comparison report exists when Literal Target Copy Mode applies
- screenshot report exists
- visual QA report exists
- done report validates
- scorecard caps are applied
