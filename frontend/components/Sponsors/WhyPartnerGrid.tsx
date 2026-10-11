'use client'

import React from 'react'
import { WHY_PARTNER_PILLARS } from '@/data/summitData'

export default function WhyPartnerGrid() {
  return (
    <div className="mt-16 sm:mt-20">
      <div className="text-center mb-10">
        <span className="text-[10px] font-mono-data text-mint font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-mint/10 border border-mint/20">
          BE PRESENT WHERE THE NEXT THING HAPPENS
        </span>
        <h3
          className="font-display font-black uppercase tracking-wider text-white mt-3 mb-2"
          style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2rem)' }}
        >
          WHY PARTNER WITH <span className="text-gradient-mint">E-SUMMIT &apos;26</span>
        </h3>
        <p className="font-body text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          Designed around real value, measurable reach, and deep institutional integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {WHY_PARTNER_PILLARS.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#091812]/80 border border-white/10 hover:border-mint/30 transition-all duration-300 group"
          >
            <span className="font-mono-data text-xs font-bold text-mint/60 group-hover:text-mint block mb-2">
              {item.number}
            </span>
            <h4 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider mb-2">
              {item.title}
            </h4>
            <p className="font-body text-xs text-gray-300 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
