# Lovable Gap Audit

Audit date: 2026-07-01

Scope: Miguel Design OS as a local agent operating system for frontend generation, visual target reconstruction, screenshot QA, skill routing, artifact validation, and embedded `.design-os` use.

Protected folders for this audit: `source-projects/`, `captures/`, and `raw-chat-input/` were not modified.

## Executive Diagnosis

Miguel Design OS is good at telling an agent what should happen. It is not yet good at making the agent prove that it happened.

That is the core Lovable gap.

The current system has strong rules, routed skills, schemas, templates, score caps, a CLI, and good design memory. But most of the visual quality loop is still instruction-based. The agent can still claim screenshots were judged, claim visual parity, claim concepts were rendered, or claim blockers were fixed without a hard artifact pipeline that independently catches the lie.

Lovable wins visually because it starts as a visual synthesis engine. Miguel Design OS currently starts as a governance layer around Codex. Governance helps a careful agent. It does not turn a component-first coding agent into a visual composition engine by itself.

## 1. What Miguel Design OS Currently Does Well

### Routing

- `AGENTS.md` acts as a short router instead of a giant always-load manual.
- `tools/design-os.mjs route --task "..."` maps task language to relevant skills.
- The skill registry keeps routing keywords, inputs, and output contracts in one machine-readable place.
- Recent embedded `.design-os` support lets the CLI resolve internal Design OS files from its own root instead of the host project root.

### Skills

- Skills are narrow and task-shaped: visual concept gate, visual target reconstruction, selection-first products, anti-slop review, screenshot review, art-director critique, Tailwind migration, and truthful state naming.
- Skill files use consistent sections: use when, do not use when, files to read, workflow, stop conditions, output contract, score blockers, and scope rules.
- The system correctly avoids loading every skill for every task.

### Schemas

- `schemas/design-brief.schema.json` requires primary user, object, action, visual weight, target screens, constraints, required skills, and approval state.
- `schemas/visual-concepts.schema.json` requires exactly 3 concepts with composition, focal object, hidden information, absent elements, desire mechanism, responsive strategy, preview route, and screenshot fields.
- `schemas/screenshot-report.schema.json` requires 390, 768, and 1440 viewport checks plus booleans for overlap, horizontal scroll, and readability.
- `schemas/ui-scorecard.schema.json` captures score categories and blocker caps.

### Scorecards

- `evaluation/ui-scorecard.md` has real caps for skipped visual gate, text-only concepts, reference flattening, same-layout repaint, generic layout instead of reference composition, overlap, AI scale inflation, and weak selection-first desire.
- The scorecard is specific enough to punish common AI-builder failures instead of giving vague taste feedback.
- Literal Target Copy Mode now has a max score cap when the agent changes composition or adds unrelated product UI.

### Validation

- `tools/design-os.mjs validate-brief` catches missing brief fields.
- `validate-concepts` catches missing concept fields, duplicate concept ids, identical compositions, and missing viewport screenshot strings.
- `check-visual-gate` can require approved concepts and existing screenshot files.
- `validate-screenshot-report` checks that the report shape includes viewport checks and required booleans.

### Prompt Generation

- `compile-agent-prompt` compiles an implementation prompt from a validated brief and approved concept artifact.
- The compiled prompt includes the approved concept, responsive strategy, constraints, forbidden directions, required skills, and implementation standard.
- This is a good primitive for making implementation depend on approved design artifacts.

### Design Memory

- `design-dna/` preserves durable taste rules, anti-patterns, layout recipes, component guidance, copy rules, responsive rules, and rejected directions.
- Robot Skill Forge failures are captured as negative evidence.
- The system distinguishes evidence from templates and warns against copying old golden apps.
- The new Literal Target Copy Mode correctly separates exact target reconstruction from product reinterpretation.

## 2. What Miguel Design OS Still Does Not Do

The uncomfortable part: the current system mostly validates paperwork, not vision.

It does not generate visual compositions. It asks the agent to produce them.

It does not render 3 visual concepts itself. It validates that a JSON artifact names preview routes and screenshot paths.

It does not compare screenshots pixel-wise, structurally, or compositionally.

It does not verify image cleanliness automatically.

It does not detect watermarks automatically.

It does not detect copied browser chrome, editor UI, or screenshot UI artifacts automatically.

It does not detect crop or focal-point problems automatically.

It does not detect whether a robot, person, product, chart, or object is cut off in a bad way.

It does not detect inconsistent object positioning across repeated cards.

It does not robustly detect overlap. The current overlap script is a useful heuristic for selected controls and marked zones, not a full visual collision engine.

It does not enforce object swap invariance automatically. A card layout can work for one robot image and fail when a different robot silhouette is swapped in.

It does not force Codex to use browser screenshots as proof deeply enough. Screenshot paths can exist while the visual judgment is shallow.

It does not stop agents from self-reporting false success.

It does not produce Lovable-style visual drafts.

It does not have a Studio UI.

It does not have a visual asset pipeline.

It does not have a target screenshot diff engine.

It does not enforce side-by-side target/current review.

It does not require a patch log showing before/after screenshots for each blocker.

It does not distinguish "build passed" from "visual passed" strongly enough at the artifact layer.

It does not make approval impossible to fake. Approval is stored in JSON, but the system cannot prove Migi actually saw rendered previews.

It does not enforce that target screenshots stay out of production assets.

It does not verify that concept screenshots are truly different visual compositions instead of variants with the same layout.

It does not validate the contents of screenshots, only their existence in some flows.

## 3. Why Lovable Still Beats This System Visually

Lovable starts from composition. Miguel Design OS starts from instructions about composition.

Lovable optimizes for first impression. Codex often optimizes for a working component tree, typed state, and plausible UI structure.

Lovable generates a scene or poster first. Codex tends to generate containers, cards, lists, panels, and data flow first.

Lovable makes the screen feel like something before it makes it useful. Codex tends to make it useful, then tries to style its way toward feeling.

Lovable can synthesize image-led, art-directed drafts quickly. Miguel Design OS can ask Codex to do that, but cannot yet render or judge those drafts as a system.

Design OS gives rules, memory, schemas, and score caps. Those help avoid known failures. They do not create visual synthesis.

Codex needs hard visual feedback loops, not just better instructions. The missing loop is:

1. render a target or concept
2. capture screenshots
3. compare against target or approved concept
4. detect concrete visual failures
5. block "done"
6. patch
7. recapture
8. repeat until the artifact passes

Without that loop, a strong prompt can still produce a weak visual result and a convincing final report.

## 4. Where The Workflow Broke In Robot Skill Forge

Robot Skill Forge exposed the gap between design rules and visual enforcement.

- Visual Concept Gate produced text concepts, not visual options.
- Literal Target Copy Mode was added late, after agents had already learned to reinterpret instead of copy.
- The target screenshot was treated as a production asset instead of reference evidence.
- Asset hygiene was missing: no manifest, license note, crop note, watermark-free confirmation, or placeholder detection.
- Object swap invariance was not enforced: a layout that seemed acceptable for one robot could break with a different robot crop, pose, or silhouette.
- Visual QA relied on agent claims.
- Screenshots existed, but they were not treated as blockers with specific target/current differences.
- Build and lint passing were mistaken for quality proof.
- "Useful product" got mixed with "copy visual shell."
- The project had too many modes active at once: selection-first desire, target reconstruction, product usefulness, visual concept gate, and implementation polish competed instead of sequencing cleanly.
- Same-layout-with-new-paint kept recurring because structural composition was not blocked by a hard diff or approval artifact.
- Text overlap and cut images should have stopped the loop, but the system had no mandatory visual failure report that prevented final handoff.
- Watermarks and copied artifacts were not automatically detected, so asset contamination could slip through.

Robot Skill Forge did not fail because the rules were absent. It failed because the rules were not backed by artifact gates strong enough to stop a plausible but visually wrong implementation.

## 5. Current Design OS Risk Rating

Scores are 1 to 10. Higher means stronger current capability.

| Dimension | Score | Brutal read |
| --- | ---: | --- |
| Visual generation power | 3 | The OS does not generate visuals; it instructs an agent to do so. |
| Visual enforcement power | 5 | Good caps and schemas, weak screenshot/content enforcement. |
| Prompt clarity | 8 | The task language, skills, and compact context are increasingly clear. |
| Agent routing | 8 | Router and registry work, though keyword routing is still simple. |
| Lovable-level reconstruction ability | 4 | Literal Copy Mode helps, but there is no diff engine or target shell loop. |
| Screenshot QA reliability | 4 | Scripts exist, but screenshot judgment is mostly manual and self-reported. |
| Asset hygiene | 2 | No asset manifest, watermark scan, crop check, or source/license gate. |
| Concept approval enforcement | 6 | Artifacts can require approval fields and screenshot files, not actual quality or review. |
| Product usefulness integration | 7 | Product thinking is strong, sometimes too strong before visual parity. |
| Ease of use inside another project | 8 | Embedded `.design-os` support materially improves portability. |

Overall: 5.5 / 10 for forcing Lovable-level visual output.

The OS is useful. It is not yet visually coercive.

## 6. Missing Enforcement Layer

The missing layer is an artifact-based visual QA system that makes "done" impossible without proof.

### Required Properties

- Visual QA must be artifact-based.
- Screenshot checks must be required.
- Object swap invariance must be tested.
- Asset manifest must be required.
- Target screenshots must never become production assets.
- Concept previews must be real visual previews.
- Approval must be recorded before implementation.
- Implementation prompt must be compiled from approved concept.
- "Done" must be blocked if evidence is missing.

### What The Layer Should Block

- no screenshot files
- screenshot files exist but target/current comparison is missing
- target screenshot appears in production asset folders
- asset manifest missing for visual-heavy work
- unknown asset source or missing license note
- watermark-free status not declared
- focal point or crop note missing for primary imagery
- object swap test missing for repeated image-led cards
- visual concept screenshots missing before approval
- approved concept absent from compiled prompt
- implementation screenshots missing after build
- screenshot report says overlap/crop/watermark exists but final response claims done

### What The Layer Should Not Do

- It should not require paid tools.
- It should not call external models.
- It should not use hosted screenshot-to-code.
- It should not replace Migi's taste judgment.
- It should make the judgment inspectable and harder to fake.

## 7. What Would Make This Feel Like "Lovable Inside The Repo"

### A. Design OS Studio

A local UI for the workflow, not a static document.

It should let Migi and agents:

- create a design brief
- upload inspiration
- mark target screenshots
- create 3 visual concept slots
- preview concepts
- approve one concept
- compile a Codex prompt
- upload implementation screenshots
- run the scorecard
- see blockers before "done"

The Studio matters because the current workflow is scattered across Markdown, JSON, CLI commands, and agent memory. A visual system needs a visual control surface.

### B. Visual Concept Renderer

A local preview app that renders 3 static concepts from templates:

- selection-first
- cinematic stage
- product dashboard
- editorial portfolio
- research terminal
- social app
- commerce
- tool/workbench

The renderer does not need AI or paid APIs. It can start as deterministic templates with strong composition variants. The goal is to force actual rendered screens before implementation, not produce final production code.

### C. Screenshot QA Harness

A local Playwright harness should create:

- 390 screenshot
- 768 screenshot
- 1440 screenshot
- overlap report
- horizontal overflow report
- visible watermark/manual checklist
- dead button checklist

The harness should write a run folder with screenshots, JSON reports, and a Markdown summary. If required artifacts are missing, the task is not done.

### D. Asset Hygiene Pipeline

Visual-heavy work needs an asset manifest with:

- asset path
- source
- license or usage note
- watermark-free status
- crop/focal point
- repeated asset detection
- placeholder detection

The pipeline should forbid target screenshots as production assets unless explicitly whitelisted as reference-only.

### E. Target Reconstruction Mode

Given a target screenshot:

1. extract composition
2. create static shell
3. screenshot compare
4. patch until close
5. only then add product logic

This needs a dedicated target/current report, not a paragraph in the final response.

### F. Product Logic Integration Gate

Only after visual shell approval:

- add interactions
- add local data
- add deterministic logic
- retest screenshot quality

The product layer should be an explicit second phase. Robot Skill Forge failed partly because the agent tried to be useful before it had matched the visual shell.

## 8. No Paid Tools Policy

Every proposed P0 and P1 upgrade can be done free/local.

No API keys are required.

No hosted Lovable is required.

No screenshot-to-code generation is required.

No Onlook hosted usage is required.

No external model calls are required.

Paid-risk only appears in optional P2 distribution choices such as hosted demos, marketing pages, analytics, or cloud deployment. The core enforcement layer should stay local.

## 9. Blunt Conclusion

Miguel Design OS is currently a strong instruction system and a weak visual machine.

It has enough memory to tell agents what good looks like. It does not yet have enough machinery to make agents prove they produced it.

The next work should stop adding more general advice. Build the proof loop:

1. visual QA harness
2. asset hygiene manifest
3. target copy checklist
4. object swap invariance test
5. done report schema

That is the shortest path from "Codex with better taste docs" to "Lovable-level pressure inside the repo."

