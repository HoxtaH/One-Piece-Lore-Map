// API route for community contributions
// POST - Submit a new contribution (sends verification email)
// GET - List contributions (for admin)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { 
  sendVerificationEmail, 
  generateVerificationToken, 
  getTokenExpiration 
} from '@/lib/services/email';
import type { ContributionFormData } from '@/lib/types/contribution';

export async function POST(request: NextRequest) {
  try {
    const data: ContributionFormData = await request.json();

    // Validate required fields
    if (!data.contributor?.email || !data.contributor?.name) {
      return NextResponse.json(
        { success: false, message: 'Email and name are required' },
        { status: 400 }
      );
    }

    if (!data.locationName || !data.description) {
      return NextResponse.json(
        { success: false, message: 'Location name and description are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contributor.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = getTokenExpiration();

    // Store the contribution data temporarily with the verification token
    await prisma.emailVerification.create({
      data: {
        email: data.contributor.email,
        token,
        expiresAt,
        contributionData: {
          type: data.type,
          contributorName: data.contributor.name,
          contributorEmail: data.contributor.email,
          discordHandle: data.contributor.discordHandle,
          locationSlug: data.locationSlug,
          locationName: data.locationName,
          region: data.region,
          description: data.description,
          history: data.history,
          culture: data.culture,
          economy: data.economy,
          transportation: data.transportation,
          food: data.food,
          quickFacts: data.quickFacts || [],
          notablePeople: data.notablePeople,
          videos: data.videos,
          coordinates: data.coordinates,
          colorScheme: data.colorScheme,
        },
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail({
      to: data.contributor.email,
      contributorName: data.contributor.name,
      locationName: data.locationName,
      token,
    });

    if (!emailResult.success) {
      // Clean up the verification record if email fails
      await prisma.emailVerification.delete({ where: { token } });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send verification email. Please try again.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to verify your contribution!',
      verificationSent: true,
    });

  } catch (error) {
    console.error('Contribution submission error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = status ? { status, emailVerified: true } : { emailVerified: true };

    const [contributions, total] = await Promise.all([
      prisma.contribution.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.contribution.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      contributions,
      total,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Contribution list error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}
