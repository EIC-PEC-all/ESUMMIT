'use client'

import React from 'react'

import PageBanner from '@/components/Common/PageBanner'

export default function Timeline() {
  return (
    <>
      <PageBanner title="TIMELINE" subtitle="DAY 1 & DAY 2 LIVE AGENDA" />
      <section
        id="schedule"
        className="relative bg-[#07130F] text-white pt-12 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10 scroll-mt-20 sm:scroll-mt-24"
        aria-labelledby="schedule-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10">

        {/* Coming Soon Glassmorphic Showcase */}
        <div
          className="relative rounded-3xl bg-[#071711]/90 border border-mint/20 p-6 sm:p-8 md:p-10 text-center shadow-2xl overflow-hidden backdrop-blur-xl"
        >

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/30 text-mint font-mono-data text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
            </span>
            <span>Schedule Configuration</span>
          </div>

          {/* Main Title */}
          <h3
            className="font-display font-black uppercase tracking-wider text-white mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.25rem)' }}
          >
            COMING SOON
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-gray-300 font-body max-w-lg mx-auto leading-relaxed mb-6">
            We are currently finalizing the speaker timings, hackathon schedules, and investor panel alignments. The complete two-day agenda will be released shortly. Stay tuned.
          </p>
        </div>
      </div>
      </section>
    </>
  )
}
