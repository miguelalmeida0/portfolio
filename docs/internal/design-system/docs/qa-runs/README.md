# QA Runs

`tools/visual-qa.mjs` writes local visual QA runs here.

Generated run folders are ignored by git. Keep only this README and `.gitkeep` tracked.

Run:

```sh
node tools/visual-qa.mjs --url http://localhost:5173 --name robotstack-roster
```

Build/lint is not visual QA. A run must include `390 / 768 / 1440` screenshot slots and manual checklist fields before visual work can be handed off.
