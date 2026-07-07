# No-Image Fast Direction Gate Prompt

Work in:
`{{PROJECT_PATH}}`

Protected paths:
`{{PROTECTED_PATHS}}`

Brief:
`{{BRIEF}}`

Selected mode:
`{{SELECTED_MODE}}`

Read first:

- `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md`
- `design-dna/FAST_DIRECTION_GATE_CONTEXT.md`

Create a no-image 3-direction gate only.

Outputs:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

No images. No paid API calls. No visual spec. No implementation. No build/lint. No `src` edits.

Each direction must be meaningfully different and include:

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

Maximum: 200 words per direction.

Every layout map must show the primary product object, support panels/content, navigation placement, and action area.

Hard checks:

- palette fits the product domain, user environment, task pressure, and emotional state
- nav/tabs/segmented controls promise visible content/state changes
- maps/floor plans/timelines/canvases protect labels from object overlap
- desktop command surfaces keep the primary object central instead of collapsing into card soup
- no decorative-only controls
- no paid image generation unless Migi explicitly approved it in writing and the paid script uses `--paid-ok`

Final response:

- files created
- three direction names
- one-line summary of each direction
- strongest recommendation
- biggest risk in each direction
- confirmation no images/API calls/frontend code were used
- ask Migi to choose A, B, C, or a hybrid
