# selection-first-products

## Name

selection-first-products

## Description

Design and review products where the core loop is choosing, browsing, collecting, comparing, or opening one object from a set.

## Use When

- Gallery.
- Roster.
- Marketplace.
- Discovery interface.
- Card deck.
- Character selection.
- Product/object browsing.
- Template picker, robot selector, model chooser, portfolio gallery, or item catalog where desire matters.

## Do Not Use When

- The primary task is editing one object after selection.
- The screen is an operational dashboard where urgency matters more than desire.
- The task is a minor bug fix or copy edit.

## Required Inputs

- Primary selectable object.
- Desired post-selection action.
- Object attributes that create desire.
- Existing card/list/gallery patterns, if any.
- Rejected directions, if any.

## Files To Read

- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `design-dna/screen-archetypes.md`
- `design-dna/layout-recipes.md`
- `design-dna/rejected-directions.md`
- `evaluation/ui-scorecard.md`

## Workflow

1. Define why the selectable objects are desirable.
2. Make the first screen create desire before details.
3. Make objects visually distinct enough to compare, choose, or collect.
4. Avoid boring catalog grids when the product needs energy.
5. Do not expose dense stats, meters, tabs, or technical analysis before selection.
6. Use progressive disclosure after choice.
7. Define hover and selected-state rewards before styling cards.
8. Make selected state persistent until changed; hover, pressed, focus, and selected states must not collapse into the same styling.
9. Make add/create actions visually distinct from content cards so creation cannot be mistaken for an object.
10. Make the detail view feel like the product world, not a brochure.
11. Verify `390 / 768 / 1440` layouts if screenshots exist or the app can run.

## Stop Conditions

- Stop if the first screen does not create a "which one do I choose?" moment.
- Stop if cards feel passive.
- Stop if details overwhelm desire before selection.
- Stop if selected state is only a border or color change and selection is central.
- Stop if a selectable chip, tab, or object item does not visibly preserve selected state.
- Stop if an add/create card masquerades as a normal content item.

## Output Contract

```md
Selection-first object:
Desire mechanism:
First-screen choice moment:
Hidden until after selection:
Hover reward:
Selected reward:
Selected persistence:
Add/create affordance:
Detail view model:
Screenshots/evidence:
Blockers:
```

## Scorecard Blockers

- Selection-first app without desire-to-click: max score 7.
- First-screen information wall: max score 7.
- Excitement created mainly through badges/glows/stats: max score 7.
- Clickable/passive ambiguity: max score 7.
- Selectable chip/item does not retain selected state: max score 4.
- Add/new action looks like a normal content item: max score 5.

## Safety/Scope Rules

- Do not make every app game-like.
- Do not force Robot Skill Forge's direction onto unrelated products.
- Do not use fake rarity, power, or live labels unless the product truth supports them.
- Do not hide information required for safety, pricing, consent, or critical decisions.

## Audit Upgrade: Self-Correction Contract

Audit fix: Prove the selection loop, not just card aesthetics.

Required evidence:
- object set, selected state, preview/detail relationship, compare/browse rhythm, and interaction proof.

Repair routing:
- make-interfaces-feel-better owns feedback polish; screenshot-scorecard-review owns selected-state evidence.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "selection-first-products"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
