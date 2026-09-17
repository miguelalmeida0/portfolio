# Skill Orchestration Matrix

Use this matrix to route Design OS work through evidence and repair instead of isolated prompt rules.

## Phase Model

| Phase | Primary owner | Evidence owner | Repair owner |
|---|---|---|---|
| Direction | `visual-concept-gate` | `visual-spec-compiler` | `creative-orchestration-director` |
| Reference translation | `visual-target-reconstruction`, `image-first-frontend` | `screenshot-scorecard-review` | target-specific build skill |
| Visual spec | `visual-spec-compiler` | `creative-orchestration-director` | missing specialist skill |
| Implementation | task-specific build skill | screenshot, layout, motion, data, or production reviewers | implementation owner |
| Full critique | `evidence-backed-critique` | screenshot/tools/scorecard | `creative-orchestration-director` |
| Repair | owner skill from failed verdict | original evidence gate | implementation owner |
| Handoff | `screenshot-scorecard-review`, `production-hardening-review` | done report and scorecard | remaining owner skill |

## Specialist Clusters

- Direction: `visual-concept-gate`, `visual-spec-compiler`, `visual-style-selection`.
- Reference build: `visual-target-reconstruction`, `image-first-frontend`, `image-first-website-to-code`, `unsplash-asset-sourcing`.
- Landing/artistic: `landing-page-pattern-director`, `landing-page-craft-director`, `signature-interaction-director`, `elite-scroll-choreography-director`, `anti-ai-tell-preflight`.
- Evidence/review: `screenshot-scorecard-review`, `evidence-backed-critique`, `frontend-art-director-review`, `anti-ai-slop-review`, `layout-integrity-review`.
- Motion: `animation-vocabulary`, `advanced-motion-choreography`, `motion-craft-director`, `review-animations`, `scroll-choreography-review`.
- Illustration/vector: `illustration-art-director`, `svg-illustration-system`, `character-object-illustrator`, `material-surface-director`, `vector-form-system-director`, `shape-quality-review`.
- Data/spatial: `chart-system-director`, `data-visualization-selection`, `dashboard-graph-system`, `diagram-canvas-system`, `data-viz-hardening-review`.
- Product hardening: `mobile-product-flow`, `selection-first-products`, `truthful-state-product-naming`, `text-clarity-review`, `production-hardening-review`, `make-interfaces-feel-better`, `delight-opportunity-director`.
- Orchestration and memory: `creative-orchestration-director`, `skill-orchestration-planner`, `creative-session-state-manager`, `evidence-to-repair-planner`, `failure-memory-retrieval-router`, `artifact-contract-validator`, `preference-model-migi-taste-learner`.
- Detail and interaction specialists: `interaction-state-matrix-director`, `responsive-constraint-solver`, `designed-detail-reveal-director`, `scroll-physics-smoothing-director`, `media-object-stage-director`, `physical-interface-props-director`, `brand-voice-as-interface-director`, `reference-grammar-compiler`, `creative-prototype-spike-director`.
- Utilities: `tailwind-migration-zero-regression`, `userinterface-wiki`, `design-start-image-exploration`.

## Delegation Rules

- If a skill says "review", it must emit repair tasks, not just critique.
- If a skill says "director", it must name implementation and evidence owners.
- If a skill says "system", it must define structure, states, accessibility, and QA hooks.
- If a skill is broad, it must explicitly route narrower specialists.
- If screenshots or runnable evidence are possible, prose-only verdicts are incomplete.
