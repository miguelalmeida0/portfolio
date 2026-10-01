import { projects as archive } from '$lib/experience/projects';
import { leuMedia } from './leu-media';

export type VideoSource = { src: string; type: string };
// `sources` are tried in order via canPlayType; `src` is the universal fallback.
export type VideoSpec = { src: string; sources?: VideoSource[]; poster: string; label: string; caption: string; fit: 'cover' | 'contain' };
export type WorkProject = {
  id: 'second-voice' | 'f24' | 'flow' | 'leu';
  name: string; sub: string; line: string; role: string; stack: string;
  cta: { label: string; href: string }; cta2: { label: string; href: string };
  source?: string; poster: string; alt: string;
  stage: { kind: 'pair'; demo: 'second-voice' | 'f24' } | { kind: 'solo'; video: VideoSpec };
};

export const workProjects: WorkProject[] = ['second-voice-ai', 'f24', 'flow', 'leu'].map(slug => {
  const p = archive.find(project => project.slug === slug)!;
  const id = (slug === 'second-voice-ai' ? 'second-voice' : slug) as WorkProject['id'];
  const poster = id === 'leu' ? leuMedia.poster : p.image;
  const alt = id === 'leu' ? leuMedia.label : p.alt;
  return {
    id, name: id === 'second-voice' ? 'Second Voice AI' : p.name,
    sub: p.category, line: p.summary, role: p.role, stack: p.stack.join(' · '), source: p.source,
    poster, alt,
    cta: id === 'second-voice' ? { label: 'Open app', href: p.live!.href }
      : { label: id === 'f24' ? 'My contribution' : 'Case study', href: `/work/${slug}${id === 'f24' ? '#product-impact' : ''}` },
    cta2: id === 'second-voice' || id === 'f24' ? { label: 'Case study', href: `/work/${slug}` }
      : { label: 'Source', href: p.source! },
    stage: id === 'second-voice' || id === 'f24' ? { kind: 'pair', demo: id }
      : { kind: 'solo', video: id === 'leu' ? leuMedia : { src: p.video!, poster, label: alt, caption: p.caption, fit: 'cover' } }
  };
});

// The case study dates joining F24 to 2022 and groups delivery work in 2023–25.
// The middle entries are perspectives on that period, not invented release dates.
export const f24Decisions = [
  { year: '2022', title: 'From mockups to a production frontend.', body: 'Built the original Svelte frontend: reusable UI, interaction states and integrations, working with product, design, backend and QA.', tags: ['Svelte', 'Components', 'Product delivery'], meta: '2022 · Joined F24', href: '/work/f24#context' },
  { year: '2023', title: 'Make production states explicit.', body: 'Loading, empty results and failed requests need distinct behavior. The production work joined component design with integration states and ongoing releases.', tags: ['UI states', 'Integrations', 'Svelte'], meta: '2023–25 · Production delivery', href: '/work/f24#context' },
  { year: '2024', title: 'Test the transitions people rely on.', body: 'Playwright flow coverage supported the Svelte product. Worked across interactions, tests and release work with backend and QA colleagues.', tags: ['Playwright', 'Regression tests', 'QA'], meta: '2023–25 · Production delivery', href: '/work/f24#engineering-proof' },
  { year: '2026', title: 'Move to React. Keep delivery moving.', body: 'Keep the Svelte product shipping while React areas mature. Contributed activity history and regression tests; migration direction and the shared UI foundation were team work.', tags: ['React', 'TypeScript', 'Migration'], meta: '2026 · Svelte → React', href: '/work/f24#production-decision' }
] as const;

/** Current homepage summary of Miguel’s product ownership at F24. */
export const f24Ownership = {
  title: 'From mockups to production.',
  body: 'Built modular frontend architecture, backend integrations and performance improvements within a product team.',
  tags: ['Architecture', 'APIs', 'Performance'],
  meta: '2022–now · Svelte → React',
  href: '/work/f24#product-impact'
} as const;
