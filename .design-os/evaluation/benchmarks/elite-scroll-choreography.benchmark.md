# Elite Scroll Choreography Benchmark

## Purpose
Tests whether an award-level site uses authored scroll travel rather than generic fade-in sections.

## Reference Mechanics
- Stiff-like route mechanics: horizontal and vertical work travel, giant poster type, work rail, mascot punctuation.
- Bucks-like card assembly: floating product stage, scroll-to-assemble cards, review theater.
- Wembi-like list/detail reveal: editorial rows and designed information panels.
- Podium-like portal/media stage: small object entry, scroll into object, media constellation.
- Don’t Board Me-like playful gate and directional transition: ritual entry, room-like destination changes.
- Bunk Radio-like video-first mechanics: video as interface object, but with strict text/container/nav integrity.

## Required Artifacts
- selected scroll pattern
- route map
- chapter map
- pinned/sticky stage plan
- moving object inventory
- nav sync plan
- motion timeline
- mobile fallback
- reduced-motion fallback
- scroll-choreography review
- screenshot or motion evidence

## Screenshot Evidence Required
- 1440
- 1280
- 1024
- 768
- 390
- sampled scroll positions or motion sequence when possible

## Hard Failures
- only fade-in sections after elite scroll request
- selected pattern not visible
- scroll-to-assemble claim but objects do not assemble
- blank pinned stage
- movement covers critical text
- horizontal route without mobile fallback
- nav does not sync to chapters
- no reduced-motion fallback
- horizontal overflow caused by scroll implementation

## Scoring Criteria
- Route authorship: 20
- Object motion and settling: 15
- Information reveal timing: 15
- Media/object transformation quality: 10
- Nav chapter sync: 10
- Layout integrity through scroll states: 15
- Mobile and reduced-motion fallback: 10
- Performance and evidence: 5

## Score Caps
- elite scroll requested but only fade-in sections delivered: max 4
- selected scroll pattern not visible: max 4
- scroll-to-assemble claim but objects do not assemble: max 4
- pinned/sticky stage has blank dead frame: max 4
- horizontal scroll route has no mobile fallback: max 5
- scroll movement covers critical text: max 3
- scroll nav does not sync to chapters: max 5
- no reduced-motion fallback for scroll choreography: max 5
- scroll implementation causes horizontal overflow: max 4
- no scroll-choreography review for scroll-heavy site: max 6
