import { readFile } from 'node:fs/promises';
import { expect, test } from '../fixtures';

test('static films declare their size and serve exact subsequent byte ranges', async ({ request }) => {
  for (const path of ['/projects/flow/flow-loop-web-final.mp4', '/projects/leu/leu-loop-v2.mp4']) {
    const file = await readFile(`static${path}`);
    // The first media response needs a known size; the demuxer's subsequent
    // requests must receive the requested ranges from the worker asset cache.
    const initial = await request.get(path);
    expect(initial.status()).toBe(200);
    expect(initial.headers()['content-length']).toBe(String(file.length));
    expect(await initial.body()).toEqual(file);
    for (const [start, end] of [[0, 4095], [14333, 18428]]) {
      const response = await request.get(path, { headers: { Range: `bytes=${start}-${end}` } });
      expect(response.status()).toBe(206);
      expect(response.headers()['content-range']).toBe(`bytes ${start}-${end}/${file.length}`);
      expect(response.headers()['content-length']).toBe(String(end - start + 1));
      expect(await response.body()).toEqual(file.subarray(start, end + 1));
    }
  }
});
