'use client'

import { motion } from 'framer-motion'

export default function LocationSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section Skeleton */}
      <div className="relative h-80 bg-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-8">
            <div className="h-12 bg-gray-700 rounded w-96 mx-auto" />
            <div className="h-6 bg-gray-700 rounded w-64 mx-auto" />
          </div>
        </div>
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-1 overflow-x-auto py-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse w-32" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-gray-800 rounded w-48 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

