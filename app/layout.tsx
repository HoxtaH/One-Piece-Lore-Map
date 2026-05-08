import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SentryErrorBoundary } from '@/components/errors/SentryErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'One Piece Lore Map - Explore the World of One Piece',
  description: 'An interactive map documenting the vast world of One Piece, featuring detailed lore, locations, characters, and key moments from the series.',
  keywords: 'One Piece, anime, manga, map, lore, interactive, Luffy, world map, navigation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SentryErrorBoundary>
          <Providers>{children}</Providers>
        </SentryErrorBoundary>
      </body>
    </html>
  )
}


