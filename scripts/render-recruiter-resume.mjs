import { mkdir, writeFile } from 'node:fs/promises';
import { loadLocalTs } from './lib/load-local-ts.mjs';
const { createPortfolioPdf } = await loadLocalTs('src/lib/server/pdf.ts');
await mkdir('output/pdf', { recursive: true });
await writeFile('output/pdf/miguel-almeida-cv.pdf', createPortfolioPdf());
console.log('Generated output/pdf/miguel-almeida-cv.pdf from the same generator used by /portfolio.pdf.');
