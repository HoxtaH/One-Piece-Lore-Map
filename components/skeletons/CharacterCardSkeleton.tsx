'use client'

import { motion } from 'framer-motion'

export default function CharacterCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative p-5 bg-gray-800/50 rounded-xl border-2 border-gray-700"
    >
      {/* Avatar and Header Skeleton */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gray-700 animate-pulse flex-shrink-0" />
        
        <div className="flex-1 space-y-2">
          {/* Name */}
          <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4" />
          {/* Role */}
          <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
          {/* Badge */}
          <div className="h-6 bg-gray-700 rounded-full animate-pulse w-24" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-gray-700 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-700 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-gray-700 rounded-full animate-pulse w-16" />
        <div className="h-6 bg-gray-700 rounded-full animate-pulse w-20" />
        <div className="h-6 bg-gray-700 rounded-full animate-pulse w-14" />
      </div>

      {/* Faction Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-700 rounded animate-pulse w-32" />
      </div>
    </motion.div>
  )
}

