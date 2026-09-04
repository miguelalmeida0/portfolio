import { caseStudies } from '$lib/content/case-studies';
import { cvBio, cvEducation, cvExperience, cvLanguages, cvStack, site } from '$lib/content/folio';

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
      y: 708,
      size: 31,
      font: 'F2'
    }),
    drawText({
      text: 'Frontend Engineer - Product UI & Design Systems',
      x: 56,
      y: 678,
      size: 15,
      font: 'F3',
      color: [0.898, 0.822, 0.661]
    })
  );

  let summaryY = 642;
  for (const line of wrapText(cvBio, 82)) {
    commands.push(drawText({ text: line, x: 56, y: summaryY, size: 11.5 }));
    summaryY -= 18;
  }

  commands.push(
    drawText({
      text: `Berlin, Germany  |  ${site.email}  |  github.com/miguelalmeida0`,
      x: 56,
      y: 590,
      size: 9.5,
      color: [0.859, 0.788, 0.675]
    }),
    drawText({
      text: 'Professional Diploma in UX Design | UX Design Institute | 2020-2021',
      x: 56,
      y: 570,
      size: 9.5,
      font: 'F2',
      color: [0.898, 0.822, 0.661]
    }),
    drawText({
      text: 'Professional Experience',
      x: 56,
      y: 536,
      size: 17,
      font: 'F2'
    })
  );

  let roleY = 504;
  for (const item of cvExperience.slice(0, 4)) {
    commands.push(
      drawText({
        text: `${item.years}  ${item.role}`,
        x: 56,
        y: roleY,
        size: 12,
        font: 'F2'
      }),
      drawText({
        text: `${item.company} · ${item.location}`,
        x: 56,
        y: roleY - 16,
        size: 9.5,
        color: [0.859, 0.788, 0.675]
      })
    );

    roleY -= 34;

    for (const bullet of item.bullets.slice(0, 3)) {
      for (const line of wrapText(`• ${bullet}`, 83)) {
        commands.push(drawText({ text: line, x: 66, y: roleY, size: 10.25 }));
        roleY -= 14;
      }
    }
    roleY -= 18;
  }

  commands.push(
    drawText({
      text: 'Generated from the same content source as the web resume.',
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
      text: 'Selected Engineering Work',
      x: 56,
      y: 688,
      size: 22,
      font: 'F2'
    })
  );

  let projectY = 648;
  for (const project of caseStudies) {
    commands.push(
      drawText({
        text: project.title,
        x: 56,
        y: projectY,
        size: 13,
        font: 'F2'
      })
    );
    projectY -= 18;

    for (const line of wrapText(project.thesis, 78)) {
      commands.push(drawText({ text: line, x: 56, y: projectY, size: 11.25 }));
      projectY -= 15;
    }

    commands.push(
      drawText({
        text: project.technicalSignal,
        x: 56,
        y: projectY,
        size: 9.25,
        color: [0.847, 0.756, 0.620]
      })
    );
    projectY -= 34;
  }

  commands.push(
    drawText({
      text: 'Technical Focus',
      x: 56,
      y: 364,
      size: 18,
      font: 'F2'
    }),
      drawText({
        text: [...cvStack, 'Browser media APIs', 'Async lifecycle ownership', 'Applied AI interfaces'].join('  ·  '),
        x: 56,
        y: 334,
        size: 9.5,
        color: [0.859, 0.788, 0.675]
      })
  );

  commands.push(
    drawText({
      text: 'Education',
      x: 56,
      y: 282,
      size: 18,
      font: 'F2'
    })
  );

  let educationY = 252;
  for (const item of cvEducation) {
    commands.push(
      drawText({
        text: `${item.year}  ${item.title} · ${item.place}`,
        x: 56,
        y: educationY,
        size: 10.5
      })
    );
    educationY -= 20;
  }

  commands.push(
    drawText({
      text: `Languages  ·  ${cvLanguages.join('  ·  ')}`,
      x: 56,
      y: 170,
      size: 10.5,
      color: [0.859, 0.788, 0.675]
    }),
    drawText({
      text: `Contact  ·  ${site.email}  ·  ${site.linkedin}`,
      x: 56,
      y: 126,
      size: 9.5
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
