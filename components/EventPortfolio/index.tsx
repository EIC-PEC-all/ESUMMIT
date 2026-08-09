// components/EventPortfolio/index.tsx
'use client'

import React, { useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { PORTFOLIO_EVENTS, PortfolioEvent } from './data'
import { Card } from './Card'
import { FinalCard } from './FinalCard'
import { DetailModal } from './DetailModal'

export default function EventPortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [selectedEvent, setSelectedEvent] = useState<PortfolioEvent | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = useMemo(() => {
    return ['All', 'Industry Workshop', 'Recruitment', 'Deep Tech', 'Strategy', 'Keynotes']
  }, [])

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return PORTFOLIO_EVENTS
    return PORTFOLIO_EVENTS.filter(
      (e) => e.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === 'All'
    )
  }, [activeCategory])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  })

  const xTranslate = useTransform(smoothProgress, [0, 1], ['0%', '-86%'])

  return (
    <section
      ref={containerRef}
      id="event-portfolio"
      className="relative h-[480vh] w-full bg-[#0D1812] text-white"
      aria-label="Event Portfolio Showcase"
    >
      {/* Pinned Sticky Section during vertical scroll */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">

        {/* Big centered section title — matches site-wide pattern */}
        <div className="pointer-events-none absolute top-16 left-0 right-0 flex justify-center z-20">
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-center text-mint drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
          >
            EVENTS
          </h2>
        </div>

        {/* ── Main Horizontally Scrolling Track Container ── */}
        <div className="relative z-10 flex w-full items-center pt-32 sm:pt-36">
          <motion.div
            ref={trackRef}
            style={{ x: xTranslate }}
            className="flex items-center gap-6 sm:gap-8 px-6 sm:px-12 md:px-16 cursor-grab active:cursor-grabbing"
          >
            {filteredEvents.map((event, index) => (
              <Card
                key={event.id}
                event={event}
                index={index}
                total={PORTFOLIO_EVENTS.length}
                onSelect={(evt) => setSelectedEvent(evt)}
                scrollProgress={smoothProgress}
              />
            ))}
            <FinalCard onViewAll={() => setActiveCategory('All')} />
          </motion.div>
        </div>
      </div>

      {/* ── Interactive Event Detail Modal ── */}
      <DetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  )
}
