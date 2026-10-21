import { json } from '@sveltejs/kit';
import { buildInfo } from '$lib/build-info';

export const GET = () => json(buildInfo, { headers: { 'Cache-Control': 'no-store' } });
