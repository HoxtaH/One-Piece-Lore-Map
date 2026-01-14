'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { NotablePerson } from '@/lib/types/location'
import { X } from 'lucide-react'
import Image from 'next/image'

interface CharacterModalProps {
  character: NotablePerson | null
  colorScheme: { primary: string; secondary: string; accent: string }
  onClose: () => void
}

export default function CharacterModal({ character, colorScheme, onClose }: CharacterModalProps) {
  if (!character) return null

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
        return { bg: '#10b98150', text: '#10b981', label: 'Protagonist' }
      case 'antagonist':
        return { bg: '#ef444450', text: '#ef4444', label: 'Antagonist' }
      case 'historical':
        return { bg: '#f59e0b50', text: '#f59e0b', label: 'Historical Figure' }
      case 'citizen':
        return { bg: '#3b82f650', text: '#3b82f6', label: 'Citizen' }
      case 'neutral':
        return { bg: '#6b728050', text: '#9ca3af', label: 'Neutral' }
      default:
        return { bg: '#6b728050', text: '#9ca3af', label: 'Unknown' }
    }
  }

  const typeColors = getTypeColor(character.type)

  return (
    <AnimatePresence>
      {character && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 pointer-events-none"
          >
            <div 
              className="relative w-full max-w-3xl bg-gray-900 sm:rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-h-screen sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Header with Avatar */}
              <div 
                className="relative p-6 sm:p-8 pb-16 sm:pb-20"
                style={{
                  background: `linear-gradient(135deg, ${colorScheme.primary}30, ${colorScheme.secondary}30)`
                }}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Large Avatar */}
                  <div 
                    className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border-3 sm:border-4"
                    style={{ borderColor: colorScheme.accent }}
                  >
                    {character.avatar ? (
                      <Image
                        src={character.avatar}
                        alt={character.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-5xl font-bold"
                        style={{ 
                          backgroundColor: `${colorScheme.primary}50`,
                          color: colorScheme.primary
                        }}
                      >
                        {getInitials(character.name)}
                      </div>
                    )}
                  </div>

                  {/* Name and Role */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 break-words">
                      {character.name}
                    </h2>
                    <p 
                      className="text-base sm:text-xl font-semibold mb-4"
                      style={{ color: colorScheme.secondary }}
                    >
                      {character.role}
                    </p>

                    {/* Type and Faction Badges */}
                    <div className="flex flex-wrap gap-2">
                      {character.type && (
                        <span 
                          className="px-4 py-2 text-sm rounded-full font-semibold"
                          style={{
                            backgroundColor: typeColors.bg,
                            color: typeColors.text
                          }}
                        >
                          {typeColors.label}
                        </span>
                      )}
                      {character.faction && (
                        <span 
                          className="px-4 py-2 text-sm rounded-full font-semibold bg-gray-800/80 text-gray-200"
                        >
                          ⚔️ {character.faction}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Description */}
                <div>
                  <h3 
                    className="text-xl sm:text-2xl font-bold mb-3"
                    style={{ color: colorScheme.primary }}
                  >
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                    {character.description}
                  </p>
                </div>

                {/* Tags */}
                {character.tags && character.tags.length > 0 && (
                  <div>
                    <h3 
                      className="text-2xl font-bold mb-3"
                      style={{ color: colorScheme.primary }}
                    >
                      Characteristics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gray-800 text-gray-200 rounded-full text-sm hover:bg-gray-700 transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {character.type && (
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Type</p>
                      <p className="text-white font-semibold">{typeColors.label}</p>
                    </div>
                  )}
                  {character.faction && (
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Faction</p>
                      <p className="text-white font-semibold">{character.faction}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div 
                className="p-6 border-t border-gray-800"
                style={{ backgroundColor: `${colorScheme.primary}10` }}
              >
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

