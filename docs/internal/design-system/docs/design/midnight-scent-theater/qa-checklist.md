# Midnight Scent Theater QA Checklist

## Cost Safety

- [ ] No Figma AI used.
- [ ] No Figma Make used.
- [ ] No Figma Weave used.
- [ ] No image generation used.
- [ ] No Figma Motion, Figma Draw, Dev Mode-only, paid-seat, or AI-credit feature used.
- [ ] Plugin snippet uses only normal Figma Plugin API pages, frames, shapes, text, variables/styles if available, components, node metadata, and storyboard frames.

## Shape QA

- [ ] Every visible shape has a role.
- [ ] Every major shape uses `[role] / [motif] / [state] / [variant]` naming.
- [ ] Decorative shapes are explicitly marked decorative.
- [ ] Decorative smoke marks do not cover, reduce contrast, or compete with content.
- [ ] Every shape has bounds and anchors.
- [ ] Every shape maps to a motif family.
- [ ] Moon/lens forms are not decorative orbital/HUD/radar/sonar rings.
- [ ] Curtain folds control reveal/mask behavior and are not random wavy panels.
- [ ] Scent bottle silhouette is labeled as a fictional product object.
- [ ] Text-safe zones are documented for hero, CTA, scent labels, and editorial chapters.
- [ ] Responsive behavior is documented for desktop, tablet, and mobile.
- [ ] Geometry and color tokens are separate.
- [ ] Corner smoothing notes exist where squircle-like shapes are used.

## Morph QA

- [ ] Circle-to-lens compatibility notes exist.
- [ ] Squircle-to-bottle compatibility notes exist.
- [ ] Curtain-fold-to-mask compatibility notes exist.
- [ ] Petal-to-smoke is marked decorative-only if arbitrary morphing is used.
- [ ] Similar point count or normalized path strategy is documented before SVG morph implementation.
- [ ] Morph paths preserve text-safe zones.
- [ ] Reduced-motion fallback exists for every morph.

## Motion QA

- [ ] Storyboard includes frame 01 start.
- [ ] Storyboard includes frame 02 anticipation.
- [ ] Storyboard includes frame 03 transformation.
- [ ] Storyboard includes frame 04 settle.
- [ ] Storyboard includes frame 05 final state.
- [ ] Trigger is defined.
- [ ] Timeline is defined.
- [ ] Duration is defined.
- [ ] Easing is defined.
- [ ] Affected layers are named.
- [ ] Figma is treated as storyboard/handoff; runtime animation happens in code.
- [ ] Reduced-motion fallback disables curtain slide, path morph, smoke draw-on, and large parallax.
- [ ] Animation is not just fade/slide pretending to be morphing.

## Export QA

- [ ] SVG `viewBox` is preserved.
- [ ] Meaningful SVGs have `title` and `desc`.
- [ ] Decorative SVGs are marked `aria-hidden` in code.
- [ ] Reusable icon-like marks use `currentColor`.
- [ ] Fixed theme fills are not baked into reusable geometry.
- [ ] Live text is not exported as outlined SVG when HTML text is possible.
- [ ] Handoff includes shape tokens, vector export manifest, motion manifest, implementation notes, and accessibility notes.

## Landing Page Fit

- [ ] The system reads as editorial perfume theater, not generic luxury SaaS.
- [ ] Bottle silhouette, lens, curtain, and smoke marks serve the concept.
- [ ] Palette and material remain separate from shape grammar.
- [ ] The hero does not depend on paid image generation.
- [ ] The visual grammar can be implemented with local SVG/CSS/code assets.
