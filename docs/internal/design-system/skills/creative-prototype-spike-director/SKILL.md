---
name: creative-prototype-spike-director
description: Force high-risk visual mechanics, signature interactions, illustration assets, scroll choreography, WebGL effects, and unusual navigation concepts to be proven in small isolated prototypes before full-page build.
---

# Creative Prototype Spike Director

Use this skill before implementation when a core creative promise is risky.

## Required Output

Create:

- `docs/design/creative-prototype-spike-plan.md`
- `docs/qa/creative-prototype-spike-review.md`

If code is produced, place it in a scoped prototype location chosen by the project; do not pollute production components.

## Spike Candidates

- signature interaction
- illustration hero asset
- custom SVG scene
- scroll route choreography
- pinned/morphing stage
- unusual nav mechanic
- media constellation
- complex responsive composition
- WebGL/canvas effect

## Spike Contract

Each spike must define:

- creative promise
- isolated prototype scope
- what is intentionally excluded
- pass/fail criteria
- evidence required
- fallback path
- implementation decision: proceed / revise / abandon

## Hard Rules

- Do not build a full page around an unproven hero mechanic.
- Do not claim WebGL, morphing, scroll choreography, or premium illustration without a working proof or explicit fallback.
- Do not let a successful technical spike pass if the visual result is weak.
- Stop after the spike unless Migi has approved continuing or the task explicitly asks for implementation.

## Composition

Pairs with:

- `signature-interaction-director`
- `illustration-art-director`
- `elite-scroll-choreography-director`
- `responsive-constraint-solver`
- `evidence-to-repair-planner`

## Audit Upgrade: Self-Correction Contract

Audit fix: Use prototypes to prove risky mechanics quickly.

Required evidence:
- prototype goal, risk being tested, tiny implementation scope, screenshots or capture, and keep/kill verdict.

Repair routing:
- creative-orchestration-director decides whether the spike graduates into full implementation.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "creative-prototype-spike-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
