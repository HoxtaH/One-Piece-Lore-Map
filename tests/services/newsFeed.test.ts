import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchNews } from '@/lib/services/newsFeed';
import * as newsConfig from '@/lib/config/news';

const { mockParseURL } = vi.hoisted(() => ({
  mockParseURL: vi.fn(),
}));

vi.mock('rss-parser', () => ({
  default: vi.fn(function() {
    return { parseURL: mockParseURL };
  })
}));

describe('newsFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(newsConfig, 'getNewsConfig').mockReturnValue({
      feeds: [
        { name: 'Feed 1', url: 'http://test1.com', source: 'TestSource', type: 'official' },
      ],
      keywords: ['one piece', 'luffy'],
      maxArticles: 10,
    } as any);
  });

  it('fetches, parses, filters, deduplicates, and sorts news', async () => {
    mockParseURL.mockResolvedValue({
      items: [
        {
          guid: '1',
          title: 'One Piece Chapter 1000',
          link: 'http://link1.com',
          pubDate: '2023-01-02T00:00:00Z',
          contentSnippet: 'Luffy fights Kaido',
        },
        {
          guid: '2',
          title: 'Irrelevant News',
          link: 'http://link2.com',
          pubDate: '2023-01-03T00:00:00Z',
          contentSnippet: 'Nothing to see here',
        },
        {
          guid: '3',
          title: 'Duplicate One Piece News',
          link: 'http://link1.com', // Duplicate link
          pubDate: '2023-01-01T00:00:00Z',
          contentSnippet: 'Luffy fights Kaido again',
        }
      ]
    });

    const news = await fetchNews();

    expect(mockParseURL).toHaveBeenCalledWith('http://test1.com');
    // It should filter out "Irrelevant News" because it lacks "one piece" or "luffy"
    // It should deduplicate the 3rd item because it has the same link as the 1st
    expect(news).toHaveLength(1);
    expect(news[0].title).toBe('One Piece Chapter 1000');
    expect(news[0].isSpoiler).toBe(true); // matches 'chapter \d+' regex
  });

  it('handles feed fetch errors gracefully', async () => {
    mockParseURL.mockRejectedValue(new Error('Network error'));
    
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const news = await fetchNews();
    
    expect(news).toEqual([]);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
