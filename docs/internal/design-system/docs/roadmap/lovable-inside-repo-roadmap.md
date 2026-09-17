# Lovable Inside The Repo Roadmap

Roadmap date: 2026-07-01

Goal: make Miguel Design OS produce local, inspectable visual artifacts so agents cannot fake Lovable-level progress with prose, build passes, or shallow screenshots.

Policy: all P0 and P1 items are free/local unless explicitly marked otherwise. No API keys, no hosted Lovable, no screenshot-to-code generation, no Onlook hosted usage, and no external model calls.

## Priority Summary

P0 means immediately necessary. These upgrades stop false success.

P1 means next power layer. These upgrades make the workflow feel like a visual product instead of a document bundle.

P2 means product/viral layer. These upgrades help reuse, demo, and spread the system.

## 1. P0 - Visual QA Harness

Why it matters: Agents keep claiming quality from build/lint success. A harness makes visual evidence mandatory and repeatable.

Files/folders required:

- `tools/visual-qa.mjs`
- `schemas/visual-qa-report.schema.json`
- `templates/visual-qa-report.template.json`
- `docs/qa-runs/README.md`
- `docs/qa-runs/.gitkeep`
- update `skills/screenshot-scorecard-review/SKILL.md`
- update `tools/design-os.mjs`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Runs Playwright against a URL.
- Captures 390, 768, and 1440 screenshots.
- Runs horizontal overflow check.
- Runs overlap heuristic.
- Records screenshot paths and failures in JSON.
- Exits nonzero when required screenshots are missing or hard checks fail.
- Writes a Markdown summary suitable for final handoff.

Estimated effort: 1 to 2 days.

Blocker risk: medium. Playwright availability differs by host project, but the existing scripts already prove the approach.

## 2. P0 - Asset Hygiene Manifest

Why it matters: Robot Skill Forge exposed copied watermarks, bad crops, and unclear target/reference asset boundaries.

Files/folders required:

- `schemas/asset-manifest.schema.json`
- `templates/asset-manifest.template.json`
- `tools/validate-assets.mjs`
- `docs/assets/README.md`
- update `skills/visual-target-reconstruction/SKILL.md`
- update `design-dna/new-app-generation-rules.md`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Every visual-heavy project has an asset manifest.
- Each asset includes path, role, source, usage note, watermark-free status, crop/focal point note, and placeholder status.
- Validator fails if a target screenshot is marked as a production asset.
- Validator flags repeated primary assets and missing source notes.

Estimated effort: 1 day.

Blocker risk: low. The first version can be manifest validation plus manual checklist fields.

## 3. P0 - Target Copy Checklist

Why it matters: Literal Target Copy Mode needs artifact enforcement, not just prose.

Files/folders required:

- `schemas/target-copy-report.schema.json`
- `templates/target-copy-report.template.json`
- `tools/validate-target-copy.mjs`
- update `skills/visual-target-reconstruction/SKILL.md`
- update `evaluation/ui-scorecard.md`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Report requires target screens, excluded artifacts, static shell screenshot, minimum interactions, current screenshots, exact differences, and remaining mismatches.
- Validator fails when exact differences are empty.
- Validator fails when product features are added before shell approval.
- Final handoff must reference the report when Literal Target Copy Mode is active.

Estimated effort: 1 day.

Blocker risk: low. This is mostly schema, template, CLI validation, and skill wiring.

## 4. P0 - Object Swap Invariance Test

Why it matters: Image-led cards can pass with one asset and fail with another crop, silhouette, or aspect ratio.

Files/folders required:

- `tools/object-swap-check.mjs`
- `schemas/object-swap-report.schema.json`
- `templates/object-swap-report.template.json`
- `docs/object-swap/README.md`
- update `skills/selection-first-products/SKILL.md`

Free/local or paid-risk: free/local.

Acceptance criteria:

- For repeated visual objects, test at least 3 asset aspect/crop variants.
- Capture before/after or variant screenshots at 390, 768, and 1440 when feasible.
- Report flags cut-off focal objects, layout shifts, overflow, and overlap.
- Selection-first projects cannot be marked done without either passing or documenting why object swap does not apply.

Estimated effort: 2 to 3 days.

Blocker risk: medium-high. Automated focal-point detection can start manual, but true crop quality detection is harder.

## 5. P0 - Done Report Schema

Why it matters: Agents can still end with confident prose while evidence is missing.

Files/folders required:

- `schemas/done-report.schema.json`
- `templates/done-report.template.json`
- `tools/validate-done-report.mjs`
- update `AGENTS.md`
- update `evaluation/ui-scorecard.md`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Final report must reference brief, concepts, approval, screenshots, QA report, asset manifest, scorecard, blockers, and patch status when applicable.
- Validator fails if required evidence is missing for the task type.
- Validator explicitly distinguishes build/lint pass from visual QA pass.
- Final response cannot honestly say done unless the done report validates.

Estimated effort: 1 day.

Blocker risk: low-medium. The schema is easy; adoption requires updating skills and handoff habits.

## 6. P1 - Local Visual Concept Preview App

Why it matters: The Visual Concept Gate still depends on agents making real previews. A local app gives them a place to render concepts before implementation.

Files/folders required:

- `studio-preview/`
- `studio-preview/src/concepts/`
- `studio-preview/src/templates/selection-first.tsx`
- `studio-preview/src/templates/cinematic-stage.tsx`
- `studio-preview/src/templates/product-dashboard.tsx`
- `studio-preview/src/templates/editorial-portfolio.tsx`
- `studio-preview/src/templates/research-terminal.tsx`
- `studio-preview/src/templates/social-app.tsx`
- `studio-preview/src/templates/commerce.tsx`
- `studio-preview/src/templates/tool-workbench.tsx`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Renders 3 concept slots locally.
- Each slot can be screenshotted at 390, 768, and 1440.
- Concepts are visually distinct templates, not just copy changes.
- Output paths map back into `visual-concepts.local.json`.

Estimated effort: 3 to 5 days.

Blocker risk: medium. The challenge is making templates strong enough to improve behavior without becoming generic.

## 7. P1 - Screenshot Comparison Report

Why it matters: Screenshot files are not enough. The system needs target/current comparison fields and diff artifacts.

Files/folders required:

- `tools/compare-screenshots.mjs`
- `schemas/screenshot-comparison-report.schema.json`
- `templates/screenshot-comparison-report.template.json`
- `docs/comparisons/README.md`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Accepts target and current screenshots for 390, 768, and 1440.
- Emits side-by-side contact sheets.
- Calculates basic image dimensions and pixel-diff percentage where dimensions match.
- Requires manual notes for composition, focal object, crop, hidden information, and unrelated UI.
- Blocks done when comparison report is missing for target reconstruction.

Estimated effort: 2 to 4 days.

Blocker risk: medium. Pixel diff is easy; meaningful composition judgment remains manual in v1.

## 8. P1 - Design OS Studio Prototype

Why it matters: A visual workflow needs a visual control surface. Markdown and CLI alone keep too much hidden in agent narration.

Files/folders required:

- `studio/`
- `studio/src/routes/brief`
- `studio/src/routes/inspiration`
- `studio/src/routes/concepts`
- `studio/src/routes/approval`
- `studio/src/routes/qa`
- `studio/src/routes/scorecard`
- `studio/data/`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Local app can create/load a design brief.
- Uploads or references inspiration paths.
- Shows 3 concept slots and screenshot status.
- Records approved concept.
- Shows QA runs and scorecard blockers.
- Exports or calls prompt compiler.

Estimated effort: 5 to 8 days for prototype.

Blocker risk: medium-high. It is product work, not just validation scripts.

## 9. P1 - Prompt Compiler v2

Why it matters: The current compiler is useful but narrow. It should compile from all approved artifacts and task modes.

Files/folders required:

- update `tools/design-os.mjs`
- `templates/prompts/codex-new-app.md`
- `templates/prompts/codex-target-copy.md`
- `templates/prompts/codex-qa-fix.md`
- `schemas/compiled-prompt-manifest.schema.json`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Supports visual concept implementation prompts.
- Supports Literal Target Copy Mode prompts.
- Supports QA patch prompts.
- Includes only routed skills and required files.
- Includes evidence paths and protected folders.
- Refuses to compile implementation prompt without approved concept or target-copy shell report where required.

Estimated effort: 2 to 3 days.

Blocker risk: medium. The behavior must avoid dumping the whole repo into every prompt.

## 10. P2 - Public Demo / Viral Site

Why it matters: Miguel Design OS will be easier to understand if people can see the proof loop: brief, concepts, screenshots, QA, scorecard, patch.

Files/folders required:

- `demo-site/`
- `demo-site/content/`
- `demo-site/public/examples/`
- `docs/demo-script.md`

Free/local or paid-risk: paid-risk if hosted publicly; free/local if static site remains local.

Acceptance criteria:

- Shows one end-to-end example with before/after screenshots.
- Shows how Design OS catches failures that normal build/lint misses.
- Explains no-paid-tools local path.
- Includes a short demo script.

Estimated effort: 3 to 5 days.

Blocker risk: medium. Needs polished artifacts from P0/P1 to be credible.

## 11. P2 - Reusable Project Template

Why it matters: Embedded `docs/internal/design-system` support is stronger when every new project starts with the same local workflow folders.

Files/folders required:

- `templates/project-template/`
- `templates/project-template/docs/internal/design-system/README.md`
- `templates/project-template/docs/design/`
- `templates/project-template/docs/qa-runs/`
- `tools/create-project-template.mjs`

Free/local or paid-risk: free/local.

Acceptance criteria:

- Creates a target project skeleton with `docs/internal/design-system` usage documented.
- Includes local folders for briefs, concepts, assets, QA runs, screenshots, and done reports.
- Includes npm scripts or shell commands for common Design OS checks.
- Does not copy protected evidence folders.

Estimated effort: 2 to 4 days.

Blocker risk: low-medium. Main risk is keeping template paths in sync with CLI behavior.

## 12. P2 - Visual Memory Gallery

Why it matters: Rules are weaker than visual examples. A gallery gives future agents and Migi a browseable memory of approved and rejected outcomes.

Files/folders required:

- `visual-memory/`
- `visual-memory/index.json`
- `visual-memory/approved/`
- `visual-memory/rejected/`
- `schemas/visual-memory-item.schema.json`
- `tools/validate-visual-memory.mjs`

Free/local or paid-risk: free/local for local gallery; paid-risk only if hosted.

Acceptance criteria:

- Each item includes screenshot, project, task type, tags, approval status, reason, reusable lesson, and non-copy boundary.
- Includes at least 5 approved and 5 rejected entries before being used as official evidence.
- Agents can reference gallery entries by id.
- Gallery states whether an entry is evidence, target, or forbidden direction.

Estimated effort: 3 to 6 days depending on asset preparation.

Blocker risk: medium. The gallery only helps if entries are visually curated, not dumped.

## P0 ETA

The P0 package is realistic in 6 to 9 focused engineering days:

- Visual QA Harness: 1 to 2 days
- Asset Hygiene Manifest: 1 day
- Target Copy Checklist: 1 day
- Object Swap Invariance Test: 2 to 3 days
- Done Report Schema: 1 day

Parallelized or implemented roughly, the first usable P0 could exist in 3 to 5 days. A version that agents actually follow should be budgeted closer to 1 to 2 weeks because the skills, scorecard, CLI, and docs all need to agree.

## Free/Local Confirmation

All P0 upgrades can be done free/local.

All P1 upgrades can be done free/local.

P2 public demo can stay free/local as a static local site, but public hosting is paid-risk depending on deployment choice.

No P0 or P1 item requires API keys, hosted Lovable, screenshot-to-code generation, Onlook hosted usage, or external model calls.

## Build Order Recommendation

Build the P0s in this order:

1. Done Report Schema
2. Target Copy Checklist
3. Asset Hygiene Manifest
4. Visual QA Harness
5. Object Swap Invariance Test

Then build P1s in this order:

1. Screenshot Comparison Report
2. Prompt Compiler v2
3. Local Visual Concept Preview App
4. Design OS Studio Prototype

Reason: the fastest leverage is not more design advice. It is making missing evidence visible and making false completion embarrassing.

