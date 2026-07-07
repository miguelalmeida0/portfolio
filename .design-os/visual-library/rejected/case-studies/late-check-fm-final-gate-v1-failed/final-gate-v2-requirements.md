# Final Gate V2 Requirements

Final UI Integrity Gate v2 must test:

- viewport matrix: 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920
- scroll samples: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00
- state samples where applicable: default, nav active states, selected card/detail panel open, sticky/pinned active section, compact nav state, reduced motion state if practical

If a layout failure appears at any sampled width, scroll point, or state, final handoff is blocked.

Report must include:

- viewport
- scroll position
- selector / tag / text preview
- bounding rect
- blocker type
- screenshot path
- severity
- recommended fix
- passed and failed viewport state lists
