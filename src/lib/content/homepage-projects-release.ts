import { projects } from '$lib/experience/projects';
import type { ProjectTile } from './project-media';

export const homepageReleaseProjectTiles: ProjectTile[] = projects.map(project => ({
  id: project.slug, title: project.name, category: project.category, status: project.period,
  shortDescription: project.summary, valueLine: project.contribution, href: `/work/${project.slug}`,
  media: { poster: project.image, alt: project.alt, aspectRatio: '16 / 9', focalPoint: { x: 50, y: 50 }, publicSafe: true },
  size: 'standard'
}));
