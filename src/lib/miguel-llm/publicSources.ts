const projectSlugs = ['camera-harness', 'ghostwriter', 'mirror-ai', 'atlas', 'creature-app'];
const aliases: Record<string, string> = {
  'how-i-work': 'at-work',
  responsibility: 'contribution',
  behavior: 'behavior-title',
  problem: 'problem-title'
};
const caseAnchors = new Set(['artifact', 'contribution', 'decisions', 'result', 'reflection', 'problem-title', 'behavior-title', 'incident', 'system-flow', 'evidence']);

export function publicSource(source: string): string {
  const [rawLabel, rawHref] = source.split('|');
  if (rawHref) {
    const [path, fragment] = rawHref.split('#');
    const slug = path.startsWith('/work/') ? path.slice(6) : '';
    const valid = path === '/cv' || path === '/story' || path === '/' || projectSlugs.includes(slug) || ['/evidence/camera-controller-check.json', '/evidence/mirror-replay-check.json'].includes(path);
    if (valid) {
      let anchor = aliases[fragment] ?? fragment;
      if (slug && anchor && !caseAnchors.has(anchor)) anchor = '';
      if (slug && anchor === 'system-flow' && slug !== 'camera-harness') anchor = 'decisions';
      if (slug && anchor === 'incident' && slug !== 'ghostwriter') anchor = 'result';
      if (slug && anchor === 'evidence') anchor = 'result';
      if (path === '/story' && anchor && !['at-work', 'hackathon', 'side-projects'].includes(anchor)) anchor = '';
      if (path === '/' && anchor && !['top', 'work', 'experience', 'contact'].includes(anchor)) anchor = '';
      const label = rawLabel.replace(/\b(ingestion|needs miguel input|approved notes)\b/gi, '').trim();
      return `${label || 'Portfolio'}|${path}${anchor ? `#${anchor}` : ''}`;
    }
  }
  const normalized = rawLabel.toLowerCase();
  if (/cv|career|experience|skills|role/.test(normalized)) return 'Résumé & experience|/cv';
  if (/contact|availability/.test(normalized)) return 'Contact Miguel|/#contact';
  if (/project|engineering/.test(normalized)) return 'Selected work|/#work';
  return 'About Miguel|/story';
}

export function publicSources(sources: readonly string[]) {
  return [...new Set(sources.map(publicSource))].slice(0, 4);
}
