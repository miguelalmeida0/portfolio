import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
const js = ts.transpileModule(fs.readFileSync('src/lib/content/folio.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const content = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const result = spawnSync('python', ['scripts/render-cv.py', 'static/files/miguel-almeida-cv.pdf'], { input: JSON.stringify(content), encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr);
process.stdout.write(result.stdout);
