# Final Gate V3 Requirements

Final UI Integrity Gate v3 must:

- sweep widths from 360 to 1920 with 40px or smaller steps where practical
- test required height samples: 720, 844, 900, 1080
- sample scroll positions: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00
- capture screenshots for blocker states
- detect text clipping, viewport-edge clipping, partial active panels, floating drift, horizontal scroll partial content, media/text collision, and blank states
- write JSON and Markdown evidence
- exit nonzero when blockers remain
- forbid final handoff unless passed or explicitly blocked/failed
