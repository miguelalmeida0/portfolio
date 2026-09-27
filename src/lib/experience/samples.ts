export const originalDraft = 'Every winter, the harbor lights went dark. Elias kept the last lamp burning, though no ship had returned in twenty years.';
export const authors = ['Tolkien', 'King', 'Tolstoy', 'Hemingway'] as const;
export const strengths = ['Subtle', 'Balanced', 'Strong'] as const;
export type Author = typeof authors[number];
export type Strength = typeof strengths[number];

// Authored examples. Every variation retains the same four source facts.
export const samples: Record<Author, [string, string, string]> = {
  Tolkien: [
    'Each winter, the harbor lights grew dark. Elias kept the last lamp alight, though no ship had returned in twenty years.',
    'Each winter, darkness settled over the harbor. Yet Elias kept the last lamp burning, though twenty years had passed since a ship returned.',
    'Winter after winter, the lights of the harbor faded into darkness. Still Elias tended the last burning lamp; for twenty years, no ship had returned.'
  ],
  King: [
    'Every winter, the harbor lights went dark. Elias kept the last lamp burning. No ship had returned in twenty years.',
    'Every winter, the harbor went dark. All the lights but one. Elias kept that last lamp burning, though no ship had returned in twenty years.',
    'Every winter the harbor lights went out. One lamp remained. Elias kept it burning. No ship had returned in twenty years. Twenty years, and still that last light.'
  ],
  Tolstoy: [
    'Every winter the harbor lights darkened, but Elias kept the last lamp burning, although no ship had returned in twenty years.',
    'Although no ship had returned in twenty years, Elias kept the last lamp burning while, each winter, the other harbor lights went dark.',
    'Twenty years had passed without a ship returning to the harbor. Each winter its lights went dark; Elias, however, kept the last lamp burning.'
  ],
  Hemingway: [
    'Every winter, the harbor lights went dark. Elias kept the last lamp burning. No ship had returned in twenty years.',
    'Every winter the harbor went dark. Elias kept one lamp burning. The last one. No ship had returned in twenty years.',
    'Winter came each year. The harbor lights went out. Elias kept the last lamp lit. No ship had returned. Not in twenty years.'
  ]
};
export const sampleNotes: Record<Author, [string, string, string]> = {
  Tolkien: ['Small changes to diction retain the original sentence structure.', 'The contrast moves to “Yet Elias”; the absence becomes elapsed time.', 'A repeated opening and longer cadence emphasize the passing winters.'],
  King: ['The absence becomes a separate sentence.', 'An isolated fragment draws attention to the remaining lamp.', 'Short clauses and repetition emphasize the twenty-year absence.'],
  Tolstoy: ['The two original statements become one connected sentence.', 'The twenty-year absence comes first, before Elias’s action.', 'The same facts are reordered around time and contrast.'],
  Hemingway: ['Three direct statements replace the subordinate clause.', 'Short sentences isolate the lamp from the surrounding darkness.', 'Brief clauses and a final fragment emphasize the elapsed time.']
};
export function sampleFor(author: Author, strength: Strength) { return samples[author][strengths.indexOf(strength)]; }
export function noteFor(author: Author, strength: Strength) { return sampleNotes[author][strengths.indexOf(strength)]; }
