# Miguel Design OS Current State Audit

Audit date: 2026-07-01

Scope: repository structure, `AGENTS.md`, `README.md`, `design-dna/`, `skills/`, `evaluation/`, `agent-workflows/`, `case-studies/`, `manual-preferences/`, `project-index.md`, evidence folders, and local helper scripts.

Protected folders were inspected only as structure/evidence. No changes should be made to `source-projects/`, `captures/`, or `raw-chat-input/` during this audit.

## Executive Take

Miguel Design OS has already crossed from "preference docs" into a routed local instruction system. The strongest move is the new `AGENTS.md` router plus narrow `skills/*/SKILL.md` files. That is the right architecture for future agents because it reduces context bloat and creates task-specific loops.

The system is still not yet "Lovable inside the repo" because most enforcement is text-based. Agents can still skip gates, invent concepts without diagrams, avoid screenshot comparison, fail to produce a visual shell, or score themselves generously. The next leap is not more advice. It is local product infrastructure: structured briefs, galleries of approved/rejected evidence, screenshot harness, anti-slop checks, prompt compiler, and report artifacts that make the agent loop observable.

## Repository Inventory

Root:

- `AGENTS.md`: thin router to skills.
- `README.md`: overview, evidence map, fast start.
- `system.md`: architecture reference.
- `design-system.json`: machine-readable summary of gates, caps, skill routing, evidence, handoff fields.
- `MIGUEL_DESIGN_OS_MANUAL.md`: long manual for human/agent use.
- `project-index.md`: source-project index and global learning rules.

Core instruction folders:

- `skills/`: 8 routed skill files plus `skills/README.md`.
- `design-dna/`: persistent taste rules, anti-patterns, archetypes, responsive rules, copy rules, rejected/approved directions.
- `rules/`: operational rule layer for tokens, components, layout, interaction, anti-patterns, scorecard, new-app workflow.
- `agent-workflows/`: older workflow layer for app generation, review, ingestion, fix-until-elite, and visual target reconstruction.
- `evaluation/`: `ui-scorecard.md`.
- `manual-preferences/`: global frontend principles.

Evidence:

- `source-projects/`: five golden code examples.
- `captures/`: mobile/tablet/desktop screenshots for each golden project.
- `extracted/`: technical inventories and style reports for each golden project.
- `case-studies/in-the-loop-feedback/`: scoped one-app feedback evidence.
- `docs/inspiration/` and `docs/inspiration-analysis.md`: project-specific inspiration template.
- `raw-chat-input/`: ingestion source material.

Local helpers:

- `scripts/capture-screenshots.mjs`
- `scripts/check-horizontal-scroll.mjs`
- `scripts/check-overlap.mjs`
- `scripts/check-scale-inflation.mjs`
- `scripts/generate-design-report.mjs`

## What Exists

- A thin agent router with explicit skill triggers.
- Narrow skills for visual concept gate, target reconstruction, selection-first products, anti-slop review, screenshot scorecard review, art-director review, Tailwind migration, and truthful state naming.
- A compact context file with high-signal rules.
- Rich design-dna covering anti-patterns, component recipes, copy, layout, responsive behavior, approved/rejected directions.
- Scorecard with caps for skipped visual gate, reference flattening, same-layout repaint, overlap, scale inflation, decorative motion, and weak selection-first desire.
- Golden source projects and extracted reports.
- Screenshot evidence for each golden project at `390 / 768 / 1440`.
- Optional local scripts for screenshot capture and heuristic checks.
- A no-cost principle inside `skills/README.md`.

## What Is Strong

- `AGENTS.md` is now a real router. It is short and trigger-based.
- The skills have consistent required sections: name, description, use when, do not use when, inputs, files to read, workflow, stop conditions, output contract, blockers, scope rules.
- The Visual Concept Gate is correctly treated as pre-implementation.
- The system is explicit about references: composition, focal object, hidden information, absent elements, material, atmosphere, interaction model.
- The Robot Skill Forge lessons are captured as scoped negative evidence rather than universal style law.
- The scorecard has actual caps. This is much stronger than taste commentary.
- Protected folders are clearly named.
- Selection-first products have specific desire-first rules.
- There is already a local/free bias and a clear warning not to require paid services in skills.

## What Is Weak

- Enforcement is improving through local artifacts, but many checks still depend on agents actually running the CLI.
- Visual Concept Gate v2 now requires rendered concepts and screenshot evidence; the remaining gap is proving visual quality, not merely field presence.
- Screenshot comparison is not first-class. Screenshots can be captured, but there is no standard project run folder, baseline folder, diff report, or visual review artifact.
- Anti-slop checks are partly manual. Scripts only cover horizontal scroll, overlap heuristics, and scale inflation.
- Design-system schema is not yet the canonical source of truth. It mirrors docs but does not drive validation.
- Approved/rejected examples are mostly text; there is no visual gallery with screenshots, reasons, tags, and lessons.
- `MIGUEL_DESIGN_OS_MANUAL.md`, `system.md`, `rules/`, `design-dna/`, and `agent-workflows/` still repeat similar loops.
- There is no "project packet" generator that compiles only relevant context for a new app.
- There is no prompt compiler for Codex, Lovable, v0, Bolt, or other agents.
- There is no local Studio UI, CLI, or checklist runner that makes the workflow feel like a product.

## What Is Duplicated

- Visual Concept Gate appears in `system.md`, `README.md`, `MIGUEL_DESIGN_OS_MANUAL.md`, `design-dna/00_COMPACT_AGENT_CONTEXT.md`, `design-dna/miguel-style-principles.md`, `design-dna/new-app-generation-rules.md`, `rules/new-app-workflow.md`, `agent-workflows/generate-new-app.md`, and `skills/visual-concept-gate/SKILL.md`.
- Screenshot proof appears in scorecard, skills, workflows, compact context, manual, and rules.
- Anti-slop language appears in `design-dna/anti-patterns.md`, `rules/anti-patterns.md`, `skills/anti-ai-slop-review/SKILL.md`, scorecard, compact context, and workflows.
- New-app flow exists in both `rules/new-app-workflow.md` and `agent-workflows/generate-new-app.md`.
- Visual target reconstruction exists in `skills/visual-target-reconstruction/SKILL.md`, `agent-workflows/visual-target-reconstruction-mode.md`, `design-dna/new-app-generation-rules.md`, and `MIGUEL_DESIGN_OS_MANUAL.md`.

Duplication is not fatal yet, but it creates drift risk. The v2 architecture should make `AGENTS.md` + skills + schemas canonical, with old docs becoming reference material.

## What Is Too Vague

- "Elite" appears as a target but is not translated into measurable evidence beyond scorecard caps.
- "Visual thesis" is strong language, but there is no required minimum form such as diagram, object hierarchy, and hidden-information map.
- "Desire" is correctly named but not yet scored with concrete observable signals such as hover reward, selection commitment, object differentiation, and first-click motivation.
- "Patch until elite" still depends on agent judgment. There is no patch loop artifact that records before/after screenshots and blocker closure.
- "Material/atmosphere" appears in reference handling but has no structured checklist or example gallery.

## What Is Missing

- `schemas/` for briefs, concept outputs, inspiration analyses, screenshot reports, scorecards, and handoffs.
- `approved-gallery/` and `rejected-gallery/` with image evidence and tagged lessons.
- Local CLI that routes skills, validates required artifacts, runs screenshot checks, and emits a design report.
- Visual regression harness with baseline/current/diff folders.
- Prompt compiler that converts Design OS context into precise prompts for different agents.
- Project-specific identity compiler that outputs tokens, layout constraints, copy rules, and anti-patterns.
- Design Brief Contract that blocks implementation until required fields exist.
- Dead UI detector for buttons/links/forms without handlers or visible disabled state.
- Design OS Studio UI for intake, inspiration upload, concept review, screenshot review, and scorecard.
- A machine-readable registry of golden evidence and rejected/approved lessons.
- Versioning strategy for skills and design-dna rules.

## What Is Currently Not Enforceable

- Waiting for Migi approval before implementation.
- Producing 3 genuinely different concepts.
- Using inspiration by composition rather than surface traits.
- Building static visual shell before product logic.
- Comparing screenshots against a reference target.
- Fixing scorecard blockers before final response.
- Not loading unrelated skills.
- Not overusing old golden projects.
- Keeping motion purposeful.
- Avoiding dead UI.

These are instructions, not gates. A local CLI/harness could enforce many of them by checking required files, screenshots, report fields, and score caps.

## Where Agents Can Still Fail

- They can read `README.md` and `system.md` and skip skill routing.
- They can skip the CLI and claim the Visual Concept Gate happened without validated artifacts.
- They can render 3 concepts that are only palette variants.
- They can implement before approval if the user prompt is ambiguous.
- They can flatten inspiration into dark/neon/cards/glow.
- They can run screenshots but not compare them to the target.
- They can produce "same layout with new paint" and call it progress.
- They can score a UI without applying caps.
- They can use source projects as templates instead of evidence.
- They can ship clickable-looking passive UI.
- They can leave dead controls in a visual prototype.

## Context Bloat

Approximate instruction surface inspected: over 4,500 lines across root docs, design-dna, rules, skills, workflows, scorecard, manual preferences, and project index.

The route-based skill system is the right fix, but surrounding docs still invite over-reading. In a real Codex run, an agent could read:

- compact context
- AGENTS
- system
- README
- manual
- new-app rules
- design-dna principles
- skill file
- scorecard
- workflow

That is too much for routine tasks. V2 should introduce a "context packet" generated per task.

## Instruction Conflicts Or Drift Risks

- `AGENTS.md` says load only routed skills. Some older docs still describe broad read orders and may encourage reading more than needed.
- Skills are instruction-only, but workflows mention scripts. This is acceptable if scripts remain outside skills, but agents need a clearer boundary.
- `system.md` still contains detailed Visual Concept Gate instructions that overlap with the skill. The skill should be canonical.
- `agent-workflows/visual-target-reconstruction-mode.md` duplicates the skill. It should become reference or be folded into the skill.
- `design-dna/new-app-generation-rules.md` still says read relevant rules/skills/design-dna directly; this can fight the router model.
- `design-system.json` includes routing but is not generated from `AGENTS.md`, so drift is possible.

## Manual Prompt Dependency

The system still depends on Migi to:

- remember to ask for the Visual Concept Gate
- reject weak concept sets
- supply screenshots manually
- tell agents when inspiration was flattened
- demand patch loops
- notice when the agent skipped routed skills
- manually compare screenshots
- enforce no paid tools beyond the skill README

The next version should reduce that dependency by producing required artifacts and checking them locally.

## Target Evaluation

Target: "Migi should be able to start a new frontend project, point an agent to this repo, add screenshots/inspiration, and get a design process closer to Lovable-level visual output but with better code quality and stronger taste memory."

| Dimension | Score | Rationale |
| --- | ---: | --- |
| Agent routing clarity | 8 | `AGENTS.md` is now a clear router. Drift remains in older docs. |
| Visual concept generation | 7 | Strong gate and fields, but no diagrams, saved concepts, or enforcement artifact. |
| Inspiration image handling | 7 | Correct analysis categories exist. Needs target comparison and gallery examples. |
| Visual target reconstruction | 6 | Workflow exists, but no harness or side-by-side diff. |
| Screenshot comparison loop | 5 | Capture scripts exist, but comparison and patch reports are not standardized. |
| Anti-slop enforcement | 8 | Very strong taxonomy and caps. Mostly manual detection beyond a few heuristics. |
| Project-specific identity generation | 6 | Required in docs, but no compiler from brief/reference to tokens/rules. |
| Responsive proof | 7 | Viewport requirements are clear. Need consistent storage and diff workflow. |
| Scorecard quality | 7 | Good caps and categories. Needs machine-readable schema and examples. |
| Selection/gallery/roster handling | 8 | Strong, specific, and grounded in Robot Skill Forge lessons. |
| Frontend architecture standards | 5 | Design guidance is much stronger than code architecture guidance. |
| Reusability across projects | 7 | Skills and evidence map help. Needs project packets and schemas. |
| Ease of use by Codex agents | 6 | Router helps, but docs are still broad and repeated. |
| Viral/product potential | 7 | The concept is compelling. Needs Studio/CLI/gallery to feel tangible. |

Overall current score: 6.9 / 10.

## Strongest Current Weaknesses

1. No artifact enforcement. The OS says what should happen but rarely requires saved files before moving forward.
2. No screenshot comparison harness. Visual QA is manual and not persisted as a loop.
3. No taste memory gallery. Approved/rejected lessons are mostly text, not browseable visual evidence.
4. No project-specific compiler. Agents must manually translate product brief and inspiration into tokens/layout/copy.
5. Too many overlapping instruction surfaces. The router is good, but older docs still create context drag.
6. No dead UI enforcement. A visual shell can look real but have inactive controls.
7. No prompt compiler. Migi still has to formulate strong task prompts manually.

## Audit Conclusion

The current Design OS is strong enough to guide a careful agent. It is not yet strong enough to force a weak or rushed agent into an elite loop. The next version should stop adding generalized design prose and instead add local, structured, inspectable artifacts:

- brief contract
- concept JSON/Markdown
- inspiration analysis
- screenshot report
- scorecard report
- patch log
- approved/rejected gallery
- local CLI or Studio

That is the path from static memory to local AI design operating system.
