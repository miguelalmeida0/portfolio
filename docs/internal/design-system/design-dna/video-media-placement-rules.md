# Video / Media Placement Rules

Video and large media assets are powerful, but they must not dominate the entire page by default.

## Default Behavior

- Use video once in the top/hero area.
- After the hero, either remove it, convert it into a small clearly reserved media component, or replace it with a static poster/thumb.
- Do not keep a video floating over the whole page unless the selected signature interaction explicitly requires it and the layout provides a safe media lane.

## Hard Blockers

- video/image overlaps text
- video/image covers cards
- video/image covers CTA
- video/image covers nav
- video/image forces content containers to become skinny
- video/image sits above content without protected zones
- persistent media has no reason after the hero
- media object remains because "it looks cool"
- video-to-object transform damages readability

## Allowed

- video as hero stage
- video as a reserved card/tile in a later section
- video as a thumbnail inside a content card
- video as a sticky object only inside a reserved media lane
- video as a poster/static asset when reduced motion is preferred
- video returning once in a final CTA if it has a defined role

## Forbidden

- persistent floating video across multiple content sections
- media over text
- media over cards
- thinning containers to fit media
- shrinking text columns until words break
- using z-index to solve layout conflict
- hiding text behind media
- cropping or masking text to preserve media composition

## Score Caps

- video/image covers critical text: max score 3
- persistent video overlay without reserved lane: max score 4
- content containers thinned to fit media: max score 3
- cards become unreadable because of media placement: max score 3
- video remains after hero with no defined role: max score 5
- media placement forces awkward text wrapping: max score 4
- media object wins over content integrity: max score 3

## Rejected Case Study

Use `visual-library/rejected/case-studies/late-check-fm-persistent-video-overlay-container-thinning/` as the canonical rejected example. The concept is promising; the execution is rejected because persistent media overlays and container thinning damaged readability.

## Final UI Integrity Gate

Before final handoff, run `final-ui-integrity-gate`. Video/image/media over readable text, fixed media covering content, or media forcing unreadable containers blocks final handoff until fixed and rerun.
