'use client'
// components/Sponsors/index.tsx
// High-voltage Sponsors & Partners layout with Money/Fintech green theme styling

import { motion } from 'framer-motion'
import { ExternalLink, Handshake, Zap, ShieldCheck } from 'lucide-react'
import { SPONSORS } from '@/lib/data'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'

export default function Sponsors() {
  const titleAndGold = [...SPONSORS.title, ...SPONSORS.gold]
  const silverAndMedia = [...SPONSORS.silver, ...SPONSORS.media]
  const tickerItems = [...silverAndMedia, ...silverAndMedia, ...silverAndMedia, ...silverAndMedia]

  return (
    <section
      id="sponsors"
      className="py-24 relative overflow-hidden bg-void border-t border-b border-border-subtle"
      aria-labelledby="sponsors-heading"
    >
      {/* Circuit pattern overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      {/* Radial Background Glow */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-mint/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2
              id="sponsors-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              POWERED BY <br />
              <span className="text-stroke-green">INDUSTRY LEADERS</span>
            </h2>
          </div>

          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-mint hover:text-primary transition-colors border-b border-mint/40 pb-1"
          >
            View Full Partners Page &rarr;
          </Link>
        </motion.div>

        {/* ── Title & Gold Partners Grid ── */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {titleAndGold.map((s, idx) => (
              <motion.a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl p-6 bg-panel border border-border-subtle hover:border-mint transition-all duration-300 flex flex-col justify-between h-36 overflow-hidden shadow-lg"
                whileHover={{ y: -4, boxShadow: '0 0 24px var(--accent-green-glow)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[9px] uppercase tracking-widest text-mint bg-mint/10 px-2.5 py-0.5 rounded border border-mint/30 font-bold">
                    {s.id.startsWith('ts') ? 'Title Sponsor' : 'Gold Partner'}
                  </span>
                  <ExternalLink size={14} className="text-muted group-hover:text-mint transition-colors" />
                </div>

                <h3 className="font-display text-2xl text-primary group-hover:text-mint transition-all">
                  {s.name}
                </h3>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Silver & Media Partners Fast Infinite Ticker Strip ── */}
      <div className="mb-16 relative z-10">
        <div className="relative overflow-hidden py-5 bg-void/90 border-t border-b border-border-subtle">
          {/* Gradient Edge Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          {/* High-Velocity Marquee */}
          <div className="flex whitespace-nowrap animate-marquee">
            {tickerItems.map((s, idx) => (
              <a
                key={`${s.id}-${idx}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-2.5 mx-3 rounded-xl bg-panel border border-border-subtle font-mono-data text-xs text-secondary hover:text-mint hover:border-mint transition-all shrink-0 shadow-md font-medium"
              >
                <span>{s.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Prospective Sponsor CTA */}
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-panel border border-border-subtle shadow-xl"
        >
          <div>
            <p className="font-body font-bold text-lg mb-1 text-primary flex items-center gap-2">
              <Handshake size={20} className="text-mint" />
              Partner With PEC Summit 2026
            </p>
            <p className="font-body text-sm text-muted">
              Reach 3,000+ student founders, software engineers, and venture capital investors.
            </p>
          </div>
          <Link
            href="/sponsors"
            className="btn-green shrink-0"
            id="sponsor-cta-btn"
          >
            Become a Sponsor
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
