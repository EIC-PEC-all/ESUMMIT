// components/EventPortfolio/index.tsx
'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import { PORTFOLIO_EVENTS, PortfolioEvent } from './data'
import { Card } from './Card'
import { FinalCard } from './FinalCard'
import { DetailModal } from './DetailModal'
import { useSummitData } from '@/hooks/useSummitData'
import type { CmsEvent } from '@/lib/api-types'

const MAX_VISIBLE_EVENTS = 8

export default function EventPortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const { data } = useSummitData()
  const events: PortfolioEvent[] = useMemo(() => {
    const cmsEvents = Array.isArray(data?.events) ? data.events : []
    const portfolioMedia = Array.isArray(data?.portfolioMedia) ? data.portfolioMedia : []
    const baseEvents = (cmsEvents.length > 0 ? cmsEvents : PORTFOLIO_EVENTS).slice(0, MAX_VISIBLE_EVENTS)

    return baseEvents.map((e, idx) => {
      const numStr = e.number || `0${idx + 1}`.slice(-2)
      const matched = portfolioMedia.find(
        (p) =>
          p.eventId === e.id ||
          p.eventId === numStr ||
          (p.eventId === 'corporate-workshops' && (numStr === '01' || e.title.includes('Workshop'))) ||
          (p.eventId === 'internship-job-fair' && (numStr === '02' || e.title.includes('Internship') || e.title.includes('Career'))) ||
          (p.eventId === 'rd-conclave' && (numStr === '03' || e.title.includes('R&D'))) ||
          (p.eventId === 'ipl-auction' && (numStr === '04' || e.title.includes('IPL'))) ||
          (p.eventId === 'ignite' && (numStr === '05' || e.title.includes('Ignite'))) ||
          (p.eventId === 'treasure-hunt' && (numStr === '06' || e.title.includes('Treasure'))) ||
          (p.eventId === 'baazar' && (numStr === '07' || e.title.includes('Baazar'))) ||
          (p.eventId === 'bizquiz-saasc' && (numStr === '08' || e.title.includes('BizQuiz'))) ||
          (p.eventId === 'additional-quiz-saasc' && (numStr === '09' || e.title.includes('Knowledge Quiz'))) ||
          (p.eventId === 'campus-ambassador' && (numStr === '10' || e.title.includes('Ambassador'))) ||
          (p.eventId === 'expert-speakers' && (numStr === '11' || e.title.includes('Speaker'))) ||
          (p.eventId === 'funding-conclave' && (numStr === '12' || e.title.includes('Funding'))) ||
          (p.eventId === 'case-competition' && (numStr === '13' || e.title.includes('Case')))
      )

      return {
        id: e.id,
        number: numStr,
        title: e.title,
        category: e.category,
        eyebrow: e.eyebrow,
        image: matched?.imageUrl || e.image,
        purpose: e.purpose,
        delivery: e.delivery,
        expectedParticipation: e.expectedParticipation,
        tags: e.tags,
        partner: e.partner ?? undefined,
      }
    })
  }, [data.events, data.portfolioMedia])

  const [selectedEvent, setSelectedEvent] = useState<PortfolioEvent | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const xMotion = useMotionValue(0)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(events.map((e) => e.category)))
    return ['All', ...cats]
  }, [events])

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return events
    return events.filter(
      (e) => e.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === 'All'
    )
  }, [activeCategory, events])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const maxScrollRef = useRef(0)

  useEffect(() => {
    const updateMaxScroll = () => {
      if (trackRef.current) {
        maxScrollRef.current = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)
      }
    }

    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll, { passive: true })

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      xMotion.set(-progress * maxScrollRef.current)
    })

    return () => {
      window.removeEventListener('resize', updateMaxScroll)
      unsubscribe()
    }
  }, [scrollYProgress, filteredEvents, xMotion])

  return (
    <section
      ref={containerRef}
      id="event-portfolio"
      className={`relative h-[250vh] md:h-[480vh] w-full bg-section-2 text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 border-t border-[#7ED321]/20 transition-all ${
        selectedEvent ? 'z-[12000]' : 'z-10'
      }`}
      aria-label="Event Portfolio Showcase"
    >
      {/* Pinned Sticky Section during vertical scroll */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">

        {/* Big centered section title — matches site-wide pattern */}
        <div className="pointer-events-none absolute top-16 left-0 right-0 flex justify-center z-20">
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-center drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] select-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            <span className="text-gradient-mint">EVENTS</span>
          </h2>
        </div>

        {/* ── Main Horizontally Scrolling Track Container ── */}
        <div className="relative z-10 flex w-full items-center pt-32 sm:pt-36">
          <motion.div
            ref={trackRef}
            style={{ x: xMotion, willChange: 'transform' }}
            className="flex items-center gap-6 sm:gap-8 px-6 sm:px-12 md:px-16 cursor-grab active:cursor-grabbing w-max"
          >
            {filteredEvents.map((event, index) => (
              <Card
                key={event.id}
                event={event}
                index={index}
                total={PORTFOLIO_EVENTS.length}
                onSelect={(evt) => setSelectedEvent(evt)}
                scrollProgress={scrollYProgress}
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
