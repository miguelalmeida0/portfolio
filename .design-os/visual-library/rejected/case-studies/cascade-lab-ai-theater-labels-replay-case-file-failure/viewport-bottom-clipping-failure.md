# Viewport Bottom Clipping Failure

The bottom of the page cut content in the screenshot. This is not a subtle taste issue; it is a final integrity failure.

Bottom clipping often comes from fixed viewport containers, unsafe nested scroll regions, missing bottom padding, sticky overlays, or components sized against the wrong viewport.

## Rule

Critical content must never be cut by the bottom viewport edge at rest. If a panel scrolls, the scroll container must be obvious and must preserve readable bottom padding and safe areas.

## Score Caps

- critical content cut by bottom edge: max score 2
- panel/card bottom clipped at rest: max score 3
- bottom clipping remains after final gate: max score 2
