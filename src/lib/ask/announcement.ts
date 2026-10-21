import type { AskView } from './types';

/** Announce ready evidence once, independently of decorative quote playback. */
export function answerAnnouncement(view: AskView, footer: string, refusal: string): string {
  if (view.error) return view.error;
  if (view.loading) return 'Reviewing the relevant project notes.';
  if (view.knowledge) return [...view.knowledge.paragraphs, ...view.knowledge.bullets,
    ...(view.knowledge.conversational ? [] : [footer])].join(' ');
  return view.refusal ? refusal : '';
}
