import { findProject } from '$lib/experience/projects';

/** Page labels use the site's existing names, including this isolated preview. */
export function destinationLabel(url: URL): string | undefined {
  const path = url.pathname.replace(/\/$/, '') || '/';
  const canonical = path.replace(/^\/hero-lab\/typographic(?=\/|$)/, '') || '/';
  if (canonical === '/') return url.hash === '#work' ? 'Work' : 'Home';
  if (canonical === '/story') return 'Story';
  if (canonical === '/cv') return 'CV';
  const match = /^\/work\/([^/]+)$/.exec(canonical);
  return match ? findProject(match[1] === "second-voice" ? "second-voice-ai" : decodeURIComponent(match[1]))?.name : undefined;
}

