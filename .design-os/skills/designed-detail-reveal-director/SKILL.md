# Designed Detail Reveal Director

## Purpose
Plan and review non-default detail reveals that feel designed into the interface: drawers, panels, sleeves, split views, object pull-outs, station boards, route rooms, ritual selectors, and contextual detail surfaces.

This skill prevents default modal gravity when references call for richer detail behavior.

## Use When
- A list, card, object, service, media tile, work item, or menu needs a designed reveal.
- References include Wembi-like list/detail panels, Bucks-like card expansion, Podium-like media work reveals, or Don’t Board Me-like ritual selectors.
- A default modal would feel generic or break the visual system.
- Detail state must update visible product context.

## Do Not Use When
- A standard accessible dialog is correct and visual direction does not require a custom reveal.
- The task is a simple confirmation, alert, or settings form.
- There is no interactive detail state.

## Required Output Before Coding
- reveal pattern: drawer, side panel, sleeve, split view, pull-out, station board, ritual selector, inline expansion, or route room
- trigger model: click, hover, focus, scroll, keyboard, or route
- state model: selected item, open/closed, previous/next, nested state, URL if needed
- content model: title, metadata, body, media, actions, related items
- focus and close behavior
- keyboard behavior: Tab, Escape, Enter/Space, arrows where relevant
- responsive fallback: mobile sheet, page route, accordion, or inline expansion
- text overflow handling
- scroll containment
- loading/empty/error states when async

## Detail Reveal Contract
Use this table before implementation:

| Trigger | Reveal Surface | State Updated | Focus Rule | Close Rule | Mobile Fallback | Text Risk |
|---|---|---|---|---|---|---|

## Hard Rules
- If a designed detail reveal is required, do not ship a default modal.
- Detail panels must update from real selection state.
- Open, close, focus, and keyboard behavior must be defined.
- Long content must scroll inside the reveal or route safely.
- Text must wrap or clamp without escaping.
- Mobile fallback must preserve content and actions.
- Details must not obscure the triggering context without a reason.

## Review Checks
- Does the reveal feel native to the page's art direction?
- Does selecting a different item change the visible detail content?
- Is focus moved and restored properly?
- Can keyboard users open and close it?
- Does the reveal survive long copy and small viewport height?
- Does it avoid generic dialog styling?

## Stop Conditions
- Default modal used where designed detail reveal was required.
- Detail panel overflows or lacks close/focus behavior.
- Selection state changes but detail content does not.
- Mobile fallback clips or hides primary actions.

## Score Caps
- default modal used where designed detail reveal was required: max score 5.
- detail panel overflows or lacks close/focus behavior: max score 4.
- detail reveal does not update from selected item: max score 4.
- detail text escapes or clips: max score 4.
- mobile detail reveal has no safe fallback: max score 5.

## Audit Upgrade: Self-Correction Contract

Audit fix: Make reveal details purposeful and stateful.

Required evidence:
- revealed detail, trigger, user value, motion/focus behavior, fallback, and screenshot/capture proof.

Repair routing:
- interaction-state-matrix-director owns state gaps; review-animations owns motion repair.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "designed-detail-reveal-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

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

## Trigger-Anchored Detail Requirement

Every detail reveal must preserve the relationship between selected trigger and revealed content.

Before implementation, define:

- trigger type
- reveal pattern
- spatial relationship
- selected state
- detail position
- close behavior
- focus behavior
- mobile behavior
- accessibility labels
- data hooks

After implementation, verify:

- click selected card
- detail appears in connected position
- selected item remains clear
- keyboard/focus behavior is acceptable
- mobile behavior works
- detail does not open lost elsewhere on page

Hard rule:

If the detail panel feels disconnected from the clicked object, final verdict cannot pass.

Required hooks:

- `data-detail-trigger`
- `data-detail-panel`
- `data-detail-for`
- `data-selected-item`

Score caps:

- detail panel disconnected from trigger: max score 4.
- selected item not visibly connected to detail: max score 5.
- detail opens below fold without focus/scroll: max score 4.
- default modal used where designed reveal required: max score 5.
- no selected state on trigger: max score 5.
- no close/focus/keyboard strategy: max score 5.
