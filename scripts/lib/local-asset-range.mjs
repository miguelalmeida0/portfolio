/** Match Pages byte-range responses when the local Workers Assets binding ignores Range. */
export async function localAssetRange(request, response) {
  const range = request.headers.get('range');
  if (!['GET', 'HEAD'].includes(request.method) || response.status !== 200) return response;
  const encoding = response.headers.get('content-encoding');
  if (encoding && encoding !== 'identity') return response;
  if (!range || request.method === 'HEAD') {
    const headers = new Headers(response.headers);
    headers.set('accept-ranges', 'bytes');
    return new Response(response.body, {status:response.status, headers});
  }
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return response;
  const ifRange = request.headers.get('if-range');
  if (ifRange && ifRange !== response.headers.get('etag') && ifRange !== response.headers.get('last-modified')) return response;
  const body = await response.arrayBuffer();
  const size = body.byteLength;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] ? (match[2] ? Math.min(Number(match[2]), size - 1) : size - 1) : size - 1;
  const headers = new Headers(response.headers);
  headers.set('accept-ranges', 'bytes');
  headers.delete('content-encoding');
  if (start >= size || end < start) {
    headers.set('content-range', `bytes */${size}`);
    headers.set('content-length', '0');
    return new Response(null, {status:416, headers});
  }
  headers.set('content-range', `bytes ${start}-${end}/${size}`);
  headers.set('content-length', String(end - start + 1));
  return new Response(body.slice(start, end + 1), {status:206, headers});
}
