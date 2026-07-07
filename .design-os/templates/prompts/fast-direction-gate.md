# Fast Direction Gate Prompt

Work in:
`{{PROJECT_PATH}}`

Protected paths:
`{{PROTECTED_PATHS}}`

Brief:
`{{BRIEF}}`

Selected mode:
`{{SELECTED_MODE}}`

Read first:

- `design-dna/FAST_DIRECTION_GATE_CONTEXT.md`
- `design-dna/NO_IMAGE_DIRECTION_GATE_CONTEXT.md`

Create a no-image fast 3-direction gate only:

1. Create `docs/design/direction-options.md` with concise direction cards.
2. Create `docs/design/direction-layout-maps.md` with ASCII/block maps for all directions.
3. Create `docs/design/direction-risk-check.md` with failure risks and recommendation score.
4. Stop for Migi selection.

No images. No paid API calls. No `OPENAI_API_KEY` usage. No visual spec. No implementation. No build/lint. No `src` edits.

Direction cards must include only:

- direction name
- product thesis
- domain palette rationale
- layout structure
- navigation model
- primary product object
- interaction model
- what it avoids
- likely failure risk
- implementation complexity
- recommendation score

Maximum 200 words per direction.

Each direction must include a compact layout map:

```txt
[Top contextual toolbar]
[Primary canvas / product object          ][Inspector]
[Queue / timeline / secondary controls    ]
```

or mobile equivalent:

```txt
[Header / current state]
[Primary control]
[Content list]
[Action zone]
[Bottom nav]
```

Hard checks:

- primary product object identified
- domain palette fit documented
- nav state effect documented
- interaction promises listed
- no decorative-only controls
- Service Floor failures avoided: random domain palette, placebo navigation, spatial label collision, primary object buried by cards

Do not implement. Do not edit `src`. Do not download production assets. Do not create visual specs, design-system docs, navigation plans, motion plans, Unsplash manifests, QA docs, screenshots, build/lint reports, or done reports before selection.

Paid image generation may only run if Migi explicitly wrote `I approve paid API image generation for this run.` and the paid script uses `--paid-ok`. Otherwise it is forbidden and unnecessary for this gate.

Final response:

- files created
- confirmation no images/API calls were used
- 3 direction names
- one-line summary of each direction
- strongest recommendation
- biggest risk in each direction
- confirmation no frontend code was changed
- ask Migi to choose A, B, C, or a hybrid
