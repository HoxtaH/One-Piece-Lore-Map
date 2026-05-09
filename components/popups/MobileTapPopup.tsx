'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LocationSummary } from '@/lib/types/location';
import { X, MapPin, Info, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileTapPopupProps {
  location: LocationSummary | null;
  onClose: () => void;
}

export default function MobileTapPopup({ location, onClose }: MobileTapPopupProps) {
  const router = useRouter();

  if (!location) return null;

  const handleExplore = () => {
    router.push(`/locations/${location.slug}`);
  };

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
        >
          {/* Backdrop for tapping outside to close - optional, but let's keep it clean */}
          <div 
            className="bg-[#D4C4A8] border-t-4 border-[#654321] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.3)] px-6 pt-4 pb-8 rounded-t-3xl"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-[#8B4513]/20 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="pirate-font text-3xl text-[#2D1810] mb-1">
                  {location.name}
                </h2>
                <div className="flex items-center gap-2 text-[#8B4513] ornate-font font-bold">
                  <MapPin size={16} />
                  <span>{location.region}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-[#E8DCC4] rounded-full border-2 border-[#8B4513] text-[#8B4513]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Facts Preview */}
            <div className="space-y-2 mb-6">
              {location.quickFacts.slice(0, 2).map((fact, index) => (
                <div key={index} className="flex items-start gap-3 bg-[#E8DCC4]/50 p-3 rounded-xl border border-[#8B4513]/20">
                  <Info size={18} className="text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <p className="old-book-font text-[#2D1810] text-sm leading-snug">
                    {fact}
                  </p>
                </div>
              ))}
            </div>

            {/* Explore Button */}
            <button
              onClick={handleExplore}
              className="w-full bg-[#8B4513] hover:bg-[#654321] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ornate-font text-lg border-b-4 border-[#2D1810]"
            >
              Explore This Island
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
