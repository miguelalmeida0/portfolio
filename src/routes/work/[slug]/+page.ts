import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  if (['ghostwriter', 'second-voice-ai'].includes(params.slug)) redirect(308, '/work/second-voice');
  error(404, 'Case study not found');
};
