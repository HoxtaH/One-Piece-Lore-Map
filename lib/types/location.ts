export interface Coordinates {
  x: number;
  y: number;
}

export interface Economy {
  industries: string[];
  currency: string;
  tradeGoods: string[];
}

export interface Food {
  cuisine: string[];
  traditions: string[];
  quirks: string[];
}

export type CharacterType = 'protagonist' | 'antagonist' | 'citizen' | 'historical' | 'neutral';

export interface NotablePerson {
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
  faction?: string;           // NEW: Which group/organization they belong to
  type?: CharacterType;       // NEW: Character classification
  tags?: string[];            // NEW: Searchable tags like "Devil Fruit User", "Marine", etc.
  avatar?: string;            // NEW: Path to character avatar image
}

export interface StoryArcs {
  mangaChapters: string;
  animeEpisodes: string;
  events: string[];
}

export interface SubLocation {
  name: string;
  type: string;              // e.g., "grove", "region", "district", "island"
  description: string;
  notableFeatures?: string[];
  coordinates?: Coordinates;  // Optional: for mini-map positioning
  image?: string;            // Optional: Image path for the sub-location
}

export interface Item {
  name: string;
  category: string;          // e.g., "Combat Dial", "Legendary Sword", "Technology"
  description: string;
  icon?: string;             // Emoji or icon identifier
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface Faction {
  name: string;
  type: string;              // e.g., "Criminal Organization", "Revolutionary", "Marine Unit"
  leader?: string;           // Name of the faction leader
  members: string[];         // Array of character names
  description: string;
  alignment?: 'ally' | 'enemy' | 'neutral';
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Video {
  id: string;
  locationId: string;
  youtubeId: string;
  title: string;
  type: 'fight' | 'comedy' | 'lore' | 'scenic';
  description?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

// Simplified video type for JSON data (before database transformation)
export interface VideoData {
  youtubeId: string;
  title: string;
  type: 'fight' | 'comedy' | 'lore' | 'scenic';
  description?: string;
  featured: boolean;
  order: number;
}

export interface Music {
  url: string;
  title: string;
  volume?: number;
}

export type Saga = 
  | 'East Blue'
  | 'Alabasta' 
  | 'Sky Island'
  | 'Water 7'
  | 'Thriller Bark'
  | 'Summit War'
  | 'Fish-Man Island'
  | 'Dressrosa'
  | 'Whole Cake Island'
  | 'Wano Country'
  | 'Final Saga';

export interface Location {
  id: string;
  slug: string;
  name: string;
  region: string;
  aliases: string[];
  coordinates: Coordinates | Coordinates[];  // Support single or multiple hotspot zones
  pathControl?: Coordinates;  // Optional: Control point for curved ship routes
  description: string;
  history: string;
  culture: string;
  economy: Economy;
  transportation: string;
  food: Food;
  notablePeople: NotablePerson[];
  subLocations?: SubLocation[];    // NEW: Regions, groves, districts within the location
  items?: Item[];                  // NEW: Special items, artifacts, technologies
  factions?: Faction[];            // NEW: Groups and organizations at this location
  storyArcs: StoryArcs;
  videos: Video[] | VideoData[];   // Can be either database Videos or JSON VideoData
  images: string[];
  colorScheme: ColorScheme;
  quickFacts: string[];
  music?: Music;                   // NEW: Background music for the location
  banner?: string;                 // NEW: Custom banner image (fallback to featured video thumbnail)
  journeyOrder?: number;           // NEW: Order in Straw Hats' journey (1 = first location, 2 = second, etc.)
  saga?: Saga;                     // NEW: Which saga this location belongs to
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationSummary {
  id: string;
  slug: string;
  name: string;
  region: string;
  coordinates: Coordinates | Coordinates[];  // Support single or multiple hotspot zones
  pathControl?: Coordinates;  // Optional: Control point for curved ship routes
  quickFacts: string[];
  colorScheme: ColorScheme;
  featuredVideo?: Video | VideoData;  // Can be either database Video or JSON VideoData
  journeyOrder?: number;
  saga?: Saga;
}


