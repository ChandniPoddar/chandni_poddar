'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="font-sora font-semibold text-text">Loading portfolio...</p>
      </motion.div>
    </div>
  );
}
