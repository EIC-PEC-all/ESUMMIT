// components/EventPortfolio/FinalCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Zap } from 'lucide-react'

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
      className="group relative shrink-0 overflow-hidden rounded-[24px] bg-panel border border-border-panel hover:border-mint/50 flex flex-col justify-between transition-all duration-300 w-full max-w-[380px] h-[420px] sm:h-[440px] shadow-2xl"
    >
      {/* Soft Top Glow */}
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, var(--accent-green-dim) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col flex-1 p-5 md:p-6 pb-0">
        
        {/* Stats Section */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Zap size={15} strokeWidth={2.5} className="text-mint" />
                <span className="font-mono-data text-[12px] uppercase tracking-[0.1em] text-secondary font-bold">
                  Total Events
                </span>
              </div>
              <span className="font-display font-black text-3xl text-primary tracking-tight flex items-baseline">
                13<span className="text-mint font-normal text-2xl ml-0.5">+</span>
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-border-subtle" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Trophy size={15} strokeWidth={2.5} className="text-mint" />
                <span className="font-mono-data text-[12px] uppercase tracking-[0.1em] text-secondary font-bold">
                  Prize Pool
                </span>
              </div>
              <span className="font-display font-black text-[28px] text-primary tracking-tight flex items-baseline gap-1">
                <span className="font-sans font-light text-lg text-muted">₹</span>
                15L<span className="text-mint font-normal text-xl">+</span>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Button Section */}
      <div className="relative z-10 px-5 pb-5 pt-0">
        <a
          href="#tracks"
          onClick={onViewAll}
          className="group/btn w-full flex items-center justify-between px-5 py-3 rounded-full font-mono-data text-[11px] font-black uppercase tracking-[0.1em] text-void bg-mint transition-all duration-300 hover:brightness-110 hover:scale-[1.02] shadow-[0_4px_20px_var(--border-glow)]"
        >
          <span>Explore All Events</span>
          <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </motion.div>
  )
}
