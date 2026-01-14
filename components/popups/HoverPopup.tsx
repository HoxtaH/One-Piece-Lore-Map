'use client'

import { motion } from 'framer-motion'
import { LocationSummary } from '@/lib/types/location'
import Image from 'next/image'
import { useMemo } from 'react'

interface HoverPopupProps {
  location: LocationSummary
  position: { x: number; y: number }
}

export default function HoverPopup({ location, position }: HoverPopupProps) {
  // Randomly select 3 quick facts to display
  const selectedFacts = useMemo(() => {
    const shuffled = [...location.quickFacts].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [location.quickFacts])

  // Calculate popup position to avoid screen edges
  const popupWidth = 350
  const popupHeight = 400
  const offset = 20

  let x = position.x + offset
  let y = position.y + offset

  // Adjust if too close to right edge
  if (x + popupWidth > window.innerWidth) {
    x = position.x - popupWidth - offset
  }

  // Adjust if too close to bottom edge
  if (y + popupHeight > window.innerHeight) {
    y = position.y - popupHeight - offset
  }

  // Get YouTube thumbnail (try maxresdefault first, fallback to hqdefault)
  const thumbnailUrl = location.featuredVideo
    ? `https://img.youtube.com/vi/${location.featuredVideo.youtubeId}/hqdefault.jpg`
    : null
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        width: popupWidth,
      }}
    >
      <div className="parchment-bg rounded-lg shadow-2xl overflow-hidden border-4 border-[#654321] vintage-shadow">
        {/* Featured Image/Video Thumbnail with Sepia */}
        {thumbnailUrl && (
          <div className="relative h-40 w-full overflow-hidden border-b-4 border-[#654321]">
            <Image
              src={thumbnailUrl}
              alt={location.name}
              fill
              className="object-cover sepia-filter"
              unoptimized
              onError={(e) => {
                // Fallback to maxresdefault if hqdefault fails
                const target = e.target as HTMLImageElement
                if (target.src.includes('hqdefault')) {
                  target.src = target.src.replace('hqdefault.jpg', 'maxresdefault.jpg')
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1810]/90 to-transparent" />
            
            {/* Decorative corner stamps */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-[#8B4513] bg-[#D4C4A8]/80 flex items-center justify-center">
              <span className="text-[#8B4513] text-xs font-bold">⚓</span>
            </div>
          </div>
        )}

        {/* Content with Vintage Styling */}
        <div className="p-4 bg-[#E8DCC4]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="pirate-font text-2xl text-[#2D1810] leading-tight">
                {location.name}
              </h3>
              <p className="ornate-font text-sm font-semibold text-[#8B4513] mt-1">
                {location.region}
              </p>
            </div>
            <div
              className="w-4 h-4 rounded-full border-2 border-[#654321] flex-shrink-0"
              style={{ backgroundColor: location.colorScheme.primary }}
            />
          </div>

          {/* Decorative divider */}
          <div className="border-t-2 border-[#8B4513] mb-3 opacity-30" style={{
            borderStyle: 'dashed'
          }} />

          {/* Quick Facts with Vintage Bullets */}
          <div className="space-y-2 mb-4">
            {selectedFacts.map((fact, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#8B4513] text-xs mt-0.5 flex-shrink-0">✦</span>
                <p className="old-book-font text-sm text-[#2D1810] leading-snug">{fact}</p>
              </div>
            ))}
          </div>

          {/* Call to Action - Vintage Button */}
          <div className="text-center py-2 px-4 rounded-md border-2 border-[#8B4513] bg-[#D4C4A8] shadow-md">
            <p className="ornate-font font-bold text-sm text-[#2D1810]">
              ⚓ Click to explore {location.name} ⚓
            </p>
          </div>
        </div>

        {/* Torn edge effect at bottom */}
        <div className="h-2 bg-[#C4B5A0] border-t-2 border-[#8B4513]" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 5px, #A0896C 5px, #A0896C 10px)'
        }} />
      </div>
    </motion.div>
  )
}


