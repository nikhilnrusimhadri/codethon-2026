import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ level: string }> },
) {
  try {
    const { level: levelParam } = await params;
    const level = Number(levelParam);

    if (!Number.isInteger(level) || level < 1 || level > 4) {
      return new NextResponse('Invalid level', {
        status: 400,
      });
    }

    const result = await db.resultPdf.findUnique({
      where: {
        level,
      },
    });

    if (!result || !result.published) {
      return new NextResponse('Results not available', {
        status: 404,
      });
    }

    const blob = await get(result.fileUrl, {
      access: 'private',
      useCache: false,
    });

    if (!blob || blob.statusCode !== 200) {
      return new NextResponse('Result PDF not found', {
        status: 404,
      });
    }

    return new NextResponse(blob.stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${result.fileName.replace(/"/g, '')}"`,
        'Cache-Control': 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Public result PDF error:', error);

    return new NextResponse('Unable to load results', {
      status: 500,
    });
  }
}