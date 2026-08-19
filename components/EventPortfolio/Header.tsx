// components/EventPortfolio/Header.tsx
'use client'

import React from 'react'
import { motion, MotionValue, useTransform } from 'framer-motion'
import { Sparkles, ArrowRight, SlidersHorizontal } from 'lucide-react'

interface HeaderProps {
  progress: MotionValue<number>
  totalEvents: number
  activeCategory: string
  onCategorySelect: (category: string) => void
  onMenuToggle?: () => void
  categories: string[]
}

export function Header({
  progress,
  totalEvents,
  activeCategory,
  onCategorySelect,
  onMenuToggle,
  categories,
}: HeaderProps) {
  const eventIndexProgress = useTransform(progress, [0, 1], [1, totalEvents])

  return (
    <header className="pointer-events-auto absolute left-0 right-0 top-0 z-30 flex flex-col items-center px-4 pt-4 sm:px-8 sm:pt-6">
      {/* Top Clean Header Nav */}
      <div className="bg-neutral-900/95 relative flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 px-5 py-3 transition-all duration-200">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-white transition-colors hover:text-emerald-400"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-emerald-400 border border-white/10">
              <Sparkles size={14} />
            </span>
            <span className="flex items-center gap-2 font-display">
              E-SUMMIT
              <span className="text-neutral-500 font-normal text-xs">|</span>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium hidden sm:inline">
                EVENT SCHEDULE
              </span>
            </span>
          </a>
        </div>

        {/* Center: Dynamic Category Tab Switcher (Flat minimal tabs) */}
        <div className="hidden lg:flex items-center gap-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`relative py-1.5 font-mono-data text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all hover:text-white border-b-2 ${
                  isActive 
                    ? 'text-emerald-400 border-emerald-400' 
                    : 'text-neutral-400 border-transparent'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Right Actions: Counter + CTA + Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Scroll Counter Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-neutral-300 bg-neutral-950 border border-white/10 px-3 py-1.5 rounded-full">
            <motion.span className="text-emerald-400">
              {useTransform(eventIndexProgress, (v) => Math.round(v).toString().padStart(2, '0'))}
            </motion.span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-400">{totalEvents.toString().padStart(2, '0')}</span>
          </div>

          {/* CTA Button */}
          <a
            href="#register"
            className="group relative inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-emerald-300 active:scale-95"
          >
            <span>Passes</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* Menu / Filter Button */}
          <button
            onClick={onMenuToggle}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-neutral-300 hover:border-emerald-400 hover:text-emerald-400 transition-colors"
            aria-label="Toggle menu filter"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Clean Progress Track Line Bar (No Glows) */}
      <div className="mt-3 w-full max-w-7xl h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400"
          style={{ width: useTransform(progress, [0, 1], ['0%', '100%']) }}
        />
      </div>
    </header>
  )
}
