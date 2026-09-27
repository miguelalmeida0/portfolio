import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { findProject } from '$lib/experience/projects';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
  if (params.slug === 'ghostwriter') redirect(308, '/work/second-voice-ai');
  const project = findProject(params.slug);

  if (!project) {
    error(404, 'Case study not found');
  }

  return { project };
};
