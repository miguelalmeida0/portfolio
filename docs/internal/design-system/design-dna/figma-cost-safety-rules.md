# Figma Cost Safety Rule

Design OS must not trigger Figma paid, plan-gated, or AI-credit features by default.

Forbidden by default:

- Figma AI
- Figma Weave
- Figma Make
- paid generation
- AI credits
- Figma Motion
- Figma Draw
- Dev Mode-only operations
- any Figma feature that requires a paid seat or plan-gated entitlement

Allowed normal Figma Plugin API operations:

- pages
- frames
- vectors
- shapes
- text
- variables if available in the active file/context
- styles
- components
- node metadata
- storyboard frames

Hard rule:
If a requested Figma operation requires Figma Motion, Figma Draw, Dev Mode, Figma AI, Figma Weave, Figma Make, AI credits, paid generation, or a paid seat, stop and report exactly:

`Blocked: this requires a paid or plan-gated Figma feature.`

Agents must not trigger paid or credit-based Figma features automatically. If it is unclear whether a feature is normal Plugin API or paid/plan-gated, fail closed and ask for a free Plugin API alternative or report the block.

## Safe Figma Work

Safe Figma work is limited to normal Plugin API creation and editing: pages, frames, vector nodes, shapes, text nodes, variables/styles when available, components, metadata, and storyboard frames.

Use these operations for:

- static design screens
- wireframes
- component libraries
- storyboard flows
- diagrammatic frames made from ordinary vectors/shapes/text
- metadata annotations
- local design-system documentation

## Unsafe Figma Work

Do not use or invoke:

- prompt-to-design generation
- AI image or layout generation
- Figma Make app generation
- Figma Weave/code-generation flows
- Motion/animation features that require paid/plan-gated access
- Dev Mode exports or inspections that require paid access
- Draw or any gated creative tool
- any operation that spends AI credits or depends on a paid seat

## Review Checks

Before any Figma operation, confirm:

- The requested output can be made with normal Plugin API nodes.
- No AI-credit, Make, Weave, Motion, Draw, Dev Mode, or paid-seat feature is required.
- Any variables/styles used are already available or can be created through normal Plugin API access.
- The final report names any skipped paid/plan-gated Figma feature.
