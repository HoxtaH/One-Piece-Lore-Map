'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Location, NotablePerson } from '@/lib/types/location'
import { motion } from 'framer-motion'
import ReactPlayer from 'react-player/youtube'
import { useLocationAudio } from '@/lib/hooks/useLocationAudio'
import CharacterGrid from '@/components/characters/CharacterGrid'
import CharacterModal from '@/components/characters/CharacterModal'
import { getAssetUrl } from '@/lib/utils/assets'

interface LocationExplorationProps {
  location: Location
}

type Tab = 'overview' | 'world' | 'economy' | 'people' | 'places' | 'items' | 'timeline'

export default function LocationExploration({ location }: LocationExplorationProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [selectedCharacter, setSelectedCharacter] = useState<NotablePerson | null>(null)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const colorScheme = location.colorScheme as { primary: string; secondary: string; accent: string }
  // Enable location-specific audio
  useLocationAudio({
    musicUrl: location.music?.url,
    musicTitle: location.music?.title,
  })

  const featuredVideo = location.videos.find(v => v.featured) || location.videos[0]
  
  // Use custom banner if available, otherwise fallback to featured video thumbnail
  const bannerImage = location.banner 
    ? getAssetUrl(location.banner)
    : featuredVideo 
      ? `https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg`
      : null

  const tabs: { id: Tab; label: string; icon?: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📖' },
    { id: 'world', label: 'World & Culture', icon: '🌏' },
    { id: 'economy', label: 'Economy & Trade', icon: '💰' },
    { id: 'people', label: 'People', icon: '👥' },
    { id: 'places', label: 'Places', icon: '🗺️' },
    { id: 'items', label: 'Items', icon: '⚔️' },
    { id: 'timeline', label: 'Story Timeline', icon: '📅' },
  ]

  // Filter tabs based on available data
  const availableTabs = tabs.filter(tab => {
    if (tab.id === 'places') return (location as any).subLocations?.length > 0
    if (tab.id === 'items') return (location as any).items?.length > 0
    return true
  })

  return (
    <div className="min-h-screen parchment-bg parchment-texture">
      {/* Hero Section - Wanted Poster Style */}
      <div className="relative overflow-hidden">
        {/* Banner Image with Sepia Filter */}
        {bannerImage && (
          <div className="relative h-[50vh]">
            <img
              src={bannerImage}
              alt={location.name}
              className="w-full h-full object-cover sepia-filter"
            />
            {/* Vintage vignette overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
          </div>
        )}

        {/* Ornate Title Section */}
        <div className="relative bg-gradient-to-b from-[#3E2723] to-[#5C4033] border-t-8 border-b-8 border-[#2D1810] py-8">
          <div className="absolute inset-0 opacity-10 bg-repeat" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='%23000' opacity='0.5'/%3E%3C/svg%3E")`,
                 backgroundSize: '30px 30px'
               }} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-7xl mx-auto px-8"
          >
            <div className="text-center">
              <h1 className="pirate-font text-7xl font-bold mb-2 text-[#F5E6D3] drop-shadow-lg">
                {location.name}
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <p className="ornate-font text-3xl font-semibold text-[#D4AF37]">
                  {location.region}
                </p>
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
              <p className="old-book-font text-xl text-[#E8DCC4] max-w-4xl mx-auto leading-relaxed">
                {location.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back Button - Vintage Style */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 px-6 py-3 bg-[#3E2723] hover:bg-[#2D1810] text-[#F5E6D3] ornate-font font-semibold rounded border-2 border-[#654321] vintage-shadow transition z-20"
        >
          ← Return to Map
        </button>
      </div>

      {/* Tab Navigation - Vintage Tabs */}
      <div className="sticky top-0 z-20 bg-[#D4C4A8] border-b-4 border-[#654321] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-wrap gap-1 sm:gap-2 py-2 justify-center">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 ornate-font font-semibold transition-all whitespace-nowrap rounded-t-lg border-2 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-[#F5E6D3] text-[#2D1810] border-[#8B4513] border-b-0 transform -translate-y-1 shadow-lg'
                    : 'bg-[#C4B5A0] text-[#5C4033] border-[#A0896C] hover:bg-[#D4C4A8]'
                }`}
              >
                {tab.icon && <span className="text-base sm:text-lg">{tab.icon}</span>}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon ? '' : tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <Section title="History" color={colorScheme.primary}>
              <p className="old-book-font text-[#2D1810] leading-relaxed text-lg">
                {location.history}
              </p>
            </Section>

            <Section title="Quick Facts" color={colorScheme.primary}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {location.quickFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-[#E8DCC4] rounded border-2 border-[#A0896C] hover:border-[#8B4513] transition vintage-shadow"
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 border-2 border-[#8B4513]"
                      style={{ backgroundColor: colorScheme.accent }}
                    />
                    <p className="old-book-font text-[#2D1810]">{fact}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Summary Stats - Wanted Poster Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-[#F5E6D3] rounded-lg border-4 border-[#654321] text-center vintage-shadow">
                <p className="pirate-font text-5xl font-bold" style={{ color: colorScheme.primary }}>
                  {location.notablePeople.length}
                </p>
                <p className="ornate-font text-sm text-[#5C4033] mt-2 font-semibold">Characters</p>
              </div>
              
              {(location as any).subLocations && (
                <div className="p-6 bg-[#F5E6D3] rounded-lg border-4 border-[#654321] text-center vintage-shadow">
                  <p className="pirate-font text-5xl font-bold" style={{ color: colorScheme.primary }}>
                    {(location as any).subLocations.length}
                  </p>
                  <p className="ornate-font text-sm text-[#5C4033] mt-2 font-semibold">Locations</p>
                </div>
              )}
              
              {(location as any).items && (
                <div className="p-6 bg-[#F5E6D3] rounded-lg border-4 border-[#654321] text-center vintage-shadow">
                  <p className="pirate-font text-5xl font-bold" style={{ color: colorScheme.primary }}>
                    {(location as any).items.length}
                  </p>
                  <p className="ornate-font text-sm text-[#5C4033] mt-2 font-semibold">Items</p>
                </div>
              )}
              
              {(location as any).factions && (
                <div className="p-6 bg-[#F5E6D3] rounded-lg border-4 border-[#654321] text-center vintage-shadow">
                  <p className="pirate-font text-5xl font-bold" style={{ color: colorScheme.primary }}>
                    {(location as any).factions.length}
                  </p>
                  <p className="ornate-font text-sm text-[#5C4033] mt-2 font-semibold">Factions</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'world' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <Section title="🌏 Cultural Overview" color={colorScheme.primary}>
              <p className="old-book-font text-[#2D1810] leading-relaxed text-lg">
                {location.culture}
              </p>
            </Section>

            <Section title="🍜 Food & Cuisine" color={colorScheme.primary}>
              <div className="space-y-6">
                <div>
                  <h4 className="ornate-font text-xl font-semibold text-[#2D1810] mb-3">
                    Traditional Dishes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(location.food as any).cuisine.map((dish: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#E8DCC4] text-[#2D1810] rounded-full border-2 border-[#8B4513] hover:bg-[#D4C4A8] transition old-book-font"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="ornate-font text-xl font-semibold text-[#2D1810] mb-3">
                    Food Traditions
                  </h4>
                  <ul className="space-y-2">
                    {(location.food as any).traditions.map((tradition: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 old-book-font text-[#2D1810]">
                        <span className="text-lg" style={{ color: colorScheme.accent }}>•</span>
                        {tradition}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="ornate-font text-xl font-semibold text-[#2D1810] mb-3">
                    Cultural Quirks
                  </h4>
                  <ul className="space-y-2">
                    {(location.food as any).quirks.map((quirk: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 old-book-font text-[#2D1810]">
                        <span className="text-lg" style={{ color: colorScheme.accent }}>✦</span>
                        {quirk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="🚢 Transportation" color={colorScheme.primary}>
              <p className="old-book-font text-[#2D1810] leading-relaxed text-lg">
                {location.transportation}
              </p>
            </Section>
          </motion.div>
        )}

        {activeTab === 'economy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <Section title="Economic Overview" color={colorScheme.primary}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#E8DCC4] rounded-lg ink-border">
                  <h4 className="ornate-font text-xl font-semibold mb-3 text-[#8B4513]">
                    Major Industries
                  </h4>
                  <ul className="space-y-2">
                    {(location.economy as any).industries.map((industry: string, index: number) => (
                      <li key={index} className="old-book-font text-[#2D1810]">
                        • {industry}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-[#E8DCC4] rounded-lg ink-border">
                  <h4 className="ornate-font text-xl font-semibold mb-3 text-[#8B4513]">
                    Currency
                  </h4>
                  <p className="old-book-font text-[#2D1810] text-lg">
                    {(location.economy as any).currency}
                  </p>
                </div>

                <div className="p-6 bg-[#E8DCC4] rounded-lg ink-border">
                  <h4 className="ornate-font text-xl font-semibold mb-3 text-[#8B4513]">
                    Trade Goods
                  </h4>
                  <ul className="space-y-2">
                    {(location.economy as any).tradeGoods.map((good: string, index: number) => (
                      <li key={index} className="old-book-font text-[#2D1810]">
                        • {good}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          </motion.div>
        )}

        {activeTab === 'people' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Character Grid with Search/Filter */}
            <CharacterGrid
              characters={location.notablePeople}
              colorScheme={colorScheme}
              onCharacterClick={setSelectedCharacter}
            />

            {/* Factions Section */}
            {(location as any).factions && (location as any).factions.length > 0 && (
              <Section title="⚔️ Factions & Organizations" color={colorScheme.primary}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(location as any).factions.map((faction: any, index: number) => (
                    <div
                      key={index}
                      className="p-6 bg-[#E8DCC4] rounded-lg border-l-4 hover:bg-[#F5E6D3] transition ink-border"
                      style={{ 
                        borderColor: 
                          faction.alignment === 'ally' ? '#10b981' :
                          faction.alignment === 'enemy' ? '#ef4444' :
                          colorScheme.accent
                      }}
                    >
                      <h4 className="pirate-font text-xl text-[#2D1810] mb-1">
                        {faction.name}
                      </h4>
                      <p className="typewriter-font text-sm text-[#8B4513] mb-2">{faction.type}</p>
                      {faction.leader && (
                        <p className="old-book-font text-sm mb-3">
                          <span className="text-[#5C4033]">Leader:</span>{' '}
                          <span className="text-[#2D1810] font-semibold">{faction.leader}</span>
                        </p>
                      )}
                      <p className="old-book-font text-[#2D1810] text-sm mb-3">{faction.description}</p>
                      <p className="typewriter-font text-xs text-[#5C4033]">
                        {faction.members.length} member{faction.members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </motion.div>
        )}

        {activeTab === 'places' && (location as any).subLocations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Section title="🗺️ Sub-Locations" color={colorScheme.primary}>
              <p className="old-book-font text-[#5C4033] mb-6">
                {(location as any).subLocations.length} location{(location as any).subLocations.length !== 1 ? 's' : ''} to explore
              </p>
              <div className="space-y-4">
                {(location as any).subLocations.map((subLocation: any, index: number) => (
                  <div
                    key={index}
                    className="overflow-hidden bg-[#E8DCC4] rounded-lg border-l-4 hover:bg-[#F5E6D3] transition ink-border"
                    style={{ borderColor: colorScheme.primary }}
                  >
                    {/* Sub-location Image */}
                    {subLocation.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={getAssetUrl(subLocation.image)}
                          alt={subLocation.name}
                          className="w-full h-full object-cover sepia-filter"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1810]/70 to-transparent" />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="pirate-font text-2xl text-[#2D1810] mb-1">
                            {subLocation.name}
                          </h4>
                          <span className="inline-block px-3 py-1 text-xs rounded-full font-semibold typewriter-font bg-[#D4C4A8] text-[#8B4513] border border-[#8B4513]">
                            {subLocation.type}
                          </span>
                        </div>
                      </div>
                      <p className="old-book-font text-[#2D1810] leading-relaxed mb-4">
                        {subLocation.description}
                      </p>
                      {subLocation.notableFeatures && subLocation.notableFeatures.length > 0 && (
                        <div>
                          <p className="ornate-font text-sm font-semibold text-[#8B4513] mb-2">Notable Features:</p>
                          <div className="flex flex-wrap gap-2">
                            {subLocation.notableFeatures.map((feature: string, fIndex: number) => (
                              <span
                                key={fIndex}
                                className="px-3 py-1 bg-[#D4C4A8] text-[#2D1810] text-xs rounded-full border border-[#8B4513] typewriter-font"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {activeTab === 'items' && (location as any).items && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Section title="⚔️ Items & Artifacts" color={colorScheme.primary}>
              <p className="old-book-font text-[#5C4033] mb-6">
                {(location as any).items.length} item{(location as any).items.length !== 1 ? 's' : ''} cataloged
              </p>

              {/* Group items by category */}
              {Object.entries(
                (location as any).items.reduce((acc: any, item: any) => {
                  if (!acc[item.category]) acc[item.category] = []
                  acc[item.category].push(item)
                  return acc
                }, {})
              ).map(([category, items]: [string, any]) => (
                <div key={category} className="mb-8">
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: colorScheme.secondary }}
                  >
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="p-5 bg-[#E8DCC4] rounded-lg border-2 border-[#8B4513] hover:border-[#654321] hover:bg-[#F5E6D3] transition\"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          {item.icon && (
                            <span className="text-3xl">{item.icon}</span>
                          )}
                          <div className="flex-1">
                            <h4 className="pirate-font text-lg text-[#2D1810] mb-1">
                              {item.name}
                            </h4>
                            {item.rarity && (
                              <span 
                                className="inline-block px-2 py-0.5 text-xs rounded font-semibold typewriter-font"
                                style={{
                                  backgroundColor: 
                                    item.rarity === 'legendary' ? '#fbbf2450' :
                                    item.rarity === 'rare' ? '#a78bfa50' :
                                    item.rarity === 'uncommon' ? '#60a5fa50' :
                                    '#6b728050',
                                  color: 
                                    item.rarity === 'legendary' ? '#fbbf24' :
                                    item.rarity === 'rare' ? '#a78bfa' :
                                    item.rarity === 'uncommon' ? '#60a5fa' :
                                    '#9ca3af'
                                }}
                              >
                                {item.rarity}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="old-book-font text-[#2D1810] text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <Section title="Story Arc" color={colorScheme.primary}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-[#E8DCC4] rounded-lg ink-border">
                  <h4 className="ornate-font text-xl font-semibold text-[#2D1810] mb-2">
                    📚 Manga
                  </h4>
                  <p className="old-book-font text-[#5C4033]">
                    {(location.storyArcs as any).mangaChapters}
                  </p>
                </div>
                <div className="p-6 bg-[#E8DCC4] rounded-lg ink-border">
                  <h4 className="ornate-font text-xl font-semibold text-[#2D1810] mb-2">
                    🎬 Anime
                  </h4>
                  <p className="old-book-font text-[#5C4033]">
                    {(location.storyArcs as any).animeEpisodes}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="pirate-font text-3xl text-[#2D1810] mb-4 text-center">
                  Major Events
                </h4>
              </div>
              
              {/* Compact 2-column timeline with show more */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {(location.storyArcs as any).events
                  .slice(0, showAllEvents ? undefined : 10)
                  .map((event: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-[#E8DCC4] rounded border-l-4 border-[#8B4513] hover:bg-[#F5E6D3] transition"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 typewriter-font font-bold text-sm border-2 border-[#8B4513]"
                        style={{
                          backgroundColor: colorScheme.primary,
                          color: '#FFF',
                        }}
                      >
                        {index + 1}
                      </div>
                      <p className="old-book-font text-[#2D1810] text-sm leading-relaxed pt-0.5">{event}</p>
                    </div>
                  ))}
              </div>

              {/* Show More/Less Button */}
              {(location.storyArcs as any).events.length > 10 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="px-6 py-3 bg-[#E8DCC4] hover:bg-[#D4C4A8] text-[#2D1810] ornate-font font-semibold rounded-lg ink-border transition-all transform hover:scale-105 shadow-lg"
                  >
                    {showAllEvents ? (
                      <>
                        <span className="mr-2">▲</span>
                        Show Less Events
                      </>
                    ) : (
                      <>
                        <span className="mr-2">▼</span>
                        Show All {(location.storyArcs as any).events.length} Events
                      </>
                    )}
                  </button>
                </div>
              )}
            </Section>

            <Section title="Featured Videos" color={colorScheme.primary}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {location.videos.map((video) => (
                  <div key={video.youtubeId} className="bg-gray-800/50 rounded-lg overflow-hidden">
                    <div className="aspect-video">
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </div>
                    <div className="p-4">
                      <h5 className="text-lg font-semibold text-white mb-1">
                        {video.title}
                      </h5>
                      {video.description && (
                        <p className="text-gray-400 text-sm">
                          {video.description}
                        </p>
                      )}
                      <span
                        className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: colorScheme.primary + '30',
                          color: colorScheme.accent,
                        }}
                      >
                        {video.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}
      </div>

      {/* Character Modal */}
      <CharacterModal
        character={selectedCharacter}
        colorScheme={colorScheme}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  )
}

function Section({ 
  title, 
  children, 
  color 
}: { 
  title: string
  children: React.ReactNode
  color: string 
}) {
  return (
    <div className="bg-[#F5E6D3] rounded-lg p-8 ink-border stamp-effect parchment-texture">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8B4513]" />
        <h3 className="pirate-font text-4xl font-bold text-[#2D1810]">
          {title}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8B4513]" />
      </div>
      {children}
    </div>
  )
}


