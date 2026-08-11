'use client'
// app/speakers/page.tsx
// Full-Screen Premium Bento Speakers Portal — Maximum Density & Zero Distraction Layout

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Twitter, Linkedin, ArrowLeft, X, Zap, MessageSquare, ChevronRight } from 'lucide-react'
import { SPEAKERS } from '@/lib/data'
import Link from 'next/link'

const TRACK_FILTERS = ['All', 'panels', 'pitch', 'hackathon', 'expo']

export default function SpeakersPage() {
  const [search, setSearch] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string>('All')
  const [activeSpeaker, setActiveSpeaker] = useState<(typeof SPEAKERS)[0] | null>(null)

  const filteredSpeakers = SPEAKERS.filter((spk) => {
    const matchesSearch =
      spk.name.toLowerCase().includes(search.toLowerCase()) ||
      spk.title.toLowerCase().includes(search.toLowerCase()) ||
      spk.bio.toLowerCase().includes(search.toLowerCase())
    const matchesTrack = selectedTrack === 'All' || spk.track === selectedTrack
    return matchesSearch && matchesTrack
  })

  return (
    <main className="min-h-screen bg-[#060B08] text-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-mint/[0.07] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#3DD9FF]/[0.05] rounded-full blur-[140px]" />
      </div>

      {/* Large Bento Modal Window */}
      <div className="relative z-10 w-full max-w-[96%] xl:max-w-7xl 2xl:max-w-[1500px] rounded-3xl border border-white/20 bg-[#0A1813]/95 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header: Nav Back & Search Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-data text-xs sm:text-sm uppercase tracking-widest text-neutral-400 hover:text-mint transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Return to Main Website</span>
          </Link>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search speakers or roles..."
                className="w-full rounded-full border border-white/20 bg-black/50 py-2 pl-9 pr-4 font-body text-xs sm:text-sm text-white outline-none focus:border-mint transition-colors placeholder:text-neutral-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {TRACK_FILTERS.map((tr) => (
                <button
                  key={tr}
                  onClick={() => setSelectedTrack(tr)}
                  className={`rounded-full px-4 py-1.5 font-mono-data text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedTrack === tr
                      ? 'bg-mint text-black shadow-md scale-[1.02]'
                      : 'border border-white/15 bg-black/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  {tr === 'All' ? 'All Tracks' : tr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Title & Subtitle Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              SPEAKERS &amp; MENTORS
            </h1>
          </div>
          <p className="font-body text-xs sm:text-sm text-neutral-400 max-w-md">
            Hear from India&apos;s leading venture capitalists, unicorn co-founders, and policy experts sharing real, hard-hitting founder playbooks.
          </p>
        </div>

        {/* ── SPEAKERS BENTO GRID ── */}
        {filteredSpeakers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-white/10 bg-white/[0.02]">
            <Search size={40} className="mb-3 text-neutral-500" />
            <h3 className="font-display text-xl font-bold uppercase text-white mb-1">No Speakers Found</h3>
            <p className="font-body text-xs text-neutral-400">Try adjusting your search query or track filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredSpeakers.map((spk, idx) => (
              <motion.div
                key={spk.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setActiveSpeaker(spk)}
                className="group cursor-pointer rounded-2xl border border-white/15 bg-white/[0.03] p-5 sm:p-6 flex flex-col justify-between hover:border-mint/50 hover:bg-mint/[0.05] transition-all shadow-lg hover:-translate-y-1 min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Initials Avatar */}
                    <div className="h-12 w-12 rounded-xl border border-mint/40 bg-mint/10 text-mint font-display text-lg font-black flex items-center justify-center group-hover:scale-105 transition-transform">
                      {spk.initials}
                    </div>
                    <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 font-mono-data text-[10px] font-bold uppercase text-neutral-300 group-hover:border-mint/40 group-hover:text-mint transition-colors">
                      {spk.track} Track
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-mint transition-colors mb-1">
                    {spk.name}
                  </h3>
                  <p className="font-mono-data text-xs text-neutral-400 leading-snug line-clamp-2">
                    {spk.title}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between font-mono-data text-xs font-bold text-neutral-400 group-hover:text-mint transition-colors">
                  <span>View Bio Profile</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* SPEAKER DETAIL MODAL */}
      <AnimatePresence>
        {activeSpeaker && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setActiveSpeaker(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#0B1913] p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl border border-mint/40 bg-mint/15 text-mint font-display text-2xl font-black flex items-center justify-center shrink-0">
                  {activeSpeaker.initials}
                </div>
                <div>
                  <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-0.5 font-mono-data text-[10px] font-bold uppercase text-mint">
                    {activeSpeaker.track} Stage
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white mt-1">
                    {activeSpeaker.name}
                  </h3>
                  <p className="font-mono-data text-xs text-neutral-400 mt-0.5">
                    {activeSpeaker.title}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-mint block">
                  SPEAKER BIOGRAPHY
                </span>
                <p className="font-body text-xs sm:text-sm leading-relaxed text-neutral-300">
                  {activeSpeaker.bio}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="h-9 w-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-mint transition-colors"
                  >
                    <Twitter size={15} />
                  </a>
                  <a
                    href="#"
                    className="h-9 w-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-mint transition-colors"
                  >
                    <Linkedin size={15} />
                  </a>
                </div>
                <button
                  onClick={() => setActiveSpeaker(null)}
                  className="rounded-full bg-mint px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-white transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
