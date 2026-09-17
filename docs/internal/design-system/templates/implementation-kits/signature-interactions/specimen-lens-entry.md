# Specimen Lens Entry

A tiny lens, seed, moon mark, or specimen dot acts as the entry object. On scroll or click, the user enters the object and reveals the guide.

## Required Pieces

- entry mark with accessible skip link
- mask or clip-path reveal
- static field-guide content in DOM
- reduced-motion static state
- proof that the reveal is not only fade/slide

## Implementation Notes

Use CSS `clip-path`, SVG mask, transform scale, or a simple overlay. Avoid fake WebGL/portal claims unless an actual shader/WebGL implementation exists.

GSAP ScrollTrigger is optional for scrubbed/pinned entry. Keep a click/skip path for keyboard users.
