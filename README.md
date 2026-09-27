# Miguel Almeida — Portfolio

Frontend developer and design engineer portfolio built with Svelte 5, SvelteKit, TypeScript and Tailwind CSS.

The site includes selected product work, an interactive Second Voice demo, F24 experience, VIGIA and Mirror case studies, CV and story pages, motion with reduced-motion support, responsive layouts, and cross-browser coverage.

## Run locally

Requires Node.js 22.12+ or Node.js 24+.

```bash
npm ci
npm run dev
```

Local development runs at `http://localhost:4173`.

## Quality checks

```bash
npm run check
npm run test:unit
npm run build
npm run e2e
```

The Playwright suite covers Chromium, Firefox and WebKit across desktop and mobile profiles, with responsive checks from 320px through 2560px.

## Main routes

- `/`
- `/work/second-voice-ai`
- `/work/f24`
- `/work/vigia`
- `/work/mirror-ai`
- `/cv`
- `/story`
- `/portfolio.pdf`

## Stack

- Svelte 5
- SvelteKit
- TypeScript
- Tailwind CSS
- Playwright
- Cloudflare Pages adapter
