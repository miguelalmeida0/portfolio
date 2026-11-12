# Case-study Motion Implementation

Approved scope: Morrow, Second Voice, Leu, Needle and F24 figures inside the current Compact index case-study dialog. Homepage, current videos, case text and routes are preserved.

- [x] Guarded, idempotent asset installation; unit tests prove original HTML bytes survive.
- [x] Five scoped figures using native browser animation timelines; replay, pause, scrubbing and case-specific actions.
- [x] Global motion preference, reduced-motion final state, offscreen suspension and teardown.
- [x] Browser regression coverage added to the existing Chromium/WebKit CI configuration.
- [x] Type check, 495 unit tests, production build and independent code review.
- [x] Cloud Browser desktop playback and intermediate/end-state inspection; 390px iframe viewport inspection for all five figures. Verified direct case switching, global pause, offscreen pause/resume and F24 edited-title preservation.
- [ ] GitHub CI and production deployment verification.

Original optical source SHA256 remains `44597bfe6fcfe67df6739f8e058ec6e4876273355a2d3d3f31f8c0cfe07e399c`.

Visual checks caught and corrected completed tracks restarting after seeking, premature Needle tile exits, and mobile control spacing. Independent review caught contradictory F24 states in the accessibility tree; these now expose one synchronized status while the editable title stays accessible.

An existing API test incorrectly rejected a valid hash containing the substring `203`; the assertion now rejects the full raw IP while retaining the 64-character hex requirement. Application API behavior is unchanged.

Local work is on a fresh main-based test checkout. The divergent remote test branch is preserved; none of its unrelated work is included in the production candidate.
