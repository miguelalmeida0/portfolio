# Viewport Bottom Content Cutoff

Content cut at the bottom of a viewport is a blocker.

## Why It Fails

It makes the app feel unfinished and amateur even when there are no obvious overlaps elsewhere.

## Detect

- card, panel, nav, or text cut by the bottom edge at rest
- nested scroll containers without bottom padding
- fixed-height panels clipping content
- sticky/fixed overlays hiding final rows

## Fix

Remove unsafe fixed heights, add real bottom padding/safe area, expose scroll behavior, and test height as well as width.

## Score Caps

- critical content cut by bottom edge: max score 2
- panel/card bottom clipped at rest: max score 3
- bottom clipping remains after final gate: max score 2
