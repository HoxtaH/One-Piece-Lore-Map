import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db/prisma';
import { Location, LocationSummary } from '@/lib/types/location';

const DATA_SOURCE = process.env.DATA_SOURCE || 'database';

// Read location from JSON file
function readLocationFromJSON(slug: string): Location | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'locations', `${slug}.json`);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);
    
    // Transform to match Location type
    return {
      id: data.slug,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error reading ${slug}.json:`, error);
    return null;
  }
}

// Read all locations from JSON files
function readAllLocationsFromJSON(): LocationSummary[] {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'locations');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    
    return files.map(file => {
      const filePath = path.join(dataDir, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileData);
      
      return {
        id: data.slug,
        slug: data.slug,
        name: data.name,
        region: data.region,
        coordinates: data.coordinates,
        pathControl: data.pathControl,  // Include pathControl for curved routes
        quickFacts: data.quickFacts,
        colorScheme: data.colorScheme,
        featuredVideo: data.videos?.find((v: any) => v.featured) || data.videos?.[0] || null,
        journeyOrder: data.journeyOrder,
        saga: data.saga,
      };
    });
  } catch (error) {
    console.error('Error reading JSON files:', error);
    return [];
  }
}

// Get all location summaries
export async function getAllLocations(): Promise<LocationSummary[]> {
  if (DATA_SOURCE === 'local') {
    console.log('📁 [LOCAL MODE] Reading locations from JSON files');
    return readAllLocationsFromJSON();
  }
  
  console.log('🗄️  [DATABASE MODE] Reading locations from Supabase');
  const locations = await prisma.location.findMany({
    include: {
      videos: {
        where: { featured: true },
        take: 1,
        orderBy: { order: 'asc' },
      },
    },
  });

  return locations.map((location) => ({
    id: location.id,
    slug: location.slug,
    name: location.name,
    region: location.region,
    coordinates: location.coordinates as any,
    pathControl: (location as any).pathControl,  // Include pathControl for curved routes
    quickFacts: location.quickFacts,
    colorScheme: location.colorScheme as any,
    featuredVideo: location.videos[0] as any || null,
    journeyOrder: (location as any).journeyOrder,
    saga: (location as any).saga,
  }));
}

// Get single location by slug
export async function getLocationBySlug(slug: string): Promise<Location | null> {
  if (DATA_SOURCE === 'local') {
    console.log(`📁 [LOCAL MODE] Reading ${slug} from JSON file`);
    return readLocationFromJSON(slug);
  }
  
  console.log(`🗄️  [DATABASE MODE] Reading ${slug} from Supabase`);
  const location = await prisma.location.findUnique({
    where: { slug },
    include: {
      videos: { orderBy: { order: 'asc' } },
    },
  });

  return location as any;
}

