# Physical Interface Props Director

## Purpose
Plan and review tactile UI props such as stickers, labels, tickets, stamps, keycards, wristbands, notice slips, rails, tabs, pins, cards, tags, and physical overlays.

Props must behave like useful interface objects. They are not random decoration.

## Use When
- A landing, brand, portfolio, editorial, playful product, or media site uses physical UI language.
- References include product labels, ingredient cards, work cards, tickets, stickers, pinned notes, keycards, rails, or tabs.
- The UI needs a memorable tactile system instead of generic cards.
- Text is placed inside rotated, layered, clipped, or physical-feeling objects.

## Do Not Use When
- Ordinary cards, tables, forms, or product panels are enough.
- The page is a high-frequency utility where props slow comprehension.
- Props are purely decorative and not part of the selected visual direction.

## Required Output Before Coding
- prop inventory: each prop, role, content, and owner section
- material language: paper, label, foil, plastic, sticker, screen, cloth, stamp, rail, tab, or card
- text-fit strategy: max copy length, clamp/wrap, font size, rotation limits
- protected text zones: inner padding, safe areas, overlap bans
- layer/z-index strategy
- motion behavior: hover, enter, settle, stack, peel, dock, or no motion
- responsive behavior
- accessibility/decorative status
- print/physical metaphor boundaries: what is interactive vs decorative

## Prop Inventory
Use this table before implementation:

| Prop | Role | Content | Material | Text Fit | Layer | Interaction | Risk |
|---|---|---|---|---|---|---|---|

## Hard Rules
- A physical prop must have a role: navigation, status, label, proof, quote, action, category, selection, or information reveal.
- Props must never clip readable text.
- Props must not cover critical copy, controls, or media subjects.
- Rotated props need larger text safe zones.
- Decorative props must be limited and secondary.
- Props need responsive fallbacks, especially on mobile.
- Prop copy must remain legible and translation-aware.
- Do not create sticker soup, ticket soup, or random label clutter.

## Review Checks
- Can every prop be named and justified?
- Does the prop's material match the product world?
- Is prop text readable at all supported breakpoints?
- Do props layer intentionally, or just overlap?
- Does motion make props feel physical without hiding content?
- Are props carrying interface meaning?

## Stop Conditions
- Physical prop clips text.
- Prop covers a critical label, CTA, nav, or media subject.
- Prop has no role or text-fit strategy.
- Prop system collapses into random decoration.

## Score Caps
- physical prop clips text: max score 3.
- physical prop has no role/text-fit strategy: max score 5.
- prop covers critical text or controls: max score 4.
- repeated props become random decoration: max score 5.
- prop text is unreadable on mobile: max score 5.

## Audit Upgrade: Self-Correction Contract

Audit fix: Use props as functional interface objects, not random decoration.

Required evidence:
- prop role, affordance, material, scale, interaction relation, and accessibility meaning/decorative status.

Repair routing:
- vector-form-system-director and material-surface-director own form/material repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "physical-interface-props-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Hero-Only Media Default

For video-led pages, the default is:

1. Use video as the hero/top-stage object.
2. Remove or dock video after the hero unless a later state has an explicit role.
3. Never allow persistent media overlay to cover content.
4. Never thin content containers to fit media.
5. If media stays visible during scroll, it must live in a reserved media lane.

## Media Must Yield To Content

If media and text compete:

- text wins
- CTA wins
- navigation wins
- content card readability wins
- media moves, docks, shrinks, or exits

The agent must not preserve a media gimmick by damaging readability.

## Final UI Integrity Gate v3

For visual/frontend work, final UI integrity v3 is mandatory before handoff. Screenshot evidence at only one width is insufficient.

Required v3 proof:
- Test viewport matrix: 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920.
- Sample scroll positions: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00.
- Include applicable states: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, and reduced motion when practical.
- Report passed and failed sampled viewport states.

Floating labels, stickers, cards, badges, props, and containers require responsive anchoring and overlap checks. Final response must not claim success if the v3 gate fails, is blocked, has blockers, has cut text, has floating overlap, has media/text collision, has nav overflow, or lacks matrix evidence.

## Final UI Integrity Gate v3

Final UI Integrity Gate v3 is mandatory. Fixed breakpoint-only evidence is insufficient. Width sweep evidence is required. Horizontal scroll must prove readable resting states. Floating objects must prove safe across resizing. Final response is forbidden unless the gate passes or clearly reports blocked/failed.
