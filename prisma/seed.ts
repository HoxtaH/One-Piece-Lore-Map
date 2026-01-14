import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface LocationSeedData {
  slug: string;
  name: string;
  region: string;
  aliases: string[];
  coordinates: { x: number; y: number };
  description: string;
  history: string;
  culture: string;
  economy: {
    industries: string[];
    currency: string;
    tradeGoods: string[];
  };
  transportation: string;
  food: {
    cuisine: string[];
    traditions: string[];
    quirks: string[];
  };
  notablePeople: Array<{
    name: string;
    role: string;
    description: string;
    imageUrl?: string;
  }>;
  storyArcs: {
    mangaChapters: string;
    animeEpisodes: string;
    events: string[];
  };
  images: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  quickFacts: string[];
  videos: Array<{
    youtubeId: string;
    title: string;
    type: string;
    description?: string;
    featured: boolean;
    order: number;
  }>;
}

async function main() {
  console.log('Starting database seed...');

  // Read all location JSON files
  const dataDir = path.join(process.cwd(), 'data', 'locations');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data: LocationSeedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`Seeding location: ${data.name}`);

    // Check if location already exists
    const existing = await prisma.location.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      console.log(`  Location ${data.name} already exists, updating...`);
      
      // Delete existing videos
      await prisma.video.deleteMany({
        where: { locationId: existing.id },
      });

      // Update location
      await prisma.location.update({
        where: { slug: data.slug },
        data: {
          name: data.name,
          region: data.region,
          aliases: data.aliases,
          coordinates: data.coordinates,
          description: data.description,
          history: data.history,
          culture: data.culture,
          economy: data.economy,
          transportation: data.transportation,
          food: data.food,
          notablePeople: data.notablePeople,
          storyArcs: data.storyArcs,
          images: data.images,
          colorScheme: data.colorScheme,
          quickFacts: data.quickFacts,
          videos: {
            create: data.videos.map(video => ({
              youtubeId: video.youtubeId,
              title: video.title,
              type: video.type,
              description: video.description,
              featured: video.featured,
              order: video.order,
            })),
          },
        },
      });
    } else {
      // Create new location
      await prisma.location.create({
        data: {
          slug: data.slug,
          name: data.name,
          region: data.region,
          aliases: data.aliases,
          coordinates: data.coordinates,
          description: data.description,
          history: data.history,
          culture: data.culture,
          economy: data.economy,
          transportation: data.transportation,
          food: data.food,
          notablePeople: data.notablePeople,
          storyArcs: data.storyArcs,
          images: data.images,
          colorScheme: data.colorScheme,
          quickFacts: data.quickFacts,
          videos: {
            create: data.videos.map(video => ({
              youtubeId: video.youtubeId,
              title: video.title,
              type: video.type,
              description: video.description,
              featured: video.featured,
              order: video.order,
            })),
          },
        },
      });
    }

    console.log(`  ✓ ${data.name} seeded successfully`);
  }

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


