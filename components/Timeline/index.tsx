'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Zap, MapPin, Navigation, Filter, ArrowUpRight } from 'lucide-react'
import { SCHEDULE } from '@/lib/data'
import { onAgentEvent } from '@/lib/events'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'
import CampusMap from './CampusMap'

type ScheduleEvent = typeof SCHEDULE.day1.events[0]

function TimelineEventCard({
  event,
  isSelected,
  onSelect,
  index,
}: {
  event: ScheduleEvent
  isSelected: boolean
  onSelect: () => void
  index: number
}) {
  return (
    <motion.div
      id={`schedule-row-${event.id}`}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onSelect}
      className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${
        isSelected
          ? 'bg-[#0E2217] border-[#50E3C2] shadow-[0_0_25px_rgba(80,227,194,0.3)] translate-x-1'
          : 'bg-[#0D140E]/90 border-[#50E3C2]/20 hover:border-[#50E3C2]/60 hover:bg-[#111A12]'
      }`}
    >
      {/* Top Gloss Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-300 ${
          isSelected
            ? 'bg-gradient-to-r from-[#50E3C2] via-[#E8A33D] to-[#50E3C2] opacity-100'
            : 'bg-gradient-to-r from-transparent via-[#50E3C2]/30 to-transparent opacity-0 group-hover:opacity-100'
        }`}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Time Badge */}
        <div className="flex items-center gap-1.5 font-mono-data text-xs text-[#50E3C2] font-bold tabular-nums">
          <Clock size={13} className="text-[#50E3C2]" />
          <span>{event.time}</span>
        </div>

        {/* Type Badge */}
        <span
          className={`font-mono-data text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border transition-colors ${
            isSelected
              ? 'bg-[#50E3C2] text-[#070B08] border-[#50E3C2]'
              : 'bg-[#50E3C2]/15 text-[#50E3C2] border-[#50E3C2]/30'
          }`}
        >
          {event.type}
        </span>
      </div>

      {/* Event Title */}
      <h3
        className={`font-display text-xl sm:text-2xl mb-2 transition-colors ${
          isSelected ? 'text-[#50E3C2]' : 'text-white group-hover:text-[#50E3C2]'
        }`}
      >
        {event.title}
      </h3>

      {/* Venue & Route Meta Footer */}
      <div className="mt-3 pt-3 border-t border-[#50E3C2]/15 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono-data text-xs text-[#8A9488]">
          <MapPin size={13} className="text-[#50E3C2] shrink-0" />
          <span className="text-[#E2FBEA] font-medium">{event.venueName}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className={`inline-flex items-center gap-1 font-mono-data text-[11px] uppercase font-bold px-2.5 py-1 rounded-lg transition-all ${
            isSelected
              ? 'bg-[#50E3C2] text-[#070B08] shadow-[0_0_12px_rgba(80,227,194,0.4)]'
              : 'bg-[#070B08] text-[#50E3C2] border border-[#50E3C2]/30 hover:bg-[#50E3C2]/20'
          }`}
        >
          <Navigation size={11} className={isSelected ? 'animate-bounce' : ''} />
          <span>{isSelected ? 'Route Active' : 'View Path'}</span>
          <span className="text-[10px] opacity-80 text-[#E8A33D]">({event.walkTime})</span>
        </button>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'both' | 'map' | 'list'>('both')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const dayData = SCHEDULE[activeDay]
  const filteredEvents = dayData.events.filter(
    (ev) => typeFilter === 'all' || ev.type === typeFilter
  )

  const selectedEvent =
    dayData.events.find((ev) => ev.id === selectedEventId) || null

  const handleDaySwitch = (dayKey: 'day1' | 'day2') => {
    setActiveDay(dayKey)
    setSelectedEventId(null)
  }

  const handleSelectEvent = (event: ScheduleEvent | null) => {
    if (!event) {
      setSelectedEventId(null)
      return
    }
    if (selectedEventId === event.id) {
      setSelectedEventId(null)
    } else {
      setSelectedEventId(event.id)
      document
        .getElementById(`schedule-row-${event.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  useEffect(() => {
    const unsub = onAgentEvent((event) => {
      if (event.type === 'highlightScheduleRow') {
        const id = event.payload.id as string
        const inDay1 = SCHEDULE.day1.events.some((e) => e.id === id)
        const inDay2 = SCHEDULE.day2.events.some((e) => e.id === id)

        if (inDay1) setActiveDay('day1')
        else if (inDay2) setActiveDay('day2')

        setSelectedEventId(id)

        setTimeout(() => {
          document
            .getElementById(`schedule-row-${id}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 150)
      }
    })
    return unsub
  }, [])

  return (
    <section
      id="schedule"
      className="py-20 lg:py-32 relative bg-[#070B08] border-t border-b border-[#50E3C2]/15 overflow-hidden"
      aria-labelledby="schedule-heading"
    >
      <CircuitBoard prefersReduced={false} />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#50E3C2]/40 to-transparent pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-10 lg:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[#50E3C2] fill-[#50E3C2]" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[#50E3C2] font-bold">
                Interactive Campus &amp; Agenda Guide
              </p>
            </div>
            <h2
              id="schedule-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(38px, 5vw, 76px)', color: 'var(--text-primary)' }}
            >
              EVENT <br />
              <span className="text-stroke-green">TIMELINE &amp; MAP</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-[#50E3C2] hover:text-white transition-colors border-b border-[#50E3C2]/40 pb-1"
            >
              Full Interactive Schedule <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Day Selector Tabs & Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#50E3C2]/15">
          {/* Day 1 / Day 2 Tabs */}
          <div className="flex items-center gap-3">
            {(['day1', 'day2'] as const).map((dayKey) => {
              const isActive = activeDay === dayKey
              const d = SCHEDULE[dayKey]
              return (
                <button
                  key={dayKey}
                  onClick={() => handleDaySwitch(dayKey)}
                  className="px-5 py-3 rounded-2xl font-mono-data text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all duration-200"
                  style={{
                    background: isActive ? '#50E3C2' : '#0D140E',
                    color: isActive ? '#070B08' : '#F5F5F0',
                    fontWeight: isActive ? 700 : 500,
                    border: `1px solid ${isActive ? '#50E3C2' : 'rgba(80,227,194,0.25)'}`,
                    boxShadow: isActive ? '0 0 20px rgba(80,227,194,0.35)' : 'none',
                  }}
                >
                  <Calendar size={14} />
                  <span>
                    {d.label} — {d.date}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Event Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
            <Filter size={13} className="text-[#50E3C2] shrink-0 hidden md:block" />
            {['all', 'keynote', 'panel', 'competition', 'hackathon', 'expo'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl font-mono-data text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? 'bg-[#50E3C2]/20 text-[#50E3C2] border border-[#50E3C2] font-bold'
                    : 'bg-[#0D140E] text-[#8A9488] border border-[#50E3C2]/15 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View Toggle Pills */}
        <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-[#0D140E] border border-[#50E3C2]/20 mb-6">
          <button
            onClick={() => setMobileView('both')}
            className={`flex-1 py-2 font-mono-data text-xs uppercase font-bold rounded-xl transition-all ${
              mobileView === 'both' ? 'bg-[#50E3C2] text-[#070B08]' : 'text-[#8A9488]'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2 font-mono-data text-xs uppercase font-bold rounded-xl transition-all ${
              mobileView === 'map' ? 'bg-[#50E3C2] text-[#070B08]' : 'text-[#8A9488]'
            }`}
          >
            2D Map
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-2 font-mono-data text-xs uppercase font-bold rounded-xl transition-all ${
              mobileView === 'list' ? 'bg-[#50E3C2] text-[#070B08]' : 'text-[#8A9488]'
            }`}
          >
            Agenda ({filteredEvents.length})
          </button>
        </div>

        {/* Main 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 2D Interactive Map */}
          <div
            className={`lg:col-span-6 xl:col-span-6 sticky top-28 ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <CampusMap
              events={dayData.events}
              selectedEvent={selectedEvent}
              onSelectEvent={handleSelectEvent}
              activeDayLabel={dayData.label}
            />
          </div>

          {/* Right Column: Events Stream */}
          <div
            className={`lg:col-span-6 xl:col-span-6 space-y-4 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="font-mono-data text-xs uppercase text-[#8A9488]">
                Select an event to preview turning path
              </span>
              <span className="font-mono-data text-xs text-[#50E3C2] font-bold">
                {filteredEvents.length} Sessions
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeDay}-${typeFilter}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 max-h-[660px] overflow-y-auto pr-1 custom-scrollbar"
              >
                {filteredEvents.map((event, idx) => (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    isSelected={selectedEventId === event.id}
                    onSelect={() => handleSelectEvent(event)}
                    index={idx}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
