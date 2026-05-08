'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LocationNotFound() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center h-screen parchment-bg parchment-texture"
    >
      <div className="text-center max-w-md px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="wanted-poster p-12 rounded-lg"
        >
          <div className="text-8xl mb-6">🗺️</div>
          <h2 className="pirate-font text-5xl font-bold mb-4 text-[#2D1810]">
            Location Not Found
          </h2>
          <p className="old-book-font text-[#5C4033] mb-8 text-lg">
            The location you&apos;re looking for doesn&apos;t exist or has been lost to the seas.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-[#3E2723] hover:bg-[#2D1810] text-[#F5E6D3] ornate-font font-bold text-lg rounded border-4 border-[#654321] vintage-shadow transition-all transform hover:scale-105"
          >
            ← Return to Map
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
