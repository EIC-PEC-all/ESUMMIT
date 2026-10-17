// components/EventPortfolio/Header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { motion, MotionValue, useTransform } from 'framer-motion'
import { Calendar, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { APPLE_SPRING_TRANSITION } from '@/components/Common/PillSegmentedTabs'

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
      <div className="bg-panel/95 relative flex w-full max-w-7xl items-center justify-between rounded-full border border-border-panel px-5 py-3 transition-all duration-200 text-primary">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-primary transition-colors hover:text-mint"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-panel-alt text-mint border border-border-subtle">
              <Calendar size={13} />
            </span>
            <span className="flex items-center gap-2 font-display">
              E-SUMMIT
              <span className="text-muted font-normal text-xs">|</span>
              <span className="text-xs uppercase tracking-widest text-secondary font-medium hidden sm:inline">
                EVENT SCHEDULE
              </span>
            </span>
          </Link>
        </div>

        {/* Center: Dynamic Category Tab Switcher (Flat minimal tabs) */}
        <div className="hidden lg:flex items-center gap-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`relative py-1.5 font-mono-data text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary ${
                  isActive ? 'text-mint' : 'text-secondary'
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <motion.div
                    layoutId="eventCategoryActiveUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-mint rounded-full"
                    transition={APPLE_SPRING_TRANSITION}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Right Actions: Counter + CTA + Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Scroll Counter Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-secondary bg-panel-alt border border-border-subtle px-3 py-1.5 rounded-full">
            <motion.span className="text-mint">
              {useTransform(eventIndexProgress, (v) => Math.round(v).toString().padStart(2, '0'))}
            </motion.span>
            <span className="text-muted">/</span>
            <span className="text-secondary">{totalEvents.toString().padStart(2, '0')}</span>
          </div>

          {/* CTA Button */}
          <a
            href="#register"
            className="group relative inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:brightness-110 active:scale-95"
          >
            <span>Passes</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* Menu / Filter Button */}
          <button
            onClick={onMenuToggle}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-panel-alt text-secondary hover:border-mint hover:text-mint transition-colors"
            aria-label="Toggle menu filter"
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Clean Progress Track Line Bar (No Glows) */}
      <div className="mt-3 w-full max-w-7xl h-[2px] bg-border-subtle rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-mint"
          style={{ width: useTransform(progress, [0, 1], ['0%', '100%']) }}
        />
      </div>
    </header>
  )
}
