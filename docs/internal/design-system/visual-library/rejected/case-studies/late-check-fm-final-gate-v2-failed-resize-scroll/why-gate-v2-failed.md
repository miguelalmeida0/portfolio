# Why Gate V2 Failed

Final UI Integrity Gate v2 improved fixed viewport coverage but did not prove the resize path.

It missed:
- intermediate-width drift between sampled breakpoints
- viewport-edge clipping of active content
- horizontal route states with partial unreadable panels
- large blank scroll states
- floating objects that change from safe to colliding across widths

V3 must sweep width, sample heights, inspect horizontal route safety, and fail closed when any sampled state has blockers.
