import { spawnSync } from 'node:child_process';
import { loadLocalTs } from './lib/load-local-ts.mjs';
const content = await loadLocalTs('src/lib/content/folio.ts');
const { cvProjects } = await loadLocalTs('src/lib/content/cv-projects.ts');
const output = process.argv[2];
if (!output) throw new Error('The production CV is user-supplied. Pass an explicit draft output path to generate a separate PDF.');
const { resolve } = await import('node:path');
if (resolve(output) === resolve('static/files/miguel-almeida-cv.pdf')) throw new Error('Do not overwrite the user-supplied production CV.');
const result = spawnSync(process.env.PYTHON || 'python3', ['scripts/render-cv.py', output], {
  input: JSON.stringify({ ...content, cvProjects: cvProjects.map(p => ({ ...p, pdfDescription: p.bullets.join(' ') })) }), encoding: 'utf8'
});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(result.stderr);
process.stdout.write(result.stdout);
