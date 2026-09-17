# Final UI Integrity Checklist

Run before final handoff for every frontend/design task.

## Evidence

- Build/lint completed.
- Screenshots captured.
- Scroll states captured at 0, 0.10, 0.20, 0.35, 0.50, 0.65, 0.80, 0.90, 1.00 when scroll/media-heavy.
- Width sweep checked: 360 through 1920 at 40px steps or smaller when practical.
- Height samples checked: 720, 844, 900, 1080.
- Minimum viewport states checked: 360x720, 390x844, 430x844, 640x900, 768x900, 900x900, 1024x900, 1180x900, 1280x900, 1366x900, 1440x900, 1536x900, 1728x1080, 1920x1080.
- Interaction states checked where applicable: default, nav active states, selected/open detail panel, sticky/pinned active section, compact nav, reduced motion.
- Passed and failed sampled viewport states are listed.
- Screenshot evidence directory is present.

## Blocker Checks

- No clipped critical text.
- No cut words.
- No nav label overflow.
- No CTA/button label clipping.
- No card title/body clipping.
- No media/image/video over readable text.
- No container covering important text.
- No floating label, sticker, card, badge, prop, or container drifting into another container.
- No viewport-edge clipping of critical content.
- No active card/panel partially unreadable.
- No horizontal scroll showing partial critical content at rest.
- No blank scroll state without intentional marker.
- No fixed/sticky overlay covering content.
- No uncontrolled body horizontal overflow.
- No accidental huge blank viewport areas.
- No fake `LIVE`, live feed, realtime, presence, activity, or online labels without documented live behavior.
- No fake live icon/dot/ticker without documented live behavior.
- No decorative `Narrative`, `Fictional incident`, `Replay`, `Mission`, `Mission Room`, `Case File`, fake `CL-####`, dossier, operation, or fake severity/status chips without documented product behavior.
- No generic domain theater: `mission control`, `control room`, `command center`, `topology`, `traces`, or `system map` must have a real domain/data contract.
- No random mock data: values need domain meaning, units/ranges/statuses/source labels, and visible sections must map to real business tasks.
- No oversized replay/status metadata strip taking prime page space.
- No muddy sepia/espresso/umber brown-black surface on cards, panels, notes, containers, sidebars, nav, stages, or app backgrounds.
- No messy offset/backplate/layered-container corners.
- No mismatched frontplate/backplate radius that creates a broken corner.
- No app name/wordmark/brand chrome unreadable over dark or variable backgrounds.
- Brand chrome over image/video/gradient/dark surfaces has contrast proof.
- No WebGL/shader/canvas effect used without static fallback, reduced-motion fallback, mobile behavior, bounded canvas area, performance note, and screenshot proof.
- No shader gradient or WebGL atmosphere making text/nav/CTA readability depend on lucky motion/color.
- No WebGL/canvas layer trapping pointer events or blocking controls.
- No Liquid Logo-style effect treated as an npm package dependency.
- No nav item that fails to activate itself after click.
- No adjacent/right-side nav item receiving active state after another item is clicked.
- Visual active state, `aria-current`/`aria-selected`, and data selected hooks agree.
- No unresolved user complaint visible in screenshots.

## Interaction Checks

- Click every nav item in order.
- Verify the clicked item receives active background/color.
- Verify exactly one route nav item is active unless multi-select is explicit.
- Verify mobile bottom nav active state works after scroll.
- Inspect all four corners of every layered media/container/backplate.
- Search visible copy for fake live/realtime/activity terms.
- Search visible copy for AI-theater terms: narrative, fictional incident, replay, mission, case file, dossier, operation, fake IDs, and fake severity chips.
- Search visible copy for generic domain-theater terms: mission control, control room, command center, topology, traces, and system map.
- Verify Domain Content Contract exists for app/dashboard/product UI.
- Inspect cards, panels, notes, sidebars, nav, and app/stage backgrounds for sepia/espresso/umber brown-black surfaces.
- Inspect app name/wordmark over every background state.
- Verify first and last nav items can become active.
- If WebGL/shaders are present, verify `webgl-shader-primitives` gate/report exists.
- If WebGL/shaders are present, capture desktop, mobile, active, and reduced-motion/static fallback evidence.

## Verdict

- `passed`
- `partial`
- `failed`
- `blocked`

Only `passed` with zero blockers, no failed viewport states, and `finalHandoffAllowed: true` can support a success claim.
