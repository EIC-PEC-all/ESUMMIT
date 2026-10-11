'use client'

import React from 'react'
import { MASTER_SPONSORS } from '@/data/summitData'

export default function PreviousSponsorsGrid() {
  return (
    <div className="mt-16 sm:mt-24">
      <div className="text-center mb-10">
        <span className="text-[10px] font-mono-data text-mint font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-mint/10 border border-mint/20">
          PROVEN TRACK RECORD
        </span>
        <h3
          className="font-display font-black uppercase tracking-wider text-white mt-3 mb-2"
          style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2rem)' }}
        >
          ORGANIZATIONS THAT HAVE <span className="text-gradient-mint">BACKED THE JOURNEY</span>
        </h3>
        <p className="font-mono-data text-[11px] text-gray-400 uppercase tracking-widest">
          PREVIOUS CORPORATE, VENTURE &amp; MEDIA SPONSORS
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {MASTER_SPONSORS.map((sp) => (
          <div
            key={sp.id}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#091812]/70 border border-white/5 hover:border-mint/30 transition-all duration-200 text-center group"
          >
            <span className="font-display font-bold text-xs sm:text-sm text-gray-200 group-hover:text-mint transition-colors tracking-wide mb-1">
              {sp.name}
            </span>
            <span className="text-[9px] font-mono-data text-gray-400 tracking-wider">
              {sp.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
