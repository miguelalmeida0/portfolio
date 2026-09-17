---
name: production-hardening-review
description: Post-implementation review that hardens product UIs against long text, missing data, errors, loading, slow networks, i18n, accessibility, large datasets, concurrency, and responsive stress.
---

# Production Hardening Review

Use after implementation and before calling a product UI production-ready. It is especially relevant for apps, dashboards, forms, editors, tables, maps, settings, modals, and mobile flows.

Do not use during Fast Direction Gate, early concept selection, or pure visual mood exploration.

## Hardening Dimensions

1. Text overflow and wrapping: long names, empty strings, emoji, accents, CJK, RTL, German expansion, truncation, line clamp, `min-width: 0`.
2. Empty states: first run, no items, no search results, no permissions, no saved data, clear next action.
3. Error states: offline, timeout, 400/401/403/404/429/500, validation, permission, partial failure, retry path.
4. Loading states: initial load, refresh, pagination, long-running actions, skeleton/progress, no layout jump.
5. Internationalization: German +30%, RTL, CJK, dates/times, numbers/currencies, pluralization.
6. Large datasets: many items/options, pagination, virtualization, search/filter.
7. Domain-real data fixtures: realistic records, business entities, units, ranges, statuses, timestamps, and source/freshness labels.
8. Concurrent operations: double submit, pending disabled states, optimistic update rollback, refresh mid-flow.
8. Accessibility resilience: keyboard, visible focus, ARIA labels, semantic HTML, non-color status cues, reduced motion, high contrast, 200% zoom.
9. Responsive resilience: 1440, 1280, 1024, 768, 390; no overflow, clipping, modal cut-off, squeezed controls.
10. Browser/performance resilience: slow network, image loading, cleanup timers/listeners, abort requests, debounced handlers.

## Hard Rules

- Designs that only work with perfect data are not production-ready.
- Fixed-width text containers are suspicious.
- Flex/grid children that contain text need `min-width: 0`.
- Every async state needs loading, success, error, and retry behavior.
- Every empty state needs context and next action.
- Destructive/concurrent actions need protection.
- Product UI must survive long text and translation expansion.
- Product UI must be hardened with realistic domain data, not only perfect placeholder records.
- Icon-only controls need accessible labels.
- Modals/sheets must survive small viewport and long content.

## Required Output

```md
## Production Hardening Review

### Production-Ready Verdict

### Hardening Audit
| Area | Edge Case | Current Risk | Required Fix | Severity |
|---|---|---|---|---|

### Edge-Case Test Matrix
| Test | Example Input/Scenario | Expected UI Behavior | Pass/Fail |
|---|---|---|---|

### CSS/Layout Resilience Checklist
### Empty/Loading/Error Checklist
### I18n Checklist
### Accessibility Checklist
### Concrete Fixes
```

## Scorecard Caps

- text escapes container: max hardening score 4
- long translation breaks layout: max hardening score 5
- no empty state for primary list: max hardening score 6
- no error recovery for async action: max hardening score 5
- double-submit possible on destructive action: max hardening score 5
- modal clips content on small viewport: max hardening score 4
- icon-only controls lack accessible labels: max hardening score 5
- color-only status indicators: max hardening score 5
- large dataset has no pagination/search/virtualization plan: max hardening score 6
- mock data is random, abstract, or missing domain entities/units/statuses: max hardening score 4
- no reduced-motion support for animated interface: max hardening score 6

## Layout Integrity Gate

Text/container integrity is mandatory production hardening. Long labels, translations, dynamic content, state changes, and viewport changes must not clip text or break nav.

Run `skills/layout-integrity-review/SKILL.md` before production-ready claims.

Block if:

- any critical text is clipped
- nav text overflows its item
- card/sticker/overlay covers headline text
- CTA text is clipped
- text overflow appears in screenshot
- huge blank area is accidental

Required stress: 1440, 1280, 1024, 768, 390, long strings, selected/hover/active states, and hidden-label accessible-name checks.

## Visualization Hardening Escalation

When charts, diagrams, maps, timelines, floor plans, pattern canvases, or spatial product objects are present, also route `skills/data-viz-hardening-review/SKILL.md`.

Check:

- long labels, German expansion, CJK, RTL, and emoji labels
- missing, zero, huge, negative, and null values
- many series, many points, or many objects
- no-data, loading, and API-error states
- legend wrapping/collapse
- tooltip viewport containment
- units and abbreviation explanations
- color-independent encoding
- 1440 / 1280 / 1024 / 768 / 390 and 200% zoom

## Audit Upgrade: Self-Correction Contract

Audit fix: Add automation hooks and stress fixtures.

Required evidence:
- long text, empty/error/loading, i18n, permissions, slow network, accessibility, and responsive stress evidence.

Repair routing:
- owner skills fix class-specific failures; creative-orchestration-director tracks remaining P0/P1 repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "production-hardening-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.

## Small-Screen Nav Clarity Requirement

For every visual/product/landing/mobile page with navigation, the agent must define:

- desktop nav variant
- tablet nav variant
- mobile/compact nav variant
- label/icon behavior
- active state behavior
- accessible labels
- hit target sizes
- overflow behavior

Compact nav must use icons or a real menu pattern. Two-letter abbreviations are not a design system.

Review requirement:

- screenshot-scorecard-review must inspect compact nav at 768 and 390
- layout-integrity-review must flag abbreviation fallback as a failure
- final-scorecard cannot pass if compact nav looks clipped, cryptic, or broken

## Final UI Integrity Gate Requirement

Before final handoff, run final-ui-integrity-gate.

The agent must not claim success if:

- clipped text remains
- overlap remains
- nav overflow remains
- media/text collision remains
- accidental blank space remains
- the user's original complaint remains true

The final review order must be:

1. build/lint
2. screenshot capture
3. scroll-choreography-review if scroll-heavy
4. layout-integrity-review
5. final-ui-integrity-gate
6. final-scorecard

## Final UI Integrity Gate v3

For visual/frontend work, final UI integrity v3 is mandatory before handoff. Screenshot evidence at only one width is insufficient.

Required v3 proof:
- Test viewport matrix: 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920.
- Sample scroll positions: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00.
- Include applicable states: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, and reduced motion when practical.
- Report passed and failed sampled viewport states.

Floating labels, stickers, cards, badges, props, and containers require responsive anchoring and overlap checks. Final response must not claim success if the v3 gate fails, is blocked, has blockers, has cut text, has floating overlap, has media/text collision, has nav overflow, or lacks matrix evidence.

## Final UI Integrity Gate v3

Final UI Integrity Gate v3 is mandatory. Fixed breakpoint-only evidence is insufficient. Width sweep evidence is required. Horizontal scroll must prove readable resting states. Floating objects must prove safe across resizing. Final response is forbidden unless the gate passes or clearly reports blocked/failed.

## Mobile Bottom Navigation Requirement

For mobile route/app experiences, navigation must be persistent and bottom-positioned by default. Verify that route navigation remains accessible after scroll, respects safe areas, has clear active state, and preserves accessible full labels.

Block if mobile route navigation disappears on scroll or if compact route access is unavailable.

## Detail Reveal Spatial Context Requirement

Every card/item/detail interaction must preserve spatial context. The selected trigger and detail panel must be connected by layout, animation, placement, or explicit selected state.

Verify close behavior, focus behavior, keyboard behavior, mobile behavior, selected state, and `data-detail-for` relationships where practical. Block detached reveals with no focus/scroll/context strategy.

## No Fake Live Affordances

Reject fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity indicators, and pulsing live badges unless real realtime functionality exists.

Production hardening must verify data source, update cadence, stale state, and fallback when live behavior is claimed.

## No AI Theater Chrome

Reject decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, `CL-####`, dossier, operation, and fake severity/status chips unless they are real product objects with documented behavior.

Production hardening must verify that these labels map to real data, task state, route behavior, or workflow mechanics. Static product theater is a blocker.

## Offset Container Alignment

Every layered container, media backplate, offset card, and framed object must have clean corner geometry and intentional offset alignment across breakpoints.

## Navigation Active State Correctness

Every nav item must be clickable and must activate itself, not an adjacent item. Verify visual active state, `aria-current`/`aria-selected`, route target, and mobile/desktop shared source-of-truth.

First and last nav items must be included in click-through QA.

## Brand Chrome Readability

App names, wordmarks, initials, logo text, and persistent brand chrome must remain readable over every background state. Verify dark, image, gradient, video, and scroll-changing background states before handoff.

## WebGL / Shader Production Hardening

When WebGL, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader atmospheres are used, verify:

- package versions match React/Next compatibility
- client-only boundary avoids SSR/hydration mismatch
- static fallback renders without WebGL
- reduced-motion fallback removes or freezes expensive motion
- mobile reduces complexity when needed
- canvas is bounded and does not own layout
- pointer events do not trap clicks/taps
- no primary content depends on shader timing
- performance budget is documented
- screenshot proof exists for default, active, mobile, and fallback states

Production-ready cannot mean "works on my machine with GPU on." It must degrade cleanly.
