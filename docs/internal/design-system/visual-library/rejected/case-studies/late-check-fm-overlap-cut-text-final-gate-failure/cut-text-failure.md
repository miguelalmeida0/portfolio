# Cut Text Failure

## Failure

Important display text is visibly cut by a viewport edge, fixed overlay, mask, parent overflow, or inadequate container sizing.

## Detection

- Flag `scrollWidth > clientWidth`.
- Flag `scrollHeight > clientHeight`.
- Flag important text inside `overflow: hidden`, `overflow: clip`, fixed-height, max-height, or masked containers.
- Treat screenshot-visible clipped words as P0 even when DOM heuristics miss it.

## Fix

- Increase container size or reduce type size responsibly.
- Let text wrap at phrase level.
- Move, dock, or remove overlay objects.
- Do not hide a text-fit failure with `overflow: hidden`.
