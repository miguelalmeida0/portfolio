# Purposeful Whitespace

Whitespace is allowed only when it creates intentional focus, rhythm, scale, or pause.

## Hard Blockers

- huge blank area caused by missing content
- empty viewport region caused by layout bug
- sticky/pinned section leaves dead blank space
- hero/section content accidentally pushed offscreen
- scroll stage has a blank frame with no visual payoff
- whitespace caused by fixed min-height without composition plan

## Required

- every large empty area must have an explicit compositional purpose
- if a section is intentionally sparse, the focal object must be strong
- empty stage must create suspense, not look unfinished
- whitespace must be checked at required breakpoints

## Final UI Integrity Gate

Before final handoff, run `final-ui-integrity-gate`. Accidental huge blank viewport areas, dead pinned sections, or content pushed offscreen by fixed overlays are blockers unless explicitly documented and proven by screenshots.

## Score Caps

- large accidental blank viewport area: max score 4
- empty space from layout bug: max score 3
- scroll/pinned stage has blank dead frame: max score 4
- whitespace has no stated purpose in visual spec: max score 6

## Final UI Integrity Gate v2 Addendum

Whitespace must be checked across the full final UI v2 viewport matrix and scroll samples.

Hard blockers:

- accidental blank viewport area at any sampled width
- scroll/pinned stage has a blank dead frame at any sampled scroll point
- floating object or fixed-height section creates unexpected empty space

If accidental blank space appears at any sampled width or scroll point, final handoff is blocked.
