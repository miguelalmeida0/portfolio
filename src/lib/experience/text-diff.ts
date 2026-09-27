export type EditOperation = { kind: 'equal' | 'delete' | 'insert'; text: string };
export type DiffPart = { text: string; changed: boolean };
/** Exact word/punctuation comparison. Whitespace is preserved for copying. */
export function compareText(original: string, rewrite: string) {
  const tokenize = (text: string) => text.match(/\s+|[\p{L}\p{N}_]+(?:['’][\p{L}\p{N}_]+)*|[^\s]/gu) ?? [];
  const sourceParts = tokenize(original), resultParts = tokenize(rewrite);
  const source = sourceParts.filter(part => !/^\s+$/.test(part));
  const result = resultParts.filter(part => !/^\s+$/.test(part));
  const sourceSame = new Set<number>(), resultSame = new Set<number>();
  const matches: [number, number][] = [];
  const match = (a: number, b: number) => { sourceSame.add(a); resultSame.add(b); matches.push([a, b]); };
  const n = source.length, m = result.length;
  // Bound work for unusually large live results; mark the changed middle region.
  if (n * m > 1_000_000) {
    let first = 0;
    while (first < Math.min(n, m) && source[first] === result[first]) {
      match(first, first); first++;
    }
    let a = n - 1, b = m - 1;
    while (a >= first && b >= first && source[a] === result[b]) {
      match(a--, b--);
    }
  } else {
    const rows = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let a = n - 1; a >= 0; a--) {
      for (let b = m - 1; b >= 0; b--) {
        rows[a][b] = source[a] === result[b] ? rows[a + 1][b + 1] + 1 : Math.max(rows[a + 1][b], rows[a][b + 1]);
      }
    }
    let a = 0, b = 0;
    while (a < n && b < m) {
      if (source[a] === result[b]) { match(a++, b++); }
      else if (rows[a + 1][b] >= rows[a][b + 1]) a++;
      else b++;
    }
  }
  function decorate(parts: string[], same: Set<number>): DiffPart[] {
    let index = 0;
    const decorated: DiffPart[] = [];
    for (const text of parts) {
      const changed = /^\s+$/.test(text) ? false : !same.has(index++);
      const previous = decorated.at(-1);
      if (previous?.changed === changed) previous.text += text;
      else decorated.push({ text, changed });
    }
    return decorated;
  }
  return { operations: editOperations(sourceParts, resultParts, matches), original: decorate(sourceParts, sourceSame), rewrite: decorate(resultParts, resultSame), coarse: n * m > 1_000_000 };
}

/** Build the edit playback from the same word matches as the comparison. */
function editOperations(source: string[], result: string[], matches: [number, number][]): EditOperation[] {
  const indices = (parts: string[]) => parts.flatMap((text, index) => /^\s+$/.test(text) ? [] : [index]);
  const aIndices = indices(source), bIndices = indices(result);
  const operations: EditOperation[] = [];
  const append = (kind: EditOperation['kind'], text: string) => {
    if (!text) return;
    const last = operations.at(-1);
    if (last?.kind === kind) last.text += text;
    else operations.push({ kind, text });
  };
  let a = 0, b = 0;
  for (const [ai, bi] of [...matches.sort((x, y) => x[0] - y[0]), [aIndices.length, bIndices.length]]) {
    const endA = aIndices[ai] ?? source.length, endB = bIndices[bi] ?? result.length;
    const left = source.slice(a, endA).join(''), right = result.slice(b, endB).join('');
    if (left === right) append('equal', left);
    else { append('delete', left); append('insert', right); }
    if (endA < source.length) append('equal', source[endA]);
    a = endA + 1; b = endB + 1;
  }
  return operations;
}
