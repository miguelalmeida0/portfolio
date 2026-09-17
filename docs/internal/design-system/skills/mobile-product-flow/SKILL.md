---
name: mobile-product-flow
description: Design or review mobile-first product flows with native-feeling hierarchy, safe-area behavior, thumb-friendly actions, icon+label bottom navigation by default for 3+ primary destinations, modal/sheet fit, persistent selected states, distinct add/create affordances, screen-by-screen flow proof, mobile visual references, and prevention of scaled-down website UI. Use for mobile apps, mobile web flows, onboarding, profiles, search/home screens, consumer apps, and mobile reference folders.
---

# Mobile Product Flow

Use when the primary experience is mobile or when Migi points to mobile app references.

## Files To Read

- `visual-library/README.md`
- `design-dna/design-generation-dials.md`
- `design-dna/design-system-first-rules.md`
- `design-dna/mobile-navigation-defaults.md`
- `design-dna/mobile-product-rules.md`
- `design-intelligence/navigation-pattern-guidance.md`
- `design-intelligence/navigation-patterns.json`
- `design-intelligence/mobile-product-guidance.md`
- `design-intelligence/mobile-product-patterns.json`
- `design-intelligence/style-taxonomy.md`
- `docs/design/mobile-flow-spec.md`

## Workflow

1. Set `MOBILE_NATIVE_FEEL`.
2. Identify the core mobile loop.
3. Define screen hierarchy and thumb zones.
4. If this is a new visual-heavy mobile app with no approved direction, confirm the Three-Direction Mockup Gate happened before coding.
   - Direction A should be Safe Refined.
   - Direction B should be Artistic Expressive.
   - Direction C should be Unexpected High-Character.
   - The directions must differ in screen hierarchy, palette, navigation feel, imagery/media use, motion, and mobile product rhythm.
5. Define navigation: bottom nav by default for 3+ primary destinations; document any top-nav exception.
   - Still make it art-directed: spacing, icon/text alignment, selected state, material, and relationship to the screen concept must feel intentional.
   - For practical product apps, each bottom-nav destination needs a semantic icon plus readable label.
6. Define safe-area behavior.
7. Define modal/sheet fit behavior: max-height, internal scroll, visible/sticky actions, close control, and relationship to bottom nav.
8. Define touch targets and spacing.
9. Define selectable control states: hover, pressed, focus, selected, disabled, and persistence source.
10. Define add/create action treatment so it cannot be mistaken for a content card.
11. Define control indicator layers so bars/underlines/progress strips cannot overlap labels.
12. Define mobile-specific states and transitions.
13. Prove the flow at 390 px before claiming quality.

## Mobile Rules

- Mobile is not a desktop website squeezed down.
- For apps with 3+ primary destinations, mobile defaults to bottom navigation.
- Top navigation is acceptable only for documentation sites, desktop-first enterprise tools, editor software, or scrolling-first websites.
- The top of mobile app screens should hold branding, current page title, search, context, or hero imagery, not primary navigation.
- Use thumb-safe primary actions.
- Keep labels readable.
- Avoid tiny Dribbble stills with no flow.
- Bottom nav must be polished, not cramped, not oversized, not generic, and safe-area aware.
- Practical mobile product bottom nav should use icons plus labels.
- Mobile nav must be designed as part of the product's visual world, not copied from desktop.
- Modals, bottom sheets, drawers, and detail panels must fit the viewport, respect safe areas, and keep primary actions visible or internally scrollable.
- Selectable chips, tabs, filters, category selectors, segmented controls, and object buttons must preserve selected state until changed.
- Active bars, progress strips, underlines, and selected indicators must never overlap labels or content.
- Add/create actions must look different from content/list/object cards and use a clear plus/create affordance.
- Cards must not become unreadable.
- Preserve product loop, not just visual beauty.
- Direction options must be meaningfully different when visual direction is not approved.
- Each mobile direction should include palette, typography, layout, imagery, motion, mobile strategy, risks, and AI-default avoided.

## Mobile Navigation Review

Ask:

- Should this become bottom navigation?
- Does the app have 3+ primary destinations?
- Is a mobile top-nav exception truly justified?
- Is valuable vertical space being wasted?
- Does this feel like a premium mobile product?
- Is the bottom navigation crafted or generic?
- Does the nav match the selected visual direction?
- Is the CTA/nav relationship intentional?
- Does nav support or damage the first screen?
- Does nav remain readable over hero imagery, large type, or changing backgrounds?
- Is any logo/app-name/initials chrome necessary, or is it wasting mobile space?
- Are icon and text alignment excellent?
- Are touch targets generous?
- Is the active state intentional?
- Does the nav respect safe areas and gesture navigation?
- Does every practical product destination have a semantic icon plus label?
- Do badges/counters avoid crowding icons and labels?
- Are labels readable and never cramped?

## Mobile Product Interaction Review

Ask:

- Does every modal, drawer, sheet, or detail panel fit the 390 px viewport?
- Are primary sheet actions visible, sticky, or safely reachable?
- Can long sheet content scroll internally?
- Does the sheet respect `safe-area-inset-bottom`?
- Does the sheet collide with bottom navigation?
- Do active bars, progress strips, or underlines overlap button, chip, tab, or nav labels?
- Do selectable chips/items preserve selected state after tap?
- Are hover, pressed, focused, and selected states visually different?
- Does the selected state update actual UI behavior?
- Is the add/create action visually distinct from content cards?
- Does the add action use a clear plus/create affordance?

## Output

Include in `docs/design/visual-spec.md`:

- mobile core loop
- mobile nav plan
- bottom-nav default or exception
- selected mobile navigation pattern
- mobile navigation icon strategy
- CTA/nav relationship
- direction options / selected direction when applicable
- why the selected mobile direction won over the other two
- safe-area plan
- modal / sheet fit strategy
- selection state strategy
- control decoration collision check
- add / create action strategy
- thumb/action plan
- screen sequence
- 390 proof plan

Also create or fill:

- `docs/design/mobile-flow-spec.md`

## Stop Conditions

- mobile app looks like scaled-down website
- app with 3+ primary destinations uses desktop/top navigation on mobile without justification
- new visual-heavy mobile app skipped the Three-Direction Mockup Gate
- mobile directions are minor variations of the same screen stack or palette
- implementation starts before Migi chooses the mobile direction
- selected direction is missing or ignored
- nav is cramped or cryptic
- nav is unreadable over imagery/type/background
- forced app-name/logo/initials chrome wastes mobile top space without justification
- bottom navigation is generic, poorly aligned, cramped, oversized, or unsafe around gestures
- practical mobile product bottom nav is text-only without explicit justification
- bottom nav icons are missing, semantically unclear, inconsistent, or crowd labels
- mobile modal/sheet is cut off, opens awkwardly, hides primary actions, ignores safe areas, cannot scroll long content, or visually collides with bottom nav
- active bars, progress strips, underlines, or selection indicators overlap labels/content
- selectable chips/items/tabs do not visibly preserve selected state until changed
- add/create action looks like a normal content card or lacks plus/create affordance
- mobile navigation feels copied from desktop or disconnected from the screen art direction
- top and bottom nav duplicate the same primary destinations
- touch targets are too small
- beautiful screen has no usable flow
- text or cards are unreadable at 390

## Layout Integrity Gate

Mobile flow review must block clipped text, card/sticker text overflow, CTA label clipping, nav label overflow, and accidental blank viewport space.

For 390px and 768px proof:

- no words cut inside chips, cards, sheets, bottom nav, buttons, or tabs
- no active indicator overlaps labels/content
- no fixed-width nav or control forces dynamic text outside the hit target
- no modal/sheet/container clips its content
- no decorative object covers critical text

Run `skills/layout-integrity-review/SKILL.md` before final handoff for mobile flows.

## Audit Upgrade: Self-Correction Contract

Audit fix: Require screen-sequence and native behavior proof.

Required evidence:
- screen sequence, safe areas, thumb zones, bottom nav exception/default, sheet fit, and 390 screenshots.

Repair routing:
- layout-integrity-review owns collisions; screenshot-scorecard-review owns viewport proof.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "mobile-product-flow"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Small-Screen Nav Clarity Requirement

For every visual/product/landing/mobile page with navigation, the agent must define:

- desktop nav variant
- tablet nav variant
- mobile/compact nav variant
- label/icon behavior
- active state behavior
- accessible labels
- hit target sizes
- overflow behavior

Compact nav must use icons or a real menu pattern. Two-letter abbreviations are not a design system.

Review requirement:

- screenshot-scorecard-review must inspect compact nav at 768 and 390
- layout-integrity-review must flag abbreviation fallback as a failure
- final-scorecard cannot pass if compact nav looks clipped, cryptic, or broken

## Final UI Integrity Gate Requirement

Before final handoff, run final-ui-integrity-gate.

The agent must not claim success if:

- clipped text remains
- overlap remains
- nav overflow remains
- media/text collision remains
- accidental blank space remains
- the user's original complaint remains true

The final review order must be:

1. build/lint
2. screenshot capture
3. scroll-choreography-review if scroll-heavy
4. layout-integrity-review
5. final-ui-integrity-gate
6. final-scorecard

## Mobile Bottom Navigation Requirement

For mobile route/app experiences, navigation must be persistent and bottom-positioned by default.

The agent must not place primary mobile route navigation only at the top unless the page is a simple document page and does not need persistent access.

For scroll-heavy experiences, mobile nav must remain accessible while scrolling.

Final review must check:

- mobile nav visibility after scroll
- bottom nav safe area
- active state
- accessible labels
- icon or icon + active label strategy

Score caps:

- mobile route nav disappears on scroll: max score 3.
- mobile nav is top-only for app-like route experience: max score 4.
- compact nav has no bottom/persistent access: max score 4.
- mobile nav lacks icons or clear labels: max score 4.
- mobile nav has no accessible labels: max score 5.

## Detail Reveal Spatial Context Requirement

Every card/item/detail interaction must preserve spatial context. The selected trigger and detail panel must be connected by layout, animation, placement, or explicit selected state.

Final review must check:

- selected card detail placement
- selected trigger remains clear
- detail panel is inline, adjacent, anchored, focused into view, or an explicit full-screen/mobile sheet
- close/focus/keyboard behavior is acceptable

If the detail panel feels disconnected from the clicked object, final verdict cannot pass.
