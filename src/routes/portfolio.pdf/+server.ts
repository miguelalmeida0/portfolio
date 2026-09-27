import { redirect } from '@sveltejs/kit';

// The searchable, font-embedded PDF is generated from the shared CV content.
// Run `node scripts/generate-cv.mjs` after changing that content.
export const GET = () => redirect(307, '/files/miguel-almeida-cv.pdf');
