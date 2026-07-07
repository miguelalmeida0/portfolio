# Why Gate V1 Failed

Final UI Integrity Gate v1 failed because it treated a small breakpoint set as sufficient proof.

Failure causes:

- sampled too few widths
- did not require scroll state matrix
- did not require passed/failed viewport state lists
- did not detect floating container drift
- did not fail hard enough when text clipping remained
- allowed final handoff without a fail-closed contract

The fix is not more prose. The fix is a matrix-based gate that exits nonzero on blockers and prevents passed done reports when any blocker remains.
