# Motion And Delight Rules

Motion and delight are craft layers. They must clarify the product experience, not decorate weak UX.

## Motion Purpose

Valid purposes:

- feedback
- state transition
- spatial consistency
- hierarchy
- storytelling
- explanation
- perceived performance

Invalid purpose:

- "it looks cool"

## Frequency Table

| Frequency | Decision |
| --- | --- |
| 100+ times/day | no animation |
| tens of times/day | remove or drastically reduce |
| occasional | standard animation |
| rare / first-time / milestone | delight can be considered |

Never animate keyboard-initiated actions that users repeat constantly.

## Duration Standards

- button press feedback: 100-160ms
- tooltip / small popover: 125-200ms
- dropdown / select: 150-250ms
- modal / drawer: 200-500ms
- normal UI motion: under 300ms by default
- brand / marketing / explanatory motion: may be longer if it does not block the task

## Easing

- no ease-in for UI motion
- entering/responding: strong ease-out
- movement already on screen: ease-in-out
- constant motion: linear only when appropriate
- use custom curves instead of weak browser defaults

Recommended curves:

- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
- `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`
- `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`

## Physicality

- never scale from `0`; start around `0.95` plus opacity
- popovers scale from their trigger
- modals can stay centered
- pressable elements need tactile active feedback
- gestures can use springs when interruptibility matters
- stagger 30-80ms only when it supports comprehension

## Implementation Rules

- prefer transitions over keyframes for interruptible UI
- animate transform and opacity by default
- expensive filters only in bounded areas
- no `transition: all` in production UI
- hover motion must be gated behind `@media (hover: hover) and (pointer: fine)`
- `prefers-reduced-motion` is required for movement
- use clip-path/mask deliberately, not as performance-hostile decoration

## Delight Rules

- delight only at earned moments
- delight amplifies, never blocks
- delight never delays core functionality
- delight must match domain seriousness
- do not hide poor UX behind personality
- one signature motion moment is stronger than scattered noise

Good delight moments:

- success
- empty state
- loading state
- milestone
- first-time completion
- safe error recovery
- contextual easter egg

## Stop Conditions

- animation has no purpose
- high-frequency action is animated
- movement lacks reduced-motion behavior
- delight distracts from the primary task
- motion style conflicts with the product mood

## Advanced Motion Means Choreography

When Migi asks for advanced animations, cinematic motion, artistic motion, award-winning motion, Awwwards/Godly/Recent-level motion, scroll animation, appearing while scrolling, or portfolio motion, the agent must route to `skills/advanced-motion-choreography/SKILL.md`.

Advanced motion requires `docs/design/motion-choreography-plan.md` before implementation.

Required layers:

- page / section choreography
- image / media choreography
- typography choreography
- navigation / menu choreography
- micro-feedback layer
- reduced-motion fallback

Approved:

- choreographed motion system
- scroll-linked story rhythm
- cinematic image reveals
- navigation/menu motion as part of art direction
- signature motion moment
- measured restraint

Rejected:

- single background animation
- fade-up everywhere
- hover scale sprinkled across the page
- motion not tied to section purpose
- motion without named technique
- motion with no capture or review evidence
- motion that distracts from reading or content

Rule:

One animation is not advanced motion. If motion is central, capture a motion sequence or document the blocker honestly.
