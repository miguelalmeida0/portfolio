import { portfolio } from '$lib/content/portfolio';

interface PdfLine {
  text: string;
  x: number;
  y: number;
  size?: number;
  font?: 'F1' | 'F2' | 'F3';
  color?: [number, number, number];
}

const escapePdfText = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');

const wrapText = (text: string, maxChars: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

const drawText = ({
  text,
  x,
  y,
  size = 12,
  font = 'F1',
  color = [0.95, 0.91, 0.84]
}: PdfLine): string => {
  const [r, g, b] = color;

  return `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x} ${y} Tm (${escapePdfText(
    text
  )}) Tj ET`;
};

const drawBackground = (): string =>
  [
    '0.196 0.255 0.184 rg 0 0 612 792 re f',
    '0.282 0.202 0.149 rg 56 742 128 2 re f',
    '0.949 0.909 0.839 RG 56 708 500 0 re S'
  ].join('\n');

const buildPageOne = (): string => {
  const commands: string[] = [drawBackground()];

  commands.push(
    drawText({
      text: 'Miguel Almeida',
      x: 56,
      y: 688,
      size: 31,
      font: 'F2'
    }),
    drawText({
      text: 'Frontend Journal',
      x: 56,
      y: 657,
      size: 18,
      font: 'F3',
      color: [0.898, 0.822, 0.661]
    })
  );

  let summaryY = 618;
  for (const line of wrapText(portfolio.site.summary, 74)) {
    commands.push(drawText({ text: line, x: 56, y: summaryY, size: 13 }));
    summaryY -= 18;
  }

  commands.push(
    drawText({
      text: `${portfolio.site.location}  |  ${portfolio.site.availability}`,
      x: 56,
      y: 565,
      size: 11,
      color: [0.859, 0.788, 0.675]
    }),
    drawText({
      text: 'Selected Work',
      x: 56,
      y: 520,
      size: 17,
      font: 'F2'
    })
  );

  let projectY = 490;
  for (const project of portfolio.featuredProjects) {
    commands.push(
      drawText({
        text: `${project.number}  ${project.title} ${project.titleItalic}`,
        x: 56,
        y: projectY,
        size: 13,
        font: 'F2'
      }),
      drawText({
        text: project.period,
        x: 420,
        y: projectY,
        size: 10,
        color: [0.859, 0.788, 0.675]
      })
    );

    projectY -= 18;

    for (const line of wrapText(project.summary, 78)) {
      commands.push(drawText({ text: line, x: 56, y: projectY, size: 11.5 }));
      projectY -= 16;
    }

    commands.push(
      drawText({
        text: project.tags.join('  ·  '),
        x: 56,
        y: projectY,
        size: 10,
        color: [0.847, 0.756, 0.620]
      })
    );

    projectY -= 34;
  }

  commands.push(
    drawText({
      text: 'At a Glance',
      x: 56,
      y: 254,
      size: 17,
      font: 'F2'
    })
  );

  let statY = 224;
  for (const stat of portfolio.site.stats) {
    commands.push(
      drawText({
        text: `${stat.value}  ${stat.label} — ${stat.note}`,
        x: 56,
        y: statY,
        size: 12
      })
    );
    statY -= 20;
  }

  commands.push(
    drawText({
      text: 'Generated from the live portfolio on request.',
      x: 56,
      y: 72,
      size: 10,
      color: [0.780, 0.714, 0.604]
    })
  );

  return commands.join('\n');
};

const buildPageTwo = (): string => {
  const commands: string[] = [drawBackground()];

  commands.push(
    drawText({
      text: 'How I Work',
      x: 56,
      y: 688,
      size: 22,
      font: 'F2'
    })
  );

  let indexY = 652;
  for (const entry of portfolio.indexEntries) {
    commands.push(
      drawText({
        text: `${entry.numeral}. ${entry.title}`,
        x: 56,
        y: indexY,
        size: 13,
        font: 'F2'
      })
    );
    indexY -= 18;

    for (const line of wrapText(entry.body, 78)) {
      commands.push(drawText({ text: line, x: 56, y: indexY, size: 11.5 }));
      indexY -= 16;
    }

    commands.push(
      drawText({
        text: entry.chips.join('  ·  '),
        x: 56,
        y: indexY,
        size: 10,
        color: [0.847, 0.756, 0.620]
      })
    );
    indexY -= 28;
  }

  commands.push(
    drawText({
      text: 'Chronicle',
      x: 56,
      y: 402,
      size: 22,
      font: 'F2'
    })
  );

  let roleY = 366;
  for (const item of portfolio.experience) {
    commands.push(
      drawText({
        text: `${item.year}  ${item.title}`,
        x: 56,
        y: roleY,
        size: 13,
        font: 'F2'
      }),
      drawText({
        text: `${item.company} · ${item.place}`,
        x: 56,
        y: roleY - 18,
        size: 10.5,
        color: [0.859, 0.788, 0.675]
      })
    );
    roleY -= 40;

    for (const line of wrapText(item.body, 78)) {
      commands.push(drawText({ text: line, x: 56, y: roleY, size: 11.5 }));
      roleY -= 16;
    }

    roleY -= 18;
  }

  commands.push(
    drawText({
      text: 'Contact',
      x: 56,
      y: 174,
      size: 22,
      font: 'F2'
    }),
    drawText({
      text: portfolio.contact.summary,
      x: 56,
      y: 142,
      size: 11.5
    }),
    drawText({
      text: `${portfolio.contact.location} · Email miguelalmeida1592@gmail.com`,
      x: 56,
      y: 106,
      size: 10.5,
      color: [0.859, 0.788, 0.675]
    })
  );

  return commands.join('\n');
};

const buildPdf = (pages: string[]): Uint8Array => {
  const objects: string[] = [];
  const fontRegularId = 7;
  const fontBoldId = 8;
  const fontItalicId = 9;

  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[1] = '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>';
  objects[2] =
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 7 0 R /F2 8 0 R /F3 9 0 R >> >> /Contents 5 0 R >>';
  objects[3] =
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 7 0 R /F2 8 0 R /F3 9 0 R >> >> /Contents 6 0 R >>';
  objects[4] = `<< /Length ${Buffer.byteLength(pages[0], 'utf8')} >>\nstream\n${pages[0]}\nendstream`;
  objects[5] = `<< /Length ${Buffer.byteLength(pages[1], 'utf8')} >>\nstream\n${pages[1]}\nendstream`;
  objects[fontRegularId - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[fontBoldId - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  objects[fontItalicId - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>';

  const parts: string[] = [];
  const offsets: number[] = [0];
  let offset = 0;

  const push = (value: string) => {
    parts.push(value);
    offset += Buffer.byteLength(value, 'utf8');
  };

  push('%PDF-1.4\n');

  objects.forEach((object, index) => {
    offsets[index + 1] = offset;
    push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const startXref = offset;
  push(`xref\n0 ${objects.length + 1}\n`);
  push('0000000000 65535 f \n');

  for (let index = 1; index <= objects.length; index += 1) {
    push(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  }

  push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`
  );

  return new TextEncoder().encode(parts.join(''));
};

export const createPortfolioPdf = (): Uint8Array => buildPdf([buildPageOne(), buildPageTwo()]);
