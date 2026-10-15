'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, Download, MapPin, Sparkles, Search, X } from 'lucide-react'
import PageBanner from '@/components/Common/PageBanner'
import { MASTER_TIMELINE, MASTER_EVENTS, EventItem } from '@/data/summitData'
import { DetailModal } from '@/components/EventPortfolio/DetailModal'
import { useSummitData } from '@/hooks/useSummitData'
import TimelineTableDesktop from './TimelineTableDesktop'
import TimelineListMobile from './TimelineListMobile'

const CATEGORIES = [
  'All',
  'Keynote',
  'Hackathon',
  'Expo',
  'Competition',
  'Workshop',
  'Networking',
  'Culture',
] as const

export default function Timeline() {
  const { data } = useSummitData()
  const [selectedDay, setSelectedDay] = useState<0 | 1 | 2>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null)

  const allEventsList: EventItem[] = useMemo(() => {
    if (Array.isArray(data?.events) && data.events.length > 0) {
      return data.events.map((e) => ({
        id: e.id,
        number: e.number,
        title: e.title,
        category: e.category,
        eyebrow: e.eyebrow,
        image: e.image,
        purpose: e.purpose,
        delivery: e.delivery,
        expectedParticipation: e.expectedParticipation,
        tags: e.tags,
        partner: e.partner ?? undefined,
        registrationUrl: e.registrationUrl ?? undefined,
      }))
    }
    return MASTER_EVENTS
  }, [data?.events])

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return MASTER_TIMELINE.filter((ev) => {
      const matchDay = selectedDay === 0 || ev.day === selectedDay
      const matchCategory =
        selectedCategory === 'All' || ev.category.toLowerCase() === selectedCategory.toLowerCase()

      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.tags.some((t) => t.toLowerCase().includes(q))

      return matchDay && matchCategory && matchSearch
    })
  }, [selectedDay, selectedCategory, searchQuery])

  return (
    <>
      <PageBanner
        title="TIMELINE"
        subtitle="14–15 NOVEMBER 2026 · OFFICIAL SUMMIT TIMETABLE & TRACK AGENDA"
      />

      <section
        id="schedule"
        className="relative bg-[#07130F] text-white pt-6 sm:pt-10 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10"
        aria-labelledby="schedule-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Control Bar: Day Switcher, Search, and Brochure */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 pb-5 border-b border-white/[0.08]">
            {/* Segmented Day Switcher */}
            <div className="inline-flex p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedDay(1)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-data transition-all ${
                  selectedDay === 1
                    ? 'bg-mint/15 text-mint font-semibold border border-mint/30 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Day 01 (14 Nov)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay(2)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-data transition-all ${
                  selectedDay === 2
                    ? 'bg-mint/15 text-mint font-semibold border border-mint/30 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Day 02 (15 Nov)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay(0)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-data transition-all ${
                  selectedDay === 0
                    ? 'bg-mint/15 text-mint font-semibold border border-mint/30 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Sessions
              </button>
            </div>

            {/* Desktop Quick Search & Brochure PDF Actions */}
            <div className="flex items-center gap-2.5 self-stretch md:self-auto">
              {/* Search input */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sessions, halls..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border border-white/10 focus:border-mint/40 text-xs font-body text-white placeholder:text-gray-400 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Slim Brochure Download */}
              <a
                href="/e-summit-brochure.pdf"
                download="PEC-E-Summit-2026-Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white text-xs font-mono-data font-medium transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-mint" />
                <span className="hidden sm:inline">Brochure (PDF)</span>
              </a>
            </div>
          </div>

          {/* Understated Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono-data whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-mint/15 text-mint border-mint/30 font-semibold'
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Clean Meta Sub-Header */}
          <div className="flex items-center justify-between text-[11px] font-mono-data text-gray-400 mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-mint/80" />
              <span>{filteredEvents.length} SESSIONS DISPLAYED</span>
              {searchQuery && (
                <span className="text-mint font-mono-data text-[10px]">
                  (filtered for &ldquo;{searchQuery}&rdquo;)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-3 h-3 text-mint/80" />
              <span>PEC CHANDIGARH</span>
            </div>
          </div>

          {/* Timetable View */}
          {filteredEvents.length > 0 ? (
            <>
              {/* Desktop: Rich Interactive Timetable Table */}
              <div className="hidden md:block">
                <TimelineTableDesktop
                  events={filteredEvents}
                  eventsList={allEventsList}
                  onSelectEvent={(evt) => setSelectedEventForModal(evt)}
                />
              </div>

              {/* Mobile: Clean Chronological Timeline List */}
              <div className="block md:hidden">
                <TimelineListMobile
                  events={filteredEvents}
                  eventsList={allEventsList}
                  onSelectEvent={(evt) => setSelectedEventForModal(evt)}
                />
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-[#091812] border border-white/10 p-12 text-center">
              <Sparkles className="w-8 h-8 text-mint mx-auto mb-3 opacity-60" />
              <p className="font-sans text-white text-base font-semibold mb-1">
                No sessions matched your criteria
              </p>
              <p className="text-xs text-gray-400 font-body mb-4">
                Try clearing your search query or switching track filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDay(0)
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="px-4 py-2 rounded-lg bg-mint/15 text-mint border border-mint/30 text-xs font-mono-data font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Interactive Event Detail Modal */}
        <DetailModal
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
        />
      </section>
    </>
  )
}
