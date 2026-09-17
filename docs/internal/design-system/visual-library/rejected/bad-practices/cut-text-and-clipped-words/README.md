# Cut Text And Clipped Words

## What The Failure Is

Words, card titles, button labels, nav labels, or body copy are visibly cut, clipped, hidden, or forced outside their intended container.

## Why It Kills Trust

Cut text is a basic product failure. It tells the user the interface is not ready and tells Migi the agent did not inspect its screenshots.

## How To Detect It

- Flag `scrollWidth > clientWidth`.
- Flag `scrollHeight > clientHeight`.
- Inspect text inside overflow-hidden or fixed-height containers.
- Treat screenshot-visible clipped words as P0.

## How To Fix It

- Increase container dimensions.
- Use responsive type and phrase-level wrapping.
- Remove fixed heights for text-heavy containers.
- Never hide important text with overflow or masks.

## Score Caps

- clipped critical text visible: max score 2
- word cut off in screenshot: max score 2
- CTA/button text clipped: max score 3
- card title/body clipped: max score 3

## Required Future Checks

- text-container-integrity rules
- layout-integrity-review
- final-ui-integrity-gate
