'use client'

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Mic2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { MASTER_SPEAKERS, Speaker } from '@/data/summitData'
import { useSpeakers } from '@/hooks/useSummitData'

const CATEGORY_TABS = [
  { id: 'all', label: 'All Speakers' },
  { id: 'keynote', label: 'Keynotes' },
  { id: 'panelist', label: 'Panelists' },
  { id: 'investor', label: 'Investors' },
  { id: 'mentor', label: 'Mentors' },
]

export default function Speakers() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { speakers: cmsSpeakers } = useSpeakers()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const speakerList: Speaker[] = useMemo(() => {
    if (Array.isArray(cmsSpeakers) && cmsSpeakers.length > 0) {
      return cmsSpeakers.map((s, idx) => ({
        id: s.id || `cms-sp-${idx}`,
        name: s.name,
        role: s.role,
        company: s.company,
        badge: s.badge || 'SPEAKER',
        category: (s.category as any) || 'keynote',
        initials: s.initials || s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        bio: s.bio,
        track: s.track,
        image: s.avatarUrl || undefined,
      }))
    }
    return MASTER_SPEAKERS
  }, [cmsSpeakers])

  const filteredSpeakers = useMemo(() => {
    if (activeCategory === 'all') return speakerList
    return speakerList.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory, speakerList])

  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 15)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 15)
  }, [])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    checkScrollState()
    el.addEventListener('scroll', checkScrollState, { passive: true })
    window.addEventListener('resize', checkScrollState)
    return () => {
      el.removeEventListener('scroll', checkScrollState)
      window.removeEventListener('resize', checkScrollState)
    }
  }, [checkScrollState, filteredSpeakers])

  const handleCategoryChange = (tabId: string) => {
    setActiveCategory(tabId)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  const scrollByDirection = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const step = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    })
  }

  return (
    <section
      id="speakers"
      className="relative bg-section-1 text-white py-20 sm:py-28 px-4 sm:px-8 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-white/10"
      aria-labelledby="speakers-heading"
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(181,242,61,0.2) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(61,217,255,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        {/* Section Heading & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/25 text-mint text-xs font-mono-data uppercase tracking-wider mb-3">
              <Mic2 size={13} className="text-mint" aria-hidden="true" />
              <span>THOUGHT LEADERSHIP &amp; KEYNOTES</span>
            </div>

            <h2
              id="speakers-heading"
              className="font-display font-black uppercase leading-none tracking-tight select-none"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              <span className="text-gradient-mint">SPEAKERS</span>
            </h2>

            <p className="mt-3 font-body text-sm sm:text-base text-gray-300 leading-relaxed">
              Visionary founders, enterprise CXOs, and top-tier angel syndicates sharing unfiltered playbooks on scaling ventures from day zero to IPO.
            </p>
          </div>

          {/* Navigation Controls for Horizontal Scroll */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <button
              onClick={() => scrollByDirection('left')}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'border-white/20 bg-white/5 text-white hover:border-mint hover:bg-mint/10 hover:text-mint'
                  : 'border-white/5 bg-white/[0.02] text-gray-600 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll speakers left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollByDirection('right')}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'border-white/20 bg-white/5 text-white hover:border-mint hover:bg-mint/10 hover:text-mint'
                  : 'border-white/5 bg-white/[0.02] text-gray-600 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll speakers right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id
            const count =
              tab.id === 'all'
                ? speakerList.length
                : speakerList.filter((s) => s.category.toLowerCase() === tab.id.toLowerCase()).length

            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`min-h-[38px] px-4 py-1.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-mint text-void shadow-lg shadow-mint/20 border border-mint'
                    : 'bg-white/[0.04] text-gray-300 border border-white/10 hover:border-mint/40 hover:text-white'
                }`}
                aria-pressed={isActive}
              >
                {tab.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Horizontal Scroll Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-2 -mx-4 px-4 sm:-mx-8 sm:px-8 focus:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Speakers horizontal carousel"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(181, 242, 61, 0.3) rgba(255, 255, 255, 0.05)',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredSpeakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[28px] bg-[#0E1B15] border border-white/10 hover:border-mint/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-mint/10 overflow-hidden w-[85vw] sm:w-[360px] md:w-[380px] shrink-0 snap-start"
              >
                {/* Top Corner Decorative Badge */}
                <div className="absolute top-5 right-5 z-10">
                  <span className="font-mono-data text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-gray-300 group-hover:border-mint/40 group-hover:text-mint transition-colors">
                    {speaker.badge}
                  </span>
                </div>

                <div>
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar / Initials */}
                    <div className="relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-mint/20 to-emerald-950/60 border border-mint/30 flex items-center justify-center font-display font-black text-xl text-mint shadow-inner overflow-hidden">
                      {speaker.image ? (
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <span>{speaker.initials}</span>
                      )}
                    </div>

                    <div className="pr-14">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-mint transition-colors leading-snug">
                        {speaker.name}
                      </h3>
                      <p className="font-body text-xs text-gray-400 font-medium mt-1">
                        {speaker.role} · <span className="text-gray-200 font-semibold">{speaker.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Track Pill */}
                  <div className="mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-mint/[0.08] border border-mint/20 text-mint text-[11px] font-mono-data font-semibold">
                      <Zap size={11} className="fill-mint" aria-hidden="true" />
                      {speaker.track}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="font-body text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-4 mb-6">
                    {speaker.bio}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-data text-gray-400">
                  <span className="uppercase text-[10px] tracking-wider text-gray-500 font-bold">
                    {speaker.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-mint group-hover:underline">
                    <span className="text-[11px] font-semibold">E-Summit &apos;26 Stage</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Swipe / Scroll Hint */}
        <div className="flex items-center justify-between text-neutral-500 font-mono-data text-[11px] px-1 pt-1">
          <span>← Drag or swipe cards horizontally →</span>
          <span>{filteredSpeakers.length} Speakers</span>
        </div>
      </div>
    </section>
  )
}
