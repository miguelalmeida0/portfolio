# Scroll Lessons

Advanced scroll is experimental by default and must not be added to a passed baseline.

Hostel Radio passed after unsafe scroll/media movement was removed or simplified. Future production-quality dogfood projects should prefer simple, readable, stable scroll unless advanced scroll is tested separately and passes Final UI Integrity Gate v3.

Required proof for any advanced scroll path:

- width sweep from 360 to 1920
- height matrix including 720, 844, 900, and 1080
- scroll samples 0 through 1
- active panel readability
- viewport-edge clipping checks
- horizontal scroll safety
- reduced-motion fallback
- screenshot/report evidence
