# Failure Report

## Summary

Late Check FM collapsed its compact navigation into arbitrary two-letter labels: IN, WL, BD, NW, RL, and BK. The labels require decoding, look like clipped text, and fail as a premium responsive navigation pattern.

## Failure Class

- Small-screen navigation abbreviation failure.
- Compact nav without icons.
- Accessible-name and recognition failure.
- Responsive fallback that looks broken.

## Why It Fails

Navigation should support recognition before recall. Two-letter codes force users to decode the interface, and on a visual page they read as layout damage rather than intentional compact design.

## Required Repair Direction

- Use a consistent icon system for compact navigation.
- Keep full accessible names through `aria-label` and screen-reader text.
- Show the active item full label when there is space.
- Use a real drawer/menu if too many destinations compete for space.
- Test the compact state at 768 and 390 before final handoff.
