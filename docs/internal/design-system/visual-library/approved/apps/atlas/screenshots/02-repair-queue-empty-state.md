# Repair Queue Empty State

## Status
Approved app reference

## Visual summary
The screen shows a post-input state explaining that the pasted code did not produce a repair queue. It includes a current input card, a clear empty-state message, an input preview, collapsed review history, and an archived repo queue.

## What Migi likely likes
- Composition: result explanation, current input card, empty state, preview, and history are clearly separated.
- Hierarchy: "what to fix" headline, no-issue result, and next review action come first.
- Spacing: soft rounded cards create calm structure without heavy chrome.
- Typography: large result headline with small explanatory support text.
- Materials/colors: white/off-white canvas, subtle borders, black primary button, green current status.
- Interaction/product pattern: review another input, inspect previous inputs, open archived repo queue.
- Emotional tone: honest, calm, and diagnostic.

## What future agents should copy
- Explain empty states with what happened and what the user can do next.
- Preserve current input context after analysis.
- Keep history collapsed until it is useful.
- Use status chips to distinguish current inputs from archived ones.

## What agents must not copy blindly
- Do not copy code sample labels or repo queue claims.
- Do not create empty-state cards without a real product state behind them.
- Do not imply no issue was found unless validation actually ran.

## Best use cases
empty state, diagnostics, code review, analysis tool, workflow history

## Scope
global

## Confidence
high

## Tags
empty-state, diagnostic, developer-tool, history, current-input, light-ui
