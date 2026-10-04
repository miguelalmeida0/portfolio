import { projects } from '$lib/experience/projects';
import type { ProjectTile } from './project-media';

// Homepage selection is independent of the complete case-study archive.
export const homepageProjects = ['needle', 'second-voice-ai', 'f24', 'flow', 'leu'].map(slug => {
  const project = projects.find(project => project.slug === slug)!;
  return slug === 'second-voice-ai' ? { ...project, name: 'Second Voice AI' } : project;
});

export const homepageReleaseProjectTiles: ProjectTile[] = homepageProjects.map(project => ({
  id: project.slug, title: project.name, category: project.category, status: project.period,
  shortDescription: project.summary, valueLine: project.contribution, href: `/work/${project.slug}`,
  media: { poster: project.image, alt: project.alt, aspectRatio: '16 / 9', focalPoint: { x: 50, y: 50 }, publicSafe: true },
  size: 'standard'
}));
