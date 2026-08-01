'use client'
// components/Timeline/index.tsx
// Vertical Pipeline Schedule Timeline with Forest Green, Vibrant Orange, and Silver Metallic Accents

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Zap, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
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
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative pl-8 sm:pl-14 pb-10 border-l-2 ${
        isHighlighted
          ? 'border-orange shadow-[0_0_20px_#FF9900] highlight-active'
          : 'border-orange/30 hover:border-orange/70'
      } transition-colors duration-300 group`}
    >
      {/* Node Bullet on Vertical Pipeline Spine */}
      <div
        className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-void border-2 transition-all duration-300 group-hover:scale-125 flex items-center justify-center"
        style={{
          borderColor: isHighlighted ? '#FF9900' : 'var(--accent-orange)',
          boxShadow: isHighlighted ? '0 0 20px #FF9900' : '0 0 8px rgba(255,153,0,0.3)',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-orange" />
      </div>

      {/* Main Event Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-panel border border-[#D1D5DB]/20 hover:border-orange transition-all duration-300 shadow-xl group-hover:-translate-y-1 relative overflow-hidden">
        {/* Top Metallic Gloss Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D1D5DB]/30 to-transparent" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Time */}
          <div className="flex items-center gap-2 font-mono-data text-xs text-orange font-bold">
            <Clock size={14} className="text-orange" />
            <span>{event.time}</span>
          </div>

          {/* Type Badge */}
          <span className="font-mono-data text-[10px] uppercase font-bold px-3 py-1 rounded bg-green/40 text-orange border border-green">
            {event.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl sm:text-3xl text-primary group-hover:text-orange transition-colors mb-2">
          {event.title}
        </h3>

        {/* Track & Venue Footer */}
        <div className="mt-4 pt-3 border-t border-[#D1D5DB]/15 flex flex-wrap items-center justify-between gap-2">
          {event.track ? (
            <span className="font-mono-data text-[10px] uppercase text-orange font-bold flex items-center gap-1">
              <Zap size={11} className="text-orange fill-orange" />
              Track: {event.track}
            </span>
          ) : (
            <span className="font-mono-data text-[10px] uppercase text-[#D1D5DB] flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#D1D5DB]" />
              PEC Official Session
            </span>
          )}

          <span className="font-mono-data text-[10px] text-muted flex items-center gap-1">
            <MapPin size={11} className="text-orange" />
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
      className="py-24 lg:py-32 relative"
      style={{ background: 'var(--bg-void)' }}
      aria-labelledby="schedule-heading"
    >
      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container">
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
              <Zap size={14} className="text-orange fill-orange" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-orange font-bold">
                Vertical Pipeline Lineup
              </p>
            </div>
            <h2
              id="schedule-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 76px)', color: 'var(--text-primary)' }}
            >
              SUMMIT <br />
              <span className="text-stroke-orange">SCHEDULE</span>
            </h2>
          </div>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-orange hover:text-primary transition-colors border-b border-orange/40 pb-1"
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
                  background: isActive ? 'var(--accent-orange)' : 'var(--bg-panel)',
                  color: isActive ? '#0D1110' : 'var(--text-primary)',
                  fontWeight: isActive ? 700 : 500,
                  border: `1px solid ${isActive ? 'transparent' : 'rgba(209,213,219,0.2)'}`,
                  boxShadow: isActive ? '0 0 20px rgba(255,153,0,0.4)' : undefined,
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
