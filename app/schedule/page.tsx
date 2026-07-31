'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Bookmark, ArrowLeft, Zap } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import { SCHEDULE } from '@/lib/data'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function ScheduleLandingPage() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')

  const currentDay = SCHEDULE[activeDay]

  const toggleBookmark = (id: string, title: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id))
      toast('Removed from bookmarks', { icon: '🗑️', style: { background: '#151515', color: '#F2F2ED' } })
    } else {
      setBookmarks([...bookmarks, id])
      toast.success(`Bookmarked "${title}"`, { style: { background: '#151515', color: '#F2F2ED', border: '1px solid #F5D400' } })
    }
  }

  const filteredEvents = currentDay.events.filter((ev) => filterType === 'all' || ev.type === filterType)

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-volt-dim/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#F5D400_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-volt transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 mb-6">
              <Zap size={14} className="text-volt fill-volt" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-volt">
                E-Summit 2025 Complete Timetable
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              CHOREOGRAPHED <br />
              <span className="text-volt">SUMMIT LINEUP</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
              Plan your 2-day summit experience. Bookmark keynotes, panel discussions, hackathon checkpoints, and speed networking sessions.
            </p>

            {/* Day Selector */}
            <div className="flex flex-wrap items-center gap-4">
              {(['day1', 'day2'] as const).map((dayKey) => (
                <button
                  key={dayKey}
                  onClick={() => setActiveDay(dayKey)}
                  className="px-6 py-3 rounded-xl font-mono-data text-xs uppercase tracking-wider transition-all duration-200"
                  style={{
                    background: activeDay === dayKey ? 'var(--accent-volt)' : 'var(--bg-panel)',
                    color: activeDay === dayKey ? '#0A0A0A' : 'var(--text-muted)',
                    fontWeight: activeDay === dayKey ? 700 : 400,
                    border: `1px solid ${activeDay === dayKey ? 'transparent' : 'rgba(138,118,0,0.3)'}`,
                  }}
                >
                  {SCHEDULE[dayKey].label} — {SCHEDULE[dayKey].date}
                </button>
              ))}

              {bookmarks.length > 0 && (
                <div className="font-mono-data text-xs text-volt px-3 py-2 rounded-lg bg-volt/10 border border-volt/30 font-bold">
                  {bookmarks.length} Bookmarked Sessions
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Timetable */}
      <section className="py-20 bg-panel/30">
        <div className="section-container max-w-4xl">
          {/* Type Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {['all', 'keynote', 'panel', 'competition', 'hackathon', 'networking', 'expo'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-150"
                style={{
                  background: filterType === t ? 'var(--accent-volt)' : 'var(--bg-panel)',
                  color: filterType === t ? '#0A0A0A' : 'var(--text-muted)',
                  fontWeight: filterType === t ? 700 : 400,
                  border: `1px solid ${filterType === t ? 'transparent' : 'rgba(138,118,0,0.3)'}`,
                }}
              >
                {t === 'all' ? 'All Event Types' : t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredEvents.map((item, idx) => {
              const isBookmarked = bookmarks.includes(item.id)
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="rounded-xl p-6 bg-panel border border-volt-dim/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-volt transition-all duration-200 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 shrink-0 font-mono-data text-sm font-bold text-volt pt-1">
                      {item.time}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono-data text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded bg-void text-volt border border-volt/30">
                          {item.type}
                        </span>
                        {item.track && (
                          <span className="font-mono-data text-[9px] uppercase tracking-widest text-muted">
                            Track: {item.track}
                          </span>
                        )}
                      </div>
                      <h3 className="font-body font-semibold text-lg text-primary">{item.title}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBookmark(item.id, item.title)}
                    className={`shrink-0 p-3 rounded-lg flex items-center gap-2 font-mono-data text-xs transition-all ${
                      isBookmarked
                        ? 'bg-volt/20 text-volt border border-volt/40'
                        : 'bg-void border border-volt-dim/30 text-muted hover:text-primary'
                    }`}
                  >
                    <Bookmark size={14} className={isBookmarked ? 'fill-volt' : ''} />
                    <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
      <Concierge />
    </main>
  )
}
