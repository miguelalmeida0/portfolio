---
name: creative-orchestration-director
description: Orchestrate multi-skill Design OS work into a self-correcting creative loop. Use when a task spans direction, specification, implementation, evidence capture, critique, repair, hardening, or skill-system improvement, especially when critique must become actionable fixes instead of prose.
---

# Creative Orchestration Director

Use this skill as the system brain for complex Design OS work. It does not replace specialist skills. It routes them, records creative state, requires evidence, turns verdicts into repair tasks, and chooses the next skill until the work can honestly stop.

## Files To Read

- `skills/skill-registry.json`
- `docs/routing/skill-routing-map.md`
- `design-intelligence/skill-orchestration-matrix.md`
- `design-intelligence/self-correction-repair-loop.md`
- `templates/skill-verdict.template.json`
- `templates/reports/creative-state-ledger.template.md`
- `templates/reports/repair-task-queue.template.md`
- `evaluation/ui-scorecard.md`

## Use When

- A request spans multiple skills, phases, or quality gates.
- A critique, audit, scorecard, screenshot review, or dogfood report must become fixes.
- A skill emits a verdict but no owner, acceptance check, or next action.
- Visual work needs direction, spec, build, evidence, critique, repair, and hardening in one loop.
- Migi asks to improve Design OS itself or make agents more self-correcting.

## Hard Rule

No review is complete until it produces:

- a machine-readable skill verdict
- evidence or an explicit evidence blocker
- owner skill for each repair
- P0/P1/P2 priority
- concrete target file, selector, artifact, or behavior
- acceptance check
- next skill or stop condition

## Workflow

1. Classify the task phase: direction, spec, implementation, evidence, critique, repair, hardening, or handoff.
2. Route the smallest skill chain from `skills/skill-registry.json`.
3. Create or update a creative state ledger using `templates/reports/creative-state-ledger.template.md`.
4. Ask each selected skill for its required output contract and evidence requirements.
5. Normalize every skill result into `templates/skill-verdict.template.json`.
6. Convert every failed verdict into a repair queue item.
7. Route each repair to the most specific owner skill.
8. After repair, rerun the evidence gate that originally failed.
9. Stop only when all P0 repairs are closed, evidence is present or honestly blocked, and handoff risks are named.

## Required Output

```md
## Skill Route
| order | skill | phase | why | required artifact |

## Creative State
- active direction:
- active references:
- active constraints:
- rejected motifs:
- open risks:

## Evidence Plan
| artifact | source | required by | status |

## Verdict Summary
| skill | status | blockers | score caps | repair count |

## Repair Queue
| priority | owner skill | target | action | acceptance check |

## Next Step
- continue with:
- stop because:
```

## Routing Principles

- Direction skills must hand off to proof skills.
- Review skills must hand off to repair owners.
- Broad skills must delegate to narrower specialists.
- Implementation skills must name evidence before claiming done.
- Evidence-backed critique is the central memory loop for finished UI.
- Production hardening, text clarity, layout integrity, animation review, and screenshot scorecard are not optional when their failure class appears.

## Stop Conditions

- A critique has no repair queue.
- A repair has no owner skill.
- A verdict has no evidence or blocked-evidence explanation.
- A broad skill is used when a narrower skill should own the decision.
- The agent claims final quality while P0 repair tasks remain open.
