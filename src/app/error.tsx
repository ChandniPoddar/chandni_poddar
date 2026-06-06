'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl border border-border p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="font-sora font-bold text-2xl text-text mb-2">Something went wrong</h1>
        <p className="text-text-muted text-sm mb-8">
          We&apos;re sorry, but an unexpected error occurred while loading this page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2.5 rounded-xl glass border border-border text-text hover:bg-white/5 transition-colors text-sm font-medium"
          >
            Go Home
          </button>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-gradient-primary text-white flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity glow-primary"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
