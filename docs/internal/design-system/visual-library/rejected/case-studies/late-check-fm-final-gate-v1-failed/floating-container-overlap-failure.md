# Floating Container Overlap Failure

The "Open desk. No fake luxury." container was positioned well at smaller widths, but as the viewport grew it became lost in the composition and overlapped another container.

Breakpoint-only checking missed the drift because the failure occurred as a responsive range problem, not only at the old fixed checkpoints.

Future detection must:

- sample expanded viewport widths
- inspect `data-floating-object`
- flag overlaps with `data-card`, `data-panel`, `data-layout-critical`, and protected text
- require responsive anchoring and a safe movement range
- fail closed if a floating object works at one width but fails at another
