import {
  cvBio,
  cvEducation,
  cvExperience,
  cvLanguages,
  cvStack,
  selectedWork,
  professionalRecommendation,
  site
} from '$lib/content/folio';
import { SITE_ORIGIN } from '$lib/config/site';

type PdfFont = 'F1' | 'F2' | 'F3';
type PdfColor = [number, number, number];

interface PdfLine {
  text: string;
  x: number;
  y: number;
  size?: number;
  font?: PdfFont;
  color?: PdfColor;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const INK: PdfColor = [0.094, 0.102, 0.11];
const MUTED: PdfColor = [0.31, 0.329, 0.349];
const SOFT: PdfColor = [0.545, 0.557, 0.565];
const ACCENT: PdfColor = [0.682, 0.337, 0.157];
const PAPER: PdfColor = [0.986, 0.98, 0.965];
const RULE: PdfColor = [0.835, 0.824, 0.796];

const escapePdfText = (value: string): string =>
  value
    .replace(/[–—]/g, '-')
    .replace(/·/g, '|')
    .replace(/[“”]/g, '"')
    .replace(/’/g, "'")
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

    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
};

const drawText = ({
  text,
  x,
  y,
  size = 10,
  font = 'F1',
  color = INK
}: PdfLine): string => {
  const [r, g, b] = color;
  return `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`;
};

const drawRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: PdfColor
): string => {
  const [r, g, b] = color;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${y} ${width} ${height} re f`;
};

const drawRule = (x: number, y: number, width: number, color = RULE): string => {
  const [r, g, b] = color;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG 0.55 w ${x} ${y} m ${x + width} ${y} l S`;
};

const drawSectionLabel = (text: string, x: number, y: number): string[] => [
  drawRect(x, y - 1, 3, 10, ACCENT),
  drawText({ text: text.toUpperCase(), x: x + 11, y, size: 8, font: 'F2', color: ACCENT })
];

const drawWrapped = (
  commands: string[],
  text: string,
  x: number,
  y: number,
  maxChars: number,
  size: number,
  leading: number,
  options: { font?: PdfFont; color?: PdfColor } = {}
): number => {
  let cursor = y;
  for (const line of wrapText(text, maxChars)) {
    commands.push(
      drawText({
        text: line,
        x,
        y: cursor,
        size,
        font: options.font,
        color: options.color
      })
    );
    cursor -= leading;
  }
  return cursor;
};

const drawBullet = (
  commands: string[],
  text: string,
  y: number,
  maxChars = 72
): number => {
  commands.push(drawRect(44, y + 3.2, 2.4, 2.4, ACCENT));
  return drawWrapped(commands, text, 54, y, maxChars, 8.45, 11.4, { color: MUTED }) - 4;
};

const buildPage = (): string => {
  const commands: string[] = [drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, PAPER)];

  commands.push(
    drawRect(42, 764, 3.5, 42, ACCENT),
    drawText({ text: site.name, x: 54, y: 789, size: 25, font: 'F2' }),
    drawText({
      text: 'FRONTEND ENGINEER | PRODUCT UI & DESIGN SYSTEMS',
      x: 54,
      y: 768,
      size: 8.7,
      font: 'F2',
      color: MUTED
    }),
    drawText({ text: 'Berlin, Germany', x: 365, y: 802, size: 8.2, color: SOFT }),
    drawText({ text: site.email, x: 365, y: 787, size: 8.2, color: INK }),
    drawText({ text: 'linkedin.com/in/miguelalmeida1', x: 365, y: 772, size: 8.2, color: INK }),
    drawText({ text: 'github.com/miguelalmeida0', x: 365, y: 757, size: 8.2, color: INK }),
    drawRule(42, 738, 511)
  );

  commands.push(...drawSectionLabel('Profile', 42, 715));
  drawWrapped(commands, cvBio, 42, 692, 104, 9.15, 13, { color: MUTED });
  commands.push(drawRule(42, 655, 511));

  commands.push(...drawSectionLabel('Experience', 42, 630));
  const f24 = cvExperience[0];
  commands.push(
    drawText({ text: f24.role, x: 42, y: 602, size: 11.4, font: 'F2' }),
    drawText({
      text: `${f24.company} | ${f24.location} | ${f24.years}`,
      x: 42,
      y: 586,
      size: 8.3,
      font: 'F2',
      color: SOFT
    })
  );

  let cursorY = 563;
  for (const bullet of f24.bullets) cursorY = drawBullet(commands, bullet, cursorY, 70);

  const freelance = cvExperience[1];
  cursorY -= 3;
  commands.push(
    drawText({ text: freelance.role, x: 42, y: cursorY, size: 10.4, font: 'F2' }),
    drawText({
      text: `${freelance.company} | ${freelance.location} | ${freelance.years}`,
      x: 42,
      y: cursorY - 15,
      size: 8.1,
      font: 'F2',
      color: SOFT
    })
  );
  cursorY -= 37;
  for (const bullet of freelance.bullets) cursorY = drawBullet(commands, bullet, cursorY, 70);

  const projectHeadingY = cursorY - 26;
  commands.push(drawRule(42, projectHeadingY + 24, 348));
  commands.push(...drawSectionLabel('Selected work', 42, projectHeadingY));

  let projectY = projectHeadingY - 28;
  for (const project of selectedWork) {
    commands.push(drawText({ text: project.title, x: 42, y: projectY, size: 9.6, font: 'F2' }));
    projectY = drawWrapped(commands, project.tagline, 42, projectY - 14, 72, 8.2, 10.5, {
      color: MUTED
    });
    projectY -= 10;
  }

  const recommendationY = projectY - 18;
  commands.push(...drawSectionLabel('Recommendation', 42, recommendationY));
  const quoteEnd = drawWrapped(commands, `"${professionalRecommendation.quote}"`, 42, recommendationY - 23, 73, 8.3, 11.4, { color: MUTED, font: 'F3' });
  commands.push(drawText({ text: `${professionalRecommendation.name} | ${professionalRecommendation.role}`, x: 42, y: quoteEnd - 7, size: 8, font: 'F2', color: INK }));

  commands.push(drawRule(412, 655, 0.1, RULE));
  commands.push(drawRect(411.5, 203, 0.7, 452, RULE));

  commands.push(...drawSectionLabel('Core expertise', 432, 630));
  const expertise = [
    'Product UI',
    'Frontend architecture',
    'Design systems',
    'Accessible interfaces',
    'State and recovery',
    'Applied AI interfaces'
  ];
  let asideY = 603;
  for (const item of expertise) {
    commands.push(drawText({ text: item, x: 432, y: asideY, size: 8.7, color: MUTED }));
    asideY -= 17;
  }

  commands.push(...drawSectionLabel('Tools', 432, 478));
  asideY = 450;
  for (const item of cvStack) {
    commands.push(drawText({ text: item, x: 432, y: asideY, size: 8.5, color: MUTED }));
    asideY -= 16;
  }

  commands.push(...drawSectionLabel('Education', 432, 305));
  asideY = 277;
  for (const item of cvEducation) {
    commands.push(
      drawText({ text: item.year, x: 432, y: asideY, size: 7.7, font: 'F2', color: ACCENT })
    );
    asideY = drawWrapped(commands, item.title, 432, asideY - 13, 27, 8.25, 10.5, {
      font: 'F2',
      color: INK
    });
    asideY = drawWrapped(commands, item.place, 432, asideY - 1, 29, 7.65, 10, { color: SOFT });
    asideY -= 10;
  }

  commands.push(...drawSectionLabel('Languages', 432, 166));
  asideY = 139;
  for (const language of cvLanguages) {
    commands.push(drawText({ text: language, x: 432, y: asideY, size: 8.3, color: MUTED }));
    asideY -= 16;
  }

  commands.push(
    drawRule(42, 56, 511),
    drawText({
      text: 'miguelalmeida.is-a.dev | Selected projects, engineering evidence, and contact',
      x: 42,
      y: 37,
      size: 7.7,
      font: 'F3',
      color: SOFT
    })
  );

  return commands.join('\n');
};

const createLinkAnnotation = (rect: [number, number, number, number], url: string): string =>
  `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${escapePdfText(url)}) >> >>`;

const buildPdf = (page: string): Uint8Array => {
  const objects: string[] = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R /Annots [8 0 R 9 0 R 10 0 R 11 0 R] >>`,
    `<< /Length ${Buffer.byteLength(page, 'utf8')} >>\nstream\n${page}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>',
    createLinkAnnotation([362, 782, 553, 795], `mailto:${site.email}`),
    createLinkAnnotation([362, 767, 553, 780], site.linkedin),
    createLinkAnnotation([362, 752, 553, 765], site.github),
    createLinkAnnotation([42, 30, 553, 49], SITE_ORIGIN),
    `<< /Title (Miguel Almeida - Frontend Engineer CV) /Author (${site.name}) /Subject (Frontend engineering, product UI, and design systems) /Creator (Miguel Almeida portfolio) >>`
  ];

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
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 12 0 R >>\nstartxref\n${startXref}\n%%EOF`
  );

  return new TextEncoder().encode(parts.join(''));
};

export const createPortfolioPdf = (): Uint8Array => buildPdf(buildPage());
