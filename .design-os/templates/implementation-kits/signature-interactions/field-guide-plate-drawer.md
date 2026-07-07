# Field Guide Plate Drawer

Specimen plates begin scattered or stacked, then organize into an archival guide as the user scrolls.

## Required Pieces

- plate data model
- accessible DOM order
- scattered/stacked visual state
- organized drawer/list state
- label-safe zones
- reduced-motion organized state

## Implementation Notes

Use CSS transforms and local state by default. GSAP ScrollTrigger is optional for scrubbed drawer choreography. The ordered state must be usable without JavaScript motion.
