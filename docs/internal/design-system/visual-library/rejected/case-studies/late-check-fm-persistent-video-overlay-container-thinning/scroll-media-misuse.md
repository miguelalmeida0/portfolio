# Scroll Media Misuse

## Bad Pattern

Scroll choreography kept the video alive as a persistent moving object, then routed it through content sections without protected zones.

## Failure Mode

- Scroll movement is introduced before the layout has safe media lanes.
- A video-to-object transform becomes more important than content readability.
- Intermediate scroll states are not reviewed for collision.
- The media stage never ends.

## Required Scroll Spec

- Define hero media start rect.
- Define media exit, dock, or static-thumb end state.
- Define forbidden overlap zones for all critical text.
- Sample scroll screenshots at start, 15%, 30%, 50%, 70%, 90%, and end.
- Run layout-integrity review after scroll choreography review.
