# Horizontal Scroll Safety

Horizontal scroll, sideways routes, and spatial scroll choreography are high-risk.

They are allowed only if:
- active content is fully readable at every resting state
- there is a clear route model
- horizontal overflow is intentional and documented
- no critical content is clipped by viewport edges
- cards/panels do not become partial unreadable fragments
- mobile fallback exists
- reduced-motion fallback exists
- the route has snap/settle states or clear readable sections

## Hard Blockers

- horizontal scroll creates random partial panels
- full containers are not displayed
- user cannot read full text at a scroll state
- large empty area appears while content is offscreen
- horizontal route has no snap/settle/readable state
- active section is split across viewport edges
- scroll route is visually impressive but harms comprehension

## Required

- scroll route map
- readable resting states
- active panel fully visible
- inactive panels may peek, but active one must fit
- no uncontrolled body horizontal overflow
- mobile simplifies to vertical readable flow
- final gate samples horizontal route states

## Score Caps

- horizontal route has unreadable partial content: max score 3
- active content cut during horizontal scroll: max score 3
- horizontal scroll creates accidental blank area: max score 4
- no horizontal fallback on mobile/tablet: max score 5
- horizontal route exists but no scroll safety review: max score 5
