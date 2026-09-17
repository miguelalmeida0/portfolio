# Scroll Lessons

## Core Lesson

Advanced scroll is currently dangerous in Design OS.

It should not be used as a default production mechanic until the scroll system is rebuilt, isolated, proven, and validated across the Final UI Integrity Gate v3 sweep.

## What Failed Before Passing

Unsafe scroll caused:

- clipped text
- partial panels
- horizontal fragments
- media over text
- floating-object drift
- blank scroll states
- confusing route states

## What Worked

The passed version simplified or removed unsafe scroll so the page could remain:

- readable
- stable
- mobile-safe
- card-safe
- text-safe
- v3-gate-safe

## Future Rule

Prefer simple, readable, stable scroll for production-quality tests unless advanced scroll passes:

- width sweep from 360 to 1920
- height matrix 720, 844, 900, 1080
- scroll samples 0 through 1
- active panel readability
- viewport-edge clipping checks
- horizontal scroll safety
- reduced-motion fallback
- screenshot/report evidence

If advanced scroll cannot pass those checks, downgrade to a simple vertical readable flow.
