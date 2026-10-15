'use client'

import React from 'react'

export default function UpcomingSponsorsComingSoon() {
  return (
    <div className="mb-12 sm:mb-16">
      <div className="relative rounded-3xl bg-[#071711]/90 border border-mint/25 p-8 sm:p-12 text-center shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h3
            className="font-display font-black uppercase tracking-wider text-white mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.25rem)' }}
          >
            2026 OFFICIAL <span className="text-gradient-mint">SPONSORS</span>
          </h3>

          <div className="my-5 py-3 px-8 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xs mx-auto shadow-inner">
            <span className="font-display font-black uppercase tracking-widest text-mint text-xl sm:text-2xl drop-shadow-[0_0_15px_rgba(138,197,63,0.35)]">
              COMING SOON
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 font-body max-w-lg mx-auto leading-relaxed">
            The official partner roster for E-Summit 2026 will be revealed soon.
          </p>
        </div>
      </div>
    </div>
  )
}
