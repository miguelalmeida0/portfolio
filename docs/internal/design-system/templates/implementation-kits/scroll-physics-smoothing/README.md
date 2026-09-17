# Scroll Physics Smoothing Kit

Use this kit when a scroll-heavy site needs authored physical feel instead of raw page drift.

## Outputs
- scroll-physics-spec.md
- QA notes from scroll samples
- reduced-motion fallback notes

## Core Decisions
- engine: native, CSS scroll timeline, Motion, GSAP ScrollTrigger, Lenis, or local scroll progress
- smoothing: none, lerp, spring, scrub, snap, settle, or hybrid
- mobile: simplified route, fewer pins, no horizontal trap
- performance: transform/opacity first, bounded observers, no layout thrash
