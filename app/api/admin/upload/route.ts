import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const pathname = url.searchParams.get('pathname');

    if (!pathname) {
      return new NextResponse('Bad request', { status: 400 });
    }

    if (
      pathname.includes('..') ||
      pathname.includes('\\') ||
      !pathname.startsWith('college-ids/')
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
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e: any) {
    console.error('College ID viewer error:', e);

    return new NextResponse(
      e?.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Not found',
      {
        status: e?.message === 'UNAUTHORIZED' ? 401 : 404,
      },
    );
  }
}