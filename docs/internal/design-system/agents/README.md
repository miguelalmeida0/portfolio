# Visual Swarm v1 Agents

Visual Swarm v1 is a local, free, instruction-only agent system for pushing Miguel Design OS closer to "Lovable inside the repo."

These agents do not call paid tools, external APIs, hosted Lovable, screenshot-to-code generation, Onlook hosted usage, or external model calls unless Migi explicitly approves a separate workflow.

## Agent Order

1. `01-inspiration-scout-agent.md`
2. `02-art-direction-concept-agent.md`
3. `03-literal-target-copy-agent.md`
4. `04-visual-qa-anti-slop-agent.md`
5. `05-productionizer-agent.md`

## Local Evidence Rule

Every visual run should produce a `visual-agent-run.local.json` from `templates/visual-agent-run.template.json`, plus the mode-specific artifacts required by the task:

- inspiration work: `inspiration-manifest.local.json`
- concept work: `visual-concepts.local.json`
- literal copy work: `target-copy-report.local.json`
- QA/final handoff: `screenshot-report.local.json` and `done-report.local.json`
- image-led production work: `asset-manifest.local.json`

No done without evidence.

## Weekend Visual Engine Commands

```sh
node tools/design-os.mjs route-agent --task "Build cinematic robot selection app from award-winning inspiration and target screenshots"
node tools/new-inspiration-queue.mjs
node tools/validate-inspiration-queue.mjs inspiration-library/queues/weekend-visual-corpus.queue.json
node tools/capture-concepts.mjs --url http://localhost:5174
node tools/compare-screenshots.mjs --target path/to/target.png --current path/to/current.png --name robotstack-roster
node tools/visual-qa.mjs --url http://localhost:5173 --name robotstack-roster
node tools/object-swap-check.mjs --url http://localhost:5173 --objects "Atlas,Neo,Phoenix,Digit,Figure" --name robotstack-roster
node tools/design-os.mjs validate-done-report done-report.local.json
```

Generated screenshots and run folders stay local and gitignored by default.
