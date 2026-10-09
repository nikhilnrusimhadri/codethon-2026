import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const LEVEL_TITLES: Record<number, string> = {
  1: 'Level 1 Results — Conditions & Loops',
  2: 'Level 2 Results — Arrays & Strings',
  3: 'Level 3 Results — Advanced Arrays & Strings',
  4: 'Level 4 Results — Data Structures & Algorithms',
};

function isValidLevel(level: number) {
  return Number.isInteger(level) && level >= 1 && level <= 4;
}

// Get all result PDFs
export async function GET() {
  try {
    await requireAdmin();

    const results = await db.resultPdf.findMany({
      orderBy: {
        level: 'asc',
      },
    });

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message === 'UNAUTHORIZED'
            ? 'Unauthorized'
            : 'Failed to load result PDFs',
      },
      {
        status: error?.message === 'UNAUTHORIZED' ? 401 : 500,
      },
    );
  }
}

// Upload or replace a result PDF
export async function POST(req: Request) {
  try {
    await requireAdmin();

    const formData = await req.formData();

    const levelValue = String(formData.get('level') || '');
    const level = Number(levelValue);

    if (!isValidLevel(level)) {
      return NextResponse.json(
        { error: 'Level must be between 1 and 4.' },
        { status: 400 },
      );
    }

    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: 'Please select a PDF file.' },
        { status: 400 },
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'PDF must be 10 MB or smaller.' },
        { status: 400 },
      );
    }

    const existing = await db.resultPdf.findUnique({
      where: { level },
    });

    const fileId = randomUUID();

    const blob = await put(
      `result-pdfs/level-${level}-${fileId}.pdf`,
      file,
      {
        access: 'private',
        addRandomSuffix: false,
        contentType: 'application/pdf',
      },
    );

    const result = existing
      ? await db.resultPdf.update({
          where: { level },
          data: {
            fileUrl: blob.pathname,
            fileName: file.name,
            title: LEVEL_TITLES[level],
            published: false,
          },
        })
      : await db.resultPdf.create({
          data: {
            level,
            title: LEVEL_TITLES[level],
            fileUrl: blob.pathname,
            fileName: file.name,
            published: false,
          },
        });

    await db.auditLog.create({
      data: {
        action: existing
          ? 'RESULT_PDF_REPLACED'
          : 'RESULT_PDF_UPLOADED',
        entity: 'ResultPdf',
        entityId: result.id,
        metadata: JSON.stringify({
          level,
          fileName: file.name,
        }),
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Result PDF upload error:', error);

    return NextResponse.json(
      {
        error:
          error?.message === 'UNAUTHORIZED'
            ? 'Unauthorized'
            : 'Failed to upload result PDF',
      },
      {
        status: error?.message === 'UNAUTHORIZED' ? 401 : 500,
      },
    );
  }
}

// Publish / unpublish a result PDF
export async function PATCH(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();

    const level = Number(body.level);

    if (!isValidLevel(level)) {
      return NextResponse.json(
        { error: 'Level must be between 1 and 4.' },
        { status: 400 },
      );
    }

    if (typeof body.published !== 'boolean') {
      return NextResponse.json(
        { error: 'Published must be true or false.' },
        { status: 400 },
      );
    }

    const existing = await db.resultPdf.findUnique({
      where: { level },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'No result PDF exists for this level.' },
        { status: 404 },
      );
    }

    const result = await db.resultPdf.update({
      where: { level },
      data: {
        published: body.published,
      },
    });

    await db.auditLog.create({
      data: {
        action: body.published
          ? 'RESULT_PDF_PUBLISHED'
          : 'RESULT_PDF_UNPUBLISHED',
        entity: 'ResultPdf',
        entityId: result.id,
        metadata: JSON.stringify({
          level,
        }),
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Result PDF publish error:', error);

    return NextResponse.json(
      {
        error:
          error?.message === 'UNAUTHORIZED'
            ? 'Unauthorized'
            : 'Failed to update result PDF',
      },
      {
        status: error?.message === 'UNAUTHORIZED' ? 401 : 500,
      },
    );
  }
}