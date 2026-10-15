'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Ticket } from 'lucide-react'
import { useSummitData } from '@/hooks/useSummitData'

export default function Vdo2Showcase() {
  const { data } = useSummitData()
  const summitDates = data?.siteConfig?.summitDates || 'MARCH 19–21, 2026'
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section
      id="passes"
      className="relative bg-section-1 text-white py-16 sm:py-20 px-4 sm:px-6 overflow-hidden rounded-t-[36px] sm:rounded-t-[48px] -mt-10 sm:-mt-12 z-10 border-t border-white/10"
      aria-label="Passes Showcase"
    >
      {/* Ambient Mint Glows */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-[380px] w-[380px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.12) 0%, rgba(0,245,212,0) 70%)' }}
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-0 h-[380px] w-[380px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(123,184,50,0.10) 0%, rgba(123,184,50,0) 70%)' }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Headline */}
        <h2
          className="font-display font-black uppercase leading-none tracking-tight text-center drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)] mb-3 select-none"
          style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.25rem)' }}
        >
          <span className="text-gradient-mint">PASSES</span>
        </h2>

        {/* Subtitle */}
        <p className="font-body text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed font-normal mb-8">
          Unlock 2 days of pitch battles, hackathons, keynotes, and VC deal-making at North India&apos;s flagship summit.
        </p>

        {/* Pass Tier Cards Grid — Compact, Precision-Aligned Ticket Stubs */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl w-full mb-8 text-black"
        >
          {/* 1. Student Pass */}
          <Link
            href="/passes"
            className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[20px] p-4 text-black shadow-xl transition-all duration-500 ease-out select-none min-h-[350px] sm:min-h-[365px] ${
              isHovered
                ? 'sm:translate-x-0 sm:rotate-0 sm:scale-100 sm:hover:scale-[1.04] z-10 sm:hover:z-30'
                : 'sm:translate-x-6 sm:-rotate-6 sm:scale-[0.94] z-10'
            }`}
            style={{
              background: 'linear-gradient(150deg, #00F5D4 0%, #00DFBA 50%, #009E86 100%)',
              boxShadow: '0 12px 28px rgba(0,245,212,0.25)',
            }}
          >
            {/* Subtle Texture */}
            <div
              className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #000 1px, transparent 1px), repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)',
                backgroundSize: '14px 14px, 10px 10px',
              }}
            />

            {/* Side Circular Notches */}
            <div className="pointer-events-none absolute -left-2.5 top-[66px] h-5 w-5 rounded-full bg-section-1 z-30" />
            <div className="pointer-events-none absolute -right-2.5 top-[66px] h-5 w-5 rounded-full bg-section-1 z-30" />

            {/* Dotted Tear Line aligned with notches */}
            <div className="absolute left-2.5 right-2.5 top-[75px] z-20 border-t border-dashed border-black/25 pointer-events-none flex justify-center select-none">
              <span className="font-mono-data text-[7px] text-black/50 px-2 -translate-y-1.5 uppercase font-bold tracking-widest bg-transparent">
                cut here
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/15 pb-2.5 pt-0.5">
              <span className="font-display text-[11px] font-black tracking-wider text-black uppercase">
                E-SUMMIT &apos;26
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-[7.5px] font-bold text-black/75 [writing-mode:vertical-lr] rotate-180">
                  STU-88742
                </span>
                <div className="flex h-7 gap-0.5 bg-white/95 p-0.5 rounded shadow-xs">
                  {[2, 1, 2, 1, 3, 1, 2, 1, 3, 2].map((w, idx) => (
                    <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title, Perks & Price */}
            <div className="my-2 flex-1 flex flex-col justify-center text-left">
              <span className="font-mono-data text-[8.5px] font-bold text-black/60">#STU-88742</span>
              <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black leading-none my-1">
                STUDENT <span className="opacity-80">PASS</span>
              </h3>
              <p className="font-mono-data text-[9.5px] text-black/75 font-semibold mb-2">
                All Keynotes • Hackathons • Starter Kit
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono-data text-2xl sm:text-[28px] font-black text-black">₹299</span>
                <span className="font-mono-data text-xs text-black/50 line-through">₹499</span>
              </div>
            </div>

            {/* Metadata & Barcode */}
            <div className="border-t border-black/15 pt-2">
              <div className="flex justify-between font-mono-data text-[8px] font-bold text-black/80 mb-1.5">
                <span>{summitDates}</span>
                <span>GENERAL ACCESS</span>
              </div>
              <div className="w-full h-7 rounded border border-black/15 overflow-hidden bg-white/95 p-0.5 shadow-xs">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 7px, transparent 7px, transparent 9px, #000 9px, #000 10px, transparent 10px, transparent 13px)',
                  }}
                />
              </div>
            </div>
          </Link>

          {/* 2. Pitch Pass (Featured / Elevated) */}
          <Link
            href="/passes"
            className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[20px] p-4 text-black shadow-2xl transition-all duration-500 ease-out select-none min-h-[350px] sm:min-h-[365px] ${
              isHovered
                ? 'sm:translate-x-0 sm:rotate-0 sm:scale-100 sm:hover:scale-[1.04] z-20 sm:hover:z-30'
                : 'sm:translate-y-[-8px] sm:rotate-0 sm:scale-[1.03] z-20'
            }`}
            style={{
              background: 'linear-gradient(150deg, #5CFFE6 0%, #00F5D4 45%, #00C4A9 100%)',
              boxShadow: '0 16px 36px rgba(0,245,212,0.32)',
            }}
          >
            {/* Featured Badge */}
            <div className="absolute top-2 right-2 rounded-full bg-black text-[#00F5D4] px-2 py-0.5 font-mono-data text-[7.5px] font-black tracking-widest uppercase shadow">
              POPULAR
            </div>

            {/* Subtle Texture */}
            <div
              className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #000 1px, transparent 1px), repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)',
                backgroundSize: '14px 14px, 10px 10px',
              }}
            />

            {/* Side Circular Notches */}
            <div className="pointer-events-none absolute -left-2.5 top-[66px] h-5 w-5 rounded-full bg-section-1 z-30" />
            <div className="pointer-events-none absolute -right-2.5 top-[66px] h-5 w-5 rounded-full bg-section-1 z-30" />

            {/* Dotted Tear Line aligned with notches */}
            <div className="absolute left-2.5 right-2.5 top-[75px] z-20 border-t border-dashed border-black/25 pointer-events-none flex justify-center select-none">
              <span className="font-mono-data text-[7px] text-black/50 px-2 -translate-y-1.5 uppercase font-bold tracking-widest bg-transparent">
                cut here
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/15 pb-2.5 pt-0.5">
              <span className="font-display text-[11px] font-black tracking-wider text-black uppercase">
                E-SUMMIT &apos;26
              </span>
              <div className="flex items-center gap-1.5 mr-16">
                <span className="font-mono-data text-[7.5px] font-bold text-black/75 [writing-mode:vertical-lr] rotate-180">
                  PITCH-087636
                </span>
                <div className="flex h-7 gap-0.5 bg-white/95 p-0.5 rounded shadow-xs">
                  {[2, 1, 2, 1, 3, 1, 2, 1, 3, 2].map((w, idx) => (
                    <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title, Perks & Price */}
            <div className="my-2 flex-1 flex flex-col justify-center text-left">
              <span className="font-mono-data text-[8.5px] font-bold text-black/60">#PITCH-087636</span>
              <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black leading-none my-1">
                PITCH <span className="opacity-80">PASS</span>
              </h3>
              <p className="font-mono-data text-[9.5px] text-black/75 font-semibold mb-2">
                Pitch to 30+ VCs • Pitch Arena Access
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono-data text-2xl sm:text-[28px] font-black text-black">₹799</span>
                <span className="font-mono-data text-xs text-black/50 line-through">₹1,299</span>
              </div>
            </div>

            {/* Metadata & Barcode */}
            <div className="border-t border-black/15 pt-2">
              <div className="flex justify-between font-mono-data text-[8px] font-bold text-black/80 mb-1.5">
                <span>{summitDates}</span>
                <span>PITCH ARENA</span>
              </div>
              <div className="w-full h-7 rounded border border-black/15 overflow-hidden bg-white/95 p-0.5 shadow-xs">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, #000 0px, #000 3px, transparent 3px, transparent 5px, #000 5px, #000 6px, transparent 6px, transparent 9px, #000 9px, #000 12px, transparent 12px, transparent 15px)',
                  }}
                />
              </div>
            </div>
          </Link>

          {/* 3. VIP Pass */}
          <Link
            href="/passes"
            className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[20px] p-4 text-black shadow-xl transition-all duration-500 ease-out select-none min-h-[350px] sm:min-h-[365px] ${
              isHovered
                ? 'sm:translate-x-0 sm:rotate-0 sm:scale-100 sm:hover:scale-[1.04] z-10 sm:hover:z-30'
                : 'sm:-translate-x-6 sm:rotate-6 sm:scale-[0.94] z-10'
            }`}
            style={{
              background: 'linear-gradient(150deg, #FFFFFF 0%, #EFFCF9 50%, #5CFFE6 100%)',
              boxShadow: '0 12px 28px rgba(0,245,212,0.20)',
            }}
          >
            {/* Subtle Texture */}
            <div
              className="absolute inset-0 opacity-[0.10] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #000 1px, transparent 1px), repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)',
                backgroundSize: '14px 14px, 10px 10px',
              }}
            />

            {/* Side Circular Notches */}
            <div className="pointer-events-none absolute -left-2.5 top-[66px] h-5 w-5 rounded-full bg-section-1 z-30" />
            <div className="pointer-events-none absolute -right-2.5 top-[66px] h-5 w-5 rounded-full bg-section-1 z-30" />

            {/* Dotted Tear Line aligned with notches */}
            <div className="absolute left-2.5 right-2.5 top-[75px] z-20 border-t border-dashed border-black/25 pointer-events-none flex justify-center select-none">
              <span className="font-mono-data text-[7px] text-black/45 px-2 -translate-y-1.5 uppercase font-bold tracking-widest bg-transparent">
                cut here
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/15 pb-2.5 pt-0.5">
              <span className="font-display text-[11px] font-black tracking-wider text-black uppercase">
                E-SUMMIT &apos;26
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-[7.5px] font-bold text-black/75 [writing-mode:vertical-lr] rotate-180">
                  VIP-00109
                </span>
                <div className="flex h-7 gap-0.5 bg-white/95 p-0.5 rounded shadow-xs">
                  {[2, 1, 2, 1, 3, 1, 2, 1, 3, 2].map((w, idx) => (
                    <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title, Perks & Price */}
            <div className="my-2 flex-1 flex flex-col justify-center text-left">
              <span className="font-mono-data text-[8.5px] font-bold text-black/60">#VIP-00109</span>
              <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black leading-none my-1">
                VIP <span className="opacity-80">PASS</span>
              </h3>
              <p className="font-mono-data text-[9.5px] text-black/75 font-semibold mb-2">
                VIP Lounge • Speaker Mixer • Priority
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono-data text-2xl sm:text-[28px] font-black text-black">₹1,499</span>
                <span className="font-mono-data text-xs text-black/50 line-through">₹2,499</span>
              </div>
            </div>

            {/* Metadata & Barcode */}
            <div className="border-t border-black/15 pt-2">
              <div className="flex justify-between font-mono-data text-[8px] font-bold text-black/80 mb-1.5">
                <span>{summitDates}</span>
                <span>VIP LOUNGE</span>
              </div>
              <div className="w-full h-7 rounded border border-black/15 overflow-hidden bg-white/95 p-0.5 shadow-xs">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 3px, #000 3px, #000 5px, transparent 5px, transparent 8px, #000 8px, #000 11px, transparent 11px, transparent 14px)',
                  }}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Action Button */}
        <Link
          href="/passes"
          className="group relative inline-flex items-center justify-center gap-2.5 px-7 h-11 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider bg-white text-black overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          <Ticket size={15} strokeWidth={2} />
          <span>VIEW ALL PASS DETAILS</span>
          <ArrowUpRight
            size={15}
            strokeWidth={2}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>
    </section>
  )
}
