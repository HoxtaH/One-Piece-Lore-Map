'use client'

import { motion } from 'framer-motion'
import { LocationSummary, Coordinates } from '@/lib/types/location'
import { useRouter } from 'next/navigation'

interface MapHotspotProps {
  location: LocationSummary
  coordinates: Coordinates  // Specific coordinate point for this hotspot
  showHotspot: boolean      // Toggle visibility of hotspot circles
  onMouseEnter: (location: LocationSummary, event: React.MouseEvent) => void
  onMouseLeave: () => void
  onTap?: (location: LocationSummary) => void
  isTapped?: boolean
  isJourneyPlaying?: boolean
}

export default function MapHotspot({
  location,
  coordinates,
  showHotspot,
  onMouseEnter,
  onMouseLeave,
  onTap,
  isTapped = false,
  isJourneyPlaying = false,
}: MapHotspotProps) {
  const router = useRouter()
  const { colorScheme } = location
  
  // Create a circular hotspot region
  // Scaled for pixel coordinate system (0-10798 x 0-5429)
  const radius = 100

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/locations/${location.slug}`)
  }

  return (
    <g>
      {/* Pulsing glow effect - only visible when showHotspot is true or it's tapped */}
      {(showHotspot || isTapped) && (
        <motion.circle
          cx={coordinates.x}
          cy={coordinates.y}
          r={radius * (isTapped ? 2 : 1.5)}
          fill={colorScheme.primary}
          opacity={isTapped ? 0.6 : 0.3}
          animate={isJourneyPlaying ? undefined : {
            scale: isTapped ? [1, 1.1, 1] : [1, 1.2, 1],
            opacity: isTapped ? [0.6, 0.8, 0.6] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: isTapped ? 1 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main hotspot - transparent when hidden, visible when showHotspot is true */}
      <circle
        cx={coordinates.x}
        cy={coordinates.y}
        r={radius}
        fill={(showHotspot || isTapped) ? colorScheme.primary : 'transparent'}
        stroke={(showHotspot || isTapped) ? colorScheme.accent : 'transparent'}
        strokeWidth={0.3}
        className="cursor-pointer transition-all duration-300 hover:opacity-100"
        opacity={(showHotspot || isTapped) ? 0.8 : 0}
        onMouseEnter={(e) => onMouseEnter(location, e as any)}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
      />

      {/* Larger touch target for mobile - transparent but interactive */}
      <circle
        cx={coordinates.x}
        cy={coordinates.y}
        r={radius * 2.5}
        fill="transparent"
        className="cursor-pointer md:hidden"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => {
          e.stopPropagation()
          if (onTap) onTap(location)
        }}
      />

      {/* Center dot - only visible when showHotspot is true or tapped */}
      {(showHotspot || isTapped) && (
        <circle
          cx={coordinates.x}
          cy={coordinates.y}
          r={radius * 0.3}
          fill={colorScheme.accent}
          className="pointer-events-none"
        />
      )}
    </g>
  )
}
