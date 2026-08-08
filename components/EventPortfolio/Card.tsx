// components/EventPortfolio/Card.tsx
'use client'

import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import {
  Laptop,
  Briefcase,
  Microscope,
  Gavel,
  Zap,
  Compass,
  ShoppingBag,
  HelpCircle,
  Brain,
  Users,
  Mic,
  TrendingUp,
  FileText,
  ArrowUpRight,
  LucideIcon,
} from 'lucide-react'
import { PortfolioEvent } from './data'

const ICON_MAP: Record<string, LucideIcon> = {
  Laptop,
  Briefcase,
  Microscope,
  Gavel,
  Zap,
  Compass,
  ShoppingBag,
  HelpCircle,
  Brain,
  Users,
  Mic,
  TrendingUp,
  FileText,
}

interface CardProps {
  event: PortfolioEvent
  index: number
  total: number
  onSelect: (event: PortfolioEvent) => void
  scrollProgress?: MotionValue<number>
}

export function Card({ event, index, total, onSelect }: CardProps) {
  const IconComponent = ICON_MAP[event.iconName] || Zap

  return (
    <motion.div
      onClick={() => onSelect(event)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -6 }}
      className="group relative flex w-[320px] sm:w-[380px] md:w-[420px] lg:w-[440px] shrink-0 cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-[#0C120F] p-5 sm:p-6 transition-colors duration-200 hover:border-mint/50 hover:bg-[#101914]"
    >
      {/* ── Top Header: Eyebrow + Index ── */}
      <div className="relative z-20 flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-mint">
          {event.eyebrow}
        </span>
        <span className="text-xs font-mono-data text-neutral-500 group-hover:text-neutral-300 transition-colors">
          {event.number} / {total.toString().padStart(2, '0')}
        </span>
      </div>

      {/* ── 16:9 Media Preview Artwork Container with Thematic Image ── */}
      <div className="relative z-20 my-2 w-full aspect-[16/9] rounded-xl border border-white/10 bg-neutral-950 overflow-hidden transition-colors duration-200 group-hover:border-mint/40">
        {/* Event Specific Thematic Image */}
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover opacity-65 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        {/* Gradient Scrim Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C120F] via-[#0C120F]/40 to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />

        {/* Badge & Icon Overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white shadow-md backdrop-blur-md">
            <IconComponent size={16} className="text-mint" />
          </div>

          <span className="inline-flex items-center rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-neutral-200 backdrop-blur-md">
            {event.badge}
          </span>
        </div>

        {/* Top-Right Category Pill */}
        <div className="absolute right-2.5 top-2.5 z-10">
          <span className="rounded-full bg-black/75 border border-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-mint backdrop-blur-md">
            {event.category}
          </span>
        </div>
      </div>

      {/* ── Content Block: Title & Purpose ── */}
      <div className="relative z-20 mt-3 flex flex-col gap-1.5">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-mint transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-neutral-400 line-clamp-2">
          {event.purpose}
        </p>
      </div>

      {/* ── Tag Chips ── */}
      <div className="relative z-20 mt-3 flex flex-wrap gap-1.5">
        {event.tags.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="rounded-md bg-neutral-950 border border-white/5 px-2.5 py-1 text-[11px] font-medium text-neutral-400 group-hover:border-mint/20 group-hover:text-neutral-300 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ── Bottom Action Row ── */}
      <div className="relative z-20 mt-4 flex items-center justify-between border-t border-white/10 pt-3.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 group-hover:text-mint transition-colors">
          Explore Event
        </span>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-neutral-300 group-hover:border-mint group-hover:bg-mint group-hover:text-black transition-all duration-200">
          <ArrowUpRight size={15} />
        </div>
      </div>
    </motion.div>
  )
}
