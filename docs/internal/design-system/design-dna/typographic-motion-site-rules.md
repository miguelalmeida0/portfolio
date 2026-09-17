# Typographic Motion Site Rules

## Purpose

This rule set defines a high-character typographic motion-site language inspired by elite animation-library design references.

It is for projects where motion, typography, and interactive visual primitives are core to the product concept.

It is not a default theme.

## Transferable Mechanics

- dark canvas as stage
- warm off-white or cream primary typography
- massive editorial display type
- tight line-height and tight tracking for hero words
- outlined pill controls instead of filled CTA spam
- color as taxonomy, not decoration
- category labels as navigation or section anchors
- organic 3D or gradient motion objects as foreground imagery
- hairline dividers
- full-bleed display composition
- bracket or annotation micro-language
- sparse UI chrome
- motion objects overlapping type with intention
- no box-shadow dependency
- visual richness from foreground objects, not busy backgrounds

## Allowed Use Cases

- animation library or motion product pages
- creative tool pages
- WebGL or shader primitive demos
- experimental one-page apps
- portfolio or specimen pages
- playful but premium product surfaces
- selected hero or splash sections
- motion-heavy but content-light experiences

## Forbidden Use Cases

- serious dashboards
- dense admin products
- medical, legal, or financial interfaces
- apps where readability or data clarity is the main job
- every Design OS project by default
- copying the exact GSAP brand style
- random cream-on-black without product reason
- category colors used as decoration
- giant typography that breaks mobile
- outlined buttons with unclear clickability
- organic blobs as meaningless wallpaper

## Token Mechanics

Use the reference tokens as mechanics, not as global Design OS defaults.

- page canvas: near-black, warm, not pure black
- primary text: warm cream/off-white, not pure white
- muted text: low-chroma warm gray with enough contrast
- hairline border: low-contrast divider for structure
- nested dark surface: one step lifted from the page canvas
- category accent colors: assigned to semantic disciplines or sections
- ghost-pill radius: fully rounded controls
- tight editorial type scale: huge display type plus compact UI text
- spacing: 4px base with generous section gaps
- layout width: about 1280px max for content modules
- elevation: no drop-shadow dependency; depth comes from surfaces, spacing, gradients, and foreground objects

Reference values from the source may be used for a project-specific theme, but must not be copied blindly:

```css
:root {
  --tm-canvas: #0e100f;
  --tm-text: #fffce1;
  --tm-muted: #7c7c6f;
  --tm-border: #42433d;
  --tm-nested: #191919;
  --tm-accent-green: #0ae448;
  --tm-accent-orange: #ff8709;
  --tm-accent-pink: #fec5fb;
  --tm-accent-lilac: #9d95ff;
  --tm-accent-blue: #00bae2;
  --tm-pill-radius: 100px;
  --tm-content-max: 1280px;
}
```

## Typography Rules

- Display typography may be huge, edge-aware, and tightly tracked.
- Display type must be responsive with `clamp()` and real mobile breakpoints.
- Body text cannot become tiny to preserve the poster composition.
- One-family systems can work when the font has enough character.
- Use a humanist sans fallback if the custom font is not available.
- Hero type must not destroy mobile, cause horizontal overflow, or clip words.
- Negative tracking must be reduced as type scales down.

## Interaction Rules

- Ghost-pill buttons need unmistakable hover, focus-visible, active, and disabled states.
- Outlined-only systems must still communicate the primary action.
- Category labels must remain semantically meaningful.
- Interactive controls cannot rely on color alone.
- No dead buttons.
- No fake nav.
- No fake live indicators.
- Category colors must map to product concepts, not decorative mood.

## Motion Rules

- One signature motion object can carry the page.
- Foreground organic objects may overlap type only with protected text zones and intentional composition.
- Motion must reinforce the product concept.
- Avoid fade-and-rise everywhere.
- Avoid random parallax.
- Avoid scroll hijacking.
- Respect reduced motion.
- Static fallback is required.
- Anime.js or WebGL may be used only when the concept earns it and the relevant primitive rules are satisfied.

## Mobile Rules

- Massive type must clamp aggressively.
- Side-scroll and large visuals must stay contained.
- Ghost controls must remain tappable.
- Category labels must not become cramped decoration.
- Large hero composition must remain readable.
- Organic foreground objects must not cover primary text or controls.
- Mobile proof is required before approval.

## Design OS Approval Requirements

Any project using this style must provide:

- visual thesis
- token mapping
- screenshot proof
- mobile proof
- contrast review
- motion review
- reduced-motion behavior
- explanation of what was transferred and what was not copied

## Score Caps

- typographic motion style used with no product reason: max score 5
- exact GSAP brand copy instead of transferred mechanics: max score 4
- giant type breaks mobile or clips words: max score 3
- category colors are decorative and not semantic: max score 5
- outlined controls lack clear affordance or focus states: max score 5
- organic motion objects become meaningless blobs/wallpaper: max score 4
- no reduced-motion fallback for motion-led page: max score 5
- no screenshot/mobile proof: max score 5
