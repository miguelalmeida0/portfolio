# Reference-Locked Build Mode

Use this workflow when Migi asks to base a design on a specific visual-library folder or a specific set of screenshots.

Reference-Locked Build Mode prevents vague inspiration use. The agent must select exact reference anchors, decompose them, translate their mechanics into the target app, and compare the final output back to those anchors.

## Triggers

Activate this mode when Migi says:

- use dashboard folder
- use creative folder
- use landing-page folder
- base it on these screenshots
- make it like these references
- follow the same approach as these apps
- use this visual-library folder

If Migi asks for exact visual copying instead, use Literal Target Copy Mode.

## Required Before Implementation

### 1. Select 3-5 Reference Anchors

Do not proceed from folder vibes. Select specific files or screenshots.

Each anchor must have one or more roles:

- composition anchor
- palette/material anchor
- graph/component anchor
- image/object/media anchor
- responsive/layout anchor

For each anchor, state why it was selected and what it is allowed to teach.

For landing, marketing, portfolio, and image-led references, each anchor must also identify:

- section job
- composition anchor
- background mode
- CTA behavior
- image role
- second-read moment

### 2. Create Reference Decomposition

Create:

`docs/design/reference-decomposition.md`

Use:

`templates/reference-decomposition.template.md`

For each anchor, decompose:

- canvas
- composition
- density
- typography
- charts/data
- image/object/media
- palette/material
- interaction model
- what to transfer
- what not to copy

### 3. Create Design Transfer Spec

Create:

`docs/design/design-transfer-spec.md`

Use:

`templates/design-transfer-spec.template.md`

The spec must translate the reference mechanics into the target app. It must include:

- chosen visual mode
- primary composition strategy
- layout skeleton
- panel hierarchy
- graph system
- image/object/media strategy
- palette/material strategy
- typography scale
- navigation strategy
- responsive strategy
- forbidden drift
- acceptance criteria
- anti-AI-tell checks when landing, portfolio, or marketing
- motion/delight strategy when relevant
- Unsplash/source image strategy when real imagery is required

### 4. Run The Direction Gate When Direction Is Not Approved

If this is a new visual-heavy app, landing page, portfolio, mobile app, dashboard redesign, or artistic interface and Migi has not already approved a direction, create:

`docs/design/direction-options.md`

The three directions must be built from the selected reference anchors, not from vague folder mood:

- Direction A - Safe Refined
- Direction B - Artistic Expressive
- Direction C - Unexpected High-Character

Each direction must explain which anchor mechanics it transfers: composition, palette/material, typography, density, image/object/media behavior, graph/component behavior, responsive behavior, and motion cues.

After Migi chooses A, B, C, or a hybrid, create:

`docs/design/selected-direction.md`

Do not implement until the selected or hybrid direction is documented.

### 5. Source Real Imagery When Needed

If the transfer spec requires real photography, Unsplash, or source images, create before implementation:

- `docs/design/unsplash-search-plan.md`
- `docs/design/unsplash-asset-manifest.md`

Every selected image must map back to a reference mechanic or section job. Reject generic stock filler and stock imagery used as product proof.

## Build Segments

Implementation must follow the design transfer spec and build in segments:

1. shell/nav
2. attraction zone
3. chart/data system
4. queue/list system
5. action/output system
6. responsive adaptation

Do not add product panels, alternate layouts, or generic dashboard furniture that is not supported by the transfer spec.

## Required After Implementation

Create:

`docs/qa/reference-match-report.md`

Include:

- what matched
- what missed
- density comparison
- composition comparison
- palette comparison
- chart comparison
- image/object comparison
- responsiveness comparison
- next patch required

## Stop Conditions

- Stop if exact reference anchors are not selected.
- Stop if anchor roles are not assigned.
- Stop if `docs/design/reference-decomposition.md` does not exist before coding.
- Stop if `docs/design/design-transfer-spec.md` does not exist before coding.
- Stop if the design transfer spec only describes vibe, mood, or style tokens.
- Stop if direction is unapproved and `docs/design/direction-options.md` is missing.
- Stop if Migi has not selected Direction A, B, C, or a hybrid.
- Stop if Migi selected a direction but `docs/design/selected-direction.md` is missing.
- Stop if real imagery is required but the Unsplash search plan or asset manifest is missing.
- Stop if implementation starts from generic layout instead of the spec.
- Stop if final handoff has no `docs/qa/reference-match-report.md`.

## Handoff

```md
Reference-Locked Build Mode: active/inactive
Reference anchors:
Anchor roles:
Reference decomposition:
Design transfer spec:
Direction options:
Selected direction:
Unsplash search plan:
Unsplash asset manifest:
Build segments completed:
Reference match report:
Known mismatches:
Next patch:
```
