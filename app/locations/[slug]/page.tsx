import LocationExploration from '@/components/exploration/LocationExploration'
import LocationNotFound from '@/components/exploration/LocationNotFound'
import { getLocationBySlug, getAllLocations } from '@/lib/data/locationService'

// Use ISR: revalidate every 1 hour - pre-render all location pages at build time
export const revalidate = 3600

export async function generateStaticParams() {
  // Pre-render all location pages at build time for fast static serving
  const locations = await getAllLocations()
  return locations.map(location => ({ slug: location.slug }))
}

interface PageProps {
  params: {
    slug: string
  }
}

export default async function LocationPage({ params }: PageProps) {
  const location = await getLocationBySlug(params.slug)

  if (!location) {
    return <LocationNotFound />
  }

  return <LocationExploration location={location} />
}


