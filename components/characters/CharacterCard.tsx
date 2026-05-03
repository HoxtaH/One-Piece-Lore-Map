'use client'

import { motion } from 'framer-motion'
import { NotablePerson } from '@/lib/types/location'
import Image from 'next/image'
import { getAssetUrl } from '@/lib/utils/assets'

interface CharacterCardProps {
  character: NotablePerson
  colorScheme: { primary: string; secondary: string; accent: string }
  onClick: () => void
}

export default function CharacterCard({ character, colorScheme, onClick }: CharacterCardProps) {
  // Generate initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get type color
  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'protagonist':
        return { bg: '#10b98150', text: '#10b981' }
      case 'antagonist':
        return { bg: '#ef444450', text: '#ef4444' }
      case 'historical':
        return { bg: '#f59e0b50', text: '#f59e0b' }
      case 'citizen':
        return { bg: '#3b82f650', text: '#3b82f6' }
      default:
        return { bg: '#6b728050', text: '#9ca3af' }
    }
  }

  const typeColors = getTypeColor(character.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative wanted-poster p-6 cursor-pointer transition-all group hover:shadow-2xl"
    >
      {/* "WANTED" Header */}
      <div className="text-center mb-4 border-b-2 border-[#2D1810] pb-3">
        <div className="pirate-font text-3xl font-bold text-[#8B4513]">WANTED</div>
        {character.type === 'protagonist' && (
          <div className="ornate-font text-xs text-[#5C4033] mt-1">ALIVE</div>
        )}
        {character.type === 'antagonist' && (
          <div className="ornate-font text-xs text-[#8B4513] mt-1">DEAD OR ALIVE</div>
        )}
      </div>

      {/* Character Avatar - Sepia */}
      <div className="flex justify-center mb-4">
        <div 
          className="relative w-32 h-32 rounded border-4 overflow-hidden"
          style={{ borderColor: colorScheme.accent }}
        >
          {character.avatar ? (
            <Image
              src={getAssetUrl(character.avatar)}
              alt={character.name}
              fill
              className="object-cover sepia-filter"
              unoptimized
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center pirate-font text-4xl"
              style={{ 
                backgroundColor: `${colorScheme.primary}30`,
                color: colorScheme.primary
              }}
            >
              {getInitials(character.name)}
            </div>
          )}
        </div>
      </div>

      {/* Name - Large Pirate Font */}
      <h3 className="pirate-font text-2xl font-bold text-[#2D1810] mb-2 text-center leading-tight">
        {character.name}
      </h3>

      {/* Role */}
      <p 
        className="ornate-font text-sm font-semibold mb-3 text-center"
        style={{ color: colorScheme.secondary }}
      >
        {character.role}
      </p>

      {/* Description - Old Book Font */}
      <p className="old-book-font text-[#5C4033] text-sm leading-relaxed mb-3 line-clamp-3 text-center">
        {character.description}
      </p>

      {/* Faction Badge */}
      {character.faction && (
        <div className="text-center mb-3">
          <span className="inline-block px-3 py-1 bg-[#D4C4A8] border-2 border-[#8B4513] rounded ornate-font text-xs text-[#2D1810] font-semibold">
            {character.faction}
          </span>
        </div>
      )}

      {/* Tags */}
      {character.tags && character.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mb-3">
          {character.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-[#E8DCC4] text-[#5C4033] text-xs rounded typewriter-font border border-[#A0896C]"
            >
              {tag}
            </span>
          ))}
          {character.tags.length > 3 && (
            <span className="px-2 py-0.5 text-[#8B4513] text-xs typewriter-font">
              +{character.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Click hint */}
      <div 
        className="text-center text-xs ornate-font opacity-0 group-hover:opacity-100 transition font-semibold"
        style={{ color: colorScheme.primary }}
      >
        Click to view details →
      </div>
    </motion.div>
  )
}

