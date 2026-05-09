'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, NewsCategory, NewsStory, MOCK_NEWS, NewsSourceType } from '@/lib/types/news';
import { X, Search, Eye, EyeOff } from 'lucide-react';

interface NewsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsPanel({ isOpen, onClose }: NewsPanelProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filter, setFilter] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/news');
        const result = await response.json();

        if (!result.success || !response.ok) {
          throw new Error(result.error || 'Failed to fetch news');
        }

        // Convert RSS stories to NewsArticle format
        const articles: NewsArticle[] = result.data.map((story: NewsStory) => ({
          id: story.id,
          title: story.title,
          summary: story.summary.slice(0, 300) + (story.summary.length > 300 ? '...' : ''),
          category: (story.sourceType === 'analysis') ? 'manga'
                   : (story.sourceType === 'community') ? 'community'
                   : 'world-event',
          source: story.source,
          sourceType: story.sourceType,
          url: story.link,
          publishedAt: new Date(story.publishedAt),
          imageUrl: story.thumbnail,
          isTrending: false,
          isBreaking: false,
          isSpoiler: story.isSpoiler,
        }));

        setNews(articles);
      } catch (err) {
        console.error('[NewsPanel] Error loading news:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
        // Fallback to mock data on error
        setNews(MOCK_NEWS);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      loadNews();
    }
  }, [isOpen]);

  const filteredNews = news.filter(article => {
    const matchesCategory = filter === 'all' || article.category === filter;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category: NewsCategory) => {
    const icons: Record<NewsCategory, string> = {
      'manga': '📖',
      'anime': '📺',
      'live-action': '🎬',
      'world-event': '🌍',
      'community': '👥',
      'game': '🎮',
    };
    return icons[category];
  };

  const getCategoryLabel = (category: NewsCategory) => {
    const labels: Record<NewsCategory, string> = {
      'manga': 'Manga',
      'anime': 'Anime',
      'live-action': 'Live Action',
      'world-event': 'World Events',
      'community': 'Community',
      'game': 'Games',
    };
    return labels[category];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[998]"
        onClick={onClose}
      />

      {/* News Panel */}
      <div className="fixed top-0 left-0 right-0 bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[999] w-full md:w-[90vw] md:max-w-4xl h-full md:max-h-[85vh] overflow-hidden">
        <div className="news-panel-container bg-[#E8DCC4] border-4 md:border-8 border-[#654321] shadow-2xl h-full flex flex-col" style={{ imageRendering: 'pixelated' }}>
          {/* Header */}
          <div className="news-header bg-[#2D1810] text-[#E8DCC4] p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold mb-1 md:mb-2" style={{ fontFamily: 'Pirata One' }}>
                  📰 BIG NEWS!
                </h1>
                <p className="text-sm md:text-lg opacity-90" style={{ fontFamily: 'Special Elite' }}>
                  World Economic Journal - Published by &quot;Big News&quot; Morgans
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#E8DCC4] hover:text-white transition-colors p-2"
                aria-label="Close news panel"
              >
                <X className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="bg-[#D4C5A0] border-b-4 border-[#8B4513] p-2 md:p-4 overflow-x-auto flex flex-nowrap gap-2 no-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md font-bold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#654321] text-[#E8DCC4] shadow-lg'
                  : 'bg-[#E8DCC4] text-[#2D1810] hover:bg-[#D4C5A0] border-2 border-[#8B4513]'
              }`}
              style={{ fontFamily: 'Special Elite' }}
            >
              All News
            </button>
            {(['manga', 'anime', 'live-action', 'world-event', 'game', 'community'] as NewsCategory[]).map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md font-bold transition-all whitespace-nowrap ${
                  filter === category
                    ? 'bg-[#654321] text-[#E8DCC4] shadow-lg'
                    : 'bg-[#E8DCC4] text-[#2D1810] hover:bg-[#D4C5A0] border-2 border-[#8B4513]'
                }`}
                style={{ fontFamily: 'Special Elite' }}
              >
                {getCategoryIcon(category)} {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* Search Bar & Spoiler Toggle */}
          <div className="bg-[#D4C5A0] px-4 pb-4 border-b-4 border-[#8B4513] flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for news..."
                className="w-full bg-[#F5EFE0] border-2 border-[#8B4513] rounded-md py-2 pl-10 pr-4 text-[#2D1810] placeholder-[#654321]/50 focus:outline-none focus:ring-2 focus:ring-[#654321]"
                style={{ fontFamily: 'Special Elite' }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#654321]/70" size={20} />
            </div>
            <button
              onClick={() => setShowSpoilers(!showSpoilers)}
              className={`px-3 rounded-md border-2 border-[#8B4513] flex items-center gap-2 font-bold transition-all ${
                showSpoilers 
                  ? 'bg-red-600 text-white shadow-inner' 
                  : 'bg-[#E8DCC4] text-[#654321] hover:bg-[#D4C5A0]'
              }`}
              title={showSpoilers ? "Spoilers Visible" : "Spoilers Hidden"}
            >
              {showSpoilers ? <Eye size={20} /> : <EyeOff size={20} />}
              <span className="hidden sm:inline" style={{ fontFamily: 'Special Elite' }}>
                {showSpoilers ? 'Spoilers On' : 'Spoilers Off'}
              </span>
            </button>
          </div>

          {/* News Feed */}
          <div className="news-feed overflow-y-auto flex-1 p-3 md:p-6 space-y-4 bg-[#F5EFE0]/30">
            {isLoading && (
              <div className="text-center py-12">
                <p className="text-3xl text-[#654321] mb-4" style={{ fontFamily: 'Pirata One' }}>
                  📰 Morgans is gathering the latest news...
                </p>
                <div className="animate-pulse flex justify-center gap-2">
                  <div className="w-3 h-3 bg-[#654321] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#654321] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#654321] rounded-full"></div>
                </div>
              </div>
            )}

            {error && !isLoading && (
              <div className="text-center py-12 bg-red-100 border-4 border-red-600 rounded p-6">
                <p className="text-2xl text-red-800 font-bold mb-2" style={{ fontFamily: 'Pirata One' }}>
                  ⚠️ News Coo Got Lost!
                </p>
                <p className="text-red-700" style={{ fontFamily: 'Special Elite' }}>
                  {error}
                </p>
                <p className="text-sm text-red-600 mt-4" style={{ fontFamily: 'Special Elite' }}>
                  Showing backup stories instead...
                </p>
              </div>
            )}

            {!isLoading && filteredNews.map(article => (
              <div
                key={article.id}
                className="news-article bg-[#F5EFE0] border-4 border-[#8B4513] p-6 relative hover:shadow-lg transition-shadow"
                style={{ imageRendering: 'auto' }}
              >
                {/* Breaking/Trending Badges */}
                {article.isBreaking && (
                  <div className="absolute -top-3 -left-2 bg-red-600 text-white px-4 py-1 font-bold transform -rotate-3 shadow-md z-10" style={{ fontFamily: 'Pirata One', fontSize: '14px' }}>
                    🔥 BREAKING
                  </div>
                )}
                {article.isTrending && !article.isBreaking && (
                  <div className="absolute -top-3 -right-2 bg-orange-500 text-white px-4 py-1 font-bold transform rotate-3 shadow-md z-10" style={{ fontFamily: 'Pirata One', fontSize: '14px' }}>
                    📈 TRENDING
                  </div>
                )}

                {/* Category Badge */}
                {/* Content Container (Blur for Spoilers) */}
                <div className={`transition-all duration-300 ${article.isSpoiler && !showSpoilers ? 'blur-md select-none opacity-50 hover:blur-0 hover:opacity-100' : ''}`}>
                  
                  {/* Category Badge & Source Badge */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="bg-[#654321] text-[#E8DCC4] px-3 py-1 rounded text-sm font-bold" style={{ fontFamily: 'Special Elite' }}>
                      {getCategoryIcon(article.category)} {getCategoryLabel(article.category).toUpperCase()}
                    </span>
                    
                    {/* Source Type Badge */}
                    {article.sourceType === 'official' && (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Official</span>
                    )}
                    {article.sourceType === 'community' && (
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Community</span>
                    )}
                    {article.sourceType === 'analysis' && (
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Analysis</span>
                    )}

                    <span className="text-sm text-[#654321]/70 ml-auto" style={{ fontFamily: 'Special Elite' }}>
                      🕒 {getRelativeTime(article.publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#2D1810] mb-3" style={{ fontFamily: 'Pirata One' }}>
                    {article.isSpoiler && !showSpoilers ? 'Unknown Chapter Event...' : article.title}
                  </h3>

                  {/* Image (if any) */}
                  {article.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden border-2 border-[#8B4513]/50">
                       <img src={article.imageUrl} alt="News thumbnail" className="w-full h-48 object-cover" />
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-[#2D1810] mb-4 leading-relaxed" style={{ fontFamily: 'Special Elite' }}>
                    {article.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t-2 border-[#D4C5A0]">
                    <span className="text-sm text-[#654321]/80 italic order-2 sm:order-1" style={{ fontFamily: 'Special Elite' }}>
                      Source: {article.source}
                    </span>
                    {article.url !== '#' && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#8B4513] text-[#E8DCC4] px-4 py-2 rounded font-bold hover:bg-[#654321] transition-colors text-center order-1 sm:order-2"
                        style={{ fontFamily: 'Special Elite' }}
                      >
                        Read More →
                      </a>
                    )}
                  </div>
                </div>

                {/* Spoiler Warning Overlay (only if blurred) */}
                {article.isSpoiler && !showSpoilers && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="bg-red-600/90 text-white px-6 py-3 rounded-lg transform -rotate-6 shadow-xl border-4 border-white backdrop-blur-sm">
                      <p className="font-bold text-xl" style={{ fontFamily: 'Pirata One' }}>⚠️ SPOILER WARNING</p>
                      <p className="text-sm text-center opacity-90">Hover to reveal</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {!isLoading && filteredNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-2xl text-[#654321]" style={{ fontFamily: 'Pirata One' }}>
                  No news in this category yet!
                </p>
                <p className="text-[#8B4513] mt-2" style={{ fontFamily: 'Special Elite' }}>
                  Morgans is working on it... 🦅
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
