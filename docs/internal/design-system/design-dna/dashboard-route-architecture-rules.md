# Dashboard Route Architecture Rules

Complex operational products must not dump every process into one long page.

If the product has multiple tasks, phases, or user questions, navigation must create clear routes or modes. Each route should carry a small, organized process with its own job.

## Required

- task inventory before layout
- route map before implementation
- one primary job per route
- route-specific information hierarchy
- route-specific primary action
- route-specific supporting panels
- shared global context only where useful
- clear selected nav state
- no redundant route labels that show the same page
- mobile route strategy

## Route Decomposition Triggers

Create separate routes, tabs, panels, or focused modes when the UI includes:

- overview
- timeline
- services
- traces
- hypotheses
- blast radius
- decision log
- rollback plan
- postmortem
- mobile/field view
- comparison workflow
- selected item detail
- investigation step
- approval or remediation step

## Hard Blockers

- ridiculous amount of information on one page when routes would organize it
- nav exists but the content remains a single overloaded dashboard
- side navigation is only a decoration or anchor list for one giant page
- each nav item does not have a distinct product job
- detail, timeline, service map, and decision workflow all compete in one view
- users must parse every process at once before taking action
- mobile view is treated as a panel inside the desktop dashboard instead of a real responsive route/mode
- route architecture ignores approved dashboard inspiration where screens are composed around focused command surfaces

## Preferred Patterns

- overview route for situational summary
- timeline route for sequence and causality
- services route for dependency topology
- traces route for timing comparison
- hypotheses route for investigation candidates
- blast radius route for impact and ownership
- decision log route for audit trail
- rollback route for action plan
- postmortem route for learning and follow-up
- mobile route or responsive mode for compact decision flow

## Score Caps

- complex dashboard crams multiple workflows into one page: max score 5
- navigation exists but does not create distinct route jobs: max score 5
- side nav is decorative anchor navigation for a single pileup: max score 5
- information architecture forces every process into one view: max score 5
- mobile flow appears as a desktop card instead of a real mobile route/mode: max score 6
- approved dashboard references provided but route architecture ignores their focused command surfaces: max score 5

