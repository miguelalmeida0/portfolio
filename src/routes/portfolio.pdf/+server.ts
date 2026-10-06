import { redirect } from '@sveltejs/kit';

// Preserve the exact user-supplied Miguel_Almeida_CV_OPEN.pdf (6 October 2026).
// The web CV is transcribed from it; do not regenerate this download.
export const GET = () => redirect(307, '/files/miguel-almeida-cv.pdf');
