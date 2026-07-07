# Elite Scroll Choreography Director Prompt

Work inside the project path provided by Migi. Do not use paid APIs or image generation.

## Inputs
- project type:
- brand personality:
- reference mechanics:
- content amount:
- primary media/object:
- desired scroll route:
- horizontal scroll allowed? yes/no:
- pinning allowed? yes/no:
- video transforms needed? yes/no:
- card assembly needed? yes/no:
- interaction states:
- mobile behavior:
- reduced-motion requirements:
- performance constraints:

## Required Work
1. Read skills/elite-scroll-choreography-director/SKILL.md.
2. Read design-intelligence/elite-scroll-choreography-patterns.md.
3. Select one primary scroll pattern.
4. Reject unsuitable patterns with reasons.
5. Create route map, chapter map, moving object inventory, nav sync plan, motion timeline, mobile fallback, reduced-motion fallback, layout-integrity risks, implementation approach, and QA checklist.
6. Do not implement until this plan is accepted or the current task explicitly includes implementation after selected direction.

## Output
- selected pattern:
- rejected patterns and why:
- route map:
- chapter map:
- object motion inventory:
- implementation approach:
- fallback plan:
- QA checklist:

## Late Check FM Media Placement Guardrails

- Apply the hero-only media default: video belongs in the top stage unless a later role is explicit.
- Enforce media never over text: media cannot cover headline, body, CTA, nav, labels, captions, or card content.
- Enforce no container thinning to fit media: content cards keep readable minimum widths.
- Content wins over media: text, CTAs, nav, and card readability beat any media object or scroll gimmick.
- Persistent video overlay is a hard blocker unless a reserved media lane, protected-zone map, and screenshot proof exist.

## Compact Navigation Icon Fallback

- compact nav must use icon fallback or a real menu pattern
- no arbitrary two-letter nav abbreviations
- active compact nav item must be understandable
- accessible labels are required for icon-only or visually-shortened items
- small-screen screenshots are required at 768 and 390

## Final UI Integrity Gate

Before final handoff:

1. Run build/lint.
2. Capture screenshots at required viewports.
3. Run scroll-choreography-review if scroll-heavy.
4. Run layout-integrity-review.
5. Run final-ui-integrity-gate.
6. Run final scorecard.

Do not claim success if clipped text, overlap, nav overflow, media/text collision, accidental blank space, fixed overlay collision, or the user's original complaint remains visible. If the final UI integrity gate is failed or blocked, fix the UI and rerun validation before responding.
