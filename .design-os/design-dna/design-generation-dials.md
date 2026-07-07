# Design Generation Dials

Use these dials before visual-heavy work. They make taste decisions explicit instead of letting defaults leak in.

For new visual-heavy work, dials must feed the No-Image Fast Direction Gate. Each direction card should interpret the dials differently enough that Safe Refined, Artistic Expressive, and Unexpected High-Character are meaningfully distinct in composition, palette, navigation, motion concept, and primary product object.

Scale: 1 to 10.

## DESIGN_VARIANCE

Meaning: How far the composition can move from conventional patterns.

Increase when:

- creative/artistic references are active
- Migi asks for memorable, cinematic, editorial, or non-obvious work
- the category is visually saturated

Decrease when:

- the task is enterprise, dense, regulated, or precision-heavy
- Literal Target Copy Mode is active
- visual parity matters more than originality

Failure modes:

- too low: generic template output
- too high: decorative chaos

Mode defaults:

- dashboard: 5 to 7
- landing/artistic: 7 to 9
- mobile flow: 4 to 7
- literal copy: 1

## MOTION_INTENSITY

Meaning: How much motion supports state, storytelling, or feedback.

Increase when:

- product represents freshness, activity, selection, progress, or narrative
- mobile gestures are part of the flow

Decrease when:

- dense reading, legal/medical/financial precision, or data comparison dominates
- user needs calm scanning

Failure modes:

- too low: dead surface
- too high: distraction or accessibility risk

Mode defaults:

- dashboard: 3 to 6
- landing/artistic: 4 to 8
- mobile flow: 5 to 8
- review/implementation: 2 to 4

## VISUAL_DENSITY

Meaning: How much meaningful content appears in the viewport.

Increase when:

- dashboard, command center, research, comparison, or operations work
- references show dense but readable surfaces

Decrease when:

- poster/landing hero needs emotional focus
- onboarding or single-action creation dominates

Failure modes:

- too low: AI scale inflation and empty furniture
- too high: clutter and unreadable panels

Mode defaults:

- dashboard: 7 to 9
- landing/poster: 2 to 5
- mobile flow: 5 to 7
- selection/gallery: 5 to 8

## ART_DIRECTION

Meaning: How much the screen should feel authored beyond utility.

Increase when:

- references are artistic, premium, image-led, or experimental
- Migi complains the result is generic or lifeless

Decrease when:

- task is technical parity, bug fix, or plain internal admin

Failure modes:

- too low: software default
- too high: product clarity loss

Mode defaults:

- dashboard: 6 to 8
- landing/artistic: 8 to 10
- mobile flow: 5 to 8
- implementation-only: 2 to 4

## IMAGE_USAGE_PRIORITY

Meaning: How important images, objects, media, scenes, or visual proof are.

Increase when:

- references are image-led
- product has people, places, objects, media, products, characters, or proof artifacts

Decrease when:

- data/table/form clarity dominates
- asset sourcing is unsafe or unavailable

Failure modes:

- too low: image-starved and forgettable
- too high: imagery becomes filler or asset-risk

Mode defaults:

- dashboard: 4 to 8 when references support it
- landing/poster: 8 to 10
- mobile flow: 5 to 8
- research terminal: 1 to 4

## IMPLEMENTATION_CLARITY

Meaning: How buildable and inspectable the visual plan must be.

Increase when:

- Codex will implement immediately
- references are complex
- multiple agents will hand off

Decrease when:

- early mood exploration only

Failure modes:

- too low: pretty but unbuildable
- too high: over-constrained and boring

Mode defaults:

- all production-oriented UI: 8 to 10
- concept exploration: 6 to 8

## MOBILE_NATIVE_FEEL

Meaning: How much the experience should feel designed for mobile behavior instead of web shrinkage.

Increase when:

- mobile app references are active
- primary usage is phone-first
- gestures, bottom nav, safe areas, or thumb reach matter

Decrease when:

- desktop command center or table-heavy app is primary

Failure modes:

- too low: scaled-down website
- too high: desktop loses useful density

Mode defaults:

- mobile product flow: 8 to 10
- dashboard desktop-first: 2 to 5
- responsive web: 5 to 7

## GRAPH_COMPLEXITY

Meaning: How rich and varied the data visualization system should be.

Increase when:

- dashboard references are graph-rich
- user decisions need trend, comparison, target, anomaly, distribution, or flow

Decrease when:

- charts would be decorative
- data is too thin
- mobile precision is poor

Failure modes:

- too low: chart-lite dashboard
- too high: fake analytics wallpaper

Mode defaults:

- dashboard/BI: 7 to 9
- landing page: 1 to 3
- mobile consumer: 2 to 5
- selection/gallery: 1 to 4

## Mode Defaults Summary

Use this as the starting point, then adjust based on Migi's brief and selected references.

| Mode | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY | ART_DIRECTION | IMAGE_USAGE_PRIORITY | IMPLEMENTATION_CLARITY | MOBILE_NATIVE_FEEL | GRAPH_COMPLEXITY |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard / Command Center | 5-7 | 3-6 | 7-9 | 6-8 | 4-8 | 9-10 | 2-5 | 7-9 |
| Landing Page / Poster | 7-9 | 4-8 | 2-5 | 8-10 | 8-10 | 8-10 | 5-7 | 1-3 |
| Artistic / Creative | 8-10 | 5-9 | 2-6 | 9-10 | 7-10 | 7-9 | 4-7 | 1-4 |
| Mobile Product Flow | 4-7 | 5-8 | 5-7 | 5-8 | 5-8 | 8-10 | 8-10 | 2-5 |
| Selection / Gallery / Browse | 5-8 | 4-7 | 5-8 | 6-8 | 6-9 | 8-10 | 4-7 | 1-4 |
| Tool / Workbench | 3-6 | 2-5 | 6-9 | 4-7 | 2-6 | 9-10 | 3-6 | 4-8 |
| Portfolio / Editorial | 7-10 | 3-7 | 2-6 | 8-10 | 7-10 | 7-9 | 5-7 | 1-3 |

These defaults are not permission to ignore references. Reference-Locked Build Mode overrides generic defaults with observed scale, density, image, graph, and composition mechanics from selected anchors.

## Direction Gate Use

When creating 3 no-image direction cards:

- Safe Refined usually keeps variance moderate and implementation clarity high.
- Artistic Expressive usually increases art direction, image priority, and palette character.
- Unexpected High-Character should push design variance while preserving readability and implementation clarity.

Do not make three directions by changing only color. Composition, type mood, image/media strategy, motion concept, and navigation approach must change too.

After Migi selects one direction or a hybrid, lock the selected dials into `docs/design/selected-direction.md` and continue into implementation. Do not ask for another approval checkpoint unless Migi explicitly asked for planning-only, spec-only, wait, or no-code.
