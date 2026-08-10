'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function LimeTransitionBanner() {
  const words = ['IMPACT', 'INSPIRE', 'INNOVATE', 'BUILD', 'SCALE', 'PITCH', 'INVEST']

  return (
    <div className="relative w-full overflow-hidden bg-mint text-void py-6 sm:py-8 my-0 z-20 shadow-[0_0_50px_rgba(126,211,33,0.4)] border-y-2 border-void">
      {/* Top micro line */}
      <div className="absolute top-1 left-0 right-0 h-0.5 bg-void/20" />

      {/* Repeating Marquee Ticker */}
      <div className="flex whitespace-nowrap overflow-hidden select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          className="flex items-center gap-6 sm:gap-10 shrink-0"
        >
          {[...words, ...words, ...words, ...words].map((word, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-10">
              <span className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tighter text-void">
                {word}
              </span>
              <Zap size={22} className="text-void fill-void shrink-0 stroke-[2.5]" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom micro line */}
      <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-void/20" />
    </div>
  )
}
