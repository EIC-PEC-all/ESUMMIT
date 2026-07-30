'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Twitter, Linkedin, ArrowLeft, Sparkles, X, User, MessageSquare } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import { SPEAKERS } from '@/lib/data'
import Link from 'next/link'

export default function SpeakersLandingPage() {
  const [search, setSearch] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string>('All')
  const [activeSpeaker, setActiveSpeaker] = useState<typeof SPEAKERS[0] | null>(null)

  const filteredSpeakers = SPEAKERS.filter((spk) => {
    const matchesSearch =
      spk.name.toLowerCase().includes(search.toLowerCase()) ||
      spk.title.toLowerCase().includes(search.toLowerCase()) ||
      spk.bio.toLowerCase().includes(search.toLowerCase())
    const matchesTrack = selectedTrack === 'All' || spk.track === selectedTrack
    return matchesSearch && matchesTrack
  })

  return (
    <main className="min-h-screen bg-void text-primary">
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
                E-Summit 2025 Speaker Lineup
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              VOICES THAT <br />
              <span style={{ color: 'var(--accent-ignite)' }}>BUILD &amp; INVEST</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
              Hear from India&apos;s leading venture capitalists, unicorn co-founders, policy experts, and campus innovators sharing real, hard-hitting founder playbooks.
            </p>

            {/* Search & Track Filters */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-3.5 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search speaker by name, company, or domain..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-panel border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-ignite"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {['All', 'panels', 'pitch', 'hackathon', 'expo'].map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setSelectedTrack(tr)}
                    className="px-4 py-3 rounded-xl font-mono-data text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-200"
                    style={{
                      background: selectedTrack === tr ? 'var(--accent-ignite)' : 'rgba(138,144,166,0.08)',
                      color: selectedTrack === tr ? '#F5F3EE' : 'var(--text-muted)',
                      border: `1px solid ${selectedTrack === tr ? 'transparent' : 'rgba(138,144,166,0.12)'}`,
                    }}
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
      <section className="py-20 bg-panel/30">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSpeakers.map((spk) => (
              <motion.div
                key={spk.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveSpeaker(spk)}
                className="group relative rounded-2xl p-6 bg-panel border border-[#8A90A6]/12 hover:border-ignite/40 cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-2xl font-display font-bold relative overflow-hidden"
                    style={{ background: `${spk.color}20`, color: spk.color, border: `1px solid ${spk.color}40` }}
                  >
                    {spk.initials}
                  </div>

                  <span
                    className="font-mono-data text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-3"
                    style={{ background: 'rgba(138,144,166,0.1)', color: spk.color }}
                  >
                    {spk.track} Track
                  </span>

                  <h3 className="font-body font-bold text-xl text-primary group-hover:text-ignite transition-colors mb-1">
                    {spk.name}
                  </h3>
                  <p className="font-mono-data text-xs text-muted leading-snug mb-4">{spk.title}</p>
                </div>

                <div className="pt-4 border-t border-[#8A90A6]/10 flex items-center justify-between font-mono-data text-xs text-signal group-hover:underline">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl p-8 bg-panel border border-[#8A90A6]/20 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-primary bg-void/50"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold"
                  style={{ background: `${activeSpeaker.color}25`, color: activeSpeaker.color }}
                >
                  {activeSpeaker.initials}
                </div>
                <div>
                  <h3 className="font-body font-bold text-2xl text-primary">{activeSpeaker.name}</h3>
                  <p className="font-mono-data text-xs text-muted">{activeSpeaker.title}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-void border border-[#8A90A6]/10 mb-6">
                <h4 className="font-mono-data text-xs uppercase text-signal mb-2">Speaker Overview</h4>
                <p className="font-body text-sm text-muted leading-relaxed">{activeSpeaker.bio}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <a href="#" className="p-2 rounded-lg bg-void border border-[#8A90A6]/20 text-muted hover:text-signal">
                    <Twitter size={16} />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-void border border-[#8A90A6]/20 text-muted hover:text-signal">
                    <Linkedin size={16} />
                  </a>
                </div>
                <button
                  onClick={() => setActiveSpeaker(null)}
                  className="btn-ignite px-6 py-2.5 text-xs"
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
