# Mobile Product Guidance

Use with `design-dna/mobile-product-rules.md` and `skills/mobile-product-flow/SKILL.md`.

## Core Principle

Mobile product UI is not only a visual surface. It must prove fit, state, and touch clarity at 390 px.

## Required Checks

- Modal and bottom sheet fit: max-height, internal scroll, visible/sticky actions, safe-area bottom, reachable close control, no collision with bottom nav.
- Bottom navigation: practical product apps need semantic icons plus readable labels, consistent icon family, active state on both icon and label, and no badge crowding.
- Selection state: chips, tabs, object selectors, filters, and segmented controls visibly preserve selected state until changed.
- Control indicators: active bars, progress strips, underlines, and selected indicators never cross labels or content.
- Add/create actions: visually distinct from content/list/object cards, with explicit plus/create affordance.

## Stop Signals

- Sheet is clipped or opens too low.
- Primary sheet action is below viewport.
- Text-only bottom nav appears in a practical product app without justification.
- Tap state disappears immediately or flickers.
- Add tile can be mistaken for an object card.
- Indicator line crosses label text.

## Preferred Documentation

Document these in `docs/design/visual-spec.md`:

- `Modal / Sheet Fit Strategy`
- `Mobile Navigation Icon Strategy`
- `Selection State Strategy`
- `Control Decoration Collision Check`
- `Add / Create Action Strategy`

Use `visual-library/rejected/case-studies/shelf-circle-mobile-product-failures/` as rejected evidence.
