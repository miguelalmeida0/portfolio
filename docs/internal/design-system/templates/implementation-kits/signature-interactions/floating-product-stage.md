# Floating Product Stage

Alias for the Floating Product Ingredient Stage pattern.

Use this when a tangible product, ingredient, specimen, object, or material system should become the hero memory of the page.

## Required Ingredients

- primary product/object
- supporting ingredient/material/specimen objects
- foreground, midground, and background depth layers
- truthful labels
- safe zones for text and CTAs
- static fallback

## Implementation Notes

Use dependency-light CSS, SVG, or image layers by default. GSAP ScrollTrigger is optional when depth movement needs scrubbed scroll. Every floating object must have a role and must not become decorative confetti.

## Reduced Motion

Freeze object drift and present a static product stage with an ordered ingredient/material list.
