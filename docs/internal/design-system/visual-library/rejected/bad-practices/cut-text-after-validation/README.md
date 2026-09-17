# Cut Text After Validation

## What Failed

Text remained visibly cut/clipped after final UI validation.

## Why Breakpoint-Only Checking Missed It

Text clipping can appear at specific widths, scroll states, sticky states, selected states, or inside parent overflow contexts. Checking only a few screenshots is not enough.

## Why Final Handoff Must Be Blocked

Critical text clipping is a P0 visual integrity failure. A passed handoff with cut text trains the system to ignore screenshot evidence.

## Required Future Detection Method

- Inspect all visible text elements.
- Detect scrollWidth/clientWidth and scrollHeight/clientHeight mismatch.
- Detect parent clipping under `overflow: hidden` or `overflow: clip`.
- Include failed/passed viewport state lists in the final report.
