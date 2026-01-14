// Contribution types for the community contribution system

export type ContributionType = 'new_location' | 'edit_location' | 'lore_correction';
export type ContributionStatus = 'pending' | 'approved' | 'rejected';

export interface ContributorInfo {
  name: string;
  email: string;
  discordHandle?: string;
}

export interface ContributionEconomy {
  industries?: string[];
  currency?: string;
  tradeGoods?: string[];
}

export interface ContributionFood {
  cuisine?: string[];
  traditions?: string[];
  quirks?: string[];
}

export interface ContributionPerson {
  name: string;
  role: string;
  description: string;
}

export interface ContributionVideo {
  youtubeId: string;
  title: string;
  type: 'fight' | 'comedy' | 'lore' | 'scenic';
  description?: string;
  featured?: boolean;
}

export interface ContributionCoordinates {
  x: number;
  y: number;
}

export interface ContributionColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ContributionFormData {
  // Type
  type: ContributionType;
  
  // Contributor
  contributor: ContributorInfo;
  
  // Location basics
  locationSlug?: string;  // For edits
  locationName: string;
  region?: string;
  description: string;
  
  // Lore
  history?: string;
  culture?: string;
  economy?: ContributionEconomy;
  transportation?: string;
  food?: ContributionFood;
  quickFacts?: string[];
  
  // People & Media
  notablePeople?: ContributionPerson[];
  videos?: ContributionVideo[];
  
  // Visuals
  coordinates?: ContributionCoordinates;
  colorScheme?: ContributionColorScheme;
}

export interface ContributionResponse {
  success: boolean;
  message: string;
  contributionId?: string;
  verificationSent?: boolean;
}

// Form step configuration
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  required: boolean;
}

export const CONTRIBUTION_STEPS: FormStep[] = [
  {
    id: 'type',
    title: 'Contribution Type',
    description: 'What would you like to contribute?',
    fields: ['type'],
    required: true,
  },
  {
    id: 'basics',
    title: 'Location Basics',
    description: 'Tell us about this location',
    fields: ['locationName', 'region', 'description'],
    required: true,
  },
  {
    id: 'lore',
    title: 'Lore & Details',
    description: 'Share the history and culture',
    fields: ['history', 'culture', 'economy', 'transportation', 'food'],
    required: false,
  },
  {
    id: 'people',
    title: 'Notable Characters',
    description: 'Who are the important people here?',
    fields: ['notablePeople'],
    required: false,
  },
  {
    id: 'media',
    title: 'Videos & Quick Facts',
    description: 'Add YouTube videos and fun facts',
    fields: ['videos', 'quickFacts'],
    required: false,
  },
  {
    id: 'contributor',
    title: 'Your Information',
    description: 'So we can credit you!',
    fields: ['contributor'],
    required: true,
  },
];

export const REGIONS = [
  'East Blue',
  'West Blue',
  'North Blue',
  'South Blue',
  'Paradise (First Half of Grand Line)',
  'New World (Second Half of Grand Line)',
  'Red Line',
  'Calm Belt',
  'Sky Island',
  'Unknown',
] as const;

export const VIDEO_TYPES = [
  { value: 'fight', label: '⚔️ Battle/Fight' },
  { value: 'comedy', label: '😄 Comedy' },
  { value: 'lore', label: '📚 Lore/History' },
  { value: 'scenic', label: '🏝️ Scenic' },
] as const;
