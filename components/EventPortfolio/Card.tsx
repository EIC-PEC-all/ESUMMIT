// components/EventPortfolio/Card.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { motion, MotionValue } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { PortfolioEvent } from './data'

interface CardProps {
  event: PortfolioEvent
  index: number
  total: number
  onSelect: (event: PortfolioEvent) => void
  scrollProgress?: MotionValue<number>
}

export function Card({ event, index, total, onSelect }: CardProps) {
  const hasImage = Boolean(event.image && !event.image.includes('unsplash.com'))

  return (
    <motion.div
      onClick={() => onSelect(event)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-[#7ED321]/30 bg-[#0B150E] transition-all hover:border-[#7ED321] hover:shadow-[0_0_30px_rgba(126,211,33,0.3)]"
      style={{ width: 'clamp(200px, 22vw, 280px)', height: 'clamp(280px, 40vh, 380px)' }}
    >
      {/* If real uploaded image is present */}
      {hasImage ? (
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 280px, 22vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#0B150E] group-hover:bg-[#101F15] transition-colors">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/40 text-[#7ED321] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(126,211,33,0.2)]">
            <Plus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#7ED321] transition-colors block">
              + Insert Image
            </span>
            <span className="font-mono text-[10px] text-[#8A9488] block">
              Event #{event.number} &middot; Via Admin CMS
            </span>
          </div>
        </div>
      )}

      {/* Bottom gradient scrim — primary text zone */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

      {/* Index number — large faded watermark */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-white/[0.06] select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(80px, 15vw, 140px)' }}
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Top-left: index counter */}
      <div className="absolute top-3 left-3 z-10">
        <span className="font-mono-data text-[10px] font-bold text-white/50 bg-black/60 px-2 py-0.5 rounded-full">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom content zone */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Eyebrow */}
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-[0.2em] text-mint/90 truncate">
            {event.eyebrow}
          </span>
          {/* Event name */}
          <h3 className="font-display text-lg font-black uppercase leading-tight tracking-tight text-white group-hover:text-mint transition-colors duration-300 line-clamp-2">
            {event.title}
          </h3>
        </div>

        {/* Arrow CTA */}
        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white transition-colors duration-300 group-hover:bg-mint group-hover:border-mint group-hover:text-black">
          <ArrowUpRight size={16} />
        </div>
      </div>
    </motion.div>
  )
}
