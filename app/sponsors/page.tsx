'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, CheckCircle2, ArrowLeft, Sparkles, Handshake, X } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import { SPONSORS } from '@/lib/data'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function SponsorsLandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitDeck = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success('Sponsorship brochure requested! Our partnerships team will email you.', {
      style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[var(--accent-mint)]/20 overflow-hidden">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-[var(--accent-mint)] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-mint)]/15 border border-[var(--accent-mint)]/30 mb-6">
              <Sparkles size={14} className="text-[var(--accent-mint)]" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-mint)] font-bold">
                E-Summit 2026 Ecosystem Partners
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              POWERED BY <br />
              <span className="text-stroke-green">INDUSTRY LEADERS</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
              PEC Summit is brought to life with the generous backing of venture capitals, tech conglomerates, incubators, and media partners dedicated to fostering student innovation.
            </p>

            <button
              onClick={() => { setModalOpen(true); setSubmitted(false) }}
              className="btn-green text-sm px-8 py-3.5 font-bold flex items-center gap-2"
            >
              <Handshake size={18} />
              Become a Sponsor / Partner
            </button>
          </div>
        </div>
      </section>

      {/* Tier Sections */}
      <section className="py-20 bg-[#111A12] space-y-16">
        <div className="section-container">
          {/* Title Sponsor */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-mint)] font-bold">Title Sponsor</span>
              <div className="flex-1 h-px bg-[var(--accent-mint)]/20" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {SPONSORS.title.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl p-8 bg-panel border border-[var(--accent-mint)]/30 flex items-center justify-between glow-green"
                >
                  <div>
                    <span className="font-mono-data text-[10px] uppercase text-[var(--accent-mint)] mb-1 block font-bold">Presenting Partner</span>
                    <h3 className="font-display text-4xl text-white">{s.name}</h3>
                    <p className="font-body text-xs text-muted mt-2">Premier Venture Capital Partner backing student founders.</p>
                  </div>
                  <a href={s.url} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-void text-muted hover:text-[var(--accent-mint)] border border-[var(--accent-mint)]/20">
                    <ExternalLink size={18} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-mint)] font-bold">Gold Partners</span>
              <div className="flex-1 h-px bg-[var(--accent-mint)]/20" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPONSORS.gold.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl p-6 bg-panel border border-[var(--accent-mint)]/20 flex items-center justify-between hover:border-[var(--accent-mint)] transition-colors group cursor-pointer"
                >
                  <h4 className="font-body font-semibold text-lg text-white group-hover:text-[var(--accent-mint)] filter grayscale group-hover:grayscale-0 transition-all">{s.name}</h4>
                  <ExternalLink size={16} className="text-muted group-hover:text-[var(--accent-mint)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-muted">Silver &amp; Tech Partners</span>
              <div className="flex-1 h-px bg-[var(--accent-mint)]/15" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SPONSORS.silver.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg p-4 bg-panel border border-[var(--accent-mint)]/15 text-center font-mono-data text-xs text-muted hover:text-[var(--accent-mint)] hover:border-[var(--accent-mint)] filter grayscale hover:grayscale-0 transition-colors"
                >
                  {s.name}
                </div>
              ))}
            </div>
          </div>

          {/* Media Partners */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-muted">Media &amp; Outreach Partners</span>
              <div className="flex-1 h-px bg-[var(--accent-mint)]/15" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SPONSORS.media.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg p-4 bg-panel border border-[var(--accent-mint)]/15 text-center font-mono-data text-xs text-muted hover:text-[var(--accent-mint)] hover:border-[var(--accent-mint)] filter grayscale hover:grayscale-0 transition-colors"
                >
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Proposal Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl p-8 bg-panel border border-[var(--accent-mint)]/40 shadow-2xl relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-white bg-void"
              >
                <X size={18} />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-mint)] font-bold">
                      Partner With PEC Summit
                    </span>
                    <h3 className="font-display text-3xl text-white mt-1">Request Sponsorship Deck</h3>
                    <p className="font-body text-sm text-muted mt-1">
                      Reach 3,000+ student founders, engineers, and investors at North India&apos;s premier summit.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitDeck} className="space-y-4">
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">Company / Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Ventures"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">Contact Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="partnerships@acme.com"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>
                    <button type="submit" className="w-full btn-green justify-center py-3.5 text-sm mt-4 font-bold">
                      Download Brochure &amp; Get In Touch
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-mint)]/20 border border-[var(--accent-mint)] text-[var(--accent-mint)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display text-3xl text-white mb-2">Brochure Requested!</h3>
                  <p className="font-body text-sm text-muted mb-6">
                    Thank you! Our partnerships team at E-Cell PEC will email you the full deck shortly.
                  </p>
                  <button onClick={() => setModalOpen(false)} className="btn-green px-8 py-3 font-bold">
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <Concierge />
    </main>
  )
}
