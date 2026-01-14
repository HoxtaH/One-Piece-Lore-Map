export type NewsCategory = 'manga' | 'anime' | 'live-action' | 'world-event' | 'community' | 'game';
export type NewsSourceType = 'official' | 'community' | 'analysis';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  source: string;
  sourceType: NewsSourceType;
  url: string;
  publishedAt: Date;
  imageUrl?: string;
  isTrending?: boolean;
  isBreaking?: boolean;
  isSpoiler?: boolean;
}

// RSS feed story shape (normalized from external feeds)
export interface NewsStory {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceType: NewsSourceType;
  publishedAt: Date;
  summary: string;
  thumbnail?: string;
  isSpoiler?: boolean;
}

// Mock news data for initial implementation
export const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Lulusia Kingdom Raises Straw Hat Flag in Protest!',
    summary: 'Citizens rally against World Government policies by displaying the Straw Hat Pirates\' Jolly Roger. Revolutionary fervor spreads across the globe as more nations show support for the ideals of freedom.',
    category: 'world-event',
    source: 'World Economic Journal',
    sourceType: 'official',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isTrending: true,
    isBreaking: true,
  },
  {
    id: '2',
    title: 'Netflix Announces One Piece Live Action Season 2 Production',
    summary: 'Filming begins in Cape Town as the Straw Hats prepare to enter Alabasta. New cast members revealed for fan-favorite characters including Portgas D. Ace and Crocodile.',
    category: 'live-action',
    source: 'Entertainment Daily',
    sourceType: 'official',
    url: 'https://www.netflix.com/title/80217863',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    imageUrl: '/images/news/live-action-s2.jpg',
    isTrending: true,
  },
  {
    id: '3',
    title: 'Chapter 1132: Shocking Revelations About the Ancient Weapons!',
    summary: 'Warning: Major spoilers ahead! Latest chapter reveals new information about Pluton\'s location and its connection to Wano Country. Fans are going wild with theories.',
    category: 'manga',
    source: 'Shueisha Weekly Shonen Jump',
    sourceType: 'official',
    url: '#',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isTrending: true,
    isSpoiler: true,
  },
  {
    id: '4',
    title: 'One Piece Episode 1090 Preview: Gear 5 Animation Reaches New Heights',
    summary: 'Toei Animation showcases incredible sakuga sequences in upcoming episode. Director confirms this will be "the most expressive Luffy has ever been" in the anime adaptation.',
    category: 'anime',
    source: 'Toei Animation',
    sourceType: 'official',
    url: '#',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    imageUrl: '/images/news/gear5-anime.jpg',
  },
  {
    id: '5',
    title: 'One Piece Odyssey DLC: New Island Arc Announced!',
    summary: 'Bandai Namco reveals expansion featuring original story arc set in an uncharted Grand Line island. New playable characters and Devil Fruit abilities coming this winter.',
    category: 'game',
    source: 'Bandai Namco Entertainment',
    sourceType: 'official',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '6',
    title: 'Global One Piece Day Celebrations Draw Record Crowds',
    summary: 'Events across Japan, USA, and Europe celebrate Oda\'s masterpiece with exhibitions, cosplay contests, and exclusive merchandise. Over 100,000 fans attend worldwide.',
    category: 'community',
    source: 'One Piece Official',
    sourceType: 'official',
    url: '#',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    imageUrl: '/images/news/op-day.jpg',
  },
  {
    id: '7',
    title: 'Eiichiro Oda Confirms One Piece Entering "Final Saga"',
    summary: 'Creator reiterates that the series is indeed approaching its conclusion, though "final" could still mean many years of amazing content. Fans celebrate 25+ years of adventure.',
    category: 'manga',
    source: 'Jump Festa 2024',
    sourceType: 'official',
    url: '#',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
];
