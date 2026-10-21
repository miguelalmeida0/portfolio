import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const removed: RequestHandler = () => json(
  { error: 'The portfolio assistant has been removed.' },
  { status: 410, headers: { 'Cache-Control': 'no-store' } }
);
export const GET = removed;
export const POST = removed;
