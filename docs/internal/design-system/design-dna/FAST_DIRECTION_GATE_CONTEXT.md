# Fast Direction Gate Context

Use this compact context for normal new app/design tests before loading deeper Miguel Design OS strategy files.

## No Paid Image Generation By Default

Design OS must never call paid image APIs by default. Do not use `OPENAI_API_KEY`, automatic `gpt-image` calls, or paid API moodboards during the default direction gate.

Paid image generation may only run if Migi explicitly writes:

`I approve paid API image generation for this run.`

The command must also include `--paid-ok`. If either is missing, fail closed and use the no-image direction gate.

## Direction Gate Modes

### Fast Direction Gate - Default

Use for normal new app, redesign, landing, mobile product, dashboard, or visual-heavy tests when Migi has not selected a direction yet.

Create only:

- `docs/design/direction-options.md`
- `docs/design/direction-layout-maps.md`
- `docs/design/direction-risk-check.md`

No images, no API calls, no visual spec, no implementation, no build/lint, and no source edits.

Do not create visual specs, design-system docs, palette docs, navigation plans, motion plans, Unsplash manifests, QA docs, build/lint reports, screenshots, or frontend code before selection.

### Deep Direction Gate - Opt In

Use only when Migi asks for deep exploration, full strategy, full spec, research pass, benchmark pass, reference decomposition, or reference-locked planning.

Deep mode may create `design-read.md`, `active-dials.md`, reference decomposition, navigation strategy, palette exploration, motion plans, and other planning docs.

## Direction Definitions

- Direction A - Safe Refined: controlled, readable, polished, lower-risk, high usability.
- Direction B - Artistic Expressive: stronger art direction, memorable composition, richer palette, best balanced candidate.
- Direction C - Unexpected High-Character: boldest original option, unusual but still usable and readable.

Each direction must include a compact layout map, primary product object, domain palette rationale, nav state effect, interaction promises, implementation complexity, likely failure risk, and recommendation score. Maximum 200 words per direction.

## Migi Taste Rules For First Concepts

- Avoid generic SaaS, admin templates, card soup, fake charts, fake live/session/status chips, and fake AI claims.
- Avoid forced logo/name chrome, initials bubbles, app-name chips, and default logo-left navigation unless the direction truly needs them.
- Avoid decorative circular/orbital/radar/HUD overlays unless functional and requested.
- Avoid decorative grid/lined backgrounds, graph-paper textures, separator ornaments, and filler hairlines.
- Avoid container gravity: do not make every idea a rounded card or boxed panel.
- Keep palette exploration deliberate: safe, expressive, and high-character options should feel distinct.
- Treat navigation as composition, not default navbar reflex.
- Preserve composition originality: directions must differ in layout, hierarchy, palette, navigation, interaction, and motion idea.
- Do not use decorative-only controls.
- Avoid Service Floor failures: random domain palette, placebo navigation, spatial label collision, and primary product object buried by cards.

## Selection Means Build Approval

When Migi chooses Direction A, B, C, or a hybrid, the selection is implementation approval unless Migi explicitly says planning-only, no-code, spec-only, or stop.

After selection, create `docs/design/selected-direction.md`, then continue into the full implementation pipeline.

## Final Response Contract For Fast Gate

Report:

- files created
- confirmation no paid image API was called
- three direction names
- one-line summary of each direction
- strongest recommendation
- biggest risk in each direction
- confirmation no frontend/source code was changed
- prompt Migi to choose A, B, C, or a hybrid
