// Email verification endpoint
// GET - Verify a contribution via token from email link

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/contribute?error=missing_token', request.url)
      );
    }

    // Find the verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification) {
      return NextResponse.redirect(
        new URL('/contribute?error=invalid_token', request.url)
      );
    }

    // Check if already used
    if (verification.used) {
      return NextResponse.redirect(
        new URL('/contribute?error=already_verified', request.url)
      );
    }

    // Check if expired
    if (new Date() > verification.expiresAt) {
      return NextResponse.redirect(
        new URL('/contribute?error=expired_token', request.url)
      );
    }

    // Extract contribution data
    const contributionData = verification.contributionData as Record<string, unknown>;

    // Create the actual contribution
    await prisma.contribution.create({
      data: {
        type: contributionData.type as string,
        status: 'pending',
        contributorName: contributionData.contributorName as string,
        contributorEmail: contributionData.contributorEmail as string,
        emailVerified: true,
        discordHandle: contributionData.discordHandle as string | undefined,
        locationSlug: contributionData.locationSlug as string | undefined,
        locationName: contributionData.locationName as string,
        region: contributionData.region as string | undefined,
        description: contributionData.description as string,
        history: contributionData.history as string | undefined,
        culture: contributionData.culture as string | undefined,
        economy: contributionData.economy as object | undefined,
        transportation: contributionData.transportation as string | undefined,
        food: contributionData.food as object | undefined,
        quickFacts: (contributionData.quickFacts as string[]) || [],
        notablePeople: contributionData.notablePeople as object | undefined,
        videos: contributionData.videos as object | undefined,
        coordinates: contributionData.coordinates as object | undefined,
        colorScheme: contributionData.colorScheme as object | undefined,
      },
    });

    // Mark verification as used
    await prisma.emailVerification.update({
      where: { token },
      data: { used: true },
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/contribute?success=true', request.url)
    );

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(
      new URL('/contribute?error=server_error', request.url)
    );
  }
}
