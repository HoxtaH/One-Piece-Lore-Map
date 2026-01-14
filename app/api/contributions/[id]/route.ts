// Get or update a single contribution
// GET - Get contribution details
// PATCH - Update contribution status (admin)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const contribution = await prisma.contribution.findUnique({
      where: { id },
    });

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: 'Contribution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contribution,
    });

  } catch (error) {
    console.error('Get contribution error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contribution' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Only allow certain fields to be updated
    const allowedUpdates = ['status', 'reviewerNotes', 'reviewedBy'];
    const updates: Record<string, unknown> = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // If status is being changed, add review timestamp
    if (updates.status && ['approved', 'rejected'].includes(updates.status as string)) {
      updates.reviewedAt = new Date();
    }

    const contribution = await prisma.contribution.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({
      success: true,
      contribution,
    });

  } catch (error) {
    console.error('Update contribution error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update contribution' },
      { status: 500 }
    );
  }
}
