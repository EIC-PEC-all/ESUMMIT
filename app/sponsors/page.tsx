'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, CheckCircle2, ArrowLeft, Handshake, X } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import { SPONSORS as DEFAULT_SPONSORS } from '@/lib/data'
import { api } from '@/lib/api'
import type { BackendSponsor } from '@/lib/api-types'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { TOAST_STYLE } from '@/lib/constants'

export default function SponsorsLandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sponsorsList, setSponsorsList] = useState<BackendSponsor[]>([])

  useEffect(() => {
    let mounted = true
    api.getSponsors()
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setSponsorsList(data)
        }
      })
      .catch(() => {
        // Fallback
      })
    return () => {
      mounted = false
    }
  }, [])

  const titleSponsors = sponsorsList.filter((s) => s.tier === 'title')
  const goldSponsors = sponsorsList.filter((s) => s.tier === 'gold')
  const silverSponsors = sponsorsList.filter((s) => s.tier === 'silver')
  const mediaSponsors = sponsorsList.filter((s) => s.tier === 'media')

  const activeTitle = titleSponsors.length > 0 ? titleSponsors : DEFAULT_SPONSORS.title
  const activeGold = goldSponsors.length > 0 ? goldSponsors : DEFAULT_SPONSORS.gold
  const activeSilver = silverSponsors.length > 0 ? silverSponsors : DEFAULT_SPONSORS.silver
  const activeMedia = mediaSponsors.length > 0 ? mediaSponsors : DEFAULT_SPONSORS.media

  const handleSubmitDeck = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success('Sponsorship brochure requested! Our partnerships team will email you.', TOAST_STYLE)
  }

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
              <span className="text-gradient-white">POWERED BY</span> <br />
              <span className="text-gradient-mint">INDUSTRY LEADERS</span>
            </h1>

            <p className="mb-8 max-w-xl font-body text-lg leading-relaxed text-secondary">
              E-Summit is brought to life with the generous backing of venture capitals, tech
              conglomerates, incubators, and media partners dedicated to fostering student
              innovation.
            </p>

            <button
              onClick={() => {
                setModalOpen(true)
                setSubmitted(false)
              }}
              className="btn-mint-gradient flex items-center gap-2 px-8 py-3.5 text-sm font-bold cursor-pointer"
            >
              <Handshake size={18} />
              Become a Sponsor / Partner
            </button>
          </div>
        </div>
      </section>

      {/* Tier Sections */}
      <section className="space-y-16 bg-void py-20">
        <div className="section-container">
          {/* Title Sponsor */}
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                Title Sponsor
              </span>
              <div className="bg-[var(--accent-mint)]/20 h-px flex-1" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {activeTitle.map((s) => (
                <div
                  key={s.id}
                  className="border-[var(--accent-mint)]/30 flex items-center justify-between rounded-2xl border bg-panel p-8 shadow-md hover:border-[var(--accent-mint)]/60 transition-colors"
                >
                  <div>
                    <span className="mb-1 block font-mono-data text-[10px] font-bold uppercase text-[var(--accent-mint)]">
                      Presenting Partner
                    </span>
                    <h3 className="font-display text-4xl text-white">{s.name}</h3>
                    <p className="mt-2 font-body text-xs text-muted">
                      Premier Technology & Venture Partner backing student founders.
                    </p>
                  </div>
                  {('websiteUrl' in s ? s.websiteUrl : s.url) ? (
                    <a
                      href={'websiteUrl' in s && s.websiteUrl ? s.websiteUrl : ('url' in s ? s.url : '#')}
                      target="_blank"
                      rel="noreferrer"
                      className="border-[var(--accent-mint)]/20 rounded-xl border bg-void p-3 text-muted hover:text-[var(--accent-mint)]"
                    >
                      <ExternalLink size={18} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                Gold Partners
              </span>
              <div className="bg-[var(--accent-mint)]/20 h-px flex-1" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeGold.map((s) => (
                <div
                  key={s.id}
                  className="border-[var(--accent-mint)]/20 group flex cursor-pointer items-center justify-between rounded-xl border bg-panel p-6 transition-colors hover:border-[var(--accent-mint)]"
                >
                  <h4 className="font-body text-lg font-semibold text-white transition-all group-hover:text-[var(--accent-mint)]">
                    {s.name}
                  </h4>
                  <ExternalLink
                    size={16}
                    className="text-muted group-hover:text-[var(--accent-mint)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono-data text-xs uppercase tracking-widest text-muted">
                Silver &amp; Tech Partners
              </span>
              <div className="bg-[var(--accent-mint)]/15 h-px flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {activeSilver.map((s) => (
                <div
                  key={s.id}
                  className="border-[var(--accent-mint)]/15 rounded-lg border bg-panel p-4 text-center font-mono-data text-xs text-muted transition-colors hover:border-[var(--accent-mint)] hover:text-[var(--accent-mint)]"
                >
                  {s.name}
                </div>
              ))}
            </div>
          </div>

          {/* Media Partners */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono-data text-xs uppercase tracking-widest text-muted">
                Media &amp; Outreach Partners
              </span>
              <div className="bg-[var(--accent-mint)]/15 h-px flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {activeMedia.map((s) => (
                <div
                  key={s.id}
                  className="border-[var(--accent-mint)]/15 rounded-lg border bg-panel p-4 text-center font-mono-data text-xs text-muted transition-colors hover:border-[var(--accent-mint)] hover:text-[var(--accent-mint)]"
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
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl" role="dialog" aria-modal="true" aria-labelledby="sponsor-modal-title">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-mint/30 bg-gradient-to-b from-[#0C1A14] via-[#07120E] to-[#040A08] p-8 shadow-[0_0_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close sponsorship request form"
                className="absolute right-6 top-6 rounded-lg bg-void p-2 text-muted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {!submitted ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                      Partner With E-Summit
                    </span>
                    <h3 id="sponsor-modal-title" className="mt-1 font-display text-3xl text-white">
                      Request Sponsorship Deck
                    </h3>
                    <p className="mt-1 font-body text-sm text-muted">
                      Reach 3,000+ student founders, engineers, and investors at North India&apos;s
                      premier summit.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitDeck} className="space-y-4">
                    <div>
                      <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                        Company / Brand *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Ventures"
                        className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-void px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="partnerships@acme.com"
                        className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-void px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-green mt-4 w-full justify-center py-3.5 text-sm font-bold"
                    >
                      Download Brochure &amp; Get In Touch
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="bg-[var(--accent-mint)]/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-mint)] text-[var(--accent-mint)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="mb-2 font-display text-3xl text-white">Brochure Requested!</h3>
                  <p className="mb-6 font-body text-sm text-muted">
                    Thank you! Our partnerships team at E-Cell PEC will email you the full deck
                    shortly.
                  </p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="btn-green px-8 py-3 font-bold"
                  >
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
