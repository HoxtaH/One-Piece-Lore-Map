'use client'

import type { ReactNode } from 'react'
import { AudioProvider } from '@/lib/context/AudioContext'
import dynamic from 'next/dynamic'

const AudioControls = dynamic(() => import('@/components/audio/AudioControls'), {
  ssr: false,
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AudioProvider>
      {children}
      <AudioControls />
    </AudioProvider>
  )
}


