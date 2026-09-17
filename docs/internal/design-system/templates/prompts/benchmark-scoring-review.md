# Benchmark Scoring Review Prompt

Work in:
`{{PROJECT_PATH}}`

Protected folders:
`source-projects/`, `captures/`, `raw-chat-input/`

Goal:
Score a UI against the relevant Miguel Design OS benchmark using screenshot evidence.

Steps:

1. Choose the benchmark file from `evaluation/benchmarks/`.
2. Read the benchmark gold and rejected reference paths.
3. Inspect implementation screenshots.
4. Compare concrete mechanics, not vibes:
   - composition
   - palette
   - absence of sepia/espresso/umber brown-black archive wash
   - typography
   - image/object/media use
   - motion when relevant
   - density
   - responsive behavior
   - interaction quality
   - navigation readability over all visible backgrounds
   - identity chrome justification
   - absence of decorative orbital/radar/HUD overlays
   - absence of decorative hairline/separator filler
   - mobile modal/sheet fit and safe-area behavior
   - bottom nav icon+label clarity for practical mobile products
   - selection-state persistence
   - add/create action differentiation
   - control indicators not overlapping labels/content
5. Name hard failure signs.
6. Apply scorecard caps.
7. Recommend whether the tested output is:
   - gold candidate
   - rejected candidate
   - neither

Output:

- benchmark used
- screenshots reviewed
- gold mechanics matched
- rejected mechanics present
- hard failure signs
- score
- score caps
- gold/rejected/neither recommendation
- next patch required
