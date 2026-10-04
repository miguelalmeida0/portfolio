import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { findProject } from '$lib/experience/projects';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
  if (['ghostwriter', 'second-voice-ai'].includes(params.slug)) redirect(308, '/work/second-voice');
  const project = findProject(params.slug);

  if (!project) {
    error(404, 'Case study not found');
  }

  return { project };
};
