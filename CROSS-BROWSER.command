#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

printf '\n[1/4] Installing/updating dependencies…\n'
npm install

printf '\n[2/4] Svelte diagnostics…\n'
npm run check

printf '\n[3/4] Production build…\n'
npm run build

printf '\n[4/4] Chromium + Firefox + WebKit, desktop + mobile…\n'
npm run e2e

printf '\nCross-browser QA completed successfully.\n'
