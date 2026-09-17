# Final UI Integrity Report

## Summary

- URL:
- Created:
- Gate version: v3
- Width sweep tested:
- Height matrix tested:
- Legacy viewports tested:
- Scroll samples tested:
- Interaction states tested:
- Blocker count:
- Screenshot evidence directory:
- Failed viewport states:
- Passed viewport states:
- Final handoff allowed: yes / no
- Verdict: passed / partial / failed / blocked

## Findings

| Check | Evidence | Result | Severity | Required Fix |
|---|---|---|---|---|
| clipped text |  |  |  |  |
| text overflow |  |  |  |  |
| nav overflow |  |  |  |  |
| card/container overlap |  |  |  |  |
| floating object drift/overlap |  |  |  |  |
| viewport-edge clipping |  |  |  |  |
| horizontal scroll partial content |  |  |  |  |
| blank scroll state |  |  |  |  |
| fixed/sticky overlay covering content |  |  |  |  |
| media/image/video over text |  |  |  |  |
| accidental huge blank viewport |  |  |  |  |
| body horizontal overflow |  |  |  |  |
| viewport clipping |  |  |  |  |
| unreadable or hidden content |  |  |  |  |
| scroll-state collision |  |  |  |  |
| mobile/compact nav clarity |  |  |  |  |
| mobile route nav disappears on scroll |  |  |  |  |
| mobile bottom nav safe-area/accessibility |  |  |  |  |
| top-only mobile route nav |  |  |  |  |
| CTA/button label fit |  |  |  |  |
| detail panel fit |  |  |  |  |
| detail reveal disconnected from trigger |  |  |  |  |
| selected detail missing panel |  |  |  |  |
| card title/body fit |  |  |  |  |
| fake live/realtime/status copy |  |  |  |  |
| fake live icon/dot/ticker |  |  |  |  |
| fake narrative/replay/mission/case-file chrome |  |  |  |  |
| generic domain theater / random mock data |  |  |  |  |
| oversized replay/status metadata strip |  |  |  |  |
| sepia/espresso/umber container surface |  |  |  |  |
| layered container corner alignment |  |  |  |  |
| media/frontplate/backplate radius alignment |  |  |  |  |
| brand chrome readability |  |  |  |  |
| app name over variable/dark background |  |  |  |  |
| nav active state maps to clicked item |  |  |  |  |
| nav visual/aria active state agreement |  |  |  |  |
| WebGL/shader primitive fallback/proof |  |  |  |  |
| WebGL/canvas pointer trap or content collision |  |  |  |  |

## Gate Rule

Final handoff is forbidden unless verdict is `passed`, blocker count is `0`, `failedViewportStates` is empty, width sweep and height matrix evidence exist, and `finalHandoffAllowed` is `true`. If verdict is `failed` or `blocked`, fix and rerun validation. Do not report a failed or blocked gate as passed.

Detail reveals must be anchored to clicked/selected triggers or use explicit focus/scroll/sheet context. Mobile route/app navigation must remain bottom-accessible after scroll. Either failure blocks handoff.

Fake live/realtime language must have real live behavior. Layered/offset containers must have clean corner geometry. Brand chrome must remain readable over every background state. Every nav item must activate itself when clicked. Any of these failures blocks handoff.

WebGL/shader primitives must pass their own gate. ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo, animated premium gradient, or shader atmosphere work must include product rationale, static fallback, reduced-motion fallback, mobile behavior, bounded canvas/GPU area, pointer-event strategy, performance note, and screenshot proof. Liquid Logo is source/reference only, not a normal npm dependency.
