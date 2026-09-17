# Media / Text Protected Zone Checklist

- [ ] `docs/design/protected-zone-map.md` exists.
- [ ] `docs/design/media-object-stage-plan.md` exists.
- [ ] `docs/design/scroll-motion-spec.md` exists.
- [ ] Critical text zones are listed.
- [ ] Media lanes are listed.
- [ ] Moving media start rects are defined.
- [ ] Moving media end rects are defined.
- [ ] Forbidden overlap zones are defined.
- [ ] Responsive fallback is defined.
- [ ] Reduced-motion fallback is defined.
- [ ] Moving media has `data-overlay-object` or `data-scroll-object`.
- [ ] Critical text has `data-protected-text` or `data-layout-critical`.
- [ ] Scroll-state screenshots are captured at sampled positions.
- [ ] `tools/scroll-choreography-check.mjs` ran or wrote a blocked report.
- [ ] `tools/layout-integrity-check.mjs` ran or wrote a blocked report.
- [ ] No media/text collision appears in screenshots.
