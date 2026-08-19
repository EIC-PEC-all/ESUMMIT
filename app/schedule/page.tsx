// app/schedule/page.tsx — redirects to homepage event section
import { redirect } from 'next/navigation'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Bookmark, ArrowLeft } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import { SCHEDULE as DEFAULT_SCHEDULE } from '@/lib/data'
import { api } from '@/lib/api'
import type { BackendEvent } from '@/lib/api-types'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function ScheduleLandingPage() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [liveEvents, setLiveEvents] = useState<BackendEvent[]>([])

  useEffect(() => {
    let mounted = true
    api.getEvents()
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setLiveEvents(data)
        }
      })
      .catch(() => {
        // Fallback
      })
    return () => {
      mounted = false
    }
  }, [])

  const toggleBookmark = (id: string, title: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id))
      toast('Removed from bookmarks', {
        icon: '🗑️',
        style: { background: '#0A110E', color: '#FFFFFF' },
      })
    } else {
      setBookmarks([...bookmarks, id])
      toast.success(`Bookmarked "${title}"`, {
        style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
        iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
      })
    }
  }

  // If live events exist from backend, use them for the active day (1 or 2)
  const dayNumber = activeDay === 'day1' ? 1 : 2
  const dayLiveEvents = liveEvents.filter((ev) => ev.day === dayNumber)
  
  const displayEvents = dayLiveEvents.length > 0 
    ? dayLiveEvents.map((ev) => ({
        id: ev.id,
        time: `${ev.startTime} - ${ev.endTime}`,
        title: ev.title,
        track: ev.track,
        type: ev.type,
      }))
    : DEFAULT_SCHEDULE[activeDay].events

  const filteredEvents = displayEvents.filter(
    (ev) => filterType === 'all' || ev.type.toLowerCase() === filterType.toLowerCase()
  )

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-void pb-20 pt-36">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted transition-colors hover:text-mint"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-6 font-display text-3xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
              <span className="text-gradient-white">SUMMIT</span> <br />
              <span className="text-gradient-mint">TIMETABLE</span>
            </h1>

            <p className="mb-8 max-w-xl font-body text-lg leading-relaxed text-secondary">
              Plan your 2-day summit experience. Bookmark keynotes, panel discussions, hackathon
              checkpoints, and speed networking sessions.
            </p>

            {/* Day Selector */}
            <div className="flex flex-wrap items-center gap-4" role="tablist" aria-label="Summit Days">
              {(['day1', 'day2'] as const).map((dayKey) => (
                <button
                  key={dayKey}
                  role="tab"
                  aria-selected={activeDay === dayKey}
                  onClick={() => setActiveDay(dayKey)}
                  className={`rounded-xl px-6 py-3 font-mono-data text-xs uppercase tracking-wider transition-all duration-200 ${
                    activeDay === dayKey
                      ? 'bg-mint font-bold text-void border border-mint/80'
                      : 'hover:border-mint/40 border border-border-subtle bg-panel text-secondary hover:text-white'
                  }`}
                >
                  {DEFAULT_SCHEDULE[dayKey].label} — {DEFAULT_SCHEDULE[dayKey].date}
                </button>
              ))}

              {bookmarks.length > 0 && (
                <div className="bg-mint/10 border-mint/30 rounded-xl border px-3 py-2 font-mono-data text-xs font-bold text-mint">
                  {bookmarks.length} Bookmarked Sessions
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Vertical Pipeline */}
      <section className="bg-void py-20">
        <div className="section-container max-w-3xl">
          {/* Type Filter Pills */}
          <div className="mb-10 flex gap-2 overflow-x-auto pb-4" role="tablist" aria-label="Session Type Filters">
            {['all', 'keynote', 'panel', 'competition', 'hackathon', 'networking', 'expo'].map(
              (t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={filterType === t}
                  onClick={() => setFilterType(t)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 font-mono-data text-xs uppercase tracking-wider transition-all duration-150 ${
                    filterType === t
                      ? 'bg-mint font-bold text-void border border-mint/80'
                      : 'hover:border-mint/40 border border-border-subtle bg-panel text-secondary hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All Event Types' : t}
                </button>
              )
            )}
          </div>

          {/* Vertical Pipeline Events Stream */}
          <div className="relative pl-6 sm:pl-10">
            {/* Vertical Spine Line */}
            <div className="via-[var(--accent-mint)]/40 absolute bottom-0 left-[11px] top-0 w-0.5 bg-gradient-to-b from-[var(--accent-mint)] to-transparent" />

            <div className="space-y-8">
              {filteredEvents.map((item, idx) => {
                const isBookmarked = bookmarks.includes(item.id)
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="group relative pl-6 sm:pl-8"
                  >
                    {/* Node Dot */}
                    <div className="absolute -left-[18px] top-4 h-3.5 w-3.5 rounded-full border-2 border-[var(--accent-mint)] bg-void transition-transform group-hover:scale-125" />

                    {/* Card */}
                    <div className="border-[var(--accent-mint)]/20 rounded-2xl border bg-panel p-6 shadow-lg transition-all duration-200 hover:border-[var(--accent-mint)]">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <span className="flex items-center gap-1 font-mono-data text-xs font-bold tabular-nums text-[var(--accent-mint)]">
                              <Clock size={13} /> {item.time}
                            </span>
                            <span className="bg-[var(--accent-mint)]/15 border-[var(--accent-mint)]/30 rounded border px-2.5 py-0.5 font-mono-data text-[9px] font-bold uppercase text-[var(--accent-mint)]">
                              {item.type}
                            </span>
                          </div>

                          <h3 className="mb-1 font-display text-2xl text-white transition-colors group-hover:text-[var(--accent-mint)]">
                            {item.title}
                          </h3>

                          {item.track && (
                            <p className="mt-2 font-mono-data text-[10px] font-bold uppercase text-[var(--accent-mint)]">
                              ⚡ Track: {item.track}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => toggleBookmark(item.id, item.title)}
                          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono-data text-xs transition-all ${
                            isBookmarked
                              ? 'bg-[var(--accent-mint)]/20 border-[var(--accent-mint)]/40 border font-bold text-[var(--accent-mint)]'
                              : 'border-[var(--accent-mint)]/30 border bg-void text-muted hover:text-white'
                          }`}
                        >
                          <Bookmark
                            size={14}
                            className={isBookmarked ? 'fill-[var(--accent-mint)]' : ''}
                          />
                          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Concierge />
    </main>
  )
}

