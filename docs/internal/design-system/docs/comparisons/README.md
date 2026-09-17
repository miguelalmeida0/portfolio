# Screenshot Comparisons

`tools/compare-screenshots.mjs` writes local target/current comparison reports here.

Generated comparison folders are ignored by git. Literal Target Copy Mode cannot be marked done without a comparison report.

Run:

```sh
node tools/compare-screenshots.mjs --target path/to/target.png --current path/to/current.png --name robotstack-roster
```
