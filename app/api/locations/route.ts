import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getAllLocations } from '@/lib/data/locationService'

// Cache locations for 1 hour (ISR) - locations rarely change
export const revalidate = 3600

export async function GET() {
  try {
    const locations = await getAllLocations()
    return NextResponse.json(locations, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
    
    // Capture to Sentry for production monitoring
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/locations',
        method: 'GET',
      },
    })
    
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}


