import HomeClient from '@/components/home/HomeClient'
import { getAllLocations } from '@/lib/data/locationService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const locations = await getAllLocations()
  return <HomeClient locations={locations || []} />
}


