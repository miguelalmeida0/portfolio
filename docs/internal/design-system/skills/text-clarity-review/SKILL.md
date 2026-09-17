---
name: text-clarity-review
description: Post-implementation UX writing review that finds unclear, vague, generic, inconsistent, or confusing interface copy and rewrites it into clearer production-ready text.
---

# Text Clarity Review

Use after UI implementation, after screenshot review, before final polish, or when Migi says copy feels unclear, generic, AI, confusing, or not production-ready.

Do not use during Fast Direction Gate, early visual direction generation, or pure layout exploration unless visible copy is harming the UI.

## Inputs

- target screen/component
- audience technical level
- user mental state
- screenshots or source files if available
- current copy strings
- product terminology, if known

## Checks

- jargon, ambiguity, passive voice, vague CTAs
- generic labels like `Submit`, `OK`, `Click here`
- unclear errors, empty states, loading states, success states
- destructive confirmations that do not name object/consequence
- inconsistent terminology
- tone mismatch
- translation-unfriendly strings
- placeholder-only labels
- redundant headings/intros
- domain-generic labels such as `mission control`, `topology`, `traces`, `system map`, or `control room` when real business sections are needed

## UX Writing Rules

- Button labels use verb + object when the object is not obvious.
- Errors explain what happened, why, and how to fix it.
- Destructive actions name the exact object and consequence.
- Empty states explain what is missing and the next action.
- Loading states say what is happening.
- Success states confirm what changed.
- No humor in error states.
- No jargon without explanation.
- Avoid `OK`, `Submit`, `Yes`, `No`, and `Click here` unless truly unavoidable.
- Placeholders are not labels.
- Route and section names must use the business language users expect, not dramatic AI-theater labels.
- Keep strings translation-safe and terminology consistent.

## Required Output

```md
## Text Clarity Review

### Copy Health Verdict

### Copy Audit
| Location | Current Copy | Problem | Better Copy | Why |
|---|---|---|---|---|

### Revised Copy Strings

### Tone Notes

### Terminology Glossary

### Strings Needing Migi/Product Context

### Final Copy Checklist
```

## Scorecard Caps

- vague primary CTA: max copy score 6
- generic destructive confirmation: max copy score 5
- unclear error message with no fix: max copy score 5
- placeholder-only form labels: max copy score 5
- inconsistent terminology: max copy score 6
- generic route/section labels that do not match business tasks: max copy score 4
- copy assumes technical knowledge without context: max copy score 6
- loading longer than 3 seconds with only `Loading...`: max copy score 6
- empty state has no next action: max copy score 6

## Layout Integrity Gate

Readable copy is not valid if it is clipped, covered, or overflowing.

Before final copy approval, check:

- no word is cut inside cards, stickers, buttons, tabs, nav pills, badges, modals, or panels
- no label escapes a nav item or hit target
- no sticker/card/image/overlay covers headline/body/navigation text
- no `overflow: hidden` masks copy failure
- label hiding preserves accessible labels

Any clipped critical text or nav label overflow blocks handoff, regardless of copy quality.

## Audit Upgrade: Self-Correction Contract

Audit fix: Treat copy as state/action/consequence system.

Required evidence:
- unclear copy table, rewritten strings, affected states, and user consequence/recovery notes.

Repair routing:
- truthful-state-product-naming owns truth claims; implementation owner applies strings.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "text-clarity-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Elite Experience Specialist Routing

When a selected direction or reference asks for elite craft beyond broad signature/scroll planning, route the smallest relevant specialist:

- scroll-physics-smoothing-director for smoothing, scrub, lerp, snap, settle, velocity, touch behavior, mobile fallback, reduced motion, and scroll performance.
- media-object-stage-director when video/image/media is the primary object: hero, mask, sticky object, poster, portal, card, broadcast tile, or detail view.
- physical-interface-props-director for stickers, tickets, labels, stamps, keycards, rails, pins, tabs, and tactile cards.
- designed-detail-reveal-director for drawers, panels, sleeves, split views, object pull-outs, station boards, and ritual selectors.
- brand-voice-as-interface-director when CTAs, nav labels, cards, reviews, states, or microcopy must carry brand voice without losing clarity.

Blockers to flag: raw/jittery scroll, media used as generic background when object staging is required, prop text clipping, default modal where a designed reveal is required, and generic SaaS/hotel/template copy on a playful or brand-led site.

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

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists.

Copy review must replace fake live/activity language with honest labels such as Today, Tonight, Current board, Lobby board, Check-in board, Station board, Field notes, Latest notes, Front desk, House board, or Room board.

## No AI Theater Chrome

Reject decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, and fake severity/status chips unless they are real product objects with documented behavior.

Copy review must replace generic incident drama with honest route/task labels such as Overview, Timeline, Services, Traces, Dependencies, Root cause, Impact, Actions, Follow-up, Postmortem, Evidence, or Notes.

## Navigation Active State Correctness

Navigation copy and state must agree. When a nav item is clicked, that exact label/item must become active, and the active route label must not point to an adjacent or unrelated item.

First and last nav items must be included in click-through QA.

## Brand Chrome Readability

App names, wordmarks, initials, and logo text are interface copy. They must remain readable over every background state or be moved, plated, adapted, or removed.
