import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { getCaseStudy } from '$lib/content/case-studies';

export const load: PageLoad = ({ params }) => {
  const study = getCaseStudy(params.slug);

  if (!study) {
    error(404, 'Case study not found');
  }

  return { study };
};
