import HomeClient from '@/components/home/HomeClient'
import { getAllLocations } from '@/lib/data/locationService'

// Use ISR: revalidate every 1 hour since locations rarely change
export const revalidate = 3600

export default async function Home() {
  const locations = await getAllLocations()
  return <HomeClient locations={locations || []} />
}


