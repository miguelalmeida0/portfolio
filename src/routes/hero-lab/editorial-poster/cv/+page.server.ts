import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Preserve bookmarks from the earlier whole-edition navigation.
export const load: PageServerLoad = ({ url }) => {
  redirect(308, `/hero-lab/typographic/cv${url.search}`);
};
