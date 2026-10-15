'use client'

import React from 'react'
import Image from 'next/image'

export default function AboutHeritage() {
  return (
    <div className="relative">
      <div className="text-center mb-8">
        <p className="font-mono-data text-[11px] text-mint uppercase tracking-[0.2em] mb-2 font-semibold">
          FOUNDED 1921 · CHANDIGARH
        </p>
        <h3
          className="font-display font-black uppercase tracking-wider text-white mt-2 mb-2"
          style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2.25rem)' }}
        >
          PUNJAB ENGINEERING COLLEGE <span className="text-gradient-mint">HERITAGE</span>
        </h3>
        <p className="font-body text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          Over a century of producing pioneers in aerospace, manufacturing, technology, and venture creation.
        </p>
      </div>

      {/* Themed Timeline Infographic Container */}
      <div className="relative rounded-2xl bg-[#07130F] border border-white/10 hover:border-mint/30 transition-all duration-300 p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl group">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(138,197,63,0.06)_0%,_transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Horizontal scroll on mobile to keep text sharp and readable */}
        <div className="overflow-x-auto pb-2 scrollbar-none relative z-10">
          <div className="min-w-[720px] sm:min-w-full">
            <Image
              src="/pec-heritage-timeline.png"
              alt="Punjab Engineering College Heritage Timeline: 1921 Established in Lahore to 2017 Name Restored"
              width={1024}
              height={315}
              priority
              className="w-full h-auto object-contain select-none transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        <p className="sm:hidden text-center font-mono-data text-[10px] text-mint/70 mt-3 tracking-wider">
          ← SCROLL TIMELINE HORIZONTALLY →
        </p>
      </div>
    </div>
  )
}

