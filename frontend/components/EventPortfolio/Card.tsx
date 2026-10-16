// components/EventPortfolio/Card.tsx
'use client'

import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { PortfolioEvent } from './data'
import BlurImage from '@/components/ui/BlurImage'

interface CardProps {
  event: PortfolioEvent
  index: number
  total: number
  onSelect: (event: PortfolioEvent) => void
  scrollProgress?: MotionValue<number>
}

export function Card({ event, index, total, onSelect }: CardProps) {
  const isComp = ['hackathon', 'competition', 'quiz', 'auction', 'strategy'].some(keyword => event.category.toLowerCase().includes(keyword))
  const registerLink = isComp ? (event.registrationUrl || 'https://unstop.com') : '/register'

  return (
    <motion.div
      onClick={() => onSelect(event)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(event)
        }
      }}
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-panel border border-border-panel hover:border-mint/50 focus-visible:ring-2 focus-visible:ring-mint focus:outline-none w-full max-w-[380px] h-[420px] sm:h-[440px] flex flex-col justify-between shadow-2xl transition-colors duration-300"
      style={{
        boxShadow: 'var(--card-shadow, 0 16px 36px -6px rgba(0,0,0,0.35))',
      }}
    >
      {/* ── Top: Framed Banner Image ── */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/40 shrink-0">
        <BlurImage
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 350px, 320px"
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-black/40" />

        {/* Top-Left: Category Tag Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-wider text-mint bg-void/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-mint/30 shadow-sm">
            {event.eyebrow || event.category}
          </span>
        </div>

        {/* Top-Right: Index Counter */}
        <div className="absolute top-3 right-3 z-10">
          <span className="font-mono-data text-[9.5px] font-bold text-primary bg-panel-alt/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-border-subtle">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Bottom: Structured Content Body ── */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-panel border-t border-border-subtle">
        <div>
          {/* Category Subtext */}
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-muted mb-1 block">
            {event.category}
          </span>

          {/* Event Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-primary group-hover:text-mint transition-colors duration-200 line-clamp-1 leading-snug">
            {event.title}
          </h3>

          {/* Description Teaser */}
          <p className="font-body text-xs text-secondary font-normal line-clamp-2 leading-relaxed mt-2 mb-3">
            {event.purpose}
          </p>

          {/* Tags Chips */}
          {Array.isArray(event.tags) && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {event.tags.slice(0, 2).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="font-mono-data text-[9px] font-semibold text-secondary bg-panel-alt border border-border-subtle px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer: Participation & Action Arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-auto">
          <span className="font-mono-data text-[9.5px] font-semibold text-muted truncate max-w-[150px]">
            {event.expectedParticipation || 'PEC E-Summit 2026'}
          </span>

          <div className="flex items-center gap-2">
            {isComp && (
              <>
                <a
                  href={registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center h-7 px-3.5 rounded-lg bg-mint text-void font-mono-data text-[10px] font-black uppercase tracking-wider hover:brightness-110 hover:scale-105 transition-all"
                >
                  Register
                </a>
                <div className="flex items-center gap-1.5 font-mono-data text-[10.5px] font-bold text-mint group-hover:translate-x-0.5 transition-transform">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/15 text-mint group-hover:bg-mint group-hover:text-void transition-colors shadow-xs">
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
