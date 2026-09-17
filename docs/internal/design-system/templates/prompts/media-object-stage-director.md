# Media Object Stage Director Prompt

Use this when video/image/media is a primary interface object.

## Inputs
- project path:
- protected folders:
- project type:
- selected direction:
- media assets or references:
- desired media role:
- supported breakpoints:
- accessibility constraints:

## Required Output
- media role
- media state map
- crop and safe-zone strategy
- poster/loading/error fallback
- controls/caption plan
- sticky/pinned/transform behavior if any
- reduced-motion behavior
- QA checklist

Hard bans: media as vague background when object stage is required, broken crop, unreadable text over media, video without poster fallback.

## Late Check FM Media Placement Guardrails

- Apply the hero-only media default: video belongs in the top stage unless a later role is explicit.
- Enforce media never over text: media cannot cover headline, body, CTA, nav, labels, captions, or card content.
- Enforce no container thinning to fit media: content cards keep readable minimum widths.
- Content wins over media: text, CTAs, nav, and card readability beat any media object or scroll gimmick.
- Persistent video overlay is a hard blocker unless a reserved media lane, protected-zone map, and screenshot proof exist.

## Final UI Integrity Gate

Before final handoff:

1. Run build/lint.
2. Capture screenshots at required viewports.
3. Run scroll-choreography-review if scroll-heavy.
4. Run layout-integrity-review.
5. Run final-ui-integrity-gate.
6. Run final scorecard.

Do not claim success if clipped text, overlap, nav overflow, media/text collision, accidental blank space, fixed overlay collision, or the user's original complaint remains visible. If the final UI integrity gate is failed or blocked, fix the UI and rerun validation before responding.
