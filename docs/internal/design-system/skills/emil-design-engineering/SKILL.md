---
name: emil-design-engineering
description: Apply an Emil Kowalski-style design-engineering craft lens to UI polish, component details, animation decisions, invisible interaction quality, performance, accessibility, and review notes. Use when reviewing component craft, motion feel, polish details, or when a UI works but does not yet feel great.
---

# Emil Design Engineering

Use this as a craft lens, not a style theme.

## Core Beliefs

- taste is trained
- unseen details compound
- beauty is leverage
- good defaults matter
- component identity comes from small reliable details

## Review Workflow

1. Identify the component or flow being reviewed.
2. Check whether motion should exist at all.
3. Inspect press, hover, focus, loading, empty, error, and transition states.
4. Check performance and accessibility.
5. Report with a markdown table.

## Required Review Table

Use this exact structure:

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 180ms var(--ease-out)` | Exact properties avoid jank and accidental animation. |

## Animation Decision Framework

- 100+ times/day: no animation.
- tens of times/day: remove or drastically reduce.
- occasional: standard animation.
- rare/first-time: delight can be considered.

Valid purposes: feedback, spatial consistency, state transition, hierarchy, storytelling, explanation, perceived performance.

## Component Craft Rules

- buttons need press feedback
- popovers scale from trigger
- modals can stay centered
- tooltips should feel instant after the first one opens
- dynamic UI prefers transitions over keyframes
- drag gestures need momentum, damping, pointer capture, and multi-touch protection
- empty/loading/error states are part of component quality

## Performance Rules

- animate transform and opacity by default
- avoid `transition: all`
- avoid animating width, height, top, left, padding, or margin
- use CSS/WAAPI for predetermined animations when possible
- use springs for interruptible gestures
- bound expensive filters and blur

## Accessibility Rules

- respect `prefers-reduced-motion`
- gate hover motion behind hover/pointer media queries
- do not delay high-frequency keyboard actions
- preserve focus states
- never hide function behind charm

## Stop Conditions

- motion exists only because it looks cool
- animation makes the product feel slower
- high-frequency controls are animated
- reduced-motion behavior is missing
- component polish masks unclear UX
- advanced motion was requested but only one animation or repeated fade-up exists
- motion lacks a section-by-section choreography plan when cinematic/portfolio motion is the brief

## Advanced Motion Craft Lens

For award-level motion, invisible craft includes timing relationships across the whole page. Check whether the implementation has page/section, image/media, typography, navigation/menu, and micro-feedback layers, and whether those layers feel cohesive rather than scattered.

## Audit Upgrade: Self-Correction Contract

Audit fix: Differentiate as component-level craft repair.

Required evidence:
- component-level findings, accessibility/performance notes, interaction states, and exact code targets.

Repair routing:
- specialist skills own domain decisions; emil-design-engineering owns small component craft fixes.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "emil-design-engineering"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
