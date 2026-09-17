'use client'

import React, { useState, useRef, useMemo, useCallback } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import dynamic from 'next/dynamic'
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

export default function EsummitHighlights() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
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
  const globalDates = summitBundle?.siteConfig?.summitDates || 'SEPTEMBER 26–27, 2026'

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
    if (latest < 0.5) {
      if (activeDayIndex !== 0) setActiveDayIndex(0)
    } else {
      if (activeDayIndex !== 1) setActiveDayIndex(1)
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

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 bg-section-1 text-white"
      aria-labelledby="timeline-heading"
    >
      <h2
        id="timeline-heading"
        className="font-display font-black uppercase leading-none tracking-tight text-center mb-12 sm:mb-20 md:mb-24 select-none"
        style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
      >
        <span className="text-gradient-mint">TIMELINE</span>
      </h2>

      {/* 2-Column Responsive Layout */}
      <div className="relative flex flex-col lg:flex-row gap-8 items-start min-h-[150vh]">
        {/* Left Column: Leaflet Map */}
        <div className="w-full lg:w-1/2 h-[320px] sm:h-[420px] lg:h-[80vh] relative lg:sticky lg:top-28 z-30 overflow-hidden rounded-[28px] sm:rounded-[32px]">
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

        {/* Right: Day Cards */}
        <div className="w-full lg:w-1/2 relative">
          {cards.map((card, index) => (
            <HighlightCard
              key={card.num}
              card={card}
              index={index}
              scrollYProgress={scrollYProgress}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
