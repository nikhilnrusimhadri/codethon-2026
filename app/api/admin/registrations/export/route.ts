import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function clean(value: unknown) {
  return String(value ?? '—');
}

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const q = searchParams.get('q') || '';
    const branch = searchParams.get('branch') || undefined;
    const status = searchParams.get('status') || undefined;

    const where: any = {
      ...(branch ? { branch } : {}),
      ...(status ? { verificationStatus: status } : {}),
      ...(q
        ? {
            OR: [
              {
                fullName: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
              {
                rollNumber: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
              {
                collegeEmail: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
              {
                registrationId: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const participants = await db.participant.findMany({
      where,
      orderBy: {
        registeredAt: 'desc',
      },
      select: {
        registrationId: true,
        fullName: true,
        rollNumber: true,
        collegeEmail: true,
        phoneNumber: true,
        branch: true,
        section: true,
        year: true,
        tShirtSize: true,
        verificationStatus: true,
        registeredAt: true,
      },
    });

    const pdf = await PDFDocument.create();

    const regularFont = await pdf.embedFont(
      StandardFonts.Helvetica,
    );

    const boldFont = await pdf.embedFont(
      StandardFonts.HelveticaBold,
    );

    const pageWidth = 842;
    const pageHeight = 595;

    const margin = 28;

    const titleColor = rgb(0.08, 0.85, 0.95);
    const mutedColor = rgb(0.45, 0.48, 0.55);
    const textColor = rgb(0.12, 0.13, 0.16);
    const borderColor = rgb(0.82, 0.84, 0.88);

    let page = pdf.addPage([
      pageWidth,
      pageHeight,
    ]);

    let y = pageHeight - margin;

    function drawHeader() {
      page.drawText('CODE THON 2k26', {
        x: margin,
        y,
        size: 20,
        font: boldFont,
        color: titleColor,
      });

      page.drawText(
        'MOTHER TERESA INSTITUTE OF SCIENCE AND TECHNOLOGY',
        {
          x: margin,
          y: y - 23,
          size: 8,
          font: boldFont,
          color: textColor,
        },
      );

      page.drawText('REGISTERED PARTICIPANTS', {
        x: pageWidth - margin - 170,
        y,
        size: 11,
        font: boldFont,
        color: textColor,
      });

      page.drawText(
        `Generated: ${formatDate(new Date())}`,
        {
          x: pageWidth - margin - 170,
          y: y - 18,
          size: 7,
          font: regularFont,
          color: mutedColor,
        },
      );

      page.drawLine({
        start: {
          x: margin,
          y: y - 35,
        },
        end: {
          x: pageWidth - margin,
          y: y - 35,
        },
        thickness: 1,
        color: borderColor,
      });

      y -= 55;
    }

    drawHeader();

    page.drawText(
      `Total participants: ${participants.length}`,
      {
        x: margin,
        y,
        size: 9,
        font: boldFont,
        color: textColor,
      },
    );

    const filters = [];

    if (q) filters.push(`Search: ${q}`);
    if (branch) filters.push(`Branch: ${branch}`);
    if (status) filters.push(`Status: ${status}`);

    if (filters.length > 0) {
      page.drawText(filters.join('  |  '), {
        x: margin,
        y: y - 15,
        size: 7,
        font: regularFont,
        color: mutedColor,
      });

      y -= 30;
    } else {
      y -= 18;
    }

    const columns = [
      {
        key: 'registrationId',
        label: 'Registration ID',
        width: 75,
      },
      {
        key: 'fullName',
        label: 'Name',
        width: 100,
      },
      {
        key: 'rollNumber',
        label: 'Roll No.',
        width: 68,
      },
      {
        key: 'collegeEmail',
        label: 'Email',
        width: 145,
      },
      {
        key: 'phoneNumber',
        label: 'Phone',
        width: 72,
      },
      {
        key: 'branch',
        label: 'Branch',
        width: 65,
      },
      {
        key: 'section',
        label: 'Section',
        width: 48,
      },
      {
        key: 'tShirtSize',
        label: 'T-Shirt',
        width: 48,
      },
      {
        key: 'verificationStatus',
        label: 'Status',
        width: 78,
      },
    ];

    const tableWidth = columns.reduce(
      (sum, column) => sum + column.width,
      0,
    );

    function drawTableHeader() {
      const headerHeight = 24;

      page.drawRectangle({
        x: margin,
        y: y - headerHeight + 4,
        width: tableWidth,
        height: headerHeight,
        color: rgb(0.93, 0.94, 0.96),
      });

      let x = margin;

      for (const column of columns) {
        page.drawText(column.label, {
          x: x + 4,
          y: y - 12,
          size: 6.5,
          font: boldFont,
          color: textColor,
        });

        x += column.width;
      }

      y -= headerHeight;
    }

    function truncate(
      value: string,
      maxLength: number,
    ) {
      if (value.length <= maxLength) return value;

      return (
        value.slice(0, Math.max(0, maxLength - 3)) +
        '...'
      );
    }

    function valueFor(
      participant: (typeof participants)[number],
      key: string,
    ) {
      switch (key) {
        case 'registrationId':
          return clean(participant.registrationId);

        case 'fullName':
          return clean(participant.fullName);

        case 'rollNumber':
          return clean(participant.rollNumber);

        case 'collegeEmail':
          return clean(participant.collegeEmail);

        case 'phoneNumber':
          return clean(participant.phoneNumber);

        case 'branch':
          return clean(participant.branch);

        case 'section':
          return clean(participant.section);

        case 'tShirtSize':
          return clean(participant.tShirtSize);

        case 'verificationStatus':
          return clean(participant.verificationStatus);

        default:
          return '—';
      }
    }

    drawTableHeader();

    const rowHeight = 22;

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      if (y < margin + 35) {
        page.drawText(
          `CODE THON 2k26 • Participants • Page`,
          {
            x: margin,
            y: margin - 5,
            size: 7,
            font: regularFont,
            color: mutedColor,
          },
        );

        page = pdf.addPage([
          pageWidth,
          pageHeight,
        ]);

        y = pageHeight - margin;

        drawHeader();

        drawTableHeader();
      }

      if (i % 2 === 1) {
        page.drawRectangle({
          x: margin,
          y: y - rowHeight + 5,
          width: tableWidth,
          height: rowHeight,
          color: rgb(0.97, 0.97, 0.98),
        });
      }

      let x = margin;

      for (const column of columns) {
        const rawValue = valueFor(
          participant,
          column.key,
        );

        const maxChars =
          column.width <= 50
            ? 8
            : column.width <= 75
              ? 11
              : column.width <= 105
                ? 16
                : 27;

        const value = truncate(
          rawValue,
          maxChars,
        );

        page.drawText(value, {
          x: x + 4,
          y: y - 12,
          size: 6.3,
          font: regularFont,
          color: textColor,
        });

        x += column.width;
      }

      page.drawLine({
        start: {
          x: margin,
          y: y - rowHeight + 5,
        },
        end: {
          x: margin + tableWidth,
          y: y - rowHeight + 5,
        },
        thickness: 0.4,
        color: borderColor,
      });

      y -= rowHeight;
    }

    if (participants.length === 0) {
      page.drawText(
        'No participants match the selected filters.',
        {
          x: margin + 5,
          y: y - 20,
          size: 9,
          font: regularFont,
          color: mutedColor,
        },
      );
    }

    page.drawText(
      'College ID documents are intentionally excluded from this export.',
      {
        x: margin,
        y: margin - 5,
        size: 6.5,
        font: regularFont,
        color: mutedColor,
      },
    );

    const pages = pdf.getPages();

    pages.forEach((pdfPage, index) => {
      pdfPage.drawText(
        `Page ${index + 1} of ${pages.length}`,
        {
          x: pageWidth - margin - 70,
          y: margin - 5,
          size: 6.5,
          font: regularFont,
          color: mutedColor,
        },
      );
    });

    const pdfBytes = await pdf.save();

const filename = `codethon-2k26-participants-${new Date()
  .toISOString()
  .slice(0, 10)}.pdf`;

return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error: any) {
    console.error(
      'Participant PDF export error:',
      error,
    );

    return NextResponse.json(
      {
        error:
          error?.message === 'UNAUTHORIZED'
            ? 'Unauthorized'
            : 'Unable to generate participant PDF',
      },
      {
        status:
          error?.message === 'UNAUTHORIZED'
            ? 401
            : 500,
      },
    );
  }
}