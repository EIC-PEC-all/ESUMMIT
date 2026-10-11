// components/EventPortfolio/index.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Download, Calendar } from 'lucide-react'
import { PORTFOLIO_EVENTS, PortfolioEvent } from './data'
import { Card } from './Card'
import { DetailModal } from './DetailModal'
import { useSummitData } from '@/hooks/useSummitData'
import PageBanner from '@/components/Common/PageBanner'

const FILTER_TABS = [
  { id: 'all', label: 'All Events' },
  { id: 'flagship', label: 'Flagship Initiatives' },
  { id: 'competition', label: 'Competitions & Sprints' },
  { id: 'culture', label: 'Culture & Entertainment' },
] as const

export default function EventPortfolioShowcase() {
  const { data } = useSummitData()

  const allEvents: PortfolioEvent[] = useMemo(() => {
    const cmsEvents = Array.isArray(data?.events) && data.events.length > 0 ? data.events : []
    const portfolioMedia = Array.isArray(data?.portfolioMedia) ? data.portfolioMedia : []
    const baseEvents = cmsEvents.length > 0 ? cmsEvents : PORTFOLIO_EVENTS

    return baseEvents.map((e, idx) => {
      const numStr = e.number || `0${idx + 1}`.slice(-2)
      const matched = portfolioMedia.find(
        (p) =>
          p.eventId === e.id ||
          p.eventId === numStr ||
          (p.eventId === 'corporate-workshops' && (numStr === '01' || e.title.includes('Workshop'))) ||
          (p.eventId === 'internship-job-fair' && (numStr === '02' || e.title.includes('Internship') || e.title.includes('Career'))) ||
          (p.eventId === 'funding-conclave' && (numStr === '03' || e.title.includes('Funding'))) ||
          (p.eventId === 'ipl-auction' && (numStr === '04' || e.title.includes('IPL'))) ||
          (p.eventId === 'build-pitch' && (numStr === '05' || e.title.includes('Build') || e.title.includes('Pitch'))) ||
          (p.eventId === 'baazar' && (numStr === '06' || e.title.includes('Bazaar') || e.title.includes('Baazar'))) ||
          (p.eventId === 'bizquiz-saasc' && (numStr === '07' || e.title.includes('Quiz') || e.title.includes('Brands'))) ||
          (p.eventId === 'science-fair' && (numStr === '08' || e.title.includes('Science') || e.title.includes('Expo'))) ||
          (p.eventId === 'networking-arena' && (numStr === '09' || e.title.includes('Networking'))) ||
          (p.eventId === 'women-founders' && (numStr === '10' || e.title.includes('Women') || e.title.includes('Alumni'))) ||
          (p.eventId === 'treasure-hunt' && (numStr === '11' || e.title.includes('Treasure'))) ||
          (p.eventId === 'comedy-esports' && (numStr === '12' || e.title.includes('Comedy') || e.title.includes('Sports')))
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
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredEvents = useMemo(() => {
    if (activeTab === 'all') return allEvents

    if (activeTab === 'flagship') {
      return allEvents.filter((e) =>
        ['Career Fair', 'Venture Capital', 'Deep Tech & Expo', 'Networking', 'Community'].includes(e.category) ||
        e.title.includes('Conclave') ||
        e.title.includes('Talent') ||
        e.title.includes('Expo') ||
        e.title.includes('Women')
      )
    }

    if (activeTab === 'competition') {
      return allEvents.filter((e) =>
        ['Hackathon', 'Strategy & Finance', 'Pitch Competition', 'Marketplace', 'Quiz Arena'].includes(e.category) ||
        e.title.includes('Hackathon') ||
        e.title.includes('Auction') ||
        e.title.includes('Pitch') ||
        e.title.includes('Quiz') ||
        e.title.includes('Bazaar')
      )
    }

    if (activeTab === 'culture') {
      return allEvents.filter((e) =>
        e.category === 'Fun Activities' ||
        e.title.includes('Comedy') ||
        e.title.includes('Treasure') ||
        e.title.includes('Sports')
      )
    }

    return allEvents
  }, [activeTab, allEvents])

  return (
    <>
      <PageBanner
        title="EVENTS"
        subtitle="14–15 NOVEMBER 2026 · 12 SIGNATURE PROPERTIES & COMPETITIONS"
      />

      <section
        id="event-portfolio"
        className={`relative w-full bg-section-2 text-white transition-all pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-24 ${
          selectedEvent ? 'z-[12000]' : 'z-10'
        }`}
        aria-label="Event Portfolio Showcase"
      >
        {/* Background Section Scrim */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#07130F]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F221D]/75 via-transparent to-[#0F221D]/85" />
        </div>

        {/* ── Main Container ── */}
        <div className="relative z-10 w-full px-5 sm:px-10 md:px-16 max-w-[1400px] mx-auto">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#091812] border border-mint/20 overflow-x-auto scrollbar-none">
              {FILTER_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-data whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-mint text-[#07130F] font-bold shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Brochure CTA */}
            <a
              href="/e-summit-brochure.pdf"
              download="PEC-E-Summit-2026-Brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-mint/10 hover:bg-mint/20 border border-mint/30 text-mint text-xs font-mono-data font-bold transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD BROCHURE (PDF)</span>
            </a>
          </div>

          {/* Event Count Indicator */}
          <div className="flex items-center justify-between text-xs font-mono-data text-gray-400 mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-mint" />
              <span>SHOWING {filteredEvents.length} OF {allEvents.length} EVENTS</span>
            </div>
            <span className="text-[11px] text-gray-400">CLICK ANY CARD FOR DETAILED GUIDELINES</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
            {filteredEvents.map((event, index) => (
              <Card
                key={event.id}
                event={event}
                index={index}
                total={allEvents.length}
                onSelect={(evt) => setSelectedEvent(evt)}
              />
            ))}
          </div>
        </div>

        {/* ── Interactive Event Detail Modal ── */}
        <DetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      </section>
    </>
  )
}
