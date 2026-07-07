# Persistent Video Overlay Failure

## Bad Pattern

The video remained above the page across multiple sections without a clear content role. It behaved like a floating signature effect rather than a designed media component.

## Symptoms

- Video covers room board and event card content.
- Video remains visible after the hero stage has ended.
- Content is arranged around the video instead of receiving normal layout space.
- The z-index stack makes media more important than reading.

## Rule

Video is hero-only by default. Persistent video requires a reserved lane, explicit media role, protected text zones, and scroll-state screenshot proof.

## Better Pattern

- Hero-only video stage.
- Later static poster/thumb inside a normal card if needed.
- Docked media card with reserved layout space.
- Sticky media only inside a dedicated lane that text never enters.
