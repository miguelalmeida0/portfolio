# Story reading correction — 6 October 2026

The deployed baseline at 1512×685 used the mobile layout on a laptop: a height
media query capped the reading surface at 608 physical pixels. Its reward
handler also consumed downward wheel and keyboard input before arrival,
scaled movement to 28%, and waited for another gesture before releasing.

## Decisions

- Delete the reward input interceptor. Native document scroll remains the only
  reading surface, with the site's existing Lenis owner for desktop wheel input.
- Stop outstanding wheel momentum when a native scrolling key is pressed,
  without cancelling the keyboard event. The first test run caught Page Down
  being pulled back to the previous wheel target; editing controls are excluded.
- Keep the desktop two-column composition based on width, including ordinary
  laptop heights. Size the visual stage for the existing 80% desktop presentation.
- Add a persistent Home link, previous/next controls and a chapter disclosure.
  Escape restores focus to its trigger. Choosing a chapter focuses the destination
  after travel; cancelling travel leaves focus on the persistent trigger.
- Keep the green summary on screen through a longer sticky reward section.
  This is a spatial pause, not a timed input lock: reversing, dragging the
  scrollbar, contact links, chapter links and Home remain available immediately.
- On mobile, the green summary comes before the contact invitation. Start its
  reveal only when its containing stage enters view. Short-height phones retain
  ordinary flow so a tall summary cannot trap reading inside a smaller viewport.
- Reduced motion shows the summary immediately and removes the extra runway.
  Existing scene interactions and copy remain available.

## Verification

Baseline: `artifacts/portfolio-corrections/story/before-laptop.png`.
Local browser review: laptop split, mobile chapter picker, final scene interaction,
green reward and persistent navigation. Candidate checks run in the
`Portfolio corrections` workflow on `story-flow/20261006`.

The focused `story-scroll.spec.ts` covers 1440×900, 1280×800, 1440×685,
768×1024, 390×844 and 375×812, each with normal and reduced motion:
wheel/touch document movement, native PageDown, picker Escape/focus, all eight
interactive scenes, next-chapter focus, full reward reveal, continued movement
and immediate reversal during the desktop reward, contact/Home, Back, breakpoint
resizing, horizontal overflow and page errors. Screenshots are uploaded with CI.

No new GSAP animations or ScrollTriggers were introduced. The reward wheel/key
interceptors were removed; the shared keyboard handoff never prevents default.
An IntersectionObserver is disconnected
on unmount; dock listeners are also removed on unmount. This change does not
claim a new measured field INP/LCP result.
