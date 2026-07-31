'use client'
// components/Timeline/index.tsx
// Pinned Schedule & Lineup timeline with Voltage current line spine and interactive day toggle

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Zap, ArrowRight } from 'lucide-react'
import { SCHEDULE } from '@/lib/data'
import { onAgentEvent } from '@/lib/events'
import Link from 'next/link'

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
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`relative pl-8 sm:pl-12 pb-8 border-l-2 ${
        isHighlighted ? 'border-volt highlight-active' : 'border-volt-dim/30'
      } group`}
    >
      {/* Node Dot on Timeline Spine */}
      <div
        className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-void border-2 transition-all duration-300 group-hover:scale-125"
        style={{
          borderColor: isHighlighted ? '#F5D400' : 'var(--accent-volt-dim)',
          boxShadow: isHighlighted ? '0 0 16px #F5D400' : undefined,
        }}
      />

      <div className="p-6 rounded-2xl bg-panel border border-volt-dim/25 hover:border-volt transition-all duration-300 shadow-xl group-hover:-translate-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          {/* Time */}
          <div className="flex items-center gap-2 font-mono-data text-xs text-volt font-bold">
            <Clock size={13} /> {event.time}
          </div>

          {/* Type Badge */}
          <span className="font-mono-data text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-void text-volt border border-volt/30">
            {event.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl text-primary group-hover:text-volt transition-colors">
          {event.title}
        </h3>

        {/* Track tag if present */}
        {event.track && (
          <div className="mt-3 pt-3 border-t border-volt-dim/20 flex items-center justify-between">
            <span className="font-mono-data text-[10px] uppercase text-volt">
              ⚡ Track: {event.track}
            </span>
            <span className="font-mono-data text-[10px] text-muted">
              Main Campus Auditorium
            </span>
          </div>
        )}
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
      className="py-24 lg:py-32 relative"
      style={{ background: 'var(--bg-void)' }}
      aria-labelledby="schedule-heading"
    >
      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-volt fill-volt" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-volt">
                Lineup &amp; Agenda
              </p>
            </div>
            <h2
              id="schedule-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              SUMMIT <br />
              <span className="text-volt">SCHEDULE</span>
            </h2>
          </div>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-volt hover:text-primary transition-colors"
          >
            View Interactive Schedule Page &rarr;
          </Link>
        </motion.div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-4 mb-12">
          {(['day1', 'day2'] as const).map((dayKey) => {
            const isActive = activeDay === dayKey
            const d = SCHEDULE[dayKey]
            return (
              <button
                key={dayKey}
                onClick={() => setActiveDay(dayKey)}
                className="px-6 py-3 rounded-xl font-mono-data text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-200"
                style={{
                  background: isActive ? 'var(--accent-volt)' : 'var(--bg-panel)',
                  color: isActive ? '#0A0A0A' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 400,
                  border: `1px solid ${isActive ? 'transparent' : 'rgba(138,118,0,0.3)'}`,
                }}
              >
                <Calendar size={14} />
                <span>{d.label} ({d.date})</span>
              </button>
            )
          })}
        </div>

        {/* Timeline Events List */}
        <div className="max-w-4xl relative">
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
