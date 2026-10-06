import { projects } from '$lib/experience/projects';
import { leuMedia } from '$lib/content/leu-media';
export type PreviewSource = { src: string; type: string };
export type SelectedProject = {
  id: string; name: string; line: string; tags: string[]; poster: string; alt: string;
  href: string; live?: string; code?: string; sources: PreviewSource[];
};
const treatments = [
  { id: 'needle', name: 'Needle', line: 'Search 10,000 artworks. A semantic search engine.', tags: ['Semantic search', 'Web Workers', 'HNSW retrieval'] },
  { id: 'second-voice-ai', name: 'Second Voice AI', line: 'Choose a literary voice. See exactly what changes.', tags: ['AI rewriting', 'Edit comparison', 'Request recovery'] },
  { id: 'flow', name: 'Flow', line: 'Move a meeting. Inspect the change. Undo it.', tags: ['Voice-first actions', 'Undo / redo', 'Persistent state'] },
  { id: 'leu', name: 'Leu', line: 'Read a passage. Find the gap. Return to the exact source.', tags: ['Source-linked learning', 'SwiftUI', 'On-device narration'] }
];
export const selectedProjects: SelectedProject[] = treatments.map(item => {
  const project = projects.find(p => p.slug === item.id)!;
  const sources: PreviewSource[] = item.id === 'needle'
    ? [{ src: '/projects/needle/needle-loop-web.mp4', type: 'video/mp4' }]
    : item.id === 'leu'
    ? [...leuMedia.sources, { src: leuMedia.src, type: 'video/mp4' }]
    : item.id === 'second-voice-ai'
      ? [{ src: '/projects/ghostwriter/second-voice-loop.mp4', type: 'video/mp4' }]
      : project.video ? [{ src: project.video, type: 'video/mp4' }] : [];
  const poster = item.id === 'needle'
    ? '/projects/needle/needle-loop-poster.png'
    : item.id === 'second-voice-ai' ? '/projects/ghostwriter/second-voice-poster-1500.jpg' : project.image;
  const alt = item.id === 'needle'
    ? 'Needle semantic artwork search with clustered results and an artwork inspector.'
    : item.id === 'second-voice-ai' ? 'Second Voice writing interface with author voices and rewrite controls.' : project.alt;
  return { ...item, poster, alt, href: `/work/${item.id}`, live: project.live?.href, code: project.source, sources };
});
