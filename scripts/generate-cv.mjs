import { spawnSync } from 'node:child_process';
import { loadLocalTs } from './lib/load-local-ts.mjs';
const content = await loadLocalTs('src/lib/content/folio.ts');
const { cvProjects } = await loadLocalTs('src/lib/content/cv-projects.ts');
const result = spawnSync(process.env.PYTHON || 'python3', ['scripts/render-cv.py', process.argv[2] || 'static/files/miguel-almeida-cv.pdf'], {
  input: JSON.stringify({ ...content, cvProjects }), encoding: 'utf8'
});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(result.stderr);
process.stdout.write(result.stdout);
