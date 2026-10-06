import { projects } from '$lib/experience/projects';

// Preserve the reviewed 5 October CV descriptions independently of case-study copy.
const descriptions: Record<string, string> = {
  needle: 'Engineered search across 10,000 artworks with worker-isolated HNSW retrieval, a precomputed search graph, windowed rendering and cache-aware image delivery.',
  'second-voice-ai': 'Engineered an AI writing product with literary voice controls, word-level edit comparison and recoverable request state. Preserved drafts and results across failures, with bounded provider requests and generation safeguards.'
};

const webDescriptions: Record<string, string> = {
  needle: 'Designed and engineered a browser-based search system for 10,000 artworks, combining Web Worker-isolated HNSW retrieval with a precomputed, corpus-bound search graph. Built a windowed collection interface and image delivery pipeline with bounded derivatives and HTTP cache validation, coordinating retrieval, network transfer and rendering as one product experience.',
  'second-voice-ai': 'Designed and engineered an AI writing product that makes literary rewrites inspectable and recoverable. Built voice and intensity controls, word-level edit comparison and explicit request-state management, preserving drafts and previous results through failures. Integrated bounded, cancellable provider requests and generation safeguards to keep writers in control.'
};

export const cvProjects = ['needle', 'second-voice-ai', 'flow', 'leu'].map(slug => {
  const project = projects.find(project => project.slug === slug)!;
  return {
    slug,
    name: slug === 'second-voice-ai' ? 'Second Voice AI' : project.name,
    href: `/work/${slug}`,
    live: slug === 'leu' ? 'https://leu-desktop.vercel.app' : project.live?.href,
    description: webDescriptions[slug] ?? project.summary,
    pdfDescription: descriptions[slug] ?? project.summary
  };
});
