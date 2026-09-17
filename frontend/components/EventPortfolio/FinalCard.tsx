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
      className="group relative shrink-0 overflow-hidden rounded-2xl bg-[#0A110D] flex flex-col justify-between transition-all duration-300 aspect-[4/3] border border-white/10"
      style={{
        width: 'clamp(280px, 26vw, 380px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Soft Top Glow */}
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(181,242,61,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col flex-1 p-5 md:p-6 pb-0">
        
        {/* Stats Section */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Zap size={15} strokeWidth={2.5} className="text-[#B5F23D]" />
                <span className="font-mono-data text-[12px] uppercase tracking-[0.1em] text-neutral-400 font-bold">
                  Total Events
                </span>
              </div>
              <span className="font-display font-black text-3xl text-white tracking-tight flex items-baseline">
                13<span className="text-[#B5F23D] font-normal text-2xl ml-0.5">+</span>
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Trophy size={15} strokeWidth={2.5} className="text-[#B5F23D]" />
                <span className="font-mono-data text-[12px] uppercase tracking-[0.1em] text-neutral-400 font-bold">
                  Prize Pool
                </span>
              </div>
              <span className="font-display font-black text-[28px] text-white tracking-tight flex items-baseline gap-1">
                <span className="font-sans font-light text-lg text-neutral-500">₹</span>
                15L<span className="text-[#B5F23D] font-normal text-xl">+</span>
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
          className="group/btn w-full flex items-center justify-between px-5 py-3 rounded-xl font-mono-data text-[11px] font-black uppercase tracking-[0.1em] text-black bg-[#B5F23D] transition-all duration-300 hover:brightness-110 hover:scale-[1.02] shadow-[0_4px_20px_rgba(181,242,61,0.2)]"
        >
          <span>Explore All Events</span>
          <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </motion.div>
  )
}
