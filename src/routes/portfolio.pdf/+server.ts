import { createPortfolioPdf } from '$lib/server/pdf';

export const GET = async () => {
  const pdf = createPortfolioPdf();
  const bytes = Buffer.from(pdf);
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

  return new Response(body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="miguel-almeida-cv.pdf"',
      'cache-control': 'no-cache'
    }
  });
};
