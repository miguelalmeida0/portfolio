# Scroll Choreography Review Prompt

Use after implementation when a page depends on authored scroll.

## Inputs
- URL or screenshots:
- selected scroll pattern:
- route map:
- chapter map:
- motion timeline:
- viewports:

## Required Checks
- selected pattern visible
- route matches spec
- pinned stages have no blank frames
- objects assemble/dock/settle as promised
- information reveals at intended moments
- nav syncs to chapters
- text/container/nav integrity survives scroll states
- no accidental horizontal overflow
- mobile fallback exists
- reduced-motion fallback exists

## Output Table
| Issue | Evidence | Why It Fails | Required Fix | Severity |
|---|---|---|---|---|

## Verdict
Block / Partial / Pass
