# RobotStack Repair With Visual Engine

Use this flow when a RobotStack-style roster works for one object but breaks when the selected object changes.

## Repair Loop

1. Route agents:

```sh
node tools/design-os.mjs route-agent --task "Repair robot roster with visual QA and object swap evidence"
```

2. Capture the current UI:

```sh
node tools/visual-qa.mjs --url http://localhost:5173 --name robotstack-roster
```

3. Run object-swap evidence:

```sh
node tools/object-swap-check.mjs --url http://localhost:5173 --objects "Atlas,Neo,Phoenix,Digit,Figure" --name robotstack-roster
```

4. Fix frame, crop, scale, object-position, overflow, and overlap issues.

5. Re-run visual QA and object-swap checks.

6. Fill and validate:

```sh
node tools/design-os.mjs validate-assets asset-manifest.local.json
node tools/design-os.mjs validate-done-report done-report.local.json
```

## Hard Blocks

- One robot passes but another is cut.
- A swapped object creates horizontal overflow.
- UI overlays collide with robot art.
- Target screenshots are used as production assets.
- Dead visible buttons remain.
