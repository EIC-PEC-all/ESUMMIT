// components/EventPortfolio/FinalCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Zap } from 'lucide-react'

interface FinalCardProps {
  onViewAll?: () => void
}

const STATS = [
  { value: '13+', label: 'EVENTS', Icon: Zap },
  { value: '₹15L+', label: 'IN PRIZES', Icon: Trophy },
]

export function FinalCard({ onViewAll }: FinalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative shrink-0 overflow-hidden rounded-2xl aspect-[4/3] bg-[#070E0A] flex flex-col items-center justify-center text-center transition-colors duration-300"
      style={{
        width: 'clamp(280px, 26vw, 380px)',
        border: '1px solid rgba(126,211,33,0.15)',
        boxShadow: '0 0 60px rgba(126,211,33,0.06), inset 0 1px 0 rgba(126,211,33,0.08)',
      }}
    >
      {/* Radial glow in center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(126,211,33,0.07) 0%, transparent 70%)' }}
      />

      {/* Faded ∞ watermark */}
      <span
        className="absolute font-display font-black text-mint select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(140px, 22vw, 200px)', opacity: 0.025, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        aria-hidden
      >
        ∞
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6 px-8 w-full">
        {/* Stats row */}
        <div className="flex items-stretch gap-0 w-full">
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="flex-1 flex flex-col items-center gap-2 py-2">
                <stat.Icon size={14} strokeWidth={1.5} className="text-mint/50" />
                <span
                  className="font-display font-black leading-none"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                    color: i === 0 ? '#7ED321' : '#FFFFFF',
                  }}
                >
                  {stat.value}
                </span>
                <span className="font-mono-data text-[9px] uppercase tracking-[0.18em] text-neutral-500">
                  {stat.label}
                </span>
              </div>

              {/* Divider */}
              {i < STATS.length - 1 && (
                <div className="w-px self-stretch bg-mint/10 mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-mint/20 to-transparent" />

        {/* CTA */}
        <a
          href="#tracks"
          onClick={onViewAll}
          className="group/btn w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono-data text-[10px] font-black uppercase tracking-[0.2em] text-mint transition-all duration-300 hover:bg-mint hover:text-black"
          style={{ border: '1px solid rgba(126,211,33,0.25)', background: 'rgba(126,211,33,0.06)' }}
        >
          VIEW ALL EVENTS
          <ArrowRight size={12} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}
