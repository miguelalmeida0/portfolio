# Typographic portfolio release — 19 October 2026

The selected animated FRONTEND / DESIGNER portfolio is published on canonical
home, Story and CV routes. Case studies retain the selected typography, demos,
chapter navigation and full project tour. The initial loading/portrait overlay,
pre-hydration input interception and scroll lock are removed. Existing local
work and the historical production checkout are preserved.

## Verification before publication

- Reproduced the intro failure: fresh-entry browser regression failed because
  the old overlay was present.
- Svelte check: 0 errors, 0 warnings.
- Unit tests: 355 passed.
- Route suite against the built Cloudflare worker: 56 passed.
- Current release browser suite: 99 passed in Chromium and WebKit; one WebKit
  skip because Layout Shift API/CDP throttling is Chromium-specific.
- Production build passed, including server/client bootstrap integrity.
- Desktop 1440px and mobile 390px screenshots inspected; no horizontal overflow.
- Browser coverage includes fresh entry before hydration, old replay URL,
  role changes and resizing, Story/CV navigation, PDF links/rendering, Ask,
  keyboard and pointer scrolling, and all five interactive case studies.
- Compared the existing public homepage and Needle case before publication.

Commands:

    npm run check
    npm run test:unit
    npm run build
    node node_modules/wrangler/bin/wrangler.js pages dev .svelte-kit/cloudflare --ip 127.0.0.1 --port 4285 --show-interactive-dev-session=false
    ROUTE_HEALTH_BASE_URL=http://localhost:4285 npm run test:routes
    PORTFOLIO_AUDIT_URL=http://localhost:4285 npx playwright test -c tests/e2e/portfolio-release.config.ts

CI now exercises this current release suite against a production build.
Historical prototype and removed-intro tests remain available separately; the
release config is the current acceptance suite.

## Release boundary

Prepared from GitHub main 6ce6c4894a8dcae7367f5dfe29ebdea1655f22b2 on local test.
No remote test/dev history was reset or merged. No tracked source or asset was
deleted. Cloudflare's existing GitHub main integration is the deployment path.
The deployment check and public-domain verification must pass before reporting
the release live.
