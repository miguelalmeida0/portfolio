# Text / Container Integrity

Text must never be accidentally clipped, hidden, covered, or forced outside its intended container.

## Hard Blockers

- word cut off inside a card, sticker, nav pill, badge, button, tab, modal, or panel
- text escaping a container
- overlay object covering important headline/body/navigation text
- heading hidden behind a card/sticker/image
- button label clipped
- nav label clipped
- text visually present but unreadable because of shape/texture/background
- container too small for its text at any required breakpoint
- `overflow: hidden` used to hide text failure
- fixed-width container used for dynamic labels without responsive fallback

## Required Implementation Principles

- containers must size to content unless intentionally constrained
- if constrained, text must wrap, shrink, or switch representation intentionally
- use `min-width: 0` for flex/grid children
- use `overflow-wrap`, `text-wrap`, and `line-clamp` only intentionally
- avoid fixed heights for text-heavy containers
- no absolute-positioned object may overlap protected text zones
- every sticker/card/badge/nav item must have a text-fit strategy
- all critical text must survive 1440, 1280, 1024, 768, and 390

## Recommended CSS Patterns

- `inline-size: max-content` for small labels where safe
- `max-inline-size` with wrapping for variable text
- `text-wrap: balance` for large headlines where supported
- `overflow-wrap: anywhere` only for non-brand long strings, never as a visual crutch
- `min-width: 0` on flex/grid children
- `clamp()` for large display type
- container queries if available for label-to-icon transitions

## Hard Bans

- clipping text to preserve composition
- hiding overflow on content containers without proof
- absolute sticker over headline without protected-zone check
- nav pill with fixed width and dynamic text
- labels inside circles unless label length is known and tested
- decorative shape/card covering headline text

## No Hidden Text Fixes

Do not use overflow hidden, clip, max-height, fixed height, or masking to hide a text-fit failure.

If text is intentionally truncated:

- it must be non-critical
- it must have a title/aria/full-detail path
- it must be documented
- it must not be CTA/nav/card title text

## Final UI Integrity Gate

Before final handoff, run `final-ui-integrity-gate`. If clipped text, cut words, CTA/button clipping, card title/body clipping, or text hidden by overflow appears in any required screenshot, the final verdict is failed.

## No Container Thinning To Fit Media

Never make content containers unnaturally narrow just to keep a video/image/shape visible.

### Hard Blockers

- card width causes important words to split awkwardly
- headline breaks into unreadable fragments because media takes space
- body copy becomes a skinny vertical column
- CTA/card label wraps awkwardly because media is protected
- layout prioritizes media object over content readability

### Required

- content containers must have minimum readable widths
- cards need content-fit minimums
- media must move, resize, leave, or dock elsewhere before text becomes unreadable
- if viewport is narrow, media stacks above/below content instead of compressing text
- define min/max widths for text cards and media cards

### Recommended Minimums

- body text card: enough width for natural line length
- major headline card: enough width for phrase-level wrapping
- CTA/button: content-aware inline size
- room/event card: no title should split into one or two letters per line

### Score Caps

- text card thinned into unreadable column: max score 3
- headline/card title broken into awkward fragments by narrow container: max score 3
- media preserved while text readability collapses: max score 3
- no minimum readable container widths: max score 5

## Score Caps

- critical text clipped: max score 2
- word cut off in screenshot: max score 2
- nav label overflows item: max score 3
- sticker/card covers headline word: max score 3
- button/CTA text clipped: max score 3
- card title/body clipped: max score 3
- text hidden by `overflow: hidden`: max score 3
- unresolved text/container issue appears in screenshot: max score 3
- no text fit strategy for sticker/card/nav system: max score 5

## Final UI Integrity Gate v2 Addendum

Text/container integrity must be checked across the full final UI v2 viewport matrix and scroll samples, not only at fixed breakpoints.

If cut text remains after the gate, max score 2 and final handoff is blocked.

Every report must list failed and passed viewport/scroll/state samples for text clipping.
