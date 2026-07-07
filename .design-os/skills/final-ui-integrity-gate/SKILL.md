---
name: final-ui-integrity-gate
description: Fail-closed final review for visual UI integrity before handoff. Use for every frontend implementation, landing page, app redesign, visual-heavy page, scroll/motion-heavy page, mobile/product UI, custom navigation page, and any page with media, cards, stickers, labels, overlays, or custom typography.
---

# Final UI Integrity Gate

## Purpose

Fail-closed final review for visual UI integrity before handoff.

## Use For

- every frontend implementation
- every landing page
- every app redesign
- every visual-heavy page
- every scroll/motion-heavy page
- every mobile/product UI
- every page with custom navigation
- every page with media, cards, stickers, labels, overlays, or custom typography

## Required Inputs

- local URL
- required viewport list
- screenshot paths
- user's original complaint
- changed files
- final implementation state

## Required Checks

- clipped text
- overflow text
- overlapping containers
- card/text collisions
- media/text collisions
- nav overflow
- CTA clipping
- fixed/sticky overlay collisions
- accidental blank space
- text hidden by overflow hidden
- scroll-state collisions
- disconnected detail reveals
- mobile route nav disappearing on scroll
- top-only mobile route nav for app-like experiences
- fake live/realtime/status affordances
- generic domain theater and random mock data
- offset/backplate/layered-container corner alignment
- navigation active-state correctness
- reduced viewport survival

## Required Output

| Check | Evidence | Result | Severity | Required Fix |
|---|---|---|---|---|

## Verdicts

- `passed`: all required integrity checks pass.
- `partial`: only non-blocking issues remain and they are documented.
- `failed`: P0 blockers are present.
- `blocked`: evidence or tooling is unavailable; do not claim passed.

## Hard Rule

Screenshot evidence beats agent self-report.

If screenshots show clipped text or overlap, verdict is failed even if build/lint passed.

Before final handoff, run `tools/final-ui-integrity-check.mjs` when a local URL exists:

```bash
node tools/final-ui-integrity-check.mjs --url <local-url> --out docs/qa/final-ui-integrity/ --width-sweep 360:1920:40 --heights 720,844,900,1080 --scroll-samples 0,0.1,0.2,0.35,0.5,0.65,0.8,0.9,1
```

If the tool is unavailable or blocked, produce `templates/reports/final-ui-integrity-report.md` manually from screenshots. A blocked gate cannot be reported as passed.

## Final UI Integrity Gate v3

For visual/frontend work, final UI integrity v3 is mandatory before handoff. Screenshot evidence at only one width is insufficient.

Required v3 proof:
- Test viewport matrix: 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920.
- Sample scroll positions: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00.
- Include applicable states: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, and reduced motion when practical.
- Report passed and failed sampled viewport states.

Floating labels, stickers, cards, badges, props, and containers require responsive anchoring and overlap checks. Final response must not claim success if the v3 gate fails, is blocked, has blockers, has cut text, has floating overlap, has media/text collision, has nav overflow, or lacks matrix evidence.

## Final UI Integrity Gate v3

Final UI Integrity Gate v3 is mandatory for visual/frontend work. Fixed breakpoint-only evidence is insufficient.

Required v3 proof:
- Width sweep from 360 to 1920 in 40px steps or smaller when practical.
- Height matrix: 720, 844, 900, 1080.
- Scroll samples: 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00.
- Applicable states: default, nav active, selected/open detail, compact nav, sticky/pinned stage, reduced motion when practical.
- Passed and failed sampled states.

Horizontal scroll must prove readable resting states. Floating objects must prove safe across resizing. Viewport-edge clipping, partial active panels, blank scroll states, cut text, overlap, and user-visible complaints block handoff.

Final response is forbidden unless the gate passes or clearly reports blocked/failed.

## Anchored Detail Reveal And Mobile Bottom Nav

Final UI Integrity Gate must block:

- detail panel disconnected from clicked trigger
- visible `data-detail-panel` missing `data-detail-for`
- selected `data-detail-trigger` with no matching visible panel
- detail opens below fold without focus/scroll context
- mobile route/app navigation appears only at top
- mobile route/app navigation disappears after scroll
- mobile route/app navigation lacks bottom-accessible route control
- bottom mobile nav lacks safe-area/accessibility proof

Expected hooks:

- `data-detail-trigger`
- `data-detail-panel`
- `data-detail-for`
- `data-selected-item`
- `data-detail-detached-allowed`
- `data-nav-primary`
- `data-nav-mobile`
- `data-nav-persistent`
- `data-nav-position="bottom"`
- `data-nav-safe-area`

Score caps:

- detail panel disconnected from trigger: max score 4.
- selected item not visibly connected to detail: max score 5.
- mobile route nav disappears on scroll: max score 3.
- mobile nav is top-only for app-like route experience: max score 4.

## Fake Live / Offset Container / Navigation Active State

Final UI Integrity Gate must block:

- fake `LIVE`, fake live feed, fake realtime, fake presence, fake activity, or pulsing live badges without real live behavior
- decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, fake `CL-####`, dossier, operation, or fake severity/status chips without real product behavior
- generic `mission control`, `control room`, `command center`, `topology`, `traces`, or `system map` language without a real domain/data contract
- random mock values, abstract metrics, or route labels that do not map to real business tasks
- sepia/espresso/umber brown-black surfaces on pages, stages, cards, panels, notes, containers, sidebars, nav, drawers, modals, or framed objects
- layered containers, media backplates, offset frames, or backing cards with messy exposed corners, mismatched radii, or accidental leaks
- nav items that do not activate themselves after click
- first/last nav items that never receive active state
- adjacent/right-side nav items becoming active instead of the clicked item
- visual active state disagreeing with `aria-current`, `aria-selected`, `data-nav-active`, or `data-nav-selected`
- app name, wordmark, logo text, or brand chrome unreadable over dark/variable backgrounds

Expected hooks:

- `data-live-justified`
- `data-live-source`
- `data-update-cadence`
- `data-realtime-source`
- `data-ai-theater-justified`
- `data-domain-object`
- `data-product-behavior`
- `data-replay-source`
- `data-real-severity`
- `data-case-id-source`
- `data-layered-container`
- `data-backplate`
- `data-frontplate`
- `data-nav-id`
- `data-nav-target`
- `data-nav-active`
- `data-nav-selected`
- `data-brand-chrome`
- `data-app-name`
- `data-wordmark`
- `data-brand-contrast-safe`

Score caps:

- fake LIVE badge: max score 4.
- fake live feed label: max score 3.
- fake narrative/fictional incident chip: max score 4.
- replay/mission chrome used as default identity: max score 4.
- fake case-file or dossier identifier: max score 3.
- no Domain Content Contract for app/dashboard/product UI: max score 4.
- random mock values with no units/ranges/source: max score 3.
- generic domain-theater sections instead of real business pages/routes: max score 3.
- sepia/espresso/umber container surface: max score 2.
- misaligned media backplate: max score 3.
- messy exposed backing corner: max score 4.
- clicked nav item does not become selected: max score 2.
- adjacent/right-side item becomes selected: max score 2.
- nav item never receives selected state: max score 2.
- first/last nav item never receives selected state: max score 2.
- app name unreadable over dark/variable background: max score 3.
- brand chrome over image/background without contrast strategy: max score 4.

## WebGL / Shader Primitive Check

Final UI Integrity Gate must block WebGL, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo, animated premium gradient, or shader atmosphere usage when:

- no `webgl-shader-primitives` gate/report exists
- the effect is generic decoration or a tech demo
- the effect covers weak layout, typography, hierarchy, or product clarity
- text/nav/CTA readability depends on lucky shader colors or motion timing
- the canvas traps pointer events or blocks primary controls
- no static fallback exists
- no reduced-motion fallback exists
- no mobile fallback or reduced complexity exists
- no bounded canvas/GPU area is documented
- no performance note exists
- fake live/realtime/status/presence is implied
- desktop/mobile/reduced-motion screenshot proof is missing

Liquid Logo-style effects must be documented as source inspiration/adaptation reference. Do not approve `npm i liquid-logo` or copied third-party shader code without license attribution and clear adaptation notes.

## Anime.js Motion Primitive Check

Final UI Integrity Gate must block Anime.js usage when:

- no Anime.js motion gate/plan exists
- Anime.js is used for generic fade-and-rise everywhere
- CSS transitions would clearly be enough
- content is hidden until animation timing finishes
- motion blocks reading, navigation, selection, focus, or pointer interaction
- motion implies fake live/status/pulse behavior
- no reduced-motion/static fallback exists
- no mobile proof exists
- React/Next selectors are global or unscoped
- loops, timelines, draggables, or timers are not cleaned up on unmount
- screenshot proof for default, active/selected, mobile, and reduced-motion states is missing

Anime.js must support hierarchy, state, spatial continuity, delight, or comprehension. It cannot be approved as motion wallpaper.
