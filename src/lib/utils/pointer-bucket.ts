export type PointerBucket =
  | 'center'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'northwest'
  | 'southeast'
  | 'southwest';

const getAxisBucket = (value: number, size: number): 'start' | 'center' | 'end' => {
  if (value < size * 0.33) return 'start';
  if (value > size * 0.66) return 'end';

  return 'center';
};

export const getPointerBucket = (
  pointerX: number,
  pointerY: number,
  width: number,
  height: number
): PointerBucket => {
  const x = getAxisBucket(pointerX, width);
  const y = getAxisBucket(pointerY, height);

  if (x === 'center' && y === 'center') return 'center';
  if (x === 'center' && y === 'start') return 'north';
  if (x === 'center' && y === 'end') return 'south';
  if (x === 'start' && y === 'center') return 'west';
  if (x === 'end' && y === 'center') return 'east';
  if (x === 'end' && y === 'start') return 'northeast';
  if (x === 'start' && y === 'start') return 'northwest';
  if (x === 'end' && y === 'end') return 'southeast';

  return 'southwest';
};
