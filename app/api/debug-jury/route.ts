import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jury = await db.juryMember.findMany({
      select: {
        id: true,
        name: true,
        isPublished: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({
      count: jury.length,
      jury,
    });
  } catch (error) {
    console.error('Debug jury error:', error);

    return NextResponse.json(
      {
        error: 'Database query failed',
      },
      { status: 500 },
    );
  }
}