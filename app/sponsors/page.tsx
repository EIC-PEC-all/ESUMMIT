'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Mail, CheckCircle2, ArrowLeft, Sparkles, Building2, Handshake, X } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
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
      style: { background: 'var(--bg-panel)', color: 'var(--text-primary)' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[#8A90A6]/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#3DD9FF_1px,transparent_1px)] [background-size:28px_28px]" />

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 mb-6">
              <Sparkles size={14} className="text-signal" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-signal">
                E-Summit 2025 Ecosystem Partners
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              POWERED BY <br />
              <span style={{ color: 'var(--accent-ignite)' }}>INDUSTRY LEADERS</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
              PEC Summit is brought to life with the generous backing of venture capitals, tech conglomerates, incubators, and media partners dedicated to fostering student innovation.
            </p>

            <button
              onClick={() => { setModalOpen(true); setSubmitted(false) }}
              className="btn-ignite text-sm px-8 py-3.5"
            >
              <Handshake size={18} />
              Become a Sponsor / Partner
            </button>
          </div>
        </div>
      </section>

      {/* Tier Sections */}
      <section className="py-20 bg-panel/30 space-y-16">
        <div className="section-container">
          {/* Title Sponsor */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-ignite">Title Sponsor</span>
              <div className="flex-1 h-px bg-[#8A90A6]/10" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {SPONSORS.title.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl p-8 bg-panel border border-ignite/30 flex items-center justify-between glow-ignite"
                >
                  <div>
                    <span className="font-mono-data text-[10px] uppercase text-ignite mb-1 block">Presenting Partner</span>
                    <h3 className="font-display text-4xl text-primary">{s.name}</h3>
                    <p className="font-body text-xs text-muted mt-2">Premier Venture Capital Partner backing student founders.</p>
                  </div>
                  <a href={s.url} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-void text-muted hover:text-signal border border-[#8A90A6]/20">
                    <ExternalLink size={18} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-signal">Gold Partners</span>
              <div className="flex-1 h-px bg-[#8A90A6]/10" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPONSORS.gold.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl p-6 bg-panel border border-[#8A90A6]/12 flex items-center justify-between hover:border-signal/40 transition-colors"
                >
                  <h4 className="font-body font-semibold text-lg text-primary">{s.name}</h4>
                  <ExternalLink size={16} className="text-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono-data text-xs uppercase tracking-widest text-muted">Silver &amp; Tech Partners</span>
              <div className="flex-1 h-px bg-[#8A90A6]/10" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SPONSORS.silver.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg p-4 bg-panel border border-[#8A90A6]/10 text-center font-mono-data text-xs text-muted hover:text-primary transition-colors"
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
              <div className="flex-1 h-px bg-[#8A90A6]/10" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SPONSORS.media.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg p-4 bg-panel border border-[#8A90A6]/10 text-center font-mono-data text-xs text-muted hover:text-primary transition-colors"
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
              className="w-full max-w-lg rounded-2xl p-8 bg-panel border border-[#8A90A6]/20 shadow-2xl relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-primary bg-void/50"
              >
                <X size={18} />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs uppercase tracking-widest text-signal">
                      Partner With PEC Summit
                    </span>
                    <h3 className="font-display text-3xl text-primary mt-1">Request Sponsorship Deck</h3>
                    <p className="font-body text-sm text-muted mt-1">
                      Reach 3,000+ student founders, engineers, and investors at North India&apos;s premier summit.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitDeck} className="space-y-4">
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1">Company / Brand *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Ventures"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1">Contact Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="partnerships@acme.com"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
                      />
                    </div>
                    <button type="submit" className="w-full btn-ignite justify-center py-3.5 text-sm mt-4">
                      Download Brochure &amp; Get In Touch
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-signal/20 border border-signal text-signal flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display text-3xl text-primary mb-2">Brochure Requested!</h3>
                  <p className="font-body text-sm text-muted mb-6">
                    Thank you! Our partnerships team at E-Cell PEC will email you the full deck shortly.
                  </p>
                  <button onClick={() => setModalOpen(false)} className="btn-ignite px-8 py-3">
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
