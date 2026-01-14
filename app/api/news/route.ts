import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/services/newsFeed';
import { getNewsConfig } from '@/lib/config/news';

export const revalidate = 3600; // Cache for 60 minutes

export async function GET() {
  try {
    const stories = await fetchNews();

    return NextResponse.json(
      { 
        success: true,
        data: stories,
        timestamp: new Date().toISOString(),
        count: stories.length,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${getNewsConfig().cacheDuration}, stale-while-revalidate`,
        },
      }
    );
  } catch (error) {
    console.error('[API /news] Error fetching news:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        data: [],
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
