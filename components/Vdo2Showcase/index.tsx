'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Ticket, Zap } from 'lucide-react'

export default function Vdo2Showcase() {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <section
      id="passes"
      className="relative bg-[#040705] text-white py-24 px-4 sm:px-6 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-white/10"
      aria-label="Passes Showcase"
    >
      {/* ── High-Voltage Ambient Mesh Background Glows ───────────────────── */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-lime-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-emerald-700/20 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-green-400/10 blur-[160px]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">


        {/* Headline — WHITE with High-Voltage Drop Shadow */}
        <h2
          className="font-display font-black uppercase leading-none tracking-tight text-center text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] mb-4"
          style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
        >
          PASSES
        </h2>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal mb-10">
          Unlock 2 days of high-octane pitch battles, 24-hr hackathons, keynotes, and 1-on-1 VC deal-making at North India&apos;s flagship summit.
        </p>

        {/* Pass Tier Cards Grid — Exact Scalloped Barcode Ticket Stubs */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full mb-10 text-black"
        >
          {/* Student Pass — Electric Blue/Purple Gradient */}
          <Link
            href="/passes"
            className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[26px] p-5 text-black shadow-2xl transition-all duration-500 select-none min-h-[440px] ${
              isHovered 
                ? 'sm:translate-x-0 sm:rotate-0 sm:scale-100 sm:hover:scale-[1.05] z-10 sm:hover:z-30'
                : 'sm:translate-x-[48px] sm:-rotate-6 sm:scale-[0.88] z-10'
            }`}
            style={{
              background: 'linear-gradient(165deg, #39FF14 0%, #00DD00 50%, #009900 100%)',
              boxShadow: '0 15px 35px rgba(57,255,20,0.35)',
            }}
          >
            {/* Subtle Textured Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.16] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px), repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 12px)',
                backgroundSize: '16px 16px, 12px 12px',
              }}
            />

            {/* Top Scalloped Teeth */}
            <div className="absolute left-0 right-0 -top-1.5 z-30 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#040705]" />
              ))}
            </div>
            {/* Bottom Scalloped Teeth */}
            <div className="absolute left-0 right-0 -bottom-1.5 z-30 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#040705]" />
              ))}
            </div>
            {/* Side Circular Notches */}
            <div className="pointer-events-none absolute left-0 top-20 -translate-x-1/2 h-6 w-6 rounded-full bg-[#040705] z-30" />
            <div className="pointer-events-none absolute right-0 top-20 translate-x-1/2 h-6 w-6 rounded-full bg-[#040705] z-30" />

            {/* Dotted Tear Line */}
            <div className="absolute left-3 right-3 top-[91px] z-20 border-t-2 border-dashed border-black/15 pointer-events-none flex justify-center select-none">
              <span className="font-mono-data text-[7px] text-black/40 px-2 -translate-y-1.5 uppercase font-bold tracking-widest bg-transparent">
                cut here
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/20 pb-3 pt-1">
              <span className="font-display text-xs font-black tracking-tighter text-black uppercase">PEC SUMMIT</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-[8px] font-bold text-black/80 [writing-mode:vertical-lr] rotate-180">
                  STU-88742
                </span>
                <div className="flex h-9 gap-0.5 bg-white/90 p-1 rounded">
                  {[2, 1, 3, 1, 2, 1, 3, 2, 1, 4].map((w, idx) => (
                    <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="my-3 flex-1 flex flex-col justify-center text-left">
              <span className="font-mono-data text-[9px] font-bold text-black/70">#STU-88742</span>
              <h3 className="font-display text-3xl font-black uppercase tracking-tighter text-black leading-none my-1">
                STUDENT <br /> <span className="text-stroke-black">PASS</span>
              </h3>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className="font-mono-data text-3xl font-black text-black">₹299</span>
                <span className="font-mono-data text-xs text-black/60 line-through">₹499</span>
              </div>
            </div>

            {/* Metadata & Barcode */}
            <div className="border-t border-black/20 pt-2.5">
              <div className="flex justify-between font-mono-data text-[9px] font-bold text-black mb-2">
                <span>MARCH 15-16</span>
                <span>GENERAL ACCESS</span>
              </div>
              <div className="w-full flex h-9 items-center justify-between bg-white/90 p-1 rounded-lg border border-black/20 overflow-hidden">
                {[2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2].map((w, idx) => (
                  <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </Link>

          {/* Founder & Pitch Pass — Reference Purple/Coral Gradient (Featured) */}
          <Link
            href="/passes"
            className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[26px] p-5 text-black shadow-2xl transition-all duration-500 select-none min-h-[440px] ${
              isHovered 
                ? 'sm:translate-x-0 sm:rotate-0 sm:scale-100 sm:hover:scale-[1.05] z-10 sm:hover:z-30'
                : 'sm:translate-x-0 sm:rotate-0 sm:scale-[1.04] z-20'
            }`}
            style={{
              background: 'linear-gradient(165deg, #E2FF6E 0%, #BAEF4B 30%, #7FD420 65%, #4EAA0A 100%)',
              boxShadow: '0 15px 35px rgba(186,239,75,0.35)',
            }}
          >
            {/* Subtle Textured Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.16] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px), repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 12px)',
                backgroundSize: '16px 16px, 12px 12px',
              }}
            />

            {/* Top Scalloped Teeth */}
            <div className="absolute left-0 right-0 -top-1.5 z-30 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#040705]" />
              ))}
            </div>
            {/* Bottom Scalloped Teeth */}
            <div className="absolute left-0 right-0 -bottom-1.5 z-30 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#040705]" />
              ))}
            </div>
            {/* Side Circular Notches */}
            <div className="pointer-events-none absolute left-0 top-20 -translate-x-1/2 h-6 w-6 rounded-full bg-[#040705] z-30" />
            <div className="pointer-events-none absolute right-0 top-20 translate-x-1/2 h-6 w-6 rounded-full bg-[#040705] z-30" />

            {/* Dotted Tear Line */}
            <div className="absolute left-3 right-3 top-[91px] z-20 border-t-2 border-dashed border-black/15 pointer-events-none flex justify-center select-none">
              <span className="font-mono-data text-[7px] text-black/40 px-2 -translate-y-1.5 uppercase font-bold tracking-widest bg-transparent">
                cut here
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/20 pb-3 pt-1">
              <span className="font-display text-xs font-black tracking-tighter text-black uppercase">PEC SUMMIT</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-[8px] font-bold text-black/80 [writing-mode:vertical-lr] rotate-180">
                  PITCH-087636
                </span>
                <div className="flex h-9 gap-0.5 bg-white/90 p-1 rounded">
                  {[2, 1, 3, 1, 2, 1, 3, 2, 1, 4].map((w, idx) => (
                    <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="my-3 flex-1 flex flex-col justify-center text-left">
              <span className="font-mono-data text-[9px] font-bold text-black/70">#PITCH-087636</span>
              <h3 className="font-display text-3xl font-black uppercase tracking-tighter text-black leading-none my-1">
                PITCH <br /> <span className="text-stroke-black">PASS</span>
              </h3>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className="font-mono-data text-3xl font-black text-black">₹799</span>
                <span className="font-mono-data text-xs text-black/60 line-through">₹1,299</span>
              </div>
            </div>

            {/* Metadata & Barcode */}
            <div className="border-t border-black/20 pt-2.5">
              <div className="flex justify-between font-mono-data text-[9px] font-bold text-black mb-2">
                <span>MARCH 15-16</span>
                <span>PITCH ARENA</span>
              </div>
              <div className="w-full flex h-9 items-center justify-between bg-white/90 p-1 rounded-lg border border-black/20 overflow-hidden">
                {[2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2].map((w, idx) => (
                  <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </Link>

          {/* VIP Pass — Golden Amber/Rose Gradient */}
          <Link
            href="/passes"
            className={`group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[26px] p-5 text-black shadow-2xl transition-all duration-500 select-none min-h-[440px] ${
              isHovered 
                ? 'sm:translate-x-0 sm:rotate-0 sm:scale-100 sm:hover:scale-[1.05] z-10 sm:hover:z-30'
                : 'sm:translate-x-[-48px] sm:rotate-6 sm:scale-[0.88] z-10'
            }`}
            style={{
              background: 'linear-gradient(165deg, #FFFFFF 0%, #F0FFF4 40%, #CCFFD5 100%)',
              boxShadow: '0 15px 35px rgba(204,255,213,0.5)',
            }}
          >
            {/* Subtle Textured Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #000 1.2px, transparent 1.2px), repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 12px)',
                backgroundSize: '16px 16px, 12px 12px',
              }}
            />

            {/* Top Scalloped Teeth */}
            <div className="absolute left-0 right-0 -top-1.5 z-30 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#040705]" />
              ))}
            </div>
            {/* Bottom Scalloped Teeth */}
            <div className="absolute left-0 right-0 -bottom-1.5 z-30 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full bg-[#040705]" />
              ))}
            </div>
            {/* Side Circular Notches */}
            <div className="pointer-events-none absolute left-0 top-20 -translate-x-1/2 h-6 w-6 rounded-full bg-[#040705] z-30" />
            <div className="pointer-events-none absolute right-0 top-20 translate-x-1/2 h-6 w-6 rounded-full bg-[#040705] z-30" />

            {/* Dotted Tear Line */}
            <div className="absolute left-3 right-3 top-[91px] z-20 border-t-2 border-dashed border-black/15 pointer-events-none flex justify-center select-none">
              <span className="font-mono-data text-[7px] text-black/45 px-2 -translate-y-1.5 uppercase font-bold tracking-widest bg-transparent">
                cut here
              </span>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/20 pb-3 pt-1">
              <span className="font-display text-xs font-black tracking-tighter text-black uppercase">PEC SUMMIT</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-[8px] font-bold text-black/80 [writing-mode:vertical-lr] rotate-180">
                  VIP-00109
                </span>
                <div className="flex h-9 gap-0.5 bg-white/90 p-1 rounded">
                  {[2, 1, 3, 1, 2, 1, 3, 2, 1, 4].map((w, idx) => (
                    <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="my-3 flex-1 flex flex-col justify-center text-left">
              <span className="font-mono-data text-[9px] font-bold text-black/70">#VIP-00109</span>
              <h3 className="font-display text-3xl font-black uppercase tracking-tighter text-black leading-none my-1">
                VIP <br /> <span className="text-stroke-black">PASS</span>
              </h3>
              <div className="my-2 flex items-baseline gap-1.5">
                <span className="font-mono-data text-3xl font-black text-black">₹1,499</span>
                <span className="font-mono-data text-xs text-black/60 line-through">₹2,499</span>
              </div>
            </div>

            {/* Metadata & Barcode */}
            <div className="border-t border-black/20 pt-2.5">
              <div className="flex justify-between font-mono-data text-[9px] font-bold text-black mb-2">
                <span>MARCH 15-16</span>
                <span>VIP LOUNGE</span>
              </div>
              <div className="w-full flex h-9 items-center justify-between bg-white/90 p-1 rounded-lg border border-black/20 overflow-hidden">
                {[2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2].map((w, idx) => (
                  <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* Main CTA Link */}
        <Link
          href="/passes"
          className="group relative mt-8 sm:mt-4 inline-flex items-center justify-center gap-3 px-10 h-14 rounded-full font-mono-data text-xs font-black uppercase tracking-[0.2em] bg-white text-black overflow-hidden shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
        >
          <Ticket size={18} strokeWidth={2.5} />
          <span>EXPLORE ALL TICKET PERKS</span>
          <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
