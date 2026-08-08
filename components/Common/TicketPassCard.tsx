'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface PassTier {
  id: string
  name: string
  tagline: string
  price: string
  originalPrice?: string
  badge?: string
  popular?: boolean
  category: 'student' | 'founder' | 'group'
  features: string[]
  gradient: string
  code: string
  passengerType: string
  cabinClass: string
  ctaText: string
}

interface TicketPassCardProps {
  pass: PassTier
  onSelectPass: (pass: PassTier) => void
}

export default function TicketPassCard({ pass, onSelectPass }: TicketPassCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, rotate: pass.popular ? 0 : 0.5, scale: 1.02 }}
      onClick={() => onSelectPass(pass)}
      className="group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-[32px] p-6 text-black shadow-2xl transition-all duration-300 select-none min-h-[580px]"
      style={{
        background: pass.gradient,
        boxShadow: pass.popular
          ? '0 20px 40px rgba(244,63,94,0.4), 0 0 50px rgba(124,58,237,0.3)'
          : '0 15px 35px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Scalloped Top Teeth Cutouts ───────────────────────────────────── */}
      <div className="absolute left-0 right-0 -top-2 z-30 flex justify-between px-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-4 w-4 rounded-full bg-void" />
        ))}
      </div>

      {/* ── Scalloped Bottom Teeth Cutouts ────────────────────────────────── */}
      <div className="absolute left-0 right-0 -bottom-2 z-30 flex justify-between px-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-4 w-4 rounded-full bg-void" />
        ))}
      </div>

      {/* ── Side Circular Notch Cutouts ────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-0 top-24 -translate-x-1/2 h-8 w-8 rounded-full bg-void z-30" />
      <div className="pointer-events-none absolute right-0 top-24 translate-x-1/2 h-8 w-8 rounded-full bg-void z-30" />

      {/* ── HEADER SECTION: LOGO BADGE & VERTICAL BARCODE ────────────────── */}
      <div className="flex items-start justify-between border-b border-black/15 pb-4 pt-2">
        {/* Solid Black Logo Badge */}
        <div className="rounded-lg bg-black px-4 py-2 text-white shadow-md">
          <span className="font-display text-lg font-black tracking-tighter">PEC SUMMIT</span>
        </div>

        {/* Top Right Barcode Strip + Serial Number */}
        <div className="flex items-center gap-2">
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-black/70 [writing-mode:vertical-lr] rotate-180">
            {pass.code}
          </span>
          <div className="flex h-12 gap-0.5 bg-white/90 p-1 rounded border border-black/20">
            {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2].map((w, idx) => (
              <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── TICKET BODY: SERIAL & ULTRA-BOLD HEADLINE ────────────────────── */}
      <div className="my-4 flex-1 flex flex-col justify-center">
        <span className="font-mono-data text-[11px] font-bold uppercase tracking-widest text-black/80">
          #{pass.code}
        </span>

        <h3 className="font-display text-4xl sm:text-5xl font-black uppercase leading-[0.95] tracking-tighter text-black my-2">
          {pass.name.split(' ')[0]} <br />
          <span className="text-stroke-black opacity-90">{pass.name.split(' ').slice(1).join(' ')}</span>
        </h3>

        <div className="my-3 flex items-center justify-between border-y border-black/20 py-2">
          <span className="font-display text-xs font-bold tracking-widest text-black uppercase">
            PEC SUMMIT ***
          </span>
          <span className="font-mono-data text-xs font-bold text-black">2026</span>
        </div>

        {/* Pricing Badge */}
        <div className="my-2 flex items-baseline gap-2">
          <span className="font-mono-data text-4xl sm:text-5xl font-black text-black">
            {pass.price}
          </span>
          {pass.originalPrice && (
            <span className="font-mono-data text-sm font-bold text-black/60 line-through">
              {pass.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* ── METADATA GRID & GEOMETRIC STAMP ───────────────────────────────── */}
      <div className="my-3 grid grid-cols-2 gap-3 border-t border-black/20 pt-3 text-black">
        <div>
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-black/60 block">
            DATE
          </span>
          <span className="font-mono-data text-xs font-bold uppercase text-black">MARCH 15-16</span>
        </div>

        <div>
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-black/60 block">
            CABIN / ACCESS
          </span>
          <span className="font-mono-data text-xs font-bold uppercase text-black">
            {pass.cabinClass}
          </span>
        </div>

        <div>
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-black/60 block">
            PASSENGER TIER
          </span>
          <span className="font-mono-data text-xs font-bold uppercase text-black">
            {pass.passengerType}
          </span>
        </div>

        {/* Geometric Triple-Circle Icon Stamp */}
        <div className="flex justify-end items-end">
          <div className="flex items-center gap-1 opacity-80">
            <div className="h-4 w-4 rounded-full bg-black" />
            <div className="h-4 w-4 rounded-full bg-black/70" />
            <div className="h-4 w-4 rounded-full bg-black/40" />
          </div>
        </div>
      </div>

      {/* ── BOTTOM FULL-WIDTH BARCODE STRIP ───────────────────────────────── */}
      <div className="mt-2 pt-3 border-t border-black/20 flex flex-col items-center">
        <div className="w-full flex h-14 items-center justify-between bg-white/95 p-2 rounded-xl border border-black/30 shadow-inner overflow-hidden">
          {[3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3, 1, 4, 2, 1, 3, 2].map(
            (w, idx) => (
              <div key={idx} className="h-full bg-black" style={{ width: `${w * 1.5}px` }} />
            )
          )}
        </div>

        {/* CTA Label */}
        <div className="mt-3 flex items-center gap-2 font-mono-data text-xs font-black uppercase tracking-widest text-black group-hover:scale-105 transition-transform">
          <span>CLICK TO BOOK TICKET &rarr;</span>
        </div>
      </div>
    </motion.div>
  )
}
