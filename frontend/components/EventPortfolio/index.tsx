// components/EventPortfolio/index.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PORTFOLIO_EVENTS, PortfolioEvent } from './data'
import { Card } from './Card'
import { FinalCard } from './FinalCard'
import { DetailModal } from './DetailModal'
import { useSummitData } from '@/hooks/useSummitData'
import type { CmsEvent } from '@/lib/api-types'
import PageBanner from '@/components/Common/PageBanner'


const MAX_VISIBLE_EVENTS = 8

export default function EventPortfolioShowcase() {

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

  // Vertical layout doesn't require scroll tracking

  return (
    <>
      <PageBanner 
        title="EVENTS" 
      />
      <section
        id="event-portfolio"
        className={`relative w-full bg-section-2 text-white transition-all pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 ${
          selectedEvent ? 'z-[12000]' : 'z-10'
        }`}
        aria-label="Event Portfolio Showcase"
      >
        {/* Background Section */}
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none bg-[#07130F]">
          {/* Subtle vertical vignette scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F221D]/75 via-transparent to-[#0F221D]/85" />
        </div>

      {/* ── Main Grid Container ── */}
      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {filteredEvents.map((event, index) => (
            <Card
              key={event.id}
              event={event}
              index={index}
              total={PORTFOLIO_EVENTS.length}
              onSelect={(evt) => setSelectedEvent(evt)}
            />
          ))}
          <FinalCard onViewAll={() => setActiveCategory('All')} />
        </div>
      </div>

      {/* ── Interactive Event Detail Modal ── */}
      <DetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
    </>
  )
}
