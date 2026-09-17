# Dashboard Route Underuse

## What Failed

Navigation appears, but it does not meaningfully divide the product into focused jobs.

## Why It Hurts

Navigation should organize work. If nav labels do not create distinct routes, states, or task modes, users still face the same overloaded surface.

## How To Detect

- side nav is just an anchor list
- route labels do not change the user task
- selected route does not simplify the visible information
- every route shares the same generic panel pattern
- mobile route is treated as a desktop card

## How To Fix

- define one primary user question per route
- define route-specific primary action
- define route-specific panel hierarchy
- separate overview, analysis, decision, and action workflows
- verify selected nav state changes visible product scope

## Score Caps

- navigation exists but does not create distinct route jobs: max score 5
- side nav is decorative anchor navigation for a single pileup: max score 5
- mobile flow appears as a desktop card instead of a real mobile route/mode: max score 6

Evidence: `visual-library/rejected/case-studies/cascade-lab-robotic-dashboard-information-architecture-failure/`.

