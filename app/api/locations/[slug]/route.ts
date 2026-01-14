import { NextResponse } from 'next/server'
import { getLocationBySlug } from '@/lib/data/locationService'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const location = await getLocationBySlug(params.slug)

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(location)
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    )
  }
}


