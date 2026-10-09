import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const participant = await db.participant.findUnique({
      where: { id },
      include: {
        teamMembership: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(participant);
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      {
        status: e?.message === 'UNAUTHORIZED' ? 401 : 500,
      },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    const allowedVerificationStatuses = [
      'PENDING',
      'VERIFIED',
      'REJECTED',
    ];

    if (
      body.verificationStatus &&
      !allowedVerificationStatuses.includes(
        body.verificationStatus,
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 },
      );
    }

    // Make sure the participant exists before updating.
    const existing = await db.participant.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 },
      );
    }

    const data: Record<string, unknown> = {};

    if (body.verificationStatus) {
      data.verificationStatus =
        body.verificationStatus;
    }

    if (body.rejectionReason !== undefined) {
      data.rejectionReason =
        body.rejectionReason || null;
    }

    if (body.round1Status) {
      data.round1Status = body.round1Status;
    }

    if (body.round2Status) {
      data.round2Status = body.round2Status;
    }

    if (body.round1Score !== undefined) {
      data.round1Score =
        body.round1Score === null
          ? null
          : Number(body.round1Score);
    }

    if (body.round2Score !== undefined) {
      data.round2Score =
        body.round2Score === null
          ? null
          : Number(body.round2Score);
    }

    // Update participant.
    const participant = await db.participant.update({
      where: { id },
      data,
    });

    // Record the admin update.
    await db.auditLog.create({
      data: {
        action: 'PARTICIPANT_UPDATED',
        entity: 'Participant',
        entityId: id,
        metadata: JSON.stringify(body),
      },
    });

    return NextResponse.json(participant);
  } catch (e: any) {
    return NextResponse.json(
      {
        error:
          e?.message === 'UNAUTHORIZED'
            ? 'Unauthorized'
            : 'Update failed',
      },
      {
        status:
          e?.message === 'UNAUTHORIZED'
            ? 401
            : 500,
      },
    );
  }
}