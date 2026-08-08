'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Ticket, Zap } from 'lucide-react'

export default function Vdo2Showcase() {
  return (
    <section
      className="relative bg-[#040705] text-white py-24 px-4 sm:px-6 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-white/10"
      aria-label="Passes Showcase"
    >
      {/* ── High-Voltage Ambient Mesh Background Glows ───────────────────── */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-pink-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[160px]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <Zap size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-white">
            PEC SUMMIT 2026 PASSES
          </span>
        </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mb-10 text-black">
          {/* Student Pass — Electric Blue/Purple Gradient */}
          <Link
            href="/passes"
            className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[26px] p-5 text-black shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none min-h-[440px]"
            style={{
              background: 'linear-gradient(165deg, #0284C7 0%, #2563EB 35%, #7C3AED 70%, #EC4899 100%)',
              boxShadow: '0 15px 35px rgba(37,99,235,0.4)',
            }}
          >
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

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/20 pb-3 pt-1">
              <div className="rounded bg-black px-2.5 py-1 text-white shadow-sm">
                <span className="font-display text-xs font-black tracking-tighter">PEC SUMMIT</span>
              </div>
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
            className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[26px] p-5 text-black shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none min-h-[440px]"
            style={{
              background: 'linear-gradient(165deg, #7C3AED 0%, #C026D3 30%, #F43F5E 65%, #F97316 85%, #FBBF24 100%)',
              boxShadow: '0 20px 40px rgba(244,63,94,0.4), 0 0 30px rgba(124,58,237,0.3)',
            }}
          >
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

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/20 pb-3 pt-1">
              <div className="rounded bg-black px-2.5 py-1 text-white shadow-sm">
                <span className="font-display text-xs font-black tracking-tighter">PEC SUMMIT</span>
              </div>
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
            className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[26px] p-5 text-black shadow-2xl transition-all duration-300 hover:-translate-y-2 select-none min-h-[440px]"
            style={{
              background: 'linear-gradient(165deg, #D97706 0%, #F59E0B 35%, #F43F5E 70%, #9333EA 100%)',
              boxShadow: '0 15px 35px rgba(217,119,6,0.4)',
            }}
          >
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

            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/20 pb-3 pt-1">
              <div className="rounded bg-black px-2.5 py-1 text-white shadow-sm">
                <span className="font-display text-xs font-black tracking-tighter">PEC SUMMIT</span>
              </div>
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
          className="group relative inline-flex items-center justify-center gap-3 px-10 h-14 rounded-full font-mono-data text-xs font-black uppercase tracking-[0.2em] bg-white text-black overflow-hidden shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
        >
          <Ticket size={18} strokeWidth={2.5} />
          <span>EXPLORE ALL TICKET PERKS</span>
          <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
