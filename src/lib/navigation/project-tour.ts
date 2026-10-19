import { findProject } from '$lib/experience/projects';
const tour = ['f24', 'needle', 'second-voice', 'leu', 'flow'];
export function nextProject(slug: string, preview = false) {
  const index = tour.indexOf(slug);
  const next = index >= 0 ? tour[index + 1] : undefined;
  return next
    ? { href: '/work/' + next, name: findProject(next === "second-voice" ? "second-voice-ai" : next)?.name ?? '', label: 'Next project' }
    : { href: '/#work', name: 'All selected work', label: 'Explore the portfolio' };
}

