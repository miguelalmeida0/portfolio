# Image-First Frontend Workflow

Use this when a frontend task is visually important and references, screenshots, generated section images, or visual-library material should define the result.

## Trigger

Use when Migi asks for:

- image-to-code
- screenshot-to-frontend reconstruction
- premium website or landing page
- artistic / cinematic / poster page
- reference-folder based design
- visual-heavy redesign
- generated concept-to-code workflow

## Rule

For visual-heavy tasks, do not start from generic component code.

Start from image/reference evidence, analyze it deeply, compile a visual spec, define design-system tokens, then implement.

If image generation is not available, use visual-library references or Migi-provided screenshots. If the user requests exact copying, switch to Literal Target Copy Mode.

## Workflow

1. Select the active mode.
2. Select exact reference anchors or section-level images.
3. Reject unreadable compressed boards.
4. Prefer one readable section reference per major section when possible.
5. Analyze each reference before coding.
6. Extract typography, spacing, layout, buttons, image treatment, color, surface logic, and motion cues.
7. Create `docs/design/reference-decomposition.md` when references are external or folder-based.
8. If the visual direction is not already approved, create `docs/design/direction-options.md` with three distinct directions and stop for Migi to choose.
9. After Migi chooses A, B, C, or a hybrid, create `docs/design/selected-direction.md`.
10. Create `docs/design/visual-spec.md` with a Direction Gate Summary.
11. If real imagery is needed, use `skills/unsplash-asset-sourcing/SKILL.md` before implementation.
12. Create `docs/design/unsplash-search-plan.md` and `docs/design/unsplash-asset-manifest.md` when Unsplash images are selected.
13. Define design-system tokens.
14. Implement visual shell first.
15. Add only the minimum visible interactions needed to evaluate the shell.
16. Capture screenshots.
17. Create `docs/qa/reference-match-report.md` or equivalent notes.

## Landing / Marketing / Portfolio Reference Rules

For landing, marketing, portfolio, and visual redesign work:

1. Generate or select one horizontal image/reference per section.
2. Never compress a multi-section page into one unreadable board.
3. Give every section a job: hook, proof, educate, compare, demonstrate, trust, convert, or close.
4. For each section, choose composition anchor, background mode, CTA variation, and image role.
5. When real photography is needed, create an Unsplash search plan before implementation.
6. Every major sourced image needs a manifest entry, source metadata, crop strategy, palette relationship, and text safe-zone notes.
7. Keep palette and typography locked across the page.
8. Before locking the palette, explore Safe Refined, Artistic Expressive, and Unexpected High-Character palette directions.
9. Vary section rhythm.
10. Avoid AI-classic hero defaults unless the brief supports them.
11. Run anti-AI-tell preflight before coding and before handoff.

## Required Analysis

For each reference, extract:

- canvas/background
- shell/navigation
- focal object or scene
- section rhythm
- typography roles
- image role
- image source metadata and asset manifest entry when real imagery is used
- button/control behavior
- spacing system
- palette/material system
- palette exploration options and why the selected palette avoids AI-default color
- responsive implications
- what should not be copied

## Stop Conditions

Stop before coding if:

- no readable visual reference exists
- no `docs/design/direction-options.md` exists when a new visual-heavy direction is not already approved
- Migi has not selected a direction
- no `docs/design/selected-direction.md` exists after Migi chooses
- references are too compressed to analyze
- no active dials are declared
- no visual spec exists
- no design-system direction exists
- artistic, cinematic, landing, portfolio, creative, editorial, or experimental work has no 3-direction palette exploration
- real imagery is needed but `docs/design/unsplash-search-plan.md` or `docs/design/unsplash-asset-manifest.md` is missing
- selected images are generic filler, source metadata is missing, or responsive crop/text safe-zone risks are unresolved
- landing/portfolio work has no anti-AI-tell plan
- section references compress multiple sections into one unreadable image
- exact target copy is requested but no target-copy report path exists
- the agent can only describe a vague vibe, not transferred mechanics

## Output

Use or create:

- `docs/design/reference-decomposition.md`
- `docs/design/design-transfer-spec.md`
- `docs/design/visual-spec.md`
- `docs/design/design-system-direction.md`
- `docs/design/unsplash-search-plan.md` when Unsplash sourcing is used
- `docs/design/unsplash-asset-manifest.md` when Unsplash sourcing is used
- `docs/qa/reference-match-report.md`

## Hard Reminder

Image-first means the image drives composition. It does not mean pasting images into generic grids.
