import type { Author, Strength } from '$lib/experience/samples';

// A second authored example for each setting. The portfolio demo runs locally;
// these are prepared text, not responses from a live model.
export const alternateExamples: Record<`${Author}-${Strength}`, string> = {
  'Tolkien-Subtle': 'Every winter, the harbor lights fell dark. Elias kept the last lamp burning, though twenty years had passed without a ship returning.',
  'Tolkien-Balanced': 'With each winter the harbor lights faded, yet the last lamp still burned in Elias’s keeping. For twenty years, no ship had returned.',
  'Tolkien-Strong': 'For twenty years no ship had returned, and winter after winter darkness claimed the harbor lights. Yet Elias kept the last lamp burning through it all.',
  'King-Subtle': 'Every winter, the harbor lights went out. Elias kept the last lamp burning, though it had been twenty years since a ship returned.',
  'King-Balanced': 'The harbor lights went dark every winter. Except the last lamp. Elias kept it burning. Twenty years had passed without a ship returning.',
  'King-Strong': 'Twenty years. No ship back in the harbor. Every winter the lights went dark, but Elias kept the last lamp burning. That one stayed lit.',
  'Tolstoy-Subtle': 'The harbor lights went dark every winter, while Elias kept the last lamp burning, though twenty years had passed without a ship returning.',
  'Tolstoy-Balanced': 'Each winter brought darkness to the harbor lights, but Elias kept the last lamp burning; no ship had returned for twenty years.',
  'Tolstoy-Strong': 'That no ship had returned in twenty years did not change what Elias did: every winter, as the harbor lights went dark, he kept the last lamp burning.',
  'Hemingway-Subtle': 'The harbor lights went dark each winter. Elias kept the last lamp lit. No ship had returned for twenty years.',
  'Hemingway-Balanced': 'No ship had returned in twenty years. Every winter the harbor lights went out. Elias kept the last lamp burning.',
  'Hemingway-Strong': 'The lights went dark each winter. It was the harbor. There was one lamp left. Elias kept it lit. No ship had come back in twenty years.'
};
