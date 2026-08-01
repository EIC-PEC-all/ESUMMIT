'use client'
// app/schedule/page.tsx
// Interactive Vertical Schedule Landing Page with Silver Metallic & Vibrant Orange Accents

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Bookmark, ArrowLeft, Zap, MapPin } from 'lucide-react'
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
      toast('Removed from bookmarks', { icon: '🗑️', style: { background: '#161F1B', color: '#F9FAF6' } })
    } else {
      setBookmarks([...bookmarks, id])
      toast.success(`Bookmarked "${title}"`, {
        style: { background: '#161F1B', color: '#F9FAF6', border: '1px solid #FF9900' },
        iconTheme: { primary: '#FF9900', secondary: '#0D1110' },
      })
    }
  }

  const filteredEvents = currentDay.events.filter((ev) => filterType === 'all' || ev.type === filterType)

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-orange-dim/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#FF9900_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-orange transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green/40 border border-green mb-6">
              <Zap size={14} className="text-orange fill-orange" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-orange font-bold">
                E-Summit 2025 Vertical Pipeline Schedule
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              VERTICAL <br />
              <span className="text-stroke-orange">SUMMIT LINEUP</span>
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
                    background: activeDay === dayKey ? 'var(--accent-orange)' : 'var(--bg-panel)',
                    color: activeDay === dayKey ? '#0D1110' : 'var(--text-primary)',
                    fontWeight: activeDay === dayKey ? 700 : 500,
                    border: `1px solid ${activeDay === dayKey ? 'transparent' : 'rgba(209,213,219,0.2)'}`,
                    boxShadow: activeDay === dayKey ? '0 0 20px rgba(255,153,0,0.4)' : undefined,
                  }}
                >
                  {SCHEDULE[dayKey].label} — {SCHEDULE[dayKey].date}
                </button>
              ))}

              {bookmarks.length > 0 && (
                <div className="font-mono-data text-xs text-orange px-3 py-2 rounded-lg bg-orange/10 border border-orange/30 font-bold">
                  {bookmarks.length} Bookmarked Sessions
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Vertical Pipeline */}
      <section className="py-20 bg-panel/30">
        <div className="section-container max-w-3xl">
          {/* Type Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10">
            {['all', 'keynote', 'panel', 'competition', 'hackathon', 'networking', 'expo'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-150"
                style={{
                  background: filterType === t ? 'var(--accent-orange)' : 'var(--bg-panel)',
                  color: filterType === t ? '#0D1110' : 'var(--text-primary)',
                  fontWeight: filterType === t ? 700 : 400,
                  border: `1px solid ${filterType === t ? 'transparent' : 'rgba(209,213,219,0.2)'}`,
                }}
              >
                {t === 'all' ? 'All Event Types' : t}
              </button>
            ))}
          </div>

          {/* Vertical Pipeline Events Stream */}
          <div className="relative pl-6 sm:pl-10">
            {/* Vertical Spine Line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange via-orange/40 to-transparent" />

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
                    className="relative pl-6 sm:pl-8 group"
                  >
                    {/* Node Dot */}
                    <div className="absolute -left-[18px] top-4 w-3.5 h-3.5 rounded-full bg-void border-2 border-orange group-hover:scale-125 transition-transform" />

                    {/* Card */}
                    <div className="p-6 rounded-2xl bg-panel border border-[#D1D5DB]/20 hover:border-orange transition-all duration-200 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono-data text-xs font-bold text-orange flex items-center gap-1">
                              <Clock size={13} /> {item.time}
                            </span>
                            <span className="font-mono-data text-[9px] uppercase px-2.5 py-0.5 rounded bg-green/40 text-orange border border-green font-bold">
                              {item.type}
                            </span>
                          </div>

                          <h3 className="font-display text-2xl text-primary mb-1 group-hover:text-orange transition-colors">
                            {item.title}
                          </h3>

                          {item.track && (
                            <p className="font-mono-data text-[10px] uppercase text-orange font-bold mt-2">
                              ⚡ Track: {item.track}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => toggleBookmark(item.id, item.title)}
                          className={`shrink-0 px-4 py-2.5 rounded-xl flex items-center gap-2 font-mono-data text-xs transition-all ${
                            isBookmarked
                              ? 'bg-orange/20 text-orange border border-orange/40 font-bold'
                              : 'bg-void border border-orange-dim/30 text-muted hover:text-primary'
                          }`}
                        >
                          <Bookmark size={14} className={isBookmarked ? 'fill-orange' : ''} />
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
