# Layout Integrity Review Prompt

Project path: `<path>`
URL or screenshot source: `<url-or-path>`

## Required Reading

- `skills/layout-integrity-review/SKILL.md`
- `design-dna/text-container-integrity-rules.md`
- `design-dna/navigation-responsiveness-rules.md`
- `design-dna/whitespace-density-rules.md`
- `evaluation/ui-scorecard.md`

## Required Checks

- no text clipping
- no words cut
- no nav label overflow
- no sticker/card covering headline words
- no accidental blank viewport area
- no floating label/card/sticker drift or overlap at intermediate widths
- no detail panel disconnected from clicked/selected trigger
- no mobile route/app navigation that disappears on scroll
- mobile route/app navigation uses persistent bottom nav or bottom-accessible controller by default
- no fake live labels/icons/dots unless real live behavior exists
- no generic domain theater or random mock data labels without a Domain Content Contract
- inspect layered media/container corners
- offset/backplate must be geometrically clean
- app name/brand chrome must remain readable over dark or variable backgrounds
- click every nav item and verify the clicked item becomes active
- verify first and last nav items become active
- no adjacent/right-side active-state mismatch
- required viewport matrix screenshots/checks at 390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, and 1920 when possible

## Output

Use `templates/reports/layout-integrity-report.md`.

Required table:

| Issue | Evidence | Why It Fails | Required Fix | Severity |
|---|---|---|---|---|

Verdict must be one of:

- Block
- Partial
- Pass

Block if any critical text is clipped, nav text overflows item, card/sticker covers headline text, huge blank area is accidental, text overflow appears in screenshot, CTA text is clipped, fake live/realtime language is unjustified, layered container corners are messy, nav active state maps to the wrong item, a detail reveal is spatially disconnected from its trigger, mobile route navigation disappears on scroll, or user complaint remains visible.

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

## Anchored Detail Reveal

- selected detail must remain visually connected to its trigger
- use inline expansion, adjacent panel, anchored popover, connected drawer, split view, object pull-out, or explicit mobile sheet
- `data-detail-trigger`, `data-detail-panel`, and `data-detail-for` are expected where practical
- block if a detail panel opens far away from the clicked object

## Persistent Mobile Bottom Navigation

- mobile route/app nav must remain accessible after scroll
- bottom nav / bottom route controller is default for route/app/scroll-heavy mobile experiences
- bottom nav must respect safe area and keep accessible full labels
- block if primary mobile route nav is top-only

## Fake Live / Offset Containers / Nav Active State

- no fake live labels unless real live behavior exists
- no fake live icons/dots
- no decorative realtime/status copy
- no generic domain theater: `mission control`, `control room`, `command center`, `topology`, `traces`, or `system map` without a real domain/data contract
- no random values or abstract metrics without units, ranges, statuses, source/freshness, and business meaning
- inspect layered media/container corners
- offset/backplate must be geometrically clean
- app name/wordmark needs a stable contrast strategy over image/dark/variable backgrounds
- click every nav item and verify the clicked item becomes active
- first and last nav items must be included
- block adjacent/right-side active-state mismatch

## Final UI Integrity Gate

Before final handoff:

1. Run build/lint.
2. Capture screenshots/checks across the final UI integrity v3 width sweep, height matrix, and required scroll samples.
3. Run scroll-choreography-review if scroll-heavy.
4. Run layout-integrity-review.
5. Run final-ui-integrity-gate.
6. Run final scorecard.

Do not claim success if clipped text, viewport-edge clipping, horizontal scroll partial content, overlap, floating object drift, nav overflow, media/text collision, accidental blank space, fixed overlay collision, or the user's original complaint remains visible at any sampled width, height, scroll position, or state. If the final UI integrity gate is failed or blocked, fix the UI and rerun validation before responding.
