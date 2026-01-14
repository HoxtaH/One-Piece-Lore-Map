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
}

export default function MapHotspot({
  location,
  coordinates,
  showHotspot,
  onMouseEnter,
  onMouseLeave,
}: MapHotspotProps) {
  const router = useRouter()
  const { colorScheme } = location
  
  // Create a circular hotspot region
  // Scaled for pixel coordinate system (0-10798 x 0-5429)
  const radius = 100

  const handleClick = () => {
    router.push(`/locations/${location.slug}`)
  }

  return (
    <g>
      {/* Pulsing glow effect - only visible when showHotspot is true */}
      {showHotspot && (
        <motion.circle
          cx={coordinates.x}
          cy={coordinates.y}
          r={radius * 1.5}
          fill={colorScheme.primary}
          opacity={0.3}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
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
        fill={showHotspot ? colorScheme.primary : 'transparent'}
        stroke={showHotspot ? colorScheme.accent : 'transparent'}
        strokeWidth={0.3}
        className="cursor-pointer transition-all duration-300 hover:opacity-100"
        opacity={showHotspot ? 0.8 : 0}
        onMouseEnter={(e) => onMouseEnter(location, e as any)}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
      />

      {/* Center dot - only visible when showHotspot is true */}
      {showHotspot && (
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


