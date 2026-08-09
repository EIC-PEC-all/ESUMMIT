// components/EventPortfolio/FinalCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface FinalCardProps {
  onViewAll?: () => void
}

export function FinalCard({ onViewAll }: FinalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative shrink-0 overflow-hidden rounded-2xl border border-mint/20 bg-[#0A0F0C] flex flex-col items-center justify-center text-center hover:border-mint/50 transition-colors duration-300"
      style={{ width: 'clamp(200px, 22vw, 280px)', height: 'clamp(280px, 40vh, 380px)' }}
    >
      {/* Background mint glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint/5 via-transparent to-transparent pointer-events-none" />

      {/* Large faded number */}
      <span
        className="absolute font-display font-black text-mint opacity-[0.03] select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(100px, 18vw, 160px)' }}
        aria-hidden
      >
        ∞
      </span>

      <div className="relative z-10 flex flex-col items-center gap-5 px-6">
        {/* Stats */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-4xl font-black text-mint">13+</span>
          <span className="font-mono-data text-[10px] uppercase tracking-widest text-neutral-400">Events</span>
        </div>

        <div className="h-px w-8 bg-mint/30" />

        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-4xl font-black text-white">₹15L+</span>
          <span className="font-mono-data text-[10px] uppercase tracking-widest text-neutral-400">In Prizes</span>
        </div>

        {/* CTA */}
        <a
          href="#tracks"
          onClick={onViewAll}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-mint/40 bg-mint/10 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-mint transition-all duration-300 hover:bg-mint hover:text-black hover:border-mint group/btn"
        >
          View All
          <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  )
}
