# Animation Standards

## Frequency

| Frequency | Decision |
| --- | --- |
| 100+ times/day | no animation |
| tens of times/day | remove or drastically reduce |
| occasional | standard animation |
| rare / first-time / milestone | delight can be considered |

## Valid Purposes

- feedback
- state transition
- spatial consistency
- hierarchy
- storytelling
- explanation
- perceived performance

## Durations

- button press: 100-160ms
- tooltip / small popover: 125-200ms
- dropdown / select: 150-250ms
- modal / drawer: 200-500ms
- normal UI: under 300ms by default

## Easing

- UI entry/responding: ease-out
- on-screen movement: ease-in-out
- constant loops: linear only where appropriate
- never use ease-in for UI

Recommended:

- `cubic-bezier(0.23, 1, 0.32, 1)`
- `cubic-bezier(0.77, 0, 0.175, 1)`
- `cubic-bezier(0.32, 0.72, 0, 1)` for drawers

## Physicality

- never start from `scale(0)`
- start from `scale(0.95)` plus opacity for entrances
- press feedback: `scale(0.95-0.98)`
- popovers scale from trigger
- modals may remain centered
- exits are usually faster than entrances

## Springs

Use for:

- drag
- interruptible gestures
- momentum
- playful but rare interactions

Keep bounce subtle: `0.1-0.3`.

## Interruptibility

- prefer transitions over keyframes for rapidly triggered UI
- keyframes are acceptable for predetermined decorative sequences
- gestures must reverse smoothly

## Performance

- animate transform and opacity by default
- avoid width, height, top, left, padding, margin
- avoid `transition: all`
- use bounded blur only
- avoid continuous React state for mouse/scroll values
- gate hover effects behind `@media (hover: hover) and (pointer: fine)`

## Clip Path / Mask

- clip-path is useful for reveals, hold-to-confirm, comparison sliders
- masks are for softer fades
- ensure fallback if support or performance is questionable

## Gestures

- use pointer capture after drag starts
- guard against multi-touch jumps
- use velocity thresholds for flick dismissal
- use damping/friction at boundaries

## Stagger

- 30-80ms between items
- never block interaction while stagger runs
- do not stagger high-frequency lists on every update

## Accessibility

- `prefers-reduced-motion` required
- reduced motion means less movement, not necessarily no opacity/color transitions
- no animation on keyboard actions repeated constantly

## Debugging

- inspect in slow motion
- use DevTools animation panel
- test on real touch devices for gestures
- check frames under load

## Cohesion

Motion must match product personality:

- dashboard: crisp, fast, restrained
- playful consumer: can be bouncier
- landing/brand: one signature moment allowed
- serious/regulatory: minimal and functional
