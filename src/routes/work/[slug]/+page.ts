import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { getReleaseCaseStudy } from '$lib/content/release-case-studies';

export const load: PageLoad = ({ params }) => {
  const study = getReleaseCaseStudy(params.slug);

  if (!study) {
    error(404, 'Case study not found');
  }

  return { study };
};
