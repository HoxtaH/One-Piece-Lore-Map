'use client';

import { useState, useEffect } from 'react';
import { MOCK_NEWS } from '@/lib/types/news';

interface NewsCooIconProps {
  onClick: () => void;
}

export default function NewsCooIcon({ onClick }: NewsCooIconProps) {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Check localStorage for last read timestamp
    const lastRead = localStorage.getItem('news-last-read');
    const lastReadTime = lastRead ? new Date(lastRead) : new Date(0);
    
    // Check if there's any news newer than last read
    const unreadNews = MOCK_NEWS.some(article => article.publishedAt > lastReadTime);
    setHasUnread(unreadNews);
  }, []);

  const handleClick = () => {
    // Mark all news as read
    localStorage.setItem('news-last-read', new Date().toISOString());
    setHasUnread(false);
    onClick();
  };

  return (
    <div className="fixed top-6 right-6 z-[997]">
      <button
        onClick={handleClick}
        className="news-coo-button group relative"
        aria-label="Open News Panel"
      >
        {/* News Coo Image */}
        <div className="relative transition-transform group-hover:scale-110 group-hover:-translate-y-2 duration-300">
          <img
            src="/images/newsCoo.png"
            alt="News Coo"
            className="w-24 h-24 drop-shadow-2xl animate-bounce-slow"
            style={{ 
              imageRendering: 'pixelated',
              filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.6))'
            }}
          />
          
          {/* Unread Badge */}
          {hasUnread && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full border-4 border-white animate-pulse flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs">!</span>
            </div>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-[#2D1810] text-[#E8DCC4] px-4 py-2 rounded-lg shadow-xl border-2 border-[#8B4513] whitespace-nowrap">
            <p className="font-bold text-sm" style={{ fontFamily: 'Special Elite' }}>
              📰 Big News! Click for latest updates
            </p>
          </div>
        </div>
      </button>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
