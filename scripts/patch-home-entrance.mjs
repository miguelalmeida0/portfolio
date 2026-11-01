import { readFileSync } from 'node:fs';

export function patchHomeEntrance(html) {
  if (html.includes('id="landing-entrance"')) throw new Error('Unexpected homepage entrance source: already installed');
  const name = '<span class="text-run" data-sheet-drift="-8">Miguel</span>';
  const surname = '<span class="text-run" data-sheet-drift="6">Almeida</span>';
  for (const token of [name, surname, '</head>', '<meta charset="utf-8">']) {
    if (html.split(token).length !== 2) throw new Error('Unexpected homepage entrance source');
  }
  const css = readFileSync(new URL('../release/landing-entrance.css', import.meta.url), 'utf8');
  const js = readFileSync(new URL('../release/landing-entrance.js', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../release/hero-layout.js', import.meta.url), 'utf8');
  const oldLayout = / const inkContext=document\.createElement\('canvas'\)\.getContext\('2d'\);[\s\S]*?(?= \/\/ All choreography is sampled from scroll\.)/g;
  if ([...html.matchAll(oldLayout)].length !== 1) throw new Error('Unexpected homepage entrance layout source');
  return html
    .replace(oldLayout, layout)
    .replace(name, '<span class="landing-word">' + name + '</span>')
    .replace(surname, '<span class="landing-word">' + surname + '</span>')
    .replace('<meta charset="utf-8">', '<meta charset="utf-8"><script id="landing-entrance">' + js + '</script>')
    .replace('</head>', '<style id="landing-entrance-style">' + css + '</style></head>');
}
