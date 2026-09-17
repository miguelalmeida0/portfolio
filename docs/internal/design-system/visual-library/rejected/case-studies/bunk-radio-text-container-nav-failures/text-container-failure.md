# Text / Container Failure

## Failure

The implementation lets cards, stickers, and containers cover critical headline text. It also clips words inside fixed or constrained containers.

## Rules

- Text must never be accidentally clipped, hidden, covered, or forced outside its intended container.
- Containers must size to content unless intentionally constrained.
- If constrained, text must wrap, shrink, or switch representation intentionally.
- Fixed-height text-heavy containers require proof across required breakpoints.
- `overflow: hidden` may not be used to hide text failure.
- Stickers, cards, badges, nav items, and overlays require protected text zones.

## Score Caps

- critical text clipped: max score 2
- sticker/card covers headline word: max score 3
- button/CTA text clipped: max score 3
- text hidden by `overflow: hidden`: max score 3
- unresolved text/container issue appears in screenshot: max score 3
- no text fit strategy for sticker/card/nav system: max score 5
