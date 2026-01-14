import Parser from 'rss-parser';
import { NewsStory, NewsSourceType } from '@/lib/types/news';
import { getNewsConfig } from '@/lib/config/news';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'WanPisuMappu/1.0',
  },
});

/**
 * Extract the first image URL from HTML content
 */
function extractImageFromContent(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return imgMatch ? imgMatch[1] : undefined;
}

/**
 * Check if the content is likely a spoiler
 */
function isSpoiler(title: string, summary: string): boolean {
  const content = (title + ' ' + summary).toLowerCase();
  return content.includes('spoiler') || /chapter\s+\d+/.test(content);
}

/**
 * Fetch and parse a single RSS feed
 */
async function fetchFeed(url: string, sourceName: string, sourceType: NewsSourceType): Promise<NewsStory[]> {
  try {
    const feed = await parser.parseURL(url);
    const stories: NewsStory[] = [];

    for (const item of feed.items || []) {
      if (!item.title || !item.link) continue;

      const content = item.content || item['content:encoded'] || item.summary || '';
      const thumbnail = item.enclosure?.url || extractImageFromContent(content);

      const story: NewsStory = {
        id: item.guid || item.link || `${sourceName}-${Date.now()}`,
        title: item.title,
        link: item.link,
        source: sourceName,
        sourceType,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        summary: item.contentSnippet || item.content || item.summary || '',
        thumbnail: thumbnail,
        isSpoiler: isSpoiler(item.title, content),
      };

      stories.push(story);
    }

    return stories;
  } catch (error) {
    console.error(`[NewsFeed] Error fetching ${sourceName}:`, error);
    return [];
  }
}

/**
 * Filter stories by keyword matching
 */
function filterByKeywords(stories: NewsStory[], keywords: string[]): NewsStory[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase());

  return stories.filter(story => {
    const searchText = `${story.title} ${story.summary}`.toLowerCase();
    return lowerKeywords.some(keyword => searchText.includes(keyword));
  });
}

/**
 * Deduplicate stories by link
 */
function deduplicateStories(stories: NewsStory[]): NewsStory[] {
  const seen = new Set<string>();
  const unique: NewsStory[] = [];

  for (const story of stories) {
    if (!seen.has(story.link)) {
      seen.add(story.link);
      unique.push(story);
    }
  }

  return unique;
}

/**
 * Fetch all configured RSS feeds, filter, and merge
 */
export async function fetchNews(): Promise<NewsStory[]> {
  const config = getNewsConfig();
  
  // Fetch all feeds in parallel
  const feedPromises = config.feeds.map(feed =>
    fetchFeed(feed.url, feed.source, feed.type as NewsSourceType)
  );

  const results = await Promise.allSettled(feedPromises);
  
  // Collect all stories from successful fetches
  const allStories: NewsStory[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allStories.push(...result.value);
    } else {
      console.error(`[NewsFeed] Failed to fetch ${config.feeds[index].name}:`, result.reason);
    }
  });

  // Filter by keywords
  const filtered = filterByKeywords(allStories, config.keywords);

  // Deduplicate
  const unique = deduplicateStories(filtered);

  // Sort by publish date (newest first)
  unique.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  // Limit to max articles
  return unique.slice(0, config.maxArticles);
}
