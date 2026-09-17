---
name: failure-memory-retrieval-router
description: Retrieve relevant rejected case studies, bad-practice evidence, score caps, and prevention rules before planning, implementation, or review. Use when user feedback references recurring failures, when visual-heavy work resembles past rejected patterns, or before high-risk design generation.
---

# Failure Memory Retrieval Router

Use this skill to make Design OS learn from its own failures.

## Required Output

Create:

- `docs/design/failure-memory-retrieval.md`
- `docs/design/failure-memory-retrieval.json`

## Retrieval Targets

Search:

- `visual-library/rejected/case-studies/`
- `visual-library/rejected/bad-practices/`
- `design-dna/anti-patterns.md`
- `evaluation/ui-scorecard.md`
- relevant skill stop conditions

## Required Output Fields

- query / trigger
- matched failure memories
- why each memory applies
- exact patterns to avoid
- score caps activated
- reference evidence paths
- required gates to add
- what should be preserved if the concept was promising

## Hard Rules

- Retrieve by failure mode, not just words. A "sticker over headline" issue should retrieve text/container integrity even if the word clipping is not mentioned.
- Distinguish concept success from execution failure.
- Do not copy rejected visuals as inspiration.
- Use rejected evidence as blockers and constraints.

## Tooling

If useful, run:

```sh
node tools/failure-memory-search.mjs --query "<task or failure>"
```

If the tool is unavailable or blocked, perform manual retrieval and document the blocker.

## Audit Upgrade: Self-Correction Contract

Audit fix: Retrieve relevant failures before repeating them.

Required evidence:
- matching failure cases, rejected motifs, current-risk mapping, and preventive route.

Repair routing:
- anti-ai-slop-review or specialist owner repairs repeated failure classes.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "failure-memory-retrieval-router"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
