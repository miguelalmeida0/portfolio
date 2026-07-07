# Failure Report

## Verdict

Rejected execution. Promising direction, failed integrity.

## What Worked

- The mobile/small-screen direction had energy and a clear visual language.
- The bold hostel/radio/poster concept still has value.
- The physical-card and room-board idea is worth preserving when layout integrity is proven.

## What Failed

- Cut text remained visible.
- Critical panels were clipped by viewport edges.
- Containers were only partially visible at rest.
- Floating props drifted during resize and collided with other containers.
- Horizontal scroll choreography showed unreadable fragments.
- Huge blank space appeared without intentional composition value.
- The final gate passed or handoff happened despite visible blockers.

## Required Prevention

- Use Final UI Integrity Gate v3 before handoff.
- Sweep viewport widths from 360 to 1920 in 40px or smaller increments when practical.
- Test multiple viewport heights.
- Sample scroll positions and route states.
- Capture blockers and fail closed.
- Do not preserve scroll choreography if it damages readability.
