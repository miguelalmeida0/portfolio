# Resize Drift Failure

Floating objects that look correct at one viewport width can become broken while resizing.

Observed failure:
- The floating label/card starts in a strong position.
- As width increases, it drifts away from its intended composition.
- At larger widths it overlaps another container.

Prevention:
- Assign each floating object an anchor zone and movement range.
- Test continuous width sweep, not only named breakpoints.
- Prefer grid slots or locally constrained parent positioning.
- Use `data-floating-object` and `data-floating-anchor` where practical.
