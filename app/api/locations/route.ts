import { NextResponse } from 'next/server'
import { getAllLocations } from '@/lib/data/locationService'

// Force dynamic route - prevent caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const locations = await getAllLocations()
    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}


