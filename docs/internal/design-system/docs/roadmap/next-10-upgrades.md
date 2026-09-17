# Next 10 Upgrades

This roadmap ranks the highest-impact upgrades without implementing them. P0 items make the current system enforceable. P1 items make it powerful. P2 items make it productized and viral.

## 1. P0 - Design Brief Contract

Priority: P0

Impact: Very high

Effort: Medium

Files to change/create:

- `schemas/design-brief-contract.schema.json`
- `docs/projects/_template/brief.json`
- `tools/validate-brief.mjs`
- update `skills/visual-concept-gate/SKILL.md`
- update `AGENTS.md`

Acceptance criteria:

- A new visual-heavy task has a saved brief before implementation.
- Brief includes project type, primary user, primary object, primary action, selected skills, visual-heavy status, references, screenshot plan, and approval state.
- Validator fails missing required fields.
- Final handoff references the brief.

Free/local: yes

Needs screenshots: no

Needs implementation approval: yes

## 2. P0 - Concept Artifact Schema

Priority: P0

Impact: Very high

Effort: Medium

Files to change/create:

- `schemas/concept.schema.json`
- `docs/projects/_template/concepts.md`
- `docs/projects/_template/concepts.json`
- `tools/validate-concepts.mjs`
- `examples/concepts/`

Acceptance criteria:

- Visual Concept Gate output is saved as artifact.
- Each of 3 concepts includes metaphor, composition, focal object, hidden/absent info, desire mechanism, cliche avoidance, responsive strategy, and failure mode.
- Validator rejects concepts that omit fields.
- Approval state is explicit.

Free/local: yes

Needs screenshots: no

Needs implementation approval: yes

## 3. P0 - Screenshot Report Standard

Priority: P0

Impact: Very high

Effort: Medium

Files to change/create:

- `schemas/screenshot-report.schema.json`
- `docs/projects/_template/screenshot-report.md`
- `screenshot-harness/README.md`
- `screenshot-harness/reports/`
- update `skills/screenshot-scorecard-review/SKILL.md`

Acceptance criteria:

- Every significant frontend task can store `390 / 768 / 1440` evidence in a standard path.
- Report includes horizontal scroll, overlap, readability, primary object/action, score caps, blockers, and patch status.
- Missing screenshot evidence is recorded as a blocker.

Free/local: yes

Needs screenshots: yes

Needs implementation approval: yes

## 4. P0 - Machine-Readable Scorecard

Priority: P0

Impact: High

Effort: Low-medium

Files to change/create:

- `evaluation/ui-scorecard.json`
- `evaluation/score-caps.json`
- `tools/validate-scorecard-report.mjs`

Acceptance criteria:

- Score caps exist in JSON.
- Required report fields exist in JSON.
- A scorecard report can be validated locally.
- Markdown scorecard remains human-readable but JSON is canonical for tools.

Free/local: yes

Needs screenshots: no, but should reference screenshot report

Needs implementation approval: yes

## 5. P0 - Skill Registry And Router CLI

Priority: P0

Impact: High

Effort: Medium

Files to change/create:

- `skills/registry.json`
- `tools/route-skills.mjs`
- `schemas/task-intake.schema.json`
- update `AGENTS.md`

Acceptance criteria:

- Given a task JSON, router outputs exact skill paths and files to read.
- Router never loads all skills.
- Router flags when screenshots/reference/selection-first imply additional skill.
- Router output can be pasted into a Codex prompt.

Free/local: yes

Needs screenshots: no

Needs implementation approval: yes

## 6. P1 - Taste Memory Gallery

Priority: P1

Impact: Very high

Effort: Medium-high

Files to change/create:

- `approved-gallery/README.md`
- `approved-gallery/index.json`
- `rejected-gallery/README.md`
- `rejected-gallery/index.json`
- `schemas/gallery-item.schema.json`
- `docs/gallery-index.md`

Acceptance criteria:

- Gallery item has screenshot path, project, product type, tags, approved/rejected reason, reusable lesson, non-copy boundary.
- At least 5 approved and 5 rejected examples exist.
- Agents can reference gallery items as evidence without copying literally.

Free/local: yes

Needs screenshots: yes

Needs implementation approval: yes

## 7. P1 - Project-Specific Identity Compiler

Priority: P1

Impact: High

Effort: Medium

Files to change/create:

- `schemas/identity-packet.schema.json`
- `docs/projects/_template/identity-packet.md`
- `prompts/identity-compiler.md`
- optional `tools/validate-identity-packet.mjs`

Acceptance criteria:

- Identity packet outputs semantic tokens, layout rules, interaction rules, copy tone, anti-patterns, and responsive risks.
- Packet is derived from product type, audience, primary object/action, references, and constraints.
- Packet states what old projects are evidence and what must not be copied.

Free/local: yes

Needs screenshots: no

Needs implementation approval: yes

## 8. P1 - Prompt Compiler

Priority: P1

Impact: High

Effort: Medium

Files to change/create:

- `prompts/codex-new-app.md`
- `prompts/codex-redesign.md`
- `prompts/codex-visual-target.md`
- `prompts/lovable-to-codex-bridge.md`
- `tools/compile-prompt.mjs`

Acceptance criteria:

- Given a project folder, compiler emits a Codex-ready prompt with selected skills, brief, approved concept, references, screenshot plan, scorecard requirements, and protected folders.
- Prompt includes no unrelated skills.
- Prompt includes no paid tool invocation unless approved.

Free/local: yes

Needs screenshots: optional

Needs implementation approval: yes

## 9. P1 - Anti-Slop Detector MVP

Priority: P1

Impact: High

Effort: Medium-high

Files to change/create:

- `tools/anti-slop-detector.mjs`
- `tools/migi-taste-linter.mjs`
- `schemas/anti-slop-report.schema.json`

Acceptance criteria:

- Detects suspicious patterns for huge typography, badge/chip density, unsupported claim words, generic dashboard naming, possible dead buttons, and excessive containers.
- Emits scorecard cap suggestions.
- Report distinguishes hard blockers from warnings.

Free/local: yes

Needs screenshots: optional but stronger with screenshots

Needs implementation approval: yes

## 10. P2 - Design OS Studio

Priority: P2

Impact: Extreme

Effort: High

Files to change/create:

- `studio-app/`
- `studio-app/README.md`
- `studio-app/src/`
- integrations with `schemas/`, `screenshot-harness/`, `approved-gallery/`, and `rejected-gallery/`

Acceptance criteria:

- Local app lets Migi create a project brief, upload/reference inspiration, review 3 concepts, approve one, inspect screenshots, run scorecard, and export Codex prompt.
- Runs without paid APIs.
- External tools are behind explicit approval.
- Demo mode can show a before/after project.

Free/local: yes for MVP

Needs screenshots: yes

Needs implementation approval: yes

## What To Build First

Build the enforcement substrate before the Studio UI:

1. Design Brief Contract.
2. Concept Artifact Schema.
3. Screenshot Report Standard.
4. Machine-readable scorecard.
5. Skill registry/router CLI.

Those five upgrades make the existing docs operational. Studio becomes much easier after the artifacts exist.
