---
name: design-start-image-exploration
description: Legacy paid-image direction exploration wrapper. Paid image generation is disabled by default; use only when Migi explicitly approves paid API image generation for the run and the script is called with --paid-ok.
---

# Design Start Image Exploration

The default first design step for new visual-heavy work is now the No-Image Fast Direction Gate, not paid image generation.

Read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` and create:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

This skill exists only for the exceptional paid-image path.

## No Paid Image Generation By Default

Design OS must never call paid image APIs by default.

Forbidden by default:

- `OPENAI_API_KEY` image generation
- automatic `gpt-image` calls
- paid API moodboards
- hidden image generation during direction gate
- any script that spends API credits without explicit approval

Paid image generation may only run if Migi explicitly writes:

`I approve paid API image generation for this run.`

The command must also include `--paid-ok`. If either the written approval or the flag is missing, fail closed and write `blocked-report.md`.

## Use When

- new app
- new landing page
- portfolio
- creative/artistic page
- dashboard visual redesign
- mobile product flow
- major UI direction change
- Migi asks for "make it beautiful", creative, artistic, cinematic, Awwwards, Godly, Lovable-level, or similar

## Do Not Use When

- bug fixes
- backend-only work
- copy-only changes
- tiny refactors
- already-approved visual direction
- zero visual/UI work

## Required Outputs

Default no-image gate outputs:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

Paid-image exceptional outputs:

- `docs/design/direction-options.md`
- `generated/moodboards/<slug>/01-safe-refined.png`
- `generated/moodboards/<slug>/02-artistic-expressive.png`
- `generated/moodboards/<slug>/03-unexpected-high-character.png`
- `generated/moodboards/<slug>/manifest.json`
- `generated/moodboards/<slug>/prompts.md`

If paid image generation is blocked, write `generated/moodboards/<slug>/blocked-report.md`. Do not treat this as a failed direction gate; switch to the no-image gate and stop for Migi selection.

## Workflow

1. Read `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md` first.
2. Use no-image direction cards and layout maps by default.
3. Use this paid-image path only when Migi explicitly approved paid API image generation for this run.
4. Create 3 distinct image prompts:
   - Direction A: Safe Refined
   - Direction B: Artistic Expressive
   - Direction C: Unexpected High-Character
5. Generate one visual image for each direction only through the paid-approved script.
6. Save images locally under `generated/moodboards/<slug>/`.
7. Create `manifest.json` and `prompts.md`.
8. Create concise `docs/design/direction-options.md` with image paths, short direction cards, and one recommendation.
9. Stop and ask Migi to choose A, B, C, or a hybrid.
10. Do not code before selection.

Fast mode must not create visual specs, design-system docs, palette docs, navigation plans, motion plans, Unsplash manifests, QA docs, build/lint reports, screenshots, or frontend code.

## Local Script

Use the Codex-compatible wrapper script only when paid image generation is explicitly approved:

```bash
node .agents/skills/design-start-image-exploration/scripts/generate-design-directions.mjs \
  --project "Project Name" \
  --brief "Brief text" \
  --slug project-slug \
  --mode fast \
  --quality low \
  --size 1024x1024 \
  --paid-ok \
  --approval "I approve paid API image generation for this run."
```

Use no-image direction prompts/cards when paid generation is not approved:

```bash
node tools/design-os.mjs prompt --name no-image-fast-direction-gate
```

## Blocked Behavior

If paid image generation is unavailable, missing approval, missing `--paid-ok`, missing an API key, or blocked, create a blocked report. Do not mention missing key as the only blocker if paid approval is missing. Switch to the no-image direction gate. Implementation still requires Migi to select a direction.

## Concise Direction Cards

Each no-image direction card includes:

- name
- product thesis
- domain palette rationale
- layout structure
- ASCII/block layout map
- navigation model
- primary product object
- interaction model
- what it avoids
- likely failure risk
- implementation complexity
- recommendation score

Maximum 200 words per direction.

## Stop Conditions

- paid image generation attempted without Migi's exact written approval
- paid image generation attempted without `--paid-ok`
- no no-image direction cards and layout maps
- images all look like the same direction
- prompts are vague
- images are not connected to the brief
- agent starts coding before Migi selects
- generated images contain unreadable UI text and the agent treats it as production copy
- generated images are copied literally instead of used as art direction

## Critical Rule

Generated images are visual north stars, not production assets by default. Do not copy random AI artifacts, fake UI text, nonsense logos, distorted hands, broken text, or visual noise directly into code.

## Audit Upgrade: Self-Correction Contract

Audit fix: Keep legacy paid generation disabled and route no-image fallback.

Required evidence:
- explicit paid approval check, blocked report when missing, and no-image direction gate fallback.

Repair routing:
- visual-concept-gate owns normal direction work.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "design-start-image-exploration"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
