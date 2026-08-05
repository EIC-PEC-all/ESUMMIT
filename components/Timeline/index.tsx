'use client'
// components/Timeline/index.tsx
// Vertical Schedule Timeline with Money/Fintech theme styling

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Zap, ShieldCheck, MapPin } from 'lucide-react'
import { SCHEDULE } from '@/lib/data'
import { onAgentEvent } from '@/lib/events'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'

type ScheduleEvent = typeof SCHEDULE.day1.events[0]

function TimelineEventCard({
  event,
  isHighlighted,
  index,
}: {
  event: ScheduleEvent
  isHighlighted: boolean
  index: number
}) {
  return (
    <motion.div
      id={`schedule-row-${event.id}`}
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative pl-8 sm:pl-14 pb-10 border-l-2 ${
        isHighlighted
          ? 'border-[#7ED321] shadow-[0_0_20px_#7ED321] highlight-active'
          : 'border-[#7ED321]/30 hover:border-[#7ED321]'
      } transition-colors duration-300 group`}
    >
      {/* Node Bullet on Vertical Pipeline Spine */}
      <div
        className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#070B08] border-2 transition-all duration-300 group-hover:scale-125 flex items-center justify-center"
        style={{
          borderColor: isHighlighted ? '#7ED321' : '#7ED321',
          boxShadow: isHighlighted ? '0 0 20px #7ED321' : '0 0 8px rgba(126,211,33,0.4)',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#7ED321]" />
      </div>

      {/* Main Event Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0D140E] border border-[#7ED321]/20 hover:border-[#7ED321] transition-all duration-300 shadow-xl group-hover:-translate-y-1 relative overflow-hidden">
        {/* Top Metallic Gloss Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7ED321]/30 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Time */}
          <div className="flex items-center gap-2 font-mono-data text-xs text-[#7ED321] font-bold tabular-nums">
            <Clock size={14} className="text-[#7ED321]" />
            <span>{event.time}</span>
          </div>

          {/* Type Badge */}
          <span className="font-mono-data text-[10px] uppercase font-bold px-3 py-1 rounded bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30">
            {event.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl sm:text-3xl text-white group-hover:text-[#7ED321] transition-colors mb-2">
          {event.title}
        </h3>

        {/* Track & Venue Footer */}
        <div className="mt-4 pt-3 border-t border-[#7ED321]/15 flex flex-wrap items-center justify-between gap-2">
          {event.track ? (
            <span className="font-mono-data text-[10px] uppercase text-[#7ED321] font-bold flex items-center gap-1">
              <Zap size={11} className="text-[#7ED321] fill-[#7ED321]" />
              Track: {event.track}
            </span>
          ) : (
            <span className="font-mono-data text-[10px] uppercase text-[#8A9488] flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#8A9488]" />
              PEC Official Session
            </span>
          )}

          <span className="font-mono-data text-[10px] text-[#8A9488] flex items-center gap-1">
            <MapPin size={11} className="text-[#7ED321]" />
            PEC Main Campus, Sector 12
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [highlightId, setHighlightId] = useState<string | null>(null)

  const dayData = SCHEDULE[activeDay]

  useEffect(() => {
    const unsub = onAgentEvent((event) => {
      if (event.type === 'highlightScheduleRow') {
        const id = event.payload.id as string
        setHighlightId(id)
        document.getElementById(`schedule-row-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setHighlightId(null), 4000)
      }
    })
    return unsub
  }, [])

  return (
    <section
      id="schedule"
      className="py-24 lg:py-32 relative bg-[#070B08] border-t border-b border-[#7ED321]/15 overflow-hidden"
      aria-labelledby="schedule-heading"
    >
      {/* Circuit overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[#7ED321] fill-[#7ED321]" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[#7ED321] font-bold">
                Summit Agenda &amp; Timetable
              </p>
            </div>
            <h2
              id="schedule-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 76px)', color: 'var(--text-primary)' }}
            >
              SUMMIT <br />
              <span className="text-stroke-green">SCHEDULE</span>
            </h2>
          </div>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-[#7ED321] hover:text-white transition-colors border-b border-[#7ED321]/40 pb-1"
          >
            View Interactive Vertical Timetable &rarr;
          </Link>
        </motion.div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-4 mb-14">
          {(['day1', 'day2'] as const).map((dayKey) => {
            const isActive = activeDay === dayKey
            const d = SCHEDULE[dayKey]
            return (
              <button
                key={dayKey}
                onClick={() => setActiveDay(dayKey)}
                className="px-6 py-3.5 rounded-xl font-mono-data text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-200"
                style={{
                  background: isActive ? '#7ED321' : '#0D140E',
                  color: isActive ? '#070B08' : '#F5F5F0',
                  fontWeight: isActive ? 700 : 500,
                  border: `1px solid ${isActive ? 'transparent' : 'rgba(126,211,33,0.3)'}`,
                  boxShadow: isActive ? '0 0 20px rgba(126,211,33,0.4)' : undefined,
                }}
              >
                <Calendar size={14} />
                <span>{d.label} ({d.date})</span>
              </button>
            )
          })}
        </div>

        {/* Vertical Pipeline Events Stream */}
        <div className="max-w-3xl relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {dayData.events.map((event, idx) => (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  isHighlighted={highlightId === event.id}
                  index={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
