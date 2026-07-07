# Design OS Extreme Power Roadmap

Goal: turn Miguel Design OS into a local AI frontend/design operating system that feels like "Lovable inside the repo" while staying personalized to Migi's taste, golden projects, screenshots, feedback history, and visual standards.

Principle: do not bloat docs. Convert taste into routed skills, structured artifacts, local checks, screenshot evidence, and approval gates.

## 1. Design OS Studio

What it does:

- Local UI for project intake, inspiration upload, concept review, screenshot review, scorecard, and final handoff.
- Guides Migi and agents through the Design Intent Record, Visual Concept Gate, reference analysis, screenshot capture, and patch loop.

Why it is powerful:

- Turns the OS from docs into a product surface.
- Makes approval and review visible.
- Creates a repeatable ritual for every new app.

Files/folders needed:

- `studio-app/`
- `schemas/brief.schema.json`
- `schemas/concept.schema.json`
- `schemas/review.schema.json`
- `approved-gallery/`
- `rejected-gallery/`
- `screenshot-harness/`

Free/local MVP:

- Static local Next/Vite app reading Markdown/JSON files from the repo.
- Manual upload/drop of screenshots into local folders.
- No external APIs.

External approval needed:

- Any hosted AI generation, image analysis API, cloud database, or paid visual builder.

MVP version:

- Intake form, skill router preview, concept template, screenshot report viewer, scorecard checklist.

Overpowered version:

- Drag in screenshots, auto-generate project packet, run local screenshot checks, compare target/current screenshots, emit Codex prompt and final report.

Risks:

- Building a UI before the data model is stable.
- Becoming another dashboard instead of a focused agent control room.
- Accidentally requiring paid model APIs.

## 2. Visual Concept Generator

What it does:

- Produces 3 radically different rendered art-direction concepts with preview screenshots before coding.
- Requires visual metaphor, composition, focal object, emotional hook, hidden information, absent elements, cliche avoidance, desire mechanism, and responsive strategy.
- Adds simple composition diagrams using text grids, Mermaid, or local SVG.

Why it is powerful:

- Forces actual art direction instead of component-first coding.
- Makes weak concept sets easier to reject.

Files/folders needed:

- `schemas/concept.schema.json`
- `prompts/visual-concept-generator.md`
- `examples/concepts/`
- `tools/validate-concept.mjs`

Free/local MVP:

- Markdown template and schema validator.

External approval needed:

- Any model-generated image concepts or paid AI ideation.

MVP version:

- Agent writes `docs/projects/[project]/concepts.md` and `concepts.json`; validator checks required fields.

Overpowered version:

- Studio displays side-by-side concepts with composition diagrams and approval buttons.

Risks:

- Concepts become formulaic.
- Agents produce 3 palette variants instead of 3 structural directions.

## 3. Inspiration Analyzer

What it does:

- Extracts composition, focal object, emotional hook, hidden information, absent elements, texture, material, motion, hierarchy, and interaction model from references.

Why it is powerful:

- Prevents reference flattening into dark/neon/cards/glow.
- Creates a reusable translation artifact before implementation.

Files/folders needed:

- `docs/inspiration/[project]/`
- `docs/projects/[project]/inspiration-analysis.md`
- `schemas/inspiration-analysis.schema.json`
- `examples/inspiration-analyses/`

Free/local MVP:

- Manual analysis template plus required fields.

External approval needed:

- Computer vision model calls, hosted image analysis, or screenshot-to-code services.

MVP version:

- Agent fills an analysis file and maps "copy / avoid / translate".

Overpowered version:

- Studio shows references next to extracted principles and final screenshot comparison.

Risks:

- Copyright or privacy issues if references are copied externally.
- Treating inspiration as a template instead of evidence.

## 4. Visual Target Reconstruction Loop

What it does:

- Given a screenshot target, forces the agent to build a static visual shell first, capture screenshots, compare against the target, patch, then add product logic.

Why it is powerful:

- Directly attacks the "same layout with new paint" failure.
- Creates a bridge from a strong visual target into production code.

Files/folders needed:

- `screenshot-harness/targets/[project]/`
- `screenshot-harness/current/[project]/`
- `screenshot-harness/reports/[project].md`
- `schemas/visual-comparison.schema.json`

Free/local MVP:

- Manual side-by-side screenshot report with required comparison fields.

External approval needed:

- Automated image similarity APIs, screenshot-to-code tools, or paid builders.

MVP version:

- Required static shell report before product logic.

Overpowered version:

- Local browser harness captures current UI and produces side-by-side diff pages.

Risks:

- Chasing pixel-perfect imitation instead of translating design mechanism.
- Underweighting accessibility and code quality.

## 5. Screenshot Critic

What it does:

- Takes `390 / 768 / 1440` screenshots and scores them against Miguel Design OS.
- Checks overlap, horizontal scroll, scale inflation, primary object/action, clickable/passive ambiguity, and scorecard caps.

Why it is powerful:

- Moves review from opinion to evidence.
- Gives agents a repeatable patch loop.

Files/folders needed:

- `screenshot-harness/`
- `tools/screenshot-critic.mjs`
- `schemas/screenshot-report.schema.json`
- `evaluation/ui-scorecard.json`

Free/local MVP:

- Use local Playwright when available and existing heuristic scripts.

External approval needed:

- Remote visual QA services or hosted screenshot analysis.

MVP version:

- Standard `reports/ui-review.md` generated from screenshots and scorecard.

Overpowered version:

- Studio annotates screenshots with blocker markers and before/after patch status.

Risks:

- Heuristics may false-positive overlap.
- Agents may optimize for checks instead of taste.

## 6. Anti-Slop Detector

What it does:

- Detects obvious theme literalism, same layout with new paint, AI scale inflation, purposeless motion, container soup, chip soup, CTA soup, badge soup, reference flattening, boring catalog when desire is needed, overlap/collision, and dead buttons.

Why it is powerful:

- Converts anti-pattern language into inspectable checks.

Files/folders needed:

- `tools/anti-slop-detector.mjs`
- `schemas/anti-slop-report.schema.json`
- `rules/anti-patterns.md`
- `evaluation/ui-scorecard.md`

Free/local MVP:

- Static grep/class heuristics and DOM checks for common patterns.

External approval needed:

- Model-based design critique or hosted code analysis APIs.

MVP version:

- CLI emits warnings for suspicious class patterns, dead-looking buttons, CTA density, excessive badges/chips, huge headings, and unsupported claim words.

Overpowered version:

- Combines DOM, screenshots, code, and scorecard into one anti-slop report.

Risks:

- Overfitting to class names.
- Penalizing legitimate dense tools.

## 7. Taste Memory Gallery

What it does:

- Stores approved and rejected screenshots with reasons, tags, product type, applicable scope, and lessons.

Why it is powerful:

- Gives agents visual memory instead of abstract prose.
- Makes Migi's taste legible across time.

Files/folders needed:

- `approved-gallery/`
- `rejected-gallery/`
- `schemas/gallery-item.schema.json`
- `docs/gallery-index.md`

Free/local MVP:

- Markdown index plus local screenshot files.

External approval needed:

- None unless using hosted storage or model tagging.

MVP version:

- Add 10-20 curated examples from current captures and rejected directions.

Overpowered version:

- Studio gallery filters by archetype, anti-pattern, mood, product type, and lesson.

Risks:

- Agents copy visuals literally.
- Gallery becomes stale without ingestion workflow.

## 8. Project-Specific Identity Compiler

What it does:

- Turns product type, audience, primary object, primary action, mood, references, and constraints into semantic tokens, art direction, layout rules, copy rules, and anti-patterns.

Why it is powerful:

- Solves the gap between "define identity" and implementable UI decisions.

Files/folders needed:

- `schemas/project-brief.schema.json`
- `schemas/identity-packet.schema.json`
- `prompts/identity-compiler.md`
- `docs/projects/[project]/identity-packet.md`

Free/local MVP:

- Agent-authored packet validated against schema.

External approval needed:

- Any external model call to generate identity automatically.

MVP version:

- Required identity packet before concept approval.

Overpowered version:

- Studio generates token suggestions, layout constraints, copy tone, and scorecard emphasis.

Risks:

- Identity packet becomes decorative if not tied to code and screenshots.

## 9. Agent Prompt Compiler

What it does:

- Generates exact prompts for Codex, Lovable, v0, Bolt, or another frontend agent based on selected skills, brief, concepts, references, and scorecard.

Why it is powerful:

- Turns Migi's repeated prompting burden into a local product primitive.

Files/folders needed:

- `prompts/codex-new-app.md`
- `prompts/codex-redesign.md`
- `prompts/lovable-visual-target.md`
- `prompts/v0-shell.md`
- `tools/compile-prompt.mjs`

Free/local MVP:

- Local template compiler that fills Markdown.

External approval needed:

- Running prompts in paid/hosted tools.

MVP version:

- Compile a Codex-ready prompt with selected skills and artifacts.

Overpowered version:

- Multi-agent prompt packs with distinct outputs: concept, shell, QA, patch loop.

Risks:

- Prompt output becomes too long.
- Tool-specific prompts drift from the canonical skills.

## 10. Skill Router

What it does:

- Automatically chooses SKILL.md files based on task type, references, screenshots, product category, and requested work.

Why it is powerful:

- Reduces context bloat and prevents agents from skipping required skills.

Files/folders needed:

- `schemas/task-intake.schema.json`
- `tools/route-skills.mjs`
- `skills/registry.json`

Free/local MVP:

- Local rule-based router.

External approval needed:

- None.

MVP version:

- Given a task JSON, outputs skill list and files to read.

Overpowered version:

- Integrated in Studio and prompt compiler; creates a minimal context packet.

Risks:

- Router grows into hidden complexity.
- Bad classification routes wrong skills.

## 11. Visual Regression Harness

What it does:

- Stores baseline/current screenshots and compares before/after for redesigns, migrations, and bug fixes.

Why it is powerful:

- Makes Tailwind migration and patch loops safer.

Files/folders needed:

- `screenshot-harness/baseline/`
- `screenshot-harness/current/`
- `screenshot-harness/diff/`
- `screenshot-harness/reports/`

Free/local MVP:

- Playwright screenshots plus manual diff report.

External approval needed:

- Hosted visual regression SaaS.

MVP version:

- Capture current screenshots and require before/after report.

Overpowered version:

- Pixel diff plus DOM checks plus scorecard caps.

Risks:

- Pixel diffs can punish intentional redesign.

## 12. Lovable-to-Codex Bridge

What it does:

- Uses a Lovable screenshot as a visual target, then Codex reconstructs the static shell locally and productionizes it.

Why it is powerful:

- Combines fast visual ideation with stronger local code control.

Files/folders needed:

- `prompts/lovable-to-codex-bridge.md`
- `docs/projects/[project]/visual-target.md`
- `screenshot-harness/targets/[project]/`

Free/local MVP:

- Manual screenshot target and reconstruction prompt.

External approval needed:

- Running Lovable or any paid visual builder.

MVP version:

- Target screenshot, analysis, static shell, screenshot compare, patch report.

Overpowered version:

- Studio ingests target, routes skills, compiles Codex prompt, and tracks shell fidelity.

Risks:

- Legal/IP risk if copying exact proprietary visual assets.
- Agents may overfit to screenshot instead of product truth.

## 13. Migi Taste Linter

What it does:

- Static checklist and optional CLI flags forbidden patterns in code/classes/copy.

Why it is powerful:

- Converts taste memory into cheap, local preflight checks.

Files/folders needed:

- `tools/migi-taste-linter.mjs`
- `schemas/lint-report.schema.json`
- `rules/anti-patterns.md`
- `design-dna/copy-rules.md`

Free/local MVP:

- Regex and AST checks for forbidden copy, unsupported claims, repeated badges/chips, huge typography classes, generic dashboard naming.

External approval needed:

- None.

MVP version:

- CLI report with warnings and scorecard cap suggestions.

Overpowered version:

- DOM + screenshot + source scan in one report.

Risks:

- Static checks miss visual nuance.
- Too many warnings create noise.

## 14. Design Brief Contract

What it does:

- Requires Design Intent Record, selected skills, identity packet, concept set, approval state, and screenshot plan before implementation.

Why it is powerful:

- Creates a local approval gate instead of relying on agent memory.

Files/folders needed:

- `schemas/design-brief-contract.schema.json`
- `docs/projects/[project]/brief.json`
- `tools/validate-brief.mjs`

Free/local MVP:

- Schema validation.

External approval needed:

- None.

MVP version:

- Agent cannot claim implementation-ready until brief validates.

Overpowered version:

- Studio tracks contract state and blocks next steps.

Risks:

- Too much form-filling if schema is bloated.

## 15. Demo/Viral Mode

What it does:

- Public-facing demo of a personal AI design brain improving frontend agents with taste memory, references, concepts, screenshots, and patch loops.

Why it is powerful:

- Makes the system shareable and legible.
- Shows a before/after story instead of a docs repo.

Files/folders needed:

- `examples/demo-projects/`
- `approved-gallery/`
- `rejected-gallery/`
- `studio-app/`
- `README.demo.md`

Free/local MVP:

- Static demo page with screenshots, concept artifacts, scorecard before/after.

External approval needed:

- Public hosting or paid tooling.

MVP version:

- One demo project showing prompt, concepts, rejected direction, fixed direction, screenshots, scorecard.

Overpowered version:

- Interactive local demo that lets people route a task, choose a concept, and generate a Codex prompt.

Risks:

- Public demo may leak private taste/projects if not curated.

## Strategic Sequence

Build first:

1. Schemas and project packet.
2. Skill router CLI.
3. Brief/concept/screenshot/scorecard report artifacts.
4. Taste galleries.
5. Screenshot harness.

Build later:

1. Studio UI.
2. Prompt compiler.
3. Anti-slop detector.
4. Visual regression harness.
5. Demo mode.

The point is not to add more docs. The point is to make the agent loop artifact-driven.
