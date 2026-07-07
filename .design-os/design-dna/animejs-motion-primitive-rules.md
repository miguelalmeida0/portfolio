# Anime.js Motion Primitive Rules

## Purpose

Anime.js is approved as a controlled motion primitive for high-quality frontend motion when CSS transitions are not enough.

Use it for precise timelines, staggered sequences, SVG/DOM choreography, weather particles, selected-state transitions, and tactile interaction feedback.

It is not used as decorative motion wallpaper.

Animation is not quality by itself. Anime.js must never replace layout, typography, contrast, interaction clarity, accessibility, responsiveness, or product logic.

For typography-led motion sites, also inspect `design-dna/typographic-motion-site-rules.md` and `skills/typographic-motion-art-director/SKILL.md`.

## Allowed Use Cases

- selected card to detail continuity
- staggered rail/card entrance
- terrarium particle loops
- city selection transitions
- weather-condition transitions
- SVG raindrops, snow, fog, and sun rays
- subtle hover/focus feedback
- timeline sequences
- client-only DOM animation
- CSS variable animation when useful
- bounded decorative motion inside a product object

## Forbidden Use Cases

- generic fade-and-rise everywhere
- scroll hijacking
- fragile pinned sections
- full-page animation takeover
- casually animating layout properties
- blocking UI while animation completes
- hiding content until animation timing finishes
- fake live pulsing
- fake connection indicators
- motion that makes text unreadable
- motion that breaks mobile
- motion without reduced-motion fallback
- motion that exists only because Anime.js is installed

## React / Next.js Constraints

Anime.js must be used only in client components.

Use scoped animation patterns.

Prefer:

- `useEffect`
- `useRef`
- `createScope`
- cleanup with `scope.current.revert()`

Never leave running loops, timers, draggables, or timelines after unmount.

Do not animate elements outside the component scope.

Do not use global selectors unless scoped by a root ref.

Avoid hydration mismatch by keeping Anime.js effects out of server-rendered logic.

## Performance Constraints

Prefer transform and opacity.

Avoid animating width, height, top, left, margin, heavy filter, or layout-affecting properties unless proven safe.

Long-running loops must be bounded to small areas.

Do not create one heavy animation engine per repeated card if CSS animation would do.

Pause or simplify non-visible and secondary motion when practical.

Keep mobile and low-power devices in mind.

## Accessibility Constraints

Every Anime.js motion system must support:

- `prefers-reduced-motion`
- static fallback
- readable UI without animation
- no keyboard trap
- no pointer-event trap
- no motion-only meaning
- focus states independent from animation
- no text permanently hidden by motion

## Design OS Approval Requirements

Any project using Anime.js must provide:

- motion plan
- files/components using Anime.js
- reduced-motion behavior
- screenshot proof
- mobile proof
- build/lint proof
- honest motion review

No screenshot proof means no approval.

## Score Caps

- Anime.js used without a motion plan: max score 5.
- Anime.js used for generic fade-and-rise everywhere: max score 4.
- Anime.js motion hides content until timing finishes: max score 3.
- Anime.js motion blocks interaction or navigation: max score 3.
- Anime.js motion creates fake live/status/pulse theater: max score 3.
- Anime.js motion has no reduced-motion fallback: max score 4.
- Anime.js motion breaks mobile or low-power states: max score 4.
- Anime.js selectors are global/unscoped in React/Next: max score 5.
- Anime.js loops/timelines are not cleaned up on unmount: max score 4.
- Anime.js screenshot proof is missing: max score 5.
