# Codex Motion Benchmark Review Prompt

Use when advanced/cinematic/artistic/portfolio motion is central and the result needs benchmark scoring.

## Inputs

- Project path:
- Screenshots:
- Motion sequence report:
- Motion choreography plan:
- Motion review:
- Benchmark: `evaluation/benchmarks/motion-cinematic.benchmark.md`

## Review Steps

1. Compare the result to gold mechanics from `visual-library/approved/inspiration/advanced-motion-sites/`.
2. Check for rejected mechanics: one background drift, fade-up everywhere, random hover scaling, `transition: all`, no reduced motion, unrelated motion, jank.
3. Score motion concept, hierarchy, section choreography, media choreography, typography choreography, navigation/menu choreography, performance, accessibility, mobile behavior, and evidence quality.
4. Apply hard caps from `evaluation/ui-scorecard.md`.
5. Mark as gold candidate, rejected candidate, or neither.

## Output

Create or update:

```md
docs/qa/motion-benchmark-review.md
```

Include exact blockers and the next patch required.

