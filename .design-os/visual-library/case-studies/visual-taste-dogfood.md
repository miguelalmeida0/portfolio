# Visual Taste Dogfood

`visual-taste` was created to test whether Miguel Design OS rules actually improve a frontend product.

## What It Exposed

- The app's purpose in relation to Miguel Design OS was not clear enough.
- A state persistence bug exposed a missing core-loop proof rule.
- Uploaded examples and Memory state needed stricter truth checks.
- Screenshot QA blockage made it too easy to talk about visual quality without app-only evidence.

## Design OS Lesson

Every target-app failure must patch the Design OS. A dogfood target is not just a product project; it is a test rig for the rules, prompts, QA gates, and handoff requirements.

## Future Agent Rule

For dogfood targets:

- state what the app tests in Miguel Design OS
- verify the core loop manually
- document persistence across route changes, refresh, and browser reopen
- translate every target failure into a Design OS patch or explicit open gap
