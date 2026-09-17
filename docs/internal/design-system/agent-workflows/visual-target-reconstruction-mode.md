# Workflow: Visual Target Reconstruction Mode

Use when Migi provides inspiration images, screenshots, a visual target, or says the UI should feel close to a specific art-directed direction.

If Migi says `copy this exact UI`, `100% this design`, `literally what you see`, or `exact visual target`, enter Literal Target Copy Mode instead of this translation workflow.

## Rule

Do not extract shallow style tokens and start coding.

First reconstruct why the reference works.

Literal Target Copy Mode overrides this rule: do not reinterpret the target, create new art direction, or run a product usefulness pass. The only goal is visual parity with the supplied target.

## Literal Target Copy Mode

When active:

- no 3-concept gate
- no new art direction
- no product feature expansion
- no usefulness pass
- no extra panels
- no extra explanation
- no improvements
- no reinterpretation

Required sequence:

1. Identify target screens.
2. Reconstruct the visible composition.
3. Exclude browser chrome, editor UI, and watermark artifacts.
4. Build the static shell first.
5. Implement only minimum visible interactions.
6. Screenshot compare.
7. Report exact differences.

Product logic waits until the pixel-parity shell is approved.

## Reference Analysis

Analyze:

- composition
- focal object
- information hierarchy
- what is hidden
- what is absent
- emotional hook
- material/texture
- atmosphere
- interaction model
- why the reference creates desire

Do not reduce the reference to:

- dark
- neon
- cards
- glass
- glow
- gradients
- rounded panels
- big text

## Translation Rules

- If a reference shows a cinematic stage, do not build a dashboard.
- If a reference shows one dominant object, do not build a grid.
- If a reference hides information, do not expose stats.
- If a reference is art-directed, do not answer with generic components.
- If Migi says the result is realities away from the inspiration, stop polishing and restart concept work.

## Required Sequence

For standard visual target reconstruction:

1. Reference analysis.
2. Three radically different art-direction concepts.
3. Approval checkpoint.
4. Visual shell prototype.
5. Screenshots at 390 / 768 / 1440.
6. Comparison against the chosen concept/reference.
7. Patch loop.
8. Product logic only after the visual shell works.

## Done

Standard reconstruction is complete only when Migi approves one concept and the screenshot comparison shows the visual shell follows the chosen concept's composition, focal object, hidden information strategy, and emotional hook.

Literal Target Copy Mode is complete only when the screenshot comparison reports exact remaining differences against the supplied target.
