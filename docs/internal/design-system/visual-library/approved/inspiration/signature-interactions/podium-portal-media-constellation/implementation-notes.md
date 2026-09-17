# Implementation Notes

## Build Strategy
- Start with a no-image direction gate and select the signature mechanic.
- Use local SVG, CSS transforms, React state, and semantic HTML first.
- Use GSAP ScrollTrigger only when pinned, scrubbed, or horizontal route choreography is genuinely needed.
- Keep the core content reachable without the signature motion.
- Add reduced-motion behavior before final review.

## QA
- Verify the mechanic is visible above or near the first meaningful viewport.
- Verify it does not block access.
- Verify keyboard and reduced-motion fallbacks.
- Verify responsive behavior at 1440, 1024, 768, and 390.
