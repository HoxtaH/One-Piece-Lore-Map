'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="w-full h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              🏴‍☠️ Something went wrong!
            </h1>
            <p className="text-gray-600 mb-6">
              A critical error has occurred. Our team has been notified and we&apos;re looking into it.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
