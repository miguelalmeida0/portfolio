import { createPortfolioPdf } from '$lib/server/pdf';

export const GET = async () => {
  const pdf = createPortfolioPdf();
  const bytes = Buffer.from(pdf);
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

  return new Response(body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="miguel-almeida-portfolio.pdf"',
      'cache-control': 'public, max-age=3600'
    }
  });
};
