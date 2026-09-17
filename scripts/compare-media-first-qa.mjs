import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

const root = path.resolve('docs/qa/screenshots/media-first-reconstruction');
const outputDir = path.join(root, 'comparison');
const referencePath = path.join(root, 'reference/01-rachel-home-desktop.png');
const prototypePath = path.join(root, 'final/01-home-hero-desktop.png');
const outputPath = path.join(outputDir, '01-home-reference-vs-prototype.png');

await mkdir(outputDir, { recursive: true });

const [reference, prototype] = await Promise.all([
  readFile(referencePath),
  readFile(prototypePath)
]);
const toDataUrl = (buffer) => `data:image/png;base64,${buffer.toString('base64')}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1680, height: 760 } });

await page.setContent(`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #0b0b0b;
          color: #f4eadc;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        main {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          height: 100vh;
          padding: 20px;
        }
        figure {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 10px;
          min-width: 0;
          margin: 0;
        }
        figcaption {
          color: #e7aa73;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }
        .frame {
          display: flex;
          min-height: 0;
          align-items: flex-start;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgb(244 234 220 / 0.2);
          background: #050505;
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center top;
        }
      </style>
    </head>
    <body>
      <main>
        <figure>
          <figcaption>Reference principle · work appears in the first viewport</figcaption>
          <div class="frame"><img src="${toDataUrl(reference)}" alt="" /></div>
        </figure>
        <figure>
          <figcaption>Prototype · media-first identity with an immediate work path</figcaption>
          <div class="frame"><img src="${toDataUrl(prototype)}" alt="" /></div>
        </figure>
      </main>
    </body>
  </html>
`);

await page.screenshot({ path: outputPath });
await browser.close();

console.log(`Created ${outputPath}`);
