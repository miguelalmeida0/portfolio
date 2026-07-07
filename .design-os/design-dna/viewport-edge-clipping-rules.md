# Viewport Edge Clipping

Critical content must not be accidentally clipped by viewport edges.

Critical content includes:
- headings
- card titles
- card bodies
- CTAs
- nav labels
- station labels
- media captions
- detail panels
- active scroll chapter content
- any `data-layout-critical`
- any `data-protected-text`
- any `data-card`
- any `data-text-fit`

## Hard Blockers

- text is cut by viewport edge
- text, panel, card, or navigation content is cut by the bottom viewport edge at rest
- active card is partially offscreen and unreadable
- panel is partially outside viewport
- section's main content is clipped at rest
- nested scroll region cuts the final card/text without clear internal scroll affordance and bottom padding
- sticky/fixed bottom element hides content
- horizontal scroll stage shows only fragments of critical content
- large headline is cut without an intentional, documented editorial crop
- CTA/button is partially outside viewport
- critical content requires guessing or manual horizontal drag to read

## Allowed

- intentional editorial type cropping only if documented, non-critical, not body/card/nav/CTA text, and screenshot proof shows it improves composition
- decorative offscreen objects
- carousel peeking only if active item is fully readable

## Score Caps

- critical text clipped by viewport edge: max score 2
- critical content cut by bottom edge: max score 2
- active card/panel partially unreadable: max score 3
- panel/card bottom clipped at rest: max score 3
- CTA/nav clipped by viewport edge: max score 3
- horizontal scroll shows partial critical content at rest: max score 3
- no viewport-edge clipping check: max score 5
- bottom clipping remains after final gate: max score 2
