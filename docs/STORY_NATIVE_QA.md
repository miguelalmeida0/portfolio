# Story editorial redesign, 6 October 2026

This supersedes STORY_PACING_QA.md. The user rejected paced chapter scrolling
and explicitly requested a redesign that needs no scrolling changes.

## Design

- Native document scrolling on every device. Remove the chapter controller and
  exclude Story from Lenis installation, including custom anchor travel.
- A visible introduction, compact topic index, and eight editorial rows. Each
  answer owns its illustration in normal document flow; none are exchanged in a
  sticky stage or gated by the reader's scroll position.
- One fixed top-right Back link to home. The index uses real hash links that
  remain useful with JavaScript disabled. No fixed bottom dock or repeated step
  buttons, no viewport-sized chapters, no nested illustration scrollers.
- Preserve the authored answers and interactive examples. Play examples only
  when requested, with reduced-motion state changes applied immediately.
- The green short version is a normal, always-accessible section with copy and
  contact actions. No timed hold and no claim that all eight were read.
- Keep existing colors and professional type. Desktop uses an index rail and
  answer/example pairs; tablet and mobile use a normal stacked reading flow.

## Regression evidence

The previous controller captures wheel, touchmove and navigation keys, cancels
their default behavior and writes scroll positions through a GSAP tween. A
small input in the live browser moved from y=0 to y=590 and selected chapter 2.

The native-wheel regression waits for hydration and observes cancellation in a
later task, after every event listener has completed. A microtask observation
was too early in a native event dispatch and was corrected before accepting it.

The corrected regression failed against `85c162b` in run 37476411512:
the wheel event was prevented. Implementation results follow after validation.
