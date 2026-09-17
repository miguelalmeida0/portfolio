# Final UI Integrity Gate Workflow

## Purpose

Mandatory final validation workflow before any frontend/design task is handed to Migi.

Run after:

- implementation
- build/lint
- screenshot capture
- scroll/media/layout work
- responsive pass

## Checks

1. text clipping
2. text overflow
3. nav overflow
4. card/container overlap
5. fixed/sticky overlay covering content
6. media/image/video over text
7. accidental huge blank viewport areas
8. body horizontal overflow
9. viewport clipping
10. unreadable or hidden content
11. scroll-state collisions
12. mobile/compact nav clarity
13. CTA/button label fit
14. detail panel fit
15. card title/body fit
16. viewport-edge clipping
17. floating-object resize drift
18. horizontal scroll partial content
19. blank scroll states

## Final UI Integrity Gate v3

Run a width sweep, not only fixed breakpoints.

Required command pattern:

```bash
node tools/final-ui-integrity-check.mjs --url <local-url> --out docs/qa/final-ui-integrity/ --width-sweep 360:1920:40 --heights 720,844,900,1080 --scroll-samples 0,0.1,0.2,0.35,0.5,0.65,0.8,0.9,1
```

The report must include width sweep, height matrix, scroll samples, passed states, failed states, blocker count, screenshot evidence directory, and final handoff allowed true/false.

## Hard Rule

If any P0 blocker is found, final handoff is forbidden.

## P0 Blockers

- any critical text clipped
- any word visibly cut
- any nav label overflow
- any CTA/button label clipped
- any card title/body clipped
- any media/image/video over readable text
- any container covering important text
- any fixed/sticky overlay covering content
- any body horizontal overflow not explicitly controlled
- any viewport-edge clipping of critical content
- any horizontal scroll route showing partial unreadable active content
- any floating object drifting into content after resize
- any blank scroll state without intentional marker
- any screenshot shows the user's complaint remains true

## Required Verdicts

- `passed`
- `partial`
- `failed`
- `blocked`

The final response may only claim `passed` if the final UI integrity gate passes. If the gate is blocked or failed, fix the UI and rerun validation before final handoff.
