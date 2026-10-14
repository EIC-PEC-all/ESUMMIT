'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import PassCard from './PassCard'
import PassesComparisonTable from './PassesComparisonTable'
import { STARTUP_PACKAGES } from './passesData'

interface PassesSectionProps {
  isStandalonePage?: boolean
}

export default function PassesSection({ isStandalonePage = false }: PassesSectionProps) {
  return (
    <section
      id="passes"
      className={`relative z-10 overflow-hidden bg-[#071511] text-white ${
        isStandalonePage
          ? 'pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24'
          : '-mt-10 sm:-mt-12 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] border-t border-mint/20 py-16 sm:py-20 md:py-24'
      }`}
      aria-label="Startup Packages and Passes"
    >
      {/* Background Ambience Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-mint/15 blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        {/* Header Block */}
        <div className="mt-4 sm:mt-6 mb-10 lg:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-mono-data text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-mint flex items-center gap-2 mb-2">
              <Sparkles size={14} />
              PARTNER WITH US
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
              STARTUP <span className="text-gradient-mint">PACKAGES</span>
            </h2>
            <p className="font-mono-data text-xs sm:text-sm text-gray-300 font-bold uppercase tracking-widest mt-3">
              SHOWCASE • NETWORK • HIRE • COLLABORATE
            </p>
          </div>

          <div className="max-w-md lg:text-right">
            <p className="font-body text-xs sm:text-sm text-gray-200 leading-relaxed">
              Engage with 8,000+ students, founders, investors, and innovators at one of North India&apos;s largest student-run startup platforms.
            </p>
            <span className="font-mono-data text-[11px] font-bold text-mint uppercase tracking-widest mt-2 block">
              CHOOSE THE TIER THAT FITS YOUR GOALS
            </span>
          </div>
        </div>

        {/* 3 Tier Summary Cards (Silver -> Gold -> Diamond) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2 mb-10">
          {STARTUP_PACKAGES.map((pkg, idx) => (
            <PassCard key={pkg.id} pkg={pkg} index={idx} isCenter={idx === 1} />
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-4">
          <PassesComparisonTable />
        </div>
      </div>
    </section>
  )
}


