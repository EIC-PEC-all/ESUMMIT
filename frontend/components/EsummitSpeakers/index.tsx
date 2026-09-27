'use client'

import React, { useState, useRef, useMemo, useCallback } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Calendar, MapPin } from 'lucide-react'
import { useSchedule, useSummitData } from '@/hooks/useSummitData'
import { CARDS, DayCard } from './types'
import HighlightCard from './HighlightCard'

const HighlightsCampusMap = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-void font-mono-data text-xs text-gray-400">
      Loading Leaflet Campus Map…
    </div>
  ),
})

export default function EsummitSchedule() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [mobileView, setMobileView] = useState<'schedule' | 'map'>('schedule')
  const [isNearViewport, setIsNearViewport] = useState(false)

  // Only mount Leaflet and download map tiles when timeline is within 600px of viewport
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          obs.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { scheduleItems } = useSchedule()
  const { data: summitBundle } = useSummitData()
  const globalDates = summitBundle?.siteConfig?.summitDates || 'NOVEMBER 14–15, 2026'

  // Transform CMS schedule items into DayCard format
  const cmsCards: DayCard[] = useMemo(() => {
    const days = [1, 2] as const
    return days.map((day) => {
      const dayItems = scheduleItems.filter((s) => s.day === day)
      const firstItem = dayItems[0]
      return {
        num: String(day).padStart(2, '0'),
        day: `DAY 0${day}`,
        date: firstItem?.date || `${globalDates} (Day ${day})`,
        title: day === 1 ? 'Inauguration & Pitch Arena' : 'Hackathon Demos & Grand Finals',
        events: dayItems.map((s) => ({
          id: s.id,
          time: s.time,
          title: s.title,
          tag: s.tag,
          venueId: s.venueId,
          venueName: s.venueName,
          building: s.building,
          lat: s.lat,
          lng: s.lng,
        })),
      }
    })
  }, [scheduleItems, globalDates])

  const dynamicFallbackCards = useMemo(() => {
    return CARDS.map((c, idx) => ({
      ...c,
      date: `${globalDates} (Day ${idx + 1})`,
    }))
  }, [globalDates])

  const cards = useMemo(
    () => (cmsCards.some((c) => c.events.length > 0) ? cmsCards : dynamicFallbackCards),
    [cmsCards, dynamicFallbackCards]
  )

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (latest < 0.5) {
        if (activeDayIndex !== 0) setActiveDayIndex(0)
      } else {
        if (activeDayIndex !== 1) setActiveDayIndex(1)
      }
    }
  })

  // Fast O(1) Map lookup for selected event
  const eventLookupMap = useMemo(() => {
    const map = new Map<string, DayCard['events'][0]>()
    cards.forEach((c) => {
      c.events.forEach((ev) => map.set(ev.id, ev))
    })
    return map
  }, [cards])

  const selectedEvent = selectedEventId ? eventLookupMap.get(selectedEventId) || null : null

  const handleSelectEvent = useCallback((id: string) => {
    setSelectedEventId((prev) => (prev === id ? null : id))
  }, [])

  const handleLocateOnMap = useCallback((id: string) => {
    setSelectedEventId(id)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileView('map')
    }
  }, [])

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="esummit-section z-10 relative px-4 sm:px-8 md:px-10 pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-18 md:pb-20 bg-section-1 text-white"
      aria-labelledby="timeline-heading"
    >
      {/* Title */}
      <h2
        id="timeline-heading"
        className="font-display font-black uppercase leading-none tracking-wider text-center mb-6 sm:mb-8 select-none"
        style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}
      >
        <span className="text-gradient-mint">TIMELINE</span>
      </h2>

      {/* Day Selector Pills */}
      <div className="flex items-center justify-center gap-2 mb-5 sm:mb-7">
        {cards.map((c, idx) => (
          <button
            key={c.num}
            onClick={() => {
              setActiveDayIndex(idx)
              if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                const cardEl = document.getElementById(`timeline-day-${idx}`)
                if (cardEl) {
                  cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }
            }}
            className={`px-4 sm:px-5 py-2 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeDayIndex === idx
                ? 'bg-[#00F2B2] text-void font-black shadow-lg shadow-[#00F2B2]/25 scale-[1.02]'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {c.day} • {c.date.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Mobile Segmented Toggle (Schedule vs Campus Map) */}
      <div className="lg:hidden flex items-center justify-center mb-6">
        <div className="flex bg-[#0A1612] p-1 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={() => setMobileView('schedule')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mobileView === 'schedule'
                ? 'bg-white/15 text-white border border-[#00F2B2]/40 shadow-[0_0_15px_rgba(0,242,178,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar size={12} className={mobileView === 'schedule' ? 'text-[#00F2B2]' : ''} />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mobileView === 'map'
                ? 'bg-white/15 text-white border border-[#00F2B2]/40 shadow-[0_0_15px_rgba(0,242,178,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapPin size={12} className={mobileView === 'map' ? 'text-[#00F2B2]' : ''} />
            <span>Campus Map</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="relative flex flex-col lg:flex-row gap-6 sm:gap-8 items-start min-h-[auto] lg:min-h-[140vh]">
        {/* Left Column: Leaflet Map */}
        <div
          className={`w-full lg:w-1/2 h-[380px] sm:h-[440px] lg:h-[min(560px,calc(100dvh-7rem))] relative lg:sticky lg:top-24 z-30 overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/10 shadow-2xl ${
            mobileView === 'map' ? 'block' : 'hidden lg:block'
          }`}
        >
          {isNearViewport ? (
            <HighlightsCampusMap
              selectedEvent={selectedEvent}
              activeDayIndex={activeDayIndex}
              dayEvents={cards[activeDayIndex]?.events || []}
              onClearSelection={() => setSelectedEventId(null)}
              onSelectEventId={handleSelectEvent}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0B1410] font-mono-data text-xs text-gray-300">
              Interactive Campus Map
            </div>
          )}
        </div>

        {/* Right Column: Schedule Cards */}
        <div
          className={`w-full lg:w-1/2 relative ${
            mobileView === 'schedule' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Mobile Single Active Card View */}
          <div className="lg:hidden">
            {cards[activeDayIndex] && (
              <HighlightCard
                key={cards[activeDayIndex].num}
                card={cards[activeDayIndex]}
                index={activeDayIndex}
                scrollYProgress={scrollYProgress}
                selectedEventId={selectedEventId}
                onSelectEvent={handleSelectEvent}
                onLocateOnMap={handleLocateOnMap}
              />
            )}
          </div>

          {/* Desktop Dual Sticky Stack View */}
          <div className="hidden lg:block">
            {cards.map((card, index) => (
              <HighlightCard
                key={card.num}
                card={card}
                index={index}
                scrollYProgress={scrollYProgress}
                selectedEventId={selectedEventId}
                onSelectEvent={handleSelectEvent}
                onLocateOnMap={handleLocateOnMap}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
