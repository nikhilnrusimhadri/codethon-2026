import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pathname = url.searchParams.get('pathname');

    if (!pathname) {
      return new NextResponse('Bad request', { status: 400 });
    }

    if (
      pathname.includes('..') ||
      pathname.includes('\\') ||
      !pathname.startsWith('jury-photos/')
    ) {
      return new NextResponse('Bad request', { status: 400 });
    }

    const result = await get(pathname, {
      access: 'private',
      useCache: false,
    });

    if (!result || result.statusCode !== 200) {
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type':
          result.blob.contentType || 'application/octet-stream',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Jury photo error:', error);

    return new NextResponse('Not found', {
      status: 404,
    });
  }
}