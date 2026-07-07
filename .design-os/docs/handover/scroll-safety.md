# Scroll Safety

Advanced scroll is experimental by default and must not be added to a passed baseline.

## Default Policy

For production-quality dogfood projects, prefer simple, readable, stable scroll.

Use advanced scroll only when it is explicitly selected, isolated, and validated. If advanced scroll introduces text clipping, partial panels, media over text, floating drift, horizontal fragments, blank scroll states, or unreadable resting states, downgrade to a simpler flow.

## Required Proof For Advanced Scroll

Advanced scroll must pass:

- Final UI Integrity Gate v3
- width sweep from 360 to 1920
- height matrix including 720, 844, 900, and 1080
- scroll samples from 0 through 1
- active-state samples
- reduced-motion fallback
- horizontal scroll safety
- viewport-edge clipping checks
- screenshot evidence
- a written report with failed and passed states

## Hostel Radio Lesson

Hostel Radio, originally Late Check FM, passed after unsafe advanced scroll/media movement was removed or simplified. This is the current baseline lesson: readability and layout integrity beat scroll choreography.
