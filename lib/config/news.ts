import { NewsSourceType } from '@/lib/types/news';

// News feed configuration
export const NEWS_CONFIG = {
  // RSS feed sources
  feeds: [
    {
      name: 'The Library of Ohara',
      url: 'https://thelibraryofohara.com/feed/',
      source: 'Library of Ohara',
      type: 'analysis' as NewsSourceType,
    },
    {
      name: 'The One Piece Podcast',
      url: 'https://onepiecepodcast.com/feed/',
      source: 'OP Podcast',
      type: 'community' as NewsSourceType,
    },
    {
      name: 'Reddit r/OnePiece',
      url: 'https://www.reddit.com/r/OnePiece/new.rss',
      source: 'Reddit',
      type: 'community' as NewsSourceType,
    },
    {
      name: 'Crunchyroll News',
      url: 'https://www.crunchyroll.com/rss/news',
      source: 'Crunchyroll',
      type: 'official' as NewsSourceType,
    },
  ],

  // Keyword filter (case-insensitive)
  keywords: [
    'One Piece',
    'Eiichiro Oda',
    'Luffy',
    'Zoro',
    'Sanji',
    'Egghead',
    'Elbaf',
    'Elbaph',
    'Final Saga',
    'Vegapunk',
    'Bonney',
    'Kuma',
    'Imu',
    'Gorosei',
    'Dragon',
    'Shanks',
    'Blackbeard',
    'Cross Guild',
    'Wit Studio',
    'Netflix',
    'Live Action',
  ],

  // Cache duration in seconds (60 minutes)
  cacheDuration: 3600,

  // Max articles to return
  maxArticles: 20,

  // Timeout for RSS fetch (ms)
  fetchTimeout: 10000,
};

// Allow environment overrides
export function getNewsConfig() {
  return {
    ...NEWS_CONFIG,
    cacheDuration: process.env.NEWS_CACHE_DURATION
      ? parseInt(process.env.NEWS_CACHE_DURATION, 10)
      : NEWS_CONFIG.cacheDuration,
    maxArticles: process.env.NEWS_MAX_ARTICLES
      ? parseInt(process.env.NEWS_MAX_ARTICLES, 10)
      : NEWS_CONFIG.maxArticles,
    keywords: process.env.NEWS_KEYWORDS
      ? process.env.NEWS_KEYWORDS.split('|')
      : NEWS_CONFIG.keywords,
  };
}
