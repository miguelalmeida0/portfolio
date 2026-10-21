import { LINES } from '$lib/components/experience/hero/wind';
import { primaryNavigation } from '$lib/content/navigation';
import { selectedProjects } from '$lib/components/experience/work/selected-projects';
import { f24Ownership } from '$lib/content/work-projects';

/**
 * The homepage hero, verbatim. Every direction renders these exact strings;
 * `tests/routes/hero-lab.test.mjs` compares them with the production hero.
 */
export const hero = {
  greeting: 'Hi, I’m Miguel.',
  role: LINES,
  roleLabel: LINES.join(' '),
  experience: '4+ years building production software.',
  stack: ['React', 'TypeScript', 'Svelte', 'JavaScript'] as const,
  /** Rendered with non-breaking spaces before each separator, as in production. */
  stackLine: 'React\u00a0· TypeScript\u00a0· Svelte\u00a0· JavaScript',
  impact: 'Built a product used by hundreds of companies.',
  cv: { label: 'View CV', href: '/cv' },
  contact: { label: 'Get in touch', href: '#contact' },
  name: { first: 'MIGUEL', last: 'ALMEIDA' },
  city: 'Berlin',
  homeLabel: 'Miguel Almeida, Berlin — home'
} as const;

/**
 * The shared navigation, kept in-page where the prototype hosts the section:
 * Work and Contact scroll within the prototype instead of leaving it.
 */
export const labNavigation = primaryNavigation.map(link => ({
  ...link,
  href: link.href === '/#work' ? '#work' : link.href
}));

/** Real portrait asset and responsive sources used by the production hero. */
export const portrait = {
  alt: 'Miguel Almeida',
  fallback: '/images/miguel-contact-editorial.webp',
  width: 1086,
  height: 1448,
  avif: '/images/wind-full-720.avif 720w, /images/wind-full-1086.avif 1086w',
  webp: '/images/wind-full-720.webp 720w, /images/wind-full-1086.webp 1086w'
} as const;

/**
 * Selected Work subjects for Direction 03, reusing the exact media URLs and
 * copy that the Selected Work section below already loads and publishes.
 */
const byId = (id: string) => selectedProjects.find(project => project.id === id)!;
export const productObjects = [
  {
    id: 'f24', name: 'F24', href: '/work/f24', category: 'Professional experience',
    line: 'From mockups to production.', detail: f24Ownership.tags.slice(0, 3).join(' · '),
    image: '/projects/f24/hackathon-working.webp', width: 640, height: 854,
    alt: 'Miguel and a colleague working together at their desks during the F24 hackathon.'
  },
  ...['needle', 'second-voice-ai', 'leu'].map(id => {
    const project = byId(id);
    return {
      id: project.id, name: project.name, href: project.href, category: project.category,
      line: project.line, detail: project.tags.join(' · '),
      image: project.poster, width: 1600, height: 900, alt: project.alt
    };
  })
];
