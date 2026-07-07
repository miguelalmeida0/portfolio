# AI Builder Operating Model

This is the elite local frontend creation loop for Miguel Design OS.

Compared with the older Design OS flow, the new standard is stricter: do not move from taste notes directly into UI code. First classify the mode, gather only relevant context, select exact references or image-first inputs, define the design system, build the frontend aha moment, and only then deepen functionality.

## 1. Understand Task Mode

Classify the request:

- visual-heavy new app
- dashboard/command center
- landing/poster page
- mobile product flow
- selection/gallery/browse
- literal target copy
- visual repair
- implementation-only
- review/audit

## 2. Select Visual / Reference Mode

Choose the active evidence mode:

- visual-library inspiration
- Reference-Locked Build Mode
- Literal Target Copy Mode
- image-first section references
- rendered visual concepts
- implementation-only with existing design system

If Migi points to a folder, use Reference-Locked Build Mode. If the task is premium website, landing page, poster, mobile, or visual-heavy work, use image/reference-first mode.

## 3. Gather Only Relevant Context

Read the smallest useful set:

- `AGENTS.md`
- compact context
- selected skills
- selected reference notes
- relevant design-intelligence files
- current target app files if implementing

Do not load the whole repo by default.

## 4. Declare Active Design Dials

Set:

- `DESIGN_VARIANCE`
- `MOTION_INTENSITY`
- `VISUAL_DENSITY`
- `ART_DIRECTION`
- `IMAGE_USAGE_PRIORITY`
- `IMPLEMENTATION_CLARITY`
- `MOBILE_NATIVE_FEEL`
- `GRAPH_COMPLEXITY`

Explain what each dial means for this project.

## 5. Select Exact References Or Generate Visual Concepts

Use visual-library references, exact target screenshots, rendered concepts, or generated/selected section references.

For reference-folder work, select 3-5 exact anchors and decompose them before coding.

For visual concept work, produce rendered concepts before final implementation.

## 6. Create Design System First

Before significant UI implementation, define semantic tokens:

- colors
- typography roles
- spacing
- radius
- shadows/elevation
- borders/dividers
- chart colors
- state colors
- component variants
- image treatment
- motion

No visible UI should be generated from random one-off Tailwind classes before this direction exists.

## 7. Create Visual Spec

Create `docs/design/visual-spec.md`.

It must include product intent, mode, dials, references, design-system tokens, visual thesis, layout skeleton, component system, image roles, chart strategy, mobile strategy, interaction states, responsive strategy, failure modes, implementation order, and scorecard risks.

## 8. Implement Frontend Mock / Aha Moment

Build the first compelling local frontend loop:

- local/mock data is allowed
- mock data must be truthful and isolated
- every visible interaction works locally
- no backend until the frontend loop is compelling
- first version feels like a real product teaser, not a hollow mockup

## 9. Verify With Screenshots And Interactions

Check:

- buttons
- forms
- filters
- selection states
- export/copy/download actions
- local persistence claims
- empty/loading/error states

Dead visible controls block handoff.

Screenshot or manually import app-only proof:

- 1440
- 1280
- 1024
- 768
- 390

Check layout integrity, contrast, scale, responsive nav, chart bounds, no overlap, no watermark/browser/editor artifacts.

## 10. Patch Visual Failures Before Functionality Expansion

If the visual shell fails, fix it before adding backend, extra panels, extra product logic, or more explanation.

Functionality deepening happens after visual shell strength, not before it.

## 11. Scorecard / Done Report

Run `evaluation/ui-scorecard.md`.

For visual UI work, validate a done report before final handoff.

## 12. Patch Design OS From Failures

If the project is a dogfood target or exposes a repeatable failure, translate the failure into:

- rule
- skill
- prompt
- schema
- checklist
- scorecard cap
- explicit open gap
