'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Bookmark, Check, ArrowLeft, Sparkles } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import { SCHEDULE } from '@/lib/data'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

const TYPE_COLORS: Record<string, string> = {
  logistics: '#8A90A6',
  keynote: '#FF4D3D',
  panel: '#3DD9FF',
  expo: '#FF8C42',
  break: '#8A90A6',
  competition: '#FF4D3D',
  hackathon: '#9B5CFF',
  networking: '#3DD9FF',
  social: '#FF8C42',
}

export default function ScheduleLandingPage() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>('all')

  const currentDay = SCHEDULE[activeDay]

  const toggleBookmark = (id: string, title: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id))
      toast('Removed from bookmarks', { icon: '🗑️', style: { background: 'var(--bg-panel)', color: 'var(--text-primary)' } })
    } else {
      setBookmarks([...bookmarks, id])
      toast.success(`Bookmarked "${title}"`, { style: { background: 'var(--bg-panel)', color: 'var(--text-primary)' } })
    }
  }

  const filteredEvents = currentDay.events.filter((ev) => filterType === 'all' || ev.type === filterType)

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[#8A90A6]/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#FF4D3D_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-signal transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ignite/10 border border-ignite/30 mb-6">
              <Sparkles size={14} className="text-ignite" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-ignite">
                E-Summit 2025 Complete Timetable
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              CHOREOGRAPHED <br />
              <span style={{ color: 'var(--accent-ignite)' }}>SUMMIT LINEUP</span>
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
                    background: activeDay === dayKey ? 'var(--accent-ignite)' : 'rgba(138,144,166,0.08)',
                    color: activeDay === dayKey ? '#F5F3EE' : 'var(--text-muted)',
                    border: `1px solid ${activeDay === dayKey ? 'transparent' : 'rgba(138,144,166,0.12)'}`,
                  }}
                >
                  {SCHEDULE[dayKey].label} — {SCHEDULE[dayKey].date}
                </button>
              ))}

              {bookmarks.length > 0 && (
                <div className="font-mono-data text-xs text-signal px-3 py-2 rounded-lg bg-signal/10 border border-signal/30">
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
                  background: filterType === t ? 'rgba(61,217,255,0.15)' : 'rgba(138,144,166,0.06)',
                  color: filterType === t ? 'var(--accent-signal)' : 'var(--text-muted)',
                  border: `1px solid ${filterType === t ? 'rgba(61,217,255,0.3)' : 'rgba(138,144,166,0.1)'}`,
                }}
              >
                {t === 'all' ? 'All Event Types' : t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredEvents.map((item, idx) => {
              const color = TYPE_COLORS[item.type] || '#8A90A6'
              const isBookmarked = bookmarks.includes(item.id)
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="rounded-xl p-6 bg-panel border border-[#8A90A6]/12 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-ignite/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 shrink-0 font-mono-data text-sm font-bold pt-1" style={{ color }}>
                      {item.time}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="font-mono-data text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded"
                          style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
                        >
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
                        ? 'bg-signal/20 text-signal border border-signal/40'
                        : 'bg-void border border-[#8A90A6]/20 text-muted hover:text-primary'
                    }`}
                  >
                    <Bookmark size={14} className={isBookmarked ? 'fill-signal' : ''} />
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
