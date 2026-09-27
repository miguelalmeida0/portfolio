#!/bin/bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
command -v node >/dev/null 2>&1 || { printf 'Install Node.js 24 LTS, then run this again.\n'; exit 1; }
node -e 'const [major,minor]=process.versions.node.split(".").map(Number);process.exit((major===22&&minor>=12)||major>=24?0:1)' || { printf 'Use Node.js 22.12+ or Node.js 24+.\n'; exit 1; }
if [ ! -d node_modules ]; then npm ci; fi
printf "\nPortfolio build: 2026.09.26-relaxed-gaze\nOpening this copy on port 4286 (or the next available port).\n\n"
exec npm exec -- vite dev --host 127.0.0.1 --port 4286 --open "/?build=2026.09.26-relaxed-gaze"
