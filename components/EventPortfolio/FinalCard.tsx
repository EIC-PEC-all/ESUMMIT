// components/EventPortfolio/FinalCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'

interface FinalCardProps {
  onViewAll?: () => void
}

export function FinalCard({ onViewAll }: FinalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative flex w-[320px] sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0 flex-col justify-between rounded-2xl border border-mint/30 bg-[#0C120F] p-5 sm:p-6 transition-colors duration-200 hover:border-mint"
    >
      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-mint">
          Portfolio Archive
        </span>
        <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 text-[10px] font-medium text-mint">
          Overview
        </span>
      </div>

      {/* 16:9 Aspect ratio preview block */}
      <div className="relative z-10 my-2 w-full aspect-[16/9] rounded-xl border border-mint/20 bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
        <Compass size={28} className="text-mint mb-2 animate-pulse" />
        <span className="text-xs font-semibold text-white">Full Event Schedule</span>
        <span className="text-[10px] text-neutral-400">13 Confirmed Track Activities</span>
      </div>

      {/* Main Text Section */}
      <div className="relative z-10 mt-3 flex flex-col gap-2">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
          Explore all <span className="text-mint">digital experiences</span> and events.
        </h2>

        <p className="text-xs sm:text-sm leading-relaxed text-neutral-400 line-clamp-2">
          Discover corporate workshops, recruitment platforms, R&D conclaves, and high-stakes competitions at PEC E-Summit '26.
        </p>

        {/* Highlight Stats */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div className="rounded-md bg-neutral-950 border border-white/10 px-2 py-0.5 text-[11px] text-neutral-300">
            <span className="text-mint font-bold">13+</span> Activities
          </div>
          <div className="rounded-md bg-neutral-950 border border-white/10 px-2 py-0.5 text-[11px] text-neutral-300">
            <span className="text-mint font-bold">₹15L+</span> Prizes
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 border-t border-white/10 pt-3.5 mt-4">
        <a
          href="#tracks"
          onClick={onViewAll}
          className="group/btn relative inline-flex w-full items-center justify-between rounded-xl border border-mint/40 bg-mint/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-mint transition-all duration-200 hover:bg-mint hover:text-black"
        >
          <span className="flex items-center gap-2">
            <Compass size={16} />
            View All Projects
          </span>
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </motion.div>
  )
}
