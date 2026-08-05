'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Bookmark, ArrowLeft, Zap } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
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
      toast('Removed from bookmarks', { icon: '🗑️', style: { background: '#0D140E', color: '#F5F5F0' } })
    } else {
      setBookmarks([...bookmarks, id])
      toast.success(`Bookmarked "${title}"`, {
        style: { background: '#0D140E', color: '#F5F5F0', border: '1px solid #7ED321' },
        iconTheme: { primary: '#7ED321', secondary: '#070B08' },
      })
    }
  }

  const filteredEvents = currentDay.events.filter((ev) => filterType === 'all' || ev.type === filterType)

  return (
    <main className="min-h-screen bg-[#070B08] text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[#7ED321]/20 overflow-hidden">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-[#8A9488] hover:text-[#7ED321] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7ED321]/15 border border-[#7ED321]/30 mb-6">
              <Zap size={14} className="text-[#7ED321] fill-[#7ED321]" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-[#7ED321] font-bold">
                E-Summit 2026 Interactive Timetable
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              SUMMIT <br />
              <span className="text-stroke-green">TIMETABLE</span>
            </h1>

            <p className="font-body text-lg text-[#8A9488] max-w-xl leading-relaxed mb-8">
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
                    background: activeDay === dayKey ? '#7ED321' : '#0D140E',
                    color: activeDay === dayKey ? '#070B08' : '#F5F5F0',
                    fontWeight: activeDay === dayKey ? 700 : 500,
                    border: `1px solid ${activeDay === dayKey ? 'transparent' : 'rgba(126,211,33,0.3)'}`,
                    boxShadow: activeDay === dayKey ? '0 0 20px rgba(126,211,33,0.4)' : 'none',
                  }}
                >
                  {SCHEDULE[dayKey].label} — {SCHEDULE[dayKey].date}
                </button>
              ))}

              {bookmarks.length > 0 && (
                <div className="font-mono-data text-xs text-[#7ED321] px-3 py-2 rounded-lg bg-[#7ED321]/15 border border-[#7ED321]/30 font-bold">
                  {bookmarks.length} Bookmarked Sessions
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Vertical Pipeline */}
      <section className="py-20 bg-[#111A12]">
        <div className="section-container max-w-3xl">
          {/* Type Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10">
            {['all', 'keynote', 'panel', 'competition', 'hackathon', 'networking', 'expo'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-150"
                style={{
                  background: filterType === t ? '#7ED321' : '#0D140E',
                  color: filterType === t ? '#070B08' : '#8A9488',
                  fontWeight: filterType === t ? 700 : 400,
                  border: `1px solid ${filterType === t ? 'transparent' : 'rgba(126,211,33,0.2)'}`,
                }}
              >
                {t === 'all' ? 'All Event Types' : t}
              </button>
            ))}
          </div>

          {/* Vertical Pipeline Events Stream */}
          <div className="relative pl-6 sm:pl-10">
            {/* Vertical Spine Line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7ED321] via-[#7ED321]/40 to-transparent" />

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
                    <div className="absolute -left-[18px] top-4 w-3.5 h-3.5 rounded-full bg-[#070B08] border-2 border-[#7ED321] group-hover:scale-125 transition-transform" />

                    {/* Card */}
                    <div className="p-6 rounded-2xl bg-[#0D140E] border border-[#7ED321]/20 hover:border-[#7ED321] transition-all duration-200 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono-data text-xs font-bold text-[#7ED321] flex items-center gap-1 tabular-nums">
                              <Clock size={13} /> {item.time}
                            </span>
                            <span className="font-mono-data text-[9px] uppercase px-2.5 py-0.5 rounded bg-[#7ED321]/15 text-[#7ED321] border border-[#7ED321]/30 font-bold">
                              {item.type}
                            </span>
                          </div>

                          <h3 className="font-display text-2xl text-white mb-1 group-hover:text-[#7ED321] transition-colors">
                            {item.title}
                          </h3>

                          {item.track && (
                            <p className="font-mono-data text-[10px] uppercase text-[#7ED321] font-bold mt-2">
                              ⚡ Track: {item.track}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => toggleBookmark(item.id, item.title)}
                          className={`shrink-0 px-4 py-2.5 rounded-xl flex items-center gap-2 font-mono-data text-xs transition-all ${
                            isBookmarked
                              ? 'bg-[#7ED321]/20 text-[#7ED321] border border-[#7ED321]/40 font-bold'
                              : 'bg-[#070B08] border border-[#7ED321]/30 text-[#8A9488] hover:text-white'
                          }`}
                        >
                          <Bookmark size={14} className={isBookmarked ? 'fill-[#7ED321]' : ''} />
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
