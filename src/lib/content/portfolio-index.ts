import { projects } from '$lib/experience/projects';

export const portfolioProjects = projects.map(project => ({
  name: project.name, category: project.category, description: project.summary,
  href: `/work/${project.slug}`, image: project.image, alt: project.alt, live: project.live?.href ?? null
}));
