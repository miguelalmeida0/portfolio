# Evidence-Backed Critique Workflow

## Purpose

Review a finished UI state with both subjective design judgment and objective evidence. This workflow runs after implementation, screenshots, or browser review. It must not slow down Fast Direction Gate.

## Full Critique

Use when browser, screenshot, or deterministic tooling is available.

### Assessment A - Design Director Review

Evaluate:

- AI slop
- hierarchy
- composition
- typography
- color/domain fit
- navigation integrity
- interaction clarity
- accessibility
- states
- copy
- emotional fit
- cognitive load
- Nielsen heuristics

### Assessment B - Evidence Review

Evaluate:

- screenshot evidence
- layout overflow
- text/container collisions
- dead or placebo navigation
- contrast issues when tooling exists
- responsive breakpoints
- console/browser issues when available
- detector findings when a detector exists

## Isolation Rule

If sub-agents are available, run Assessment A and Assessment B isolated from each other, then synthesize.

If sub-agents are not available, run sequentially. The first line of the report must say:

`⚠️ DEGRADED: single-context (<reason>)`

Do not silently degrade.

## Required Output

Use `templates/reports/evidence-backed-critique-report.md`.

The report must include:

- method header
- Nielsen heuristic table scored 0-4 each
- anti-AI slop verdict
- overall impression
- 2-3 concrete strengths
- 3-5 priority issues maximum
- cognitive load assessment
- persona red flags
- minor observations
- targeted questions
- recommended Design OS next actions
- saved snapshot when possible
