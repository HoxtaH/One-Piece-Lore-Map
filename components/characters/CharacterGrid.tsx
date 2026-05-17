'use client'

import { useState, useMemo } from 'react'
import { NotablePerson } from '@/lib/types/location'
import CharacterCard from './CharacterCard'
import CharacterCardSkeleton from '../skeletons/CharacterCardSkeleton'
import { Search, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CharacterGridProps {
  characters: NotablePerson[]
  colorScheme: { primary: string; secondary: string; accent: string }
  onCharacterClick: (character: NotablePerson) => void
}

type FilterType = 'all' | 'protagonist' | 'antagonist' | 'citizen' | 'historical' | 'neutral'

export default function CharacterGrid({ characters, colorScheme, onCharacterClick }: CharacterGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterFaction, setFilterFaction] = useState<string>('all')

  // Get unique factions
  const factions = useMemo(() => {
    const uniqueFactions = new Set<string>()
    characters.forEach(char => {
      if (char.faction) uniqueFactions.add(char.faction)
    })
    return Array.from(uniqueFactions).sort()
  }, [characters])

  // Filter characters
  const filteredCharacters = useMemo(() => {
    return characters.filter(character => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        (character.name?.toLowerCase().includes(searchLower) ?? false) ||
        (character.role?.toLowerCase().includes(searchLower) ?? false) ||
        (character.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ?? false)

      // Type filter
      const matchesType = filterType === 'all' || character.type === filterType

      // Faction filter
      const matchesFaction = filterFaction === 'all' || character.faction === filterFaction

      return matchesSearch && matchesType && matchesFaction
    })
  }, [characters, searchQuery, filterType, filterFaction])

  // Get type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: characters.length,
      protagonist: 0,
      antagonist: 0,
      citizen: 0,
      historical: 0,
      neutral: 0,
    }
    characters.forEach(char => {
      if (char.type && counts[char.type] !== undefined) {
        counts[char.type]++
      }
    })
    return counts
  }, [characters])

  const filterButtons: { id: FilterType; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '👥' },
    { id: 'protagonist', label: 'Protagonists', icon: '⭐' },
    { id: 'antagonist', label: 'Antagonists', icon: '💀' },
    { id: 'citizen', label: 'Citizens', icon: '🏘️' },
    { id: 'historical', label: 'Historical', icon: '📜' },
  ]

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search characters by name, role, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 transition"
        />
      </div>

      {/* Filter Chips */}
      <div className="space-y-4">
        {/* Type Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs sm:text-sm font-semibold text-gray-400">Filter by Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map(button => (
              <button
                key={button.id}
                onClick={() => setFilterType(button.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  filterType === button.id
                    ? 'text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
                style={
                  filterType === button.id
                    ? { backgroundColor: colorScheme.primary, color: 'white' }
                    : {}
                }
              >
                <span className="mr-1 sm:mr-2">{button.icon}</span>
                <span className="hidden sm:inline">{button.label}</span>
                <span className="sm:hidden">{button.label.slice(0, 4)}</span>
                <span className="ml-1 sm:ml-2 text-xs opacity-75">
                  ({typeCounts[button.id]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Faction Filter */}
        {factions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs sm:text-sm font-semibold text-gray-400">Filter by Faction:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterFaction('all')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  filterFaction === 'all'
                    ? 'text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
                style={
                  filterFaction === 'all'
                    ? { backgroundColor: colorScheme.secondary, color: 'white' }
                    : {}
                }
              >
                All Factions
              </button>
              {factions.map(faction => (
                <button
                  key={faction}
                  onClick={() => setFilterFaction(faction)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    filterFaction === faction
                      ? 'text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                  }`}
                  style={
                    filterFaction === faction
                      ? { backgroundColor: colorScheme.secondary, color: 'white' }
                      : {}
                  }
                >
                  {faction}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredCharacters.length} of {characters.length} character{characters.length !== 1 ? 's' : ''}
      </div>

      {/* Character Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.name}
              character={character}
              colorScheme={colorScheme}
              onClick={() => onCharacterClick(character)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredCharacters.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 text-lg mb-2">No characters found</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your search or filters
          </p>
        </motion.div>
      )}
    </div>
  )
}

