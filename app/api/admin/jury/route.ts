import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const items = await db.juryMember.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      jury: items,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const b = await req.json();

    const photoUrl =
      typeof b.photoUrl === 'string' &&
      b.photoUrl.startsWith('jury-photos/')
        ? b.photoUrl
        : null;

    const member = await db.juryMember.create({
      data: {
        name: b.name,
        designation: b.designation,
        organization: b.organization || null,
        department: b.department || null,
        bio: b.bio || null,
        photoUrl,
        displayOrder: Number(b.displayOrder || 0),
        isPublished: Boolean(b.isPublished),
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Create jury member error:', error);

    return NextResponse.json(
      { error: 'Invalid jury member' },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();

    const b = await req.json();

    const photoUrl =
      typeof b.photoUrl === 'string' &&
      b.photoUrl.startsWith('jury-photos/')
        ? b.photoUrl
        : null;

    const member = await db.juryMember.update({
      where: {
        id: b.id,
      },
      data: {
        name: b.name,
        designation: b.designation,
        organization: b.organization || null,
        department: b.department || null,
        bio: b.bio || null,
        photoUrl,
        displayOrder: Number(b.displayOrder || 0),
        isPublished: Boolean(b.isPublished),
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Update jury member error:', error);

    return NextResponse.json(
      { error: 'Update failed' },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const id = new URL(req.url).searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id' },
        { status: 400 },
      );
    }

    await db.juryMember.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error('Delete jury member error:', error);

    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 400 },
    );
  }
}