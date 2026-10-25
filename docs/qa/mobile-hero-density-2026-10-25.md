# Mobile header and hero density

The owner requested a less massive mobile header after the Needle release.
This refines the selected composition and preserves its exact type family,
weight, copy, pink/blue palette, hand assets, project loops and desktop layout.

The role pairs now form two smaller lines on phones, using the same grouping
already used on tablets. Navigation reduces from 72 to 60 pixels plus the
existing safe-area inset. Logo, menu icon and button typography reduce while
interactive areas remain at least 44 pixels. Metadata spacing is slightly tighter.
Hands keep the same dimensions and bottom anchoring at the pink/cream seam.

At 393×852 in the local browser, hero height changes from 595.78 to 416.09 CSS
pixels (30% shorter), headline height from 249.56 to 90.78 pixels. At 320, 430 and
768 pixels the hero measures 390.19, 435.63 and 503.75 pixels, respectively. No
horizontal overflow was measured. Buttons remain 44 pixels high. Native-DPR
before/after viewport captures were inspected at all four widths.

This is a styling refinement, so no implementation-mirroring unit test was
added. Existing responsive, footer-input and Needle playback/re-entry checks
provide integration coverage; eight focused browser scenarios pass. The checks
include both motion preferences for Needle, which was finished and deployed
before this refinement began. Physical safe-area rendering on an iPhone is not
independently measured; the existing env(safe-area-inset-top) handling is retained.

Post-deploy validation: the shipping agent checks Cloudflare and blocking CI,
then public homepage bytes against the tested candidate. Expected: compact
navigation, two title lines at common phone widths, usable Menu/CV/contact hit
areas and intact hands. Header overlap, clipping, broken menu dismissal or a
project playback regression warrants reverting only this focused commit through
normal history. No new network calls or telemetry are introduced.

Independent Superpowers review returned ready to merge with no findings. Manual
menu probes at 320/393/430/768 pixels confirmed 44px brand/menu/link targets,
menu alignment with the navigation bottom, Work-link dismissal, Escape dismissal
and focus return, no overflow, and removal of mobile controls after desktop resize.
Svelte check reports zero errors and warnings.
