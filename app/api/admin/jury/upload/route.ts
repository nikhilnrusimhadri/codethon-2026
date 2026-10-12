import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const fd = await req.formData();
    const file = fd.get('photo');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: 'Jury photo is required.' },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Jury photo must be 5 MB or smaller.' },
        { status: 400 },
      );
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: 'Jury photo must be JPG, PNG or WebP.' },
        { status: 400 },
      );
    }

    const ext =
      file.type === 'image/png'
        ? '.png'
        : file.type === 'image/webp'
          ? '.webp'
          : '.jpg';

    const blobPath = `jury-photos/${randomUUID()}${ext}`;

    const blob = await put(blobPath, file, {
      access: 'private',
      addRandomSuffix: false,
      contentType: file.type,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error: any) {
    console.error('Jury photo upload error:', error);

    return NextResponse.json(
      {
        error:
          error?.message === 'UNAUTHORIZED'
            ? 'Unauthorized'
            : 'Unable to upload jury photo.',
      },
      {
        status: error?.message === 'UNAUTHORIZED' ? 401 : 500,
      },
    );
  }
}