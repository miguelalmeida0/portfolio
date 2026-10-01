export const projectTitles: Record<string, string> = {
  'second-voice-ai': 'Second Voice AI', f24: 'F24', flow: 'Flow', leu: 'Leu',
  'camera-harness': 'Camera Harness', ghostwriter: 'Ghostwriter', atlas: 'Atlas', 'creature-app': 'Creature App'
};

export function resolveProject(question: string, context?: string) {
  const q = question.toLowerCase();
  if (/\bsecond voice(?: ai)?\b/.test(q)) return 'second-voice-ai';
  if (/\bconnectivity hub\b/.test(q)) return 'f24';
  for (const slug of ['f24', 'flow', 'leu']) {
    if (new RegExp(`\\b${slug}\\b`).test(q)) return slug;
  }
  for (const [slug, title] of Object.entries(projectTitles)) {
    if (['second-voice-ai', 'f24', 'flow', 'leu'].includes(slug)) continue;
    if (q.includes(title.toLowerCase()) || q.includes(slug) || (slug === 'ghostwriter' && q.includes('ghostwritter'))) return slug;
  }
  if (/\b(microscope|bytetrack|florence|yolo|camera|multimodal)\b/i.test(q)) return 'camera-harness';
  if (/\b(registration|sign.?up|migration drift)\b/i.test(q)) return 'ghostwriter';
  return context && Object.hasOwn(projectTitles, context) ? context : undefined;
}

export function projectQuestions(slug?: string): string[] {
  if (!slug || !Object.hasOwn(projectTitles, slug)) return [];
  const title = projectTitles[slug];
  return [`What did Miguel build in ${title}?`, `What was the key decision in ${title}?`, `What evidence supports ${title}?`];
}
