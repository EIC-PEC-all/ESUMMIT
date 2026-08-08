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
          ? 'bg-[#0D2420] [.light_&]:bg-[#2A3C1A] border-mint [.light_&]:border-[#C8E696] shadow-xl translate-x-1'
          : 'bg-[#061210]/90 [.light_&]:bg-[#18230F]/90 hover:bg-[#0D2420]/80 [.light_&]:hover:bg-[#202E14] border-mint/20 [.light_&]:border-[#4E6527]/50 shadow-md'
      }`}
    >
      {/* Top Gloss Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl transition-opacity duration-300 ${
          isSelected
            ? 'bg-gradient-to-r from-mint via-white to-mint opacity-100'
            : 'bg-gradient-to-r from-transparent via-mint/30 to-transparent opacity-0 group-hover:opacity-100'
        }`}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Time Badge */}
        <div className="flex items-center gap-1.5 font-mono-data text-xs text-mint [.light_&]:text-[#C8E696] font-bold tabular-nums">
          <Clock size={13} className="text-mint [.light_&]:text-[#C8E696]" />
          <span>{event.time}</span>
        </div>

        {/* Type Badge */}
        <span
          className={`font-mono-data text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border transition-colors ${
            isSelected
              ? 'bg-mint text-void border-mint [.light_&]:bg-[#C8E696] [.light_&]:text-[#0A110E] [.light_&]:border-[#C8E696]'
              : 'bg-mint/15 text-mint border-mint/30 [.light_&]:bg-[#C8E696]/15 [.light_&]:text-[#C8E696] [.light_&]:border-[#C8E696]/30'
          }`}
        >
          {event.type}
        </span>
      </div>

      {/* Event Title — CRISP HIGH CONTRAST WHITE TEXT */}
      <h3
        className={`font-display text-xl sm:text-2xl mb-2 transition-colors ${
          isSelected ? 'text-mint [.light_&]:text-[#C8E696] font-bold' : 'text-white font-bold group-hover:text-mint [.light_&]:group-hover:text-[#C8E696]'
        }`}
      >
        {event.title}
      </h3>

      {/* Venue & Route Meta Footer */}
      <div className="mt-3 pt-3 border-t border-mint/20 [.light_&]:border-[#4E6527]/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono-data text-xs text-gray-200">
          <MapPin size={13} className="text-mint [.light_&]:text-[#C8E696] shrink-0" />
          <span className="text-gray-200 font-medium">{event.venueName}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className={`inline-flex items-center gap-1 font-mono-data text-[11px] uppercase font-bold px-3 py-1.5 rounded-xl transition-all ${
            isSelected
              ? 'bg-mint text-void shadow-md [.light_&]:bg-[#C8E696] [.light_&]:text-[#0A110E]'
              : 'bg-white/10 text-white border border-white/20 hover:bg-mint hover:text-void [.light_&]:hover:bg-[#C8E696] [.light_&]:hover:text-[#0A110E]'
          }`}
        >
          <Navigation size={11} className={isSelected ? 'animate-bounce' : ''} />
          <span>{isSelected ? 'Route Active' : 'View Path'}</span>
          <span className="text-[10px] opacity-80">({event.walkTime})</span>
        </button>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'both' | 'map' | 'list'>('both')

  const dayData = SCHEDULE[activeDay]

  const filteredEvents = dayData.events.filter((event) => {
    if (typeFilter === 'all') return true
    return event.type.toLowerCase() === typeFilter.toLowerCase()
  })

  const selectedEvent =
    filteredEvents.find((e) => e.id === selectedEventId) ||
    dayData.events.find((e) => e.id === selectedEventId) ||
    null

  const handleSelectEvent = (event: ScheduleEvent | null) => {
    if (!event) {
      setSelectedEventId(null)
      return
    }
    setSelectedEventId(event.id)
  }

  const handleDaySwitch = (day: 'day1' | 'day2') => {
    setActiveDay(day)
    setSelectedEventId(null)
  }

  useEffect(() => {
    const unsub = onAgentEvent((detail: any) => {
      if (detail.type === 'highlightScheduleRow') {
        const id = detail.id as string
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
      className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative bg-[#0D2420] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 overflow-hidden"
      aria-labelledby="schedule-heading"
    >
      <CircuitBoard prefersReduced={false} />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-8 flex flex-col items-center text-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="schedule-heading"
            className="font-display font-black uppercase leading-none tracking-tight text-[var(--accent-mint)] drop-shadow-lg mb-2"
            style={{ fontSize: 'clamp(3rem, 12vw, 150px)' }}
          >
            TIMELINE
          </h2>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-mint [.light_&]:text-[#C8E696] hover:text-white transition-colors border-b border-mint/40 [.light_&]:border-[#C8E696]/40 pb-1"
          >
            Full Interactive Schedule <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        {/* Day Selector Tabs & Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-mint/20 [.light_&]:border-[#4E6527]/30">
          {/* Day 1 / Day 2 Tabs */}
          <div className="flex items-center gap-3">
            {(['day1', 'day2'] as const).map((dayKey) => {
              const isActive = activeDay === dayKey
              const d = SCHEDULE[dayKey]
              return (
                <button
                  key={dayKey}
                  onClick={() => handleDaySwitch(dayKey)}
                  className={`px-5 py-3 rounded-2xl font-mono-data text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-mint text-void font-bold shadow-lg [.light_&]:bg-[#C8E696] [.light_&]:text-[#0A110E]'
                      : 'bg-white/10 text-white hover:text-mint [.light_&]:hover:text-[#C8E696] border border-white/20'
                  }`}
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
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-2 sm:pb-0">
            <Filter size={13} className="text-mint [.light_&]:text-[#C8E696] shrink-0 hidden md:block" />
            {['all', 'keynote', 'panel', 'competition', 'hackathon', 'expo'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3.5 py-2 rounded-xl font-mono-data text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? 'bg-mint text-void font-bold shadow-md [.light_&]:bg-[#C8E696] [.light_&]:text-[#0A110E]'
                    : 'bg-white/10 text-white hover:text-mint [.light_&]:hover:text-[#C8E696] border border-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View Toggle Pills */}
        <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-white/10 border border-white/20 mb-6">
          <button
            onClick={() => setMobileView('both')}
            className={`flex-1 py-2 font-mono-data text-xs uppercase font-bold rounded-xl transition-all ${
              mobileView === 'both' ? 'bg-[#C8E696] text-[#0A110E]' : 'text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 py-2 font-mono-data text-xs uppercase font-bold rounded-xl transition-all ${
              mobileView === 'map' ? 'bg-[#C8E696] text-[#0A110E]' : 'text-white'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-2 font-mono-data text-xs uppercase font-bold rounded-xl transition-all ${
              mobileView === 'list' ? 'bg-[#C8E696] text-[#0A110E]' : 'text-white'
            }`}
          >
            List
          </button>
        </div>

        {/* Main 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Leaflet Map */}
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
              <span className="font-mono-data text-xs uppercase text-gray-200">
                Select an event to preview turning path
              </span>
              <span className="font-mono-data text-xs text-mint [.light_&]:text-[#C8E696] font-bold">
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
