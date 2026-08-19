'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Twitter, Linkedin, ArrowLeft, X, MessageSquare } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import { SPEAKERS as DEFAULT_SPEAKERS } from '@/lib/data'
import { api } from '@/lib/api'
import type { BackendSpeaker } from '@/lib/api-types'
import Link from 'next/link'

export default function SpeakersLandingPage() {
  const [speakers, setSpeakers] = useState<BackendSpeaker[]>(DEFAULT_SPEAKERS as unknown as BackendSpeaker[])
  const [search, setSearch] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string>('All')
  const [activeSpeaker, setActiveSpeaker] = useState<BackendSpeaker | null>(null)

  useEffect(() => {
    let mounted = true
    api.getSpeakers()
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setSpeakers(data)
        }
      })
      .catch(() => {
        // Fallback to default
      })
    return () => {
      mounted = false
    }
  }, [])

  const filteredSpeakers = speakers.filter((spk) => {
    const matchesSearch =
      spk.name.toLowerCase().includes(search.toLowerCase()) ||
      spk.title.toLowerCase().includes(search.toLowerCase()) ||
      (spk.bio && spk.bio.toLowerCase().includes(search.toLowerCase()))
    const matchesTrack = selectedTrack === 'All' || spk.track === selectedTrack
    return matchesSearch && matchesTrack
  })

  return (
    <main className="min-h-screen bg-void text-white">
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
            <h1 className="mb-6 font-display text-3xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
              VOICES THAT <br />
              <span className="text-mint">BUILD &amp; INVEST</span>
            </h1>

            <p className="mb-8 max-w-xl font-body text-lg leading-relaxed text-secondary">
              Hear from India&apos;s leading venture capitalists, unicorn co-founders, policy
              experts, and campus innovators sharing real, hard-hitting founder playbooks.
            </p>

            {/* Search & Track Filters */}
            <div className="flex max-w-2xl flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-3.5 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search speaker by name, company, or domain..."
                  className="w-full rounded-xl border border-border-subtle bg-panel py-3 pl-11 pr-4 font-body text-sm text-white outline-none focus:border-mint"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['All', 'panels', 'pitch', 'hackathon', 'expo'].map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setSelectedTrack(tr)}
                    className={`whitespace-nowrap rounded-xl px-4 py-3 font-mono-data text-xs uppercase tracking-wider transition-all duration-200 ${
                      selectedTrack === tr
                        ? 'bg-mint font-bold text-void shadow-[0_0_15px_rgba(126,211,33,0.4)]'
                        : 'hover:border-mint/40 border border-border-subtle bg-panel text-secondary hover:text-white'
                    }`}
                  >
                    {tr === 'All' ? 'All Sessions' : tr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="bg-void py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSpeakers.map((spk) => (
              <motion.div
                key={spk.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveSpeaker(spk)}
                className="border-[var(--accent-mint)]/20 group relative flex cursor-pointer flex-col justify-between rounded-2xl border bg-panel p-6 shadow-lg transition-all duration-300 hover:border-[var(--accent-mint)]"
                whileHover={{ y: -6, boxShadow: '0 0 25px rgba(126,211,33,0.3)' }}
              >
                <div>
                  <div 
                    className="border-[var(--accent-mint)]/30 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border bg-void font-display text-2xl font-bold transition-all group-hover:scale-105 group-hover:border-[var(--accent-mint)]"
                    style={{ color: spk.color || 'var(--accent-mint)' }}
                  >
                    {spk.initials || spk.name.slice(0, 2).toUpperCase()}
                  </div>

                  <span className="border-[var(--accent-mint)]/30 mb-3 inline-block rounded-full border bg-void px-2.5 py-1 font-mono-data text-[9px] font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                    ⚡ {spk.track || 'Keynote'} Track
                  </span>

                  <h3 className="mb-1 font-body text-xl font-bold text-white transition-colors group-hover:text-[var(--accent-mint)]">
                    {spk.name}
                  </h3>
                  <p className="mb-4 font-mono-data text-xs leading-snug text-muted">{spk.title}</p>
                </div>

                <div className="border-[var(--accent-mint)]/15 flex items-center justify-between border-t pt-4 font-mono-data text-xs text-[var(--accent-mint)] group-hover:underline">
                  <span>View Speaker Bio</span>
                  <MessageSquare size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaker Detail Modal */}
      <AnimatePresence>
        {activeSpeaker && (
          <div className="bg-void/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border-[var(--accent-mint)]/40 relative w-full max-w-lg rounded-2xl border bg-panel p-8 shadow-2xl"
            >
              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute right-6 top-6 rounded-lg bg-void p-2 text-muted hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-mint)] bg-void font-display text-2xl font-bold text-[var(--accent-mint)]">
                  {activeSpeaker.initials || activeSpeaker.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-body text-2xl font-bold text-white">{activeSpeaker.name}</h3>
                  <p className="font-mono-data text-xs text-muted">{activeSpeaker.title}</p>
                </div>
              </div>

              <div className="border-[var(--accent-mint)]/20 mb-6 rounded-xl border bg-void p-4">
                <h4 className="mb-2 font-mono-data text-xs font-bold uppercase text-[var(--accent-mint)]">
                  ⚡ Speaker Overview
                </h4>
                <p className="font-body text-sm leading-relaxed text-muted">{activeSpeaker.bio}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="border-[var(--accent-mint)]/30 rounded-lg border bg-void p-2 text-muted hover:text-[var(--accent-mint)]"
                  >
                    <Twitter size={16} />
                  </a>
                  <a
                    href="#"
                    className="border-[var(--accent-mint)]/30 rounded-lg border bg-void p-2 text-muted hover:text-[var(--accent-mint)]"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
                <button
                  onClick={() => setActiveSpeaker(null)}
                  className="btn-green px-6 py-2.5 text-xs font-bold"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <Concierge />
    </main>
  )
}
