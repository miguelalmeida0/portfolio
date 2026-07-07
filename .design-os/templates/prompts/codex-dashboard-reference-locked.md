# Codex Dashboard Reference-Locked Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Selected mode:
Command Center / Dashboard Mode

Active dials:

- DESIGN_VARIANCE: `{{DESIGN_VARIANCE}}`
- VISUAL_DENSITY: `{{VISUAL_DENSITY}}`
- ART_DIRECTION: `{{ART_DIRECTION}}`
- GRAPH_COMPLEXITY: `{{GRAPH_COMPLEXITY}}`
- IMAGE_USAGE_PRIORITY: `{{IMAGE_USAGE_PRIORITY}}`

Required files to read:

- `AGENTS.md`
- `agent-workflows/reference-locked-build-mode.md`
- `skills/visual-spec-compiler/SKILL.md`
- `skills/dashboard-graph-system/SKILL.md`
- `skills/data-visualization-selection/SKILL.md`
- `design-intelligence/chart-guidance.md`
- `design-dna/layout-recipes.md`
- `design-dna/art-directed-palette-exploration.md` when dashboard art direction calls for expressive palette exploration
- `evaluation/ui-scorecard.md`

Reference anchors:
Select 3-5 exact dashboard references and assign each a role:

- composition
- palette/material
- graph/component
- image/object/media
- responsive/layout

Required artifacts before coding:

- `docs/design/reference-decomposition.md`
- `docs/design/design-transfer-spec.md`
- `docs/design/direction-options.md` when dashboard visual direction is not already approved
- `docs/design/selected-direction.md` after Migi chooses A, B, C, or a hybrid
- `docs/design/visual-spec.md`
- `docs/design/chart-selection-report.md`

Design-system-first requirement:
Define dashboard surface roles, chart colors, state colors, panel weights, typography, radius, border, and motion rules before implementation.

Direction Gate:
If dashboard visual direction is uncertain, create three directions before coding:

- Direction A - Safe Refined
- Direction B - Artistic Expressive
- Direction C - Unexpected High-Character

Stop for Migi to choose. The directions must differ in composition, palette, graph emphasis, image/object/media strategy, material system, and live/motion energy.

Implementation order:

1. shell/nav
2. attraction zone
3. graph/data system
4. queue/list/activity system
5. action/output system
6. responsive adaptation

Evidence requirements:

- build/lint
- screenshots at 1440/1280/1024/768/390 when possible
- chart bounds proof
- scorecard and done report

Final response contract:

- reference anchors
- direction options / selected direction
- visual spec
- chart rationale
- files changed
- commands run
- screenshots or blocker
- scorecard/done report
- exact remaining mismatches
