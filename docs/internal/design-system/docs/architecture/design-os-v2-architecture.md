# Miguel Design OS V2 Architecture

Goal: a local, routed, artifact-driven AI frontend/design operating system that future agents can use with minimal context bloat and maximum visual accountability.

## Proposed File Structure

```txt
design-os/
  AGENTS.md
  README.md
  system.md
  design-system.json

  skills/
    README.md
    visual-concept-gate/
      SKILL.md
    visual-target-reconstruction/
      SKILL.md
    selection-first-products/
      SKILL.md
    anti-ai-slop-review/
      SKILL.md
    screenshot-scorecard-review/
      SKILL.md
    frontend-art-director-review/
      SKILL.md
    tailwind-migration-zero-regression/
      SKILL.md
    truthful-state-product-naming/
      SKILL.md

  design-dna/
    00_COMPACT_AGENT_CONTEXT.md
    principles/
    anti-patterns/
    archetypes/
    copy/
    responsive/
    approved-directions.md
    rejected-directions.md

  evaluation/
    ui-scorecard.md
    ui-scorecard.json
    score-caps.json

  workflows/
    generate-new-app.md
    review-ui.md
    fix-until-elite.md
    ingest-project.md
    visual-target-reconstruction.md

  schemas/
    task-intake.schema.json
    design-brief-contract.schema.json
    concept.schema.json
    inspiration-analysis.schema.json
    identity-packet.schema.json
    screenshot-report.schema.json
    scorecard-report.schema.json
    gallery-item.schema.json
    handoff.schema.json

  tools/
    route-skills.mjs
    validate-brief.mjs
    validate-concepts.mjs
    compile-context-packet.mjs
    compile-prompt.mjs
    migi-taste-linter.mjs
    anti-slop-detector.mjs

  screenshot-harness/
    README.md
    baseline/
    targets/
    current/
    diff/
    reports/

  approved-gallery/
    README.md
    items/
    index.json

  rejected-gallery/
    README.md
    items/
    index.json

  prompts/
    codex-new-app.md
    codex-redesign.md
    codex-visual-target.md
    lovable-to-codex-bridge.md
    v0-shell.md
    bolt-shell.md

  examples/
    concepts/
    inspiration-analyses/
    screenshot-reports/
    scorecards/
    demo-projects/

  studio-app/
    README.md
    package.json
    src/

  cli/
    README.md
    miguel-design-os.mjs

  audits/
    design-os-current-state-audit.md
```

## Folder Responsibilities

### Root

Purpose:

- Entry points and canonical system metadata.

Instruction-only:

- `AGENTS.md`
- `README.md`
- `system.md`

Machine-readable:

- `design-system.json`

### `skills/`

Purpose:

- Narrow, trigger-specific instruction files.

Instruction-only:

- All `SKILL.md` files.

Rules:

- No scripts inside skills.
- No external dependencies required by skills.
- No paid tools without Migi approval.
- Do not load all skills.

### `design-dna/`

Purpose:

- Persistent taste memory and reusable principles.

Instruction-only:

- Markdown rules, anti-patterns, archetypes, copy rules, responsive rules.

V2 change:

- Split large files into subfolders by purpose so agents can load only relevant sections.
- Keep `00_COMPACT_AGENT_CONTEXT.md` short.

### `evaluation/`

Purpose:

- Scorecards and score caps.

Instruction-only:

- `ui-scorecard.md`

Machine-readable:

- `ui-scorecard.json`
- `score-caps.json`

V2 change:

- Scorecard should become both human-readable and machine-readable.

### `workflows/`

Purpose:

- Human-readable process docs for repeated loops.

Instruction-only:

- Workflow Markdown.

V2 change:

- Rename from `agent-workflows/` to `workflows/` or keep alias.
- Workflows should route to skills, not duplicate skill content.

### `schemas/`

Purpose:

- Contracts for artifacts.

Executable:

- None directly.

Free/local:

- JSON Schema validation only.

V2 value:

- Makes gates enforceable without paid APIs.

### `tools/`

Purpose:

- Local helper scripts for routing, validation, report generation, prompt compilation, linting, and anti-slop checks.

Executable:

- Local Node scripts.

Must remain free/local:

- Default tools must not call paid APIs, hosted AI tools, or external SaaS.

Optional paid integrations:

- Allowed only behind explicit approval prompts and separate adapters.

### `screenshot-harness/`

Purpose:

- Standard screenshot evidence and visual regression loop.

Executable:

- Local capture/diff scripts may write here.

Free/local:

- Playwright/local browser when available.
- Manual screenshot placement when automation is unavailable.

Folders:

- `baseline/`: pre-change screenshots.
- `targets/`: inspiration/visual target screenshots.
- `current/`: current UI captures.
- `diff/`: generated comparison assets.
- `reports/`: Markdown/JSON reviews.

### `approved-gallery/`

Purpose:

- Visual taste memory for approved directions.

Contents:

- Screenshots, metadata, product type, why approved, reusable principle, non-copy rule.

Instruction-only:

- README and metadata.

Executable:

- None.

### `rejected-gallery/`

Purpose:

- Visual memory of rejected directions and why they failed.

Contents:

- Screenshots, rejection reason, scope, anti-pattern tags, correction.

Critical rule:

- Rejections are scoped. Do not globalize unless the lesson is explicitly universal.

### `prompts/`

Purpose:

- Prompt templates for agents and visual builders.

Instruction-only:

- Prompt templates.

Optional external:

- Running prompts in Lovable, v0, Bolt, OpenAI, Anthropic, Gemini, Replicate, or similar requires Migi approval if paid/API/hosted.

### `examples/`

Purpose:

- Concrete examples of good artifacts.

Contents:

- Concept sets.
- Inspiration analyses.
- Screenshot reports.
- Scorecard reports.
- Demo projects.

### `studio-app/`

Purpose:

- Optional local UI for intake, concept approval, reference review, screenshot review, and handoff.

Executable:

- Local app only by default.

Free/local:

- Must run without paid services.

Optional external:

- Paid/hosted model or builder integrations only with Migi approval.

### `cli/`

Purpose:

- One command for local OS workflows.

Example commands:

```txt
mdo route task.json
mdo validate brief docs/projects/x/brief.json
mdo concept-check docs/projects/x/concepts.json
mdo screenshot-report http://localhost:3000 docs/projects/x/screens
mdo prompt codex-new-app docs/projects/x
```

Free/local:

- Default commands must not call external services.

### `audits/`

Purpose:

- Periodic architecture and quality audits.

Instruction-only:

- Markdown reports.

## Canonical Flow In V2

1. User starts a task.
2. `AGENTS.md` routes to skills.
3. `tools/route-skills.mjs` optionally confirms route.
4. Agent creates `docs/projects/[project]/brief.json`.
5. `validate-brief.mjs` checks Design Brief Contract.
6. Visual-heavy work creates `concepts.json` and `concepts.md`.
7. Migi approves one concept.
8. Agent builds visual shell.
9. Screenshot harness captures `390 / 768 / 1440`.
10. Screenshot Critic creates report and scorecard.
11. Agent patches blockers.
12. Final handoff includes artifacts, not just claims.

## Instruction-Only Vs Executable

Instruction-only:

- `AGENTS.md`
- `README.md`
- `system.md`
- `skills/`
- `design-dna/`
- `rules/`
- `workflows/`
- `prompts/`
- `audits/`

Executable/local:

- `tools/`
- `cli/`
- `screenshot-harness/` scripts
- `studio-app/`

Machine-readable contracts:

- `schemas/`
- `design-system.json`
- `evaluation/*.json`
- `approved-gallery/index.json`
- `rejected-gallery/index.json`

## Free/Local Boundary

Must remain free/local by default:

- skill routing
- brief validation
- concept validation
- prompt compilation
- screenshot file organization
- local browser capture when dependencies exist
- local static checks
- report generation

Requires explicit approval:

- paid APIs
- model provider keys
- hosted AI tools
- external SaaS services
- paid visual builders
- cloud deployment
- uploading private screenshots or source code to any external service

## Core Architecture Bet

The winning design is not more Markdown. The winning design is:

- small router
- narrow skills
- structured artifacts
- local checks
- screenshot evidence
- score caps
- approval gates
- visual memory gallery
- prompt compiler

That makes the system feel like a product while staying repo-local.
