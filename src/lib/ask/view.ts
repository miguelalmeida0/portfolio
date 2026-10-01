import { writable } from 'svelte/store';
import type { AskView } from './types';
export const DEFAULT_HEADING = 'Ask about anything on this page';
export const initialView = (): AskView => ({ state: 'idle', question: DEFAULT_HEADING, fragments: [], complete: false, refusal: false, loading: false, knowledge: null });
export const askView = writable<AskView>(initialView());
