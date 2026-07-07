# Dogfood Design OS Ingestion Gate Prompt

Use this prompt at the start of any Miguel Design OS dogfood project.

```txt
You are starting a Miguel Design OS dogfood project.

Do not create application UI yet.
Do not weaken the ingestion gate.
Do not start application UI until Design OS ingestion proof exists in the dogfood project.

Verify the Design OS repo:

/Users/malmeida/Desktop/miguel-design-os

Inside the Design OS repo, run:

node tools/design-os.mjs doctor
node tools/design-os.mjs list-skills

Read:

- HANDOVER_START_HERE.md
- AGENTS.md
- design-dna/00_COMPACT_AGENT_CONTEXT.md
- visual-library/README.md
- docs/handover/current-state.md
- docs/handover/dogfood-ingestion-gate.md
- docs/handover/hostel-radio-baseline.md
- docs/handover/scroll-safety.md

Read the relevant required Design DNA rules, including:

- design-dna/final-ui-integrity-gate-rules.md
- design-dna/text-container-integrity-rules.md
- design-dna/navigation-responsiveness-rules.md
- design-dna/mobile-navigation-defaults.md
- design-dna/media-text-protected-zone-rules.md
- design-dna/video-media-placement-rules.md
- design-dna/viewport-edge-clipping-rules.md
- design-dna/horizontal-scroll-safety-rules.md
- design-dna/scroll-readability-first-rules.md
- design-dna/anchored-detail-reveal-rules.md
- design-dna/no-fake-live-affordances-rules.md
- design-dna/no-ai-theater-chrome-rules.md
- design-dna/no-sepia-container-surface-rules.md
- design-dna/offset-container-alignment-rules.md
- design-dna/navigation-active-state-rules.md
- design-dna/brand-chrome-readability-rules.md
- design-dna/domain-realism-and-mock-data-rules.md
- design-dna/human-dashboard-palette-rules.md
- design-dna/dashboard-route-architecture-rules.md
- design-dna/oklch-contrast-and-palette-rules.md
- design-dna/new-app-generation-rules.md

Inspect approved memory:

- visual-library/approved/case-studies/hostel-radio-first-passed-project/
- visual-library/approved/case-studies/late-check-fm-first-passed-project/
- visual-library/approved/case-studies/tempo-loom-mobile-product-success/
- approved visual references relevant to the project mode

Inspect rejected memory relevant to:

- clipped text
- nav overflow
- mobile nav disappearing on scroll
- disconnected detail reveals
- media over text
- viewport-edge clipping
- fake live labels
- fake narrative/replay/mission/case-file chrome
- sepia/espresso/umber container surfaces
- offset container/backplate failures
- nav active-state mismatch
- brand/app-name contrast over images
- random mock data, generic app sections, fake command labels, unjustified topology/traces, and missing real pages/routes
- unsafe advanced scroll

Create this file inside the dogfood project:

docs/design-os-ingestion-report.md

The report must include:

- Design OS path verified
- doctor result
- list-skills result
- handover files read
- rules read
- approved memory inspected
- rejected memory inspected
- selected skill chain
- Domain Content Contract status
- scroll safety decision
- protected folders untouched
- whether ingestion passed or failed

Stop before UI if ingestion fails.

If ingestion passes, continue only with the Design OS flow required for the task mode. Future QA must include screenshots and final reports. Build/lint is not visual proof.
```
