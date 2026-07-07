# Mobile Product Benchmark

## Purpose

Tests whether mobile apps and mobile web flows feel like real mobile products with screen-first hierarchy, safe areas, bottom navigation discipline, and usable local flow.

## Gold references

- `visual-library/approved/inspiration/mobile-apps/index.md`
- `visual-library/approved/inspiration/mobile-apps/01-dark-media-profile-pair-mobile.png`
- `visual-library/approved/inspiration/mobile-apps/04-warm-meditation-breathing-flow-mobile.png`
- `visual-library/approved/inspiration/mobile-apps/06-planetary-selector-hero-detail-mobile.png`
- `visual-library/approved/apps/atlas/screenshots/03-mobile-paste-input-layout.png`
- `visual-library/approved/apps/ontime/screenshots/01-tiny-invite-social-composer.png`
- `visual-library/approved/case-studies/tempo-loom-mobile-product-success/README.md`

## Rejected references

- `visual-library/rejected/navigation bar not responsive on resizing.png`
- `visual-library/rejected/non responsive and thinned out containers.png`
- `visual-library/rejected/not aligned input with buttons.png`
- `visual-library/rejected/overlaping containers.png`
- `visual-library/rejected/case-studies/shelf-circle-mobile-product-failures/README.md`

## What gold examples prove

- Composition: one screen has a clear product job and thumb-friendly hierarchy.
- Palette: mobile color can be premium, warm, dark, cinematic, or playful when controlled.
- Typography: readable mobile type, clear labels, and no desktop-scale headings.
- Image/object/media use: media supports identity, selection, or proof.
- Motion: motion should communicate feedback, transition, or progress without slowing repeated use.
- Density: mobile surfaces are compact but not cramped.
- Responsive behavior: safe areas, bottom nav, and touch targets survive 390 px.
- Interaction quality: visible actions work locally and imply a real flow.
- Tempo Loom proves mobile product flow can be dense without being confusing.
- Tempo Loom proves bottom nav should use icons and labels in practical product apps.
- Tempo Loom proves selected states should persist and feel tactile.
- Tempo Loom proves controls should be product-specific, not generic forms.
- Tempo Loom proves practical UI can still have strong taste without cinematic landing leakage.

Tempo Loom is not a visual pattern to clone blindly. It is a benchmark for interaction clarity, statefulness, product-specific controls, truthful copy, and mobile product craft.

## What rejected examples prove

- Desktop nav copied to mobile fails.
- Bottom navigation must be crafted, not generic or cramped.
- Practical mobile product bottom nav needs semantic icons plus readable labels.
- Mobile modals/sheets must fit the viewport, safe areas, and internal scroll/action needs.
- Selection controls must visibly retain selected state.
- Add/create actions must not look like normal content cards.
- Control indicators must not cross labels or content.
- Squeezed containers and overlapping controls fail before taste scoring.
- Misaligned search/actions make mobile feel junior.

## Required Design OS skills

- `skills/mobile-product-flow/SKILL.md`
- `skills/visual-spec-compiler/SKILL.md`
- `skills/oklch-contrast-palette/SKILL.md`
- `skills/screenshot-scorecard-review/SKILL.md`
- `skills/make-interfaces-feel-better/SKILL.md`

## Required prompt template

- `templates/prompts/codex-mobile-product-flow.md`
- `templates/prompts/benchmark-scoring-review.md`

## Screenshot evidence required

- 390
- 768
- 1024 when tablet adaptation exists

## Hard failure signs

- Mobile app looks like a phone-sized website.
- App with 3+ destinations lacks bottom navigation without justified exception.
- Poor safe-area support.
- Tiny or cryptic navigation labels.
- Touch targets are uncomfortable.
- Core screen is unreadable at 390.
- Modal/sheet is cut off or hides actions.
- Bottom nav has labels but no icons in a practical product app.
- Selectable chip/item does not preserve selected state.
- Add card masquerades as content.
- Active/progress/underline indicator overlaps labels.

## Scoring criteria

- Platform-native mobile hierarchy: 20
- Bottom navigation / safe-area / sheet craft: 20
- Touch targets, selection state, and interaction clarity: 15
- Screen-first product flow: 15
- Mobile typography readability: 10
- Palette and image/media fit: 10
- Screenshot evidence and done report: 10
