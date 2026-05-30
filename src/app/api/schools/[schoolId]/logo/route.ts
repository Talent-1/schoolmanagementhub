import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/schools/[schoolId]/logo
 * Update school logo URL
 * 
 * Request body: { logoUrl: string }
 * Response: { id, name, logoUrl, ... }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    const { schoolId } = params;
    const { logoUrl } = await request.json();

    if (!logoUrl) {
      return NextResponse.json(
        { error: 'logoUrl is required' },
        { status: 400 }
      );
    }

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: { logoUrl },
    });

    return NextResponse.json(school);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
