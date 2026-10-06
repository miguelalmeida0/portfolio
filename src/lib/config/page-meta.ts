import { SITE_DESCRIPTION, SITE_IMAGE_URL, SITE_ORIGIN } from './site';
import { projects } from '$lib/experience/projects';
import { selectedProjects } from '$lib/components/experience/work/selected-projects';

export function pageMeta(path: string) {
  const slug = path.split('/')[2] === 'second-voice' ? 'second-voice-ai' : path.split('/')[2];
  const project = path.startsWith('/work/') ? projects.find(item => item.slug === slug) : undefined;
  if (project) {
    const preview = selectedProjects.find(item => item.id === slug);
    const image = slug === 'leu' ? '/projects/leu/leu-loop-v2-poster.jpg' : preview?.poster ?? project.image;
    return { title: `${project.name} | Miguel Almeida`, description: project.summary, image: new URL(image, SITE_ORIGIN).href, alt: preview?.alt ?? project.alt };
  }
  const title = path.startsWith('/cv') ? 'CV | Miguel Almeida, frontend engineer' : path === '/story' ? 'My story | Miguel Almeida' : 'Miguel Almeida | Frontend engineer & product designer';
  const description = path.startsWith('/cv') ? 'Frontend architecture, product delivery and UX design. Explore Miguel Almeida’s experience at F24 and independent products.' : path === '/story' ? 'From UX design to frontend engineering. How Miguel Almeida approaches product decisions, implementation and dependable interfaces.' : SITE_DESCRIPTION;
  return { title, description, image: SITE_IMAGE_URL, alt: 'Portrait of Miguel Almeida' };
}
