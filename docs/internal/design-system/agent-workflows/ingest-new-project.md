# Workflow: Ingest New Project

Use when adding another completed project to this memory system.

## Mandatory Start

Before inspecting the project:

1. Read `design-dna/00_COMPACT_AGENT_CONTEXT.md`.
2. Read `AGENTS.md` and `skills/README.md`.
3. Read `system.md`, `design-system.json`, and `design-dna/miguel-style-principles.md`.
4. Inspect the new project's type, framework, routes, components, styling system, tokens, and screenshots if present.
5. Define the project's project-specific visual identity in the report.
6. State that this project is evidence, not a template to copy literally; do not copy old apps literally.
7. Treat screenshots as evidence of decisions, not as future templates.
8. Score the rendered project with `evaluation/ui-scorecard.md` before finishing ingestion.

## Technical Inventory

Write `extracted/{project}/technical-inventory.md` with:

- framework and rendering mode
- package manager and lockfile
- install command used
- run command used
- routes and route ownership
- component map
- styling system
- Tailwind/theme/token config
- data/auth/env requirements
- responsive implementation notes
- run result and blockers

Each claim should name a file or observed runtime behavior.

## Style Report

Write `extracted/{project}/style-report.md` with:

- project type
- primary user
- primary object
- primary action
- visual identity words
- density level
- palette/token strategy
- typography behavior
- layout recipe
- component patterns
- clickable/passive rules observed
- responsive behavior observed
- what future agents may reuse as principle
- what future agents must not copy literally

## Run And Capture

1. Install dependencies with the project's package manager.
2. Run the documented dev/start command.
3. Capture if it runs:
   - `captures/{project}/mobile/primary.png` at 390 px
   - `captures/{project}/tablet/primary.png` at 768 px
   - `captures/{project}/desktop/primary.png` at 1440 px
4. If it cannot run, record command, error, and best alternative evidence.

## Synthesis Rules

Promote a pattern into `design-dna/` only when:

- it reinforces global preferences, or
- it repeats across multiple golden projects, or
- it is clearly a reusable failure-mode prevention rule.

Never promote:

- one palette
- one layout screenshot
- one product's tone
- one app's navigation model
- In The Loop social/planning specifics

## Done

Ingestion is complete only when:

- both extracted reports exist
- screenshots exist or a run blocker is documented
- scorecard result is recorded in the style report or final summary
- any Design OS change names the evidence behind it
- protected folders and app-specific boundaries are confirmed
