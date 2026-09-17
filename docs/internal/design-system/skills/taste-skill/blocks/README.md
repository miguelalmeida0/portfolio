# Taste Block Library Contract

This folder defines the contract for future Taste-derived block files. It is a structure for reusable Miguel Design OS block knowledge, not a finished component library.

## File Rule

Create one block per file. Keep each block focused on a single reusable pattern such as a hero, feature proof, social proof unit, pricing module, CTA, footer, navigation pattern, portfolio case block, or transition section.

## Required Frontmatter

```yaml
---
id:
category:
status: draft
bestFor:
avoidWhen:
sourceReferences:
---
```

## Required Sections

Each future block file must include:

- visual sketch
- props API
- code sketch
- mobile fallback
- motion variants
- dark-mode notes
- anti-patterns
- references

## Visual Sketch

Describe the composition, hierarchy, focal object, density, typography behavior, image role, CTA behavior, and responsive adaptation. Do not use generic “clean modern section” language.

## Props API

List the expected data shape and which fields are optional. Mock data must be truthful and must not imply a backend, live state, or metrics that do not exist.

## Code Sketch

Provide a short implementation outline. Prefer local design-system tokens and component variants. Avoid one-off colors and ad hoc Tailwind chaos.

## Mobile Fallback

Explain how the block changes at 390px. A desktop block must adapt; it must not squeeze into unreadable fragments.

## Motion Variants

List motion only when it serves state, feedback, hierarchy, continuity, or earned delight. Include reduced-motion behavior.

## Dark-Mode Notes

Define surface, text, border, image, and shadow behavior. Do not default to terminal green, muddy monochrome, or AI purple.

## Anti-Patterns

Name the likely AI tells for the block: equal-card soup, prose-heavy containers, fake div screenshots, generic logos, CTA wrapping, duplicate CTA intent, motion noise, or giant inflated scale.

## References

Point to visual-library references, research-input source names, or Design OS rule files that justify the block. Screenshots are evidence, not production assets.
