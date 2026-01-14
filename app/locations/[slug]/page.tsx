import LocationExploration from '@/components/exploration/LocationExploration'
import LocationNotFound from '@/components/exploration/LocationNotFound'
import { getLocationBySlug } from '@/lib/data/locationService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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


