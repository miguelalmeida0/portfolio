# Miguel Design OS Operating Model

Miguel Design OS is a local frontend operating system for taste, prompt compilation, reference use, visual QA, benchmark scoring, and dogfood learning. It is not a frontend Studio app.

## Elite UI Pipeline

1. Classify task mode.
2. Run the Three-Direction Mockup Gate when visual direction is not already approved.
3. Record the selected direction or hybrid.
4. Compile the visual spec.
5. Define design-system tokens.
6. Run the OKLCH/APCA palette pass.
7. Implement the frontend aha moment.
8. Capture screenshot QA.
9. Route specialist review.
10. Write a dogfood postmortem when this is a Design OS test.
11. Patch rules, templates, skills, or benchmarks only when the failure justifies a system change.

## Source Of Truth

`visual-library/` is the screenshot source of truth:

- `visual-library/approved/` stores approved app and inspiration references.
- `visual-library/rejected/` stores visual anti-pattern evidence.
- `visual-library/inspiration/` stores loose reference material.
- `visual-library/case-studies/` stores learning narratives.

Do not create duplicate gold/rejected screenshot folders. Do not copy images out of `visual-library` for benchmarks.

## Benchmark Layer

`evaluation/benchmarks/` is the scoring and test layer. Benchmark files reference existing visual-library assets and explain what those assets prove. They do not own screenshots.

Benchmarks answer:

- What should this mode become?
- Which references prove the mechanics?
- Which rejected examples prove the failure modes?
- Which skills and prompt templates must route?
- What screenshot evidence is required?
- Which hard failures cap the score?

## Skills

Skills are routeable specialists, not random prompt dumps. Each skill should be used when its scope applies and skipped when it would add noise.

The intended pattern is:

- broad workflow decides mode
- mode-specific skill handles domain craft
- review skill catches visual failure
- screenshot skill demands evidence
- scorecard applies hard caps

## Prompt Templates

Prompt templates are the main reusable interface for future agents. Use them to start new app work, run a direction-only pass, continue after direction approval, score against benchmarks, and ingest postmortems.

The prompt system should keep agents from re-learning the same rules every turn.

## Dogfood Loop

Dogfood targets exist to test whether Miguel Design OS actually improves output. A target-app failure is not automatically a global Design OS rule. The postmortem decides whether the issue is:

- project-specific feedback
- a missing prompt instruction
- a missing skill check
- a scorecard cap
- a benchmark candidate
- a global rule

Patch the Design OS only when the failure is repeatable or system-level.
