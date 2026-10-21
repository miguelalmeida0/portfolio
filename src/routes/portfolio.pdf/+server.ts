import { redirect } from '@sveltejs/kit';

// Serve the supplied CV with the user-requested contact alignment correction.
// The web CV is transcribed from it; do not regenerate this download.
export const GET = () => redirect(307, '/files/miguel-almeida-cv.pdf');
