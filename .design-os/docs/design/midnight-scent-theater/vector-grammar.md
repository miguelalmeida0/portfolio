# Vector Grammar

## Visual Thesis

Midnight Scent Theater uses a stage grammar: a moon lens opens the scene, a scent bottle becomes the lead object, curtain folds reveal chapters, and smoke marks carry atmosphere or scent notes. The system is editorial and theatrical, not a random luxury collage.

## Shape Role Map

| Role | Motif | Layer | Bounds | Anchors | Accessibility |
|---|---|---|---|---|---|
| `hero-object` | scent bottle silhouette | primary-object | center 34 percent of stage width | baseline center, neck top, label center | meaningful product object |
| `mask` | moon/lens | masks-and-clips | 52 percent wide desktop, 86 percent mobile | center, safe-zone edge | meaningful if revealing chapter image |
| `mask` | curtain reveal | masks-and-clips | full-height side panels | top edge, center seam | decorative unless chapter title is masked |
| `atmosphere` | smoke mark | atmosphere | outside text-safe zone | bottle shoulder, lower-left stage | decorative unless labeling scent note |
| `foreground-object` | brass hardware mark | foreground-object | 12-40 px marks | curtain seams, CTA edges | decorative with aria-hidden |
| `callout` | couture label | labels-and-callouts | 160-280 px wide | scent note point, label lane | meaningful text |
| `frame` | product object frame | supporting-forms | wraps bottle with 24 px padding | bottle center | decorative frame unless interactive |
| `control` | chapter button | chrome | fixed min 44 px height | lower nav rail | meaningful interactive |

## Layer Stack

1. `background-object`: midnight paper field, architectural plane.
2. `atmosphere`: smoke marks, subtle grain, soft shadow portal.
3. `masks-and-clips`: moon/lens and curtain masks.
4. `primary-object`: scent bottle silhouette.
5. `supporting-forms`: product object frame, brass marks.
6. `labels-and-callouts`: scent note labels, couture tags.
7. `interaction-states`: selected chapter ring, focus outline.
8. `chrome`: navigation, CTA, accessibility controls.

## Allowed Shape Families

- Round: moon disc, small note dots.
- Squircle/superellipse: lens, action surface, chapter card.
- Notch: bottle shoulders, couture labels.
- Bevel: brass marks and stage hardware.
- Organic: smoke marks only, with decorative status or scent-note role.
- Folded vertical planes: curtain reveals and side masks.

## Banned Shape Families

- Fake glass ovals with no optical job.
- Decorative orbit, HUD, radar, or sonar lines.
- Random blobs used because the page feels empty.
- Generic gradients that do not describe material.
- Smoke over readable type.

## Text-Safe Zones

- Hero headline must sit outside the moon/lens mask or over a stable plate.
- Bottle label text must stay within the silhouette center and never cross the shoulder notch.
- Smoke marks must keep at least `shape.offset.md` from all readable copy.
- Curtain masks cannot close over CTA text.

## Responsive Behavior

- Desktop: moon/lens sits behind bottle; curtain panels frame the stage.
- Tablet: moon/lens scales down and moves behind the bottle shoulder.
- Mobile: moon/lens becomes a top-half backdrop; curtain masks become vertical edge strips; smoke count reduces from 5 to 2.
- If labels collide, switch couture labels to a stacked scent-note list below the bottle.

## Accessibility Notes

- Bottle silhouette SVG needs `title` and `desc`.
- Moon/lens is meaningful when it masks chapter content; otherwise mark decorative.
- Smoke is decorative unless it labels a scent note.
- Motion must honor reduced motion with static final-state boards.

