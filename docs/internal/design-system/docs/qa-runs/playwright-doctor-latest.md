# Playwright Doctor
Created: 2026-07-01T17:47:09.328Z
Status: blocked
Node: v26.0.0
Platform: darwin arm64
CWD: /Users/malmeida/Desktop/miguel-design-os
Temp directory: /var/folders/x6/0d36h_s16kj9j6jgw2m775480000gn/T
TMPDIR override: none
## Package Checks
- playwright: missing
- @playwright/test: missing
## Browser Binary Checks
- chromium: missing
- webkit: missing
- chrome: missing - Chrome channel is checked by launch attempt.
## Launch Checks
- playwright: failed - Cannot find package 'playwright' imported from /Users/malmeida/Desktop/miguel-design-os/tools/playwright-doctor.mjs
## Screenshot Write
- success: false
- path: not written
## Suggested Next Command
```sh
node tools/visual-qa.mjs --url http://localhost:5173 --name <project-name> --browser auto
```
