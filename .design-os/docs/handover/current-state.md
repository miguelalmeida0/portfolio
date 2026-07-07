# Design OS Current State

Miguel Design OS is a local design memory and frontend-agent instruction system. It is made of rules, skills, templates, QA tools, visual evidence, and case studies.

The current operating model is:

1. Ingest Design OS.
2. Retrieve relevant approved and rejected visual memory.
3. Classify task mode.
4. Use the smallest relevant skill chain.
5. Produce required design artifacts before implementation.
6. Validate with screenshots and detector tools before handoff.
7. Convert failures into Design OS memory.

## Verified Current Health

At the time this handover was created, these commands passed before editing:

```bash
node tools/design-os.mjs doctor
node tools/design-os.mjs list-skills
```

Run them again in the current session before any dogfood work.

## Current High-Priority Rules

- Final UI Integrity Gate v3 is mandatory for visual/frontend handoff.
- Build/lint is not visual proof.
- Text clipping, nav overflow, media over text, viewport-edge clipping, and unresolved user complaints block final handoff.
- Mobile route/app navigation defaults to persistent bottom navigation.
- Detail reveals must stay anchored to the selected trigger.
- Fake `LIVE`, fake realtime, fake presence, and fake activity labels are banned unless real live behavior exists.
- Fake narrative/replay/mission/case-file chrome is banned unless it is a real product object with documented behavior.
- Offset containers and backplates must have clean corner geometry.
- Navigation active state must be keyed by stable ids and verified by clicking every item.
- Brand/app-name chrome must remain readable over variable backgrounds or be removed/moved.
- Dashboards must avoid robotic AI palettes and must define route architecture for complex operational workflows.
- Sepia/espresso/umber brown-black card, panel, note, container, sidebar, nav, and stage surfaces are P0 blockers capped at 2/10.
- Domain realism is mandatory: every new app/dashboard/product UI needs a Domain Content Contract with real business entities, real pages/routes, route jobs, realistic mock records, units/ranges/statuses/source labels, and no random `mission control` / `topology` / `traces` theater unless the product domain proves it.
- Advanced scroll is experimental by default.
- Anime.js is approved as a controlled motion primitive only when CSS is not enough. It requires the `animejs-motion-director` skill, scoped React/Next usage, cleanup on unmount, reduced-motion fallback, mobile proof, and screenshots.
- WebGL/shader visual primitives are experimental by default. ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, and shader atmospheres require the `webgl-shader-primitives` skill, static/reduced-motion/mobile fallbacks, bounded canvas/GPU area, no pointer traps, no fake live affordance, performance notes, and screenshot proof.

## Current Evidence Map

Use approved memory for what worked:

- `visual-library/approved/case-studies/hostel-radio-first-passed-project/`
- `visual-library/approved/case-studies/late-check-fm-first-passed-project/`
- `visual-library/approved/case-studies/tempo-loom-mobile-product-success/`

Use rejected memory for what must not recur:

- Late Check FM failure family for scroll, media, clipping, nav, detail reveal, fake live, offset containers, and active-state bugs.
- Bunk Radio failure family for text/container/nav failures.
- Nocturne failure family for amateur SVG, bad texture, annotation collisions, and missing signature interactions.
- Booking/nav/brand contrast failure family for never-selected nav items and unreadable app names over darker image bands.
- Cascade Lab dashboard failure for dull robotic palette, one-page information pileup, route underuse, and weak transfer from approved elite dashboard inspiration.
- Cascade Lab AI-theater failure for decorative narrative/status chips, replay/mission chrome, oversized replay metadata strips, fake case-file IDs, and bottom viewport cutoff.
- Sepia/espresso surface-wash failure for recurring brown-black containers, including the Cascade Lab commander-note panel.
- Domain-generic mock data failure for random values, unclear app sections, fake command labels, and pages/routes that do not map to real business work.
- `design-dna/animejs-motion-primitive-rules.md`, `implementation-kits/animejs-motion/`, and `prompts/dogfood/animejs-motion-gate.md` for controlled Anime.js motion governance.
- `design-dna/webgl-shader-visual-primitives-rules.md`, `templates/implementation-kits/webgl-shader-primitives/`, and `visual-primitives/liquid-logo/` for experimental shader/WebGL governance.

## Unverified Recovery Context

The following was supplied during handover recovery and is not verified from this repo:

- Hostel Radio external path: `/Users/malmeida/Desktop/design-os-random-test`
- GitHub remote: `https://github.com/miguelalmeida0/hostel-radio.git`
- Passed tag: `hostel-radio-v1-passed`
- Passed-state screenshot source folders in the external project

Do not access or modify the external project unless Miguel explicitly asks.
