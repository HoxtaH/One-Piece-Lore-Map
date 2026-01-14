'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import WorldMap from '@/components/map/WorldMap';
import NewsCooIcon from '@/components/news/NewsCooIcon';
import NewsPanel from '@/components/news/NewsPanel';
import { LocationSummary } from '@/lib/types/location';



interface HomeClientProps {
  locations: LocationSummary[];
}

export default function HomeClient({ locations }: HomeClientProps) {
  const [isNewsPanelOpen, setIsNewsPanelOpen] = useState(false);

  return (
    <>
      <WorldMap locations={locations || []} />
      <NewsCooIcon onClick={() => setIsNewsPanelOpen(true)} />
      <NewsPanel isOpen={isNewsPanelOpen} onClose={() => setIsNewsPanelOpen(false)} />

    </>
  );
}
