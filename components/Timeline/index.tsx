'use client'
// components/Timeline/index.tsx
// Schedule section — staggered reveal per row, day tabs, agent highlight support

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { SCHEDULE } from '@/lib/data'
import { onAgentEvent } from '@/lib/events'

const TYPE_COLORS: Record<string, string> = {
  logistics:   '#8A90A6',
  keynote:     '#FF4D3D',
  panel:       '#3DD9FF',
  expo:        '#FF8C42',
  break:       '#8A90A6',
  competition: '#FF4D3D',
  hackathon:   '#9B5CFF',
  networking:  '#3DD9FF',
  social:      '#FF8C42',
}

type ScheduleEvent = {
  id: string
  time: string
  title: string
  type: string
  track: string | null
}

function ScheduleRow({
  event,
  index,
  isHighlighted,
}: {
  event: ScheduleEvent
  index: number
  isHighlighted: boolean
}) {
  const color = TYPE_COLORS[event.type] ?? '#8A90A6'
  return (
    <motion.div
      id={`schedule-${event.id}`}
      className="flex items-start gap-4 py-4 border-b"
      style={{
        borderColor: 'rgba(138,144,166,0.08)',
        outline: isHighlighted ? `2px solid ${color}` : 'none',
        outlineOffset: '4px',
        borderRadius: isHighlighted ? '6px' : '0',
        transition: 'outline 0.3s ease',
      }}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Row number */}
      <span
        className="font-mono-data text-xs w-6 shrink-0 pt-0.5 select-none"
        style={{ color: 'var(--text-muted)', opacity: 0.4 }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Time */}
      <span
        className="font-mono-data text-sm w-14 shrink-0 pt-0.5"
        style={{ color }}
      >
        {event.time}
      </span>

      {/* Title */}
      <span
        className="font-body text-sm leading-snug flex-1"
        style={{ color: 'var(--text-primary)' }}
      >
        {event.title}
      </span>

      {/* Type badge */}
      <span
        className="font-mono-data text-[9px] uppercase tracking-wider px-2 py-1 rounded shrink-0"
        style={{
          background: `${color}15`,
          color,
          border: `1px solid ${color}30`,
        }}
        aria-label={`type: ${event.type}`}
      >
        {event.type}
      </span>
    </motion.div>
  )
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(sectionRef, { once: true, margin: '-60px' })

  const days = { day1: SCHEDULE.day1, day2: SCHEDULE.day2 }
  const currentDay = days[activeDay]

  // Listen for agent highlight events
  useEffect(() => {
    const unsub = onAgentEvent((event) => {
      if (event.type === 'highlightScheduleRow') {
        const id = event.payload.id as string
        setHighlightId(id)
        const inDay1 = SCHEDULE.day1.events.some((e) => e.id === id)
        setActiveDay(inDay1 ? 'day1' : 'day2')
        setTimeout(() => {
          document.getElementById(`schedule-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 200)
        setTimeout(() => setHighlightId(null), 4000)
      }
    })
    return unsub
  }, [])

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="py-24 lg:py-32"
      style={{ background: 'var(--bg-void)' }}
      aria-labelledby="schedule-heading"
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <p
                className="font-mono-data text-xs uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--accent-ignite)' }}
              >
                Event Schedule
              </p>
              <h2
                id="schedule-heading"
                className="font-display leading-none"
                style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
              >
                THE LINEUP
              </h2>
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-signal hover:text-primary transition-colors"
            >
              Full Interactive Agenda &amp; Bookmarks &rarr;
            </Link>
          </div>

          {/* Day tabs */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Schedule days">
            {(['day1', 'day2'] as const).map((day) => (
              <button
                key={day}
                role="tab"
                aria-selected={activeDay === day}
                aria-controls={`schedule-panel-${day}`}
                onClick={() => setActiveDay(day)}
                className="px-5 py-2.5 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeDay === day ? 'var(--accent-ignite)' : 'rgba(138,144,166,0.08)',
                  color:      activeDay === day ? 'var(--text-primary)' : 'var(--text-muted)',
                  border:     `1px solid ${activeDay === day ? 'transparent' : 'rgba(138,144,166,0.1)'}`,
                }}
              >
                {days[day].label} — {days[day].date}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Schedule rows */}
        <div
          id={`schedule-panel-${activeDay}`}
          role="tabpanel"
          aria-label={`${currentDay.label} schedule`}
          className="max-w-2xl"
          key={activeDay} // re-mount list on day switch so animations replay
        >
          {currentDay.events.map((event, i) => (
            <ScheduleRow
              key={event.id}
              event={event}
              index={i}
              isHighlighted={highlightId === event.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
