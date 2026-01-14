'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import ContributionForm from '@/components/contribute/ContributionForm';

function ContributeContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');

  const errorMessages: Record<string, string> = {
    missing_token: 'Verification link is invalid. Please try submitting again.',
    invalid_token: 'Verification link not found. It may have expired.',
    already_verified: 'This contribution has already been verified!',
    expired_token: 'Verification link expired. Please submit again.',
    server_error: 'Something went wrong. Please try again.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🏴‍☠️ Contribute to the Map
          </h1>
          <p className="text-gray-400 text-lg">
            Help build the ultimate One Piece location database. Your knowledge matters!
          </p>
        </motion.div>

        {/* Success message from email verification */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-1">
                  Email Verified! 🎉
                </h3>
                <p className="text-gray-300">
                  Your contribution has been submitted and is pending review. 
                  We&apos;ll add it to the map once approved. Thank you for helping the One Piece community!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-1">
                  Verification Failed
                </h3>
                <p className="text-gray-300">
                  {errorMessages[error] || 'An unknown error occurred.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 rounded-2xl p-6 md:p-8"
        >
          <ContributionForm />
        </motion.div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-2xl mb-2">📧</div>
            <h4 className="font-semibold text-white mb-1">Email Verification</h4>
            <p className="text-sm text-gray-400">
              We&apos;ll send a link to verify your email before your contribution is reviewed.
            </p>
          </div>
          <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-2xl mb-2">👀</div>
            <h4 className="font-semibold text-white mb-1">Manual Review</h4>
            <p className="text-sm text-gray-400">
              Our team reviews each submission for accuracy before adding it to the map.
            </p>
          </div>
          <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-semibold text-white mb-1">Get Credited</h4>
            <p className="text-sm text-gray-400">
              Your name will be added to our contributors list when your submission is approved!
            </p>
          </div>
        </motion.div>

        {/* Developer link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-gray-500"
        >
          <p>
            Are you a developer?{' '}
            <Link href="/CONTRIBUTING.md" className="text-yellow-400 hover:underline">
              Check out our GitHub contributing guide
            </Link>{' '}
            for more ways to help!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ContributeClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <ContributeContent />
    </Suspense>
  );
}
