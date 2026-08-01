'use client'
// components/Sponsors/index.tsx
// High-voltage Sponsors & Partners layout: Premium Gold Tier Cards + Fast Infinite Auto-Scrolling Silver/Media Ecosystem Ticker

import { motion } from 'framer-motion'
import { ExternalLink, Handshake, Zap, ShieldCheck } from 'lucide-react'
import { SPONSORS } from '@/lib/data'
import Link from 'next/link'

export default function Sponsors() {
  const titleAndGold = [...SPONSORS.title, ...SPONSORS.gold]
  const silverAndMedia = [...SPONSORS.silver, ...SPONSORS.media]
  const tickerItems = [...silverAndMedia, ...silverAndMedia, ...silverAndMedia, ...silverAndMedia]

  return (
    <section
      id="sponsors"
      className="py-24 relative overflow-hidden"
      style={{ background: 'var(--bg-panel)' }}
      aria-labelledby="sponsors-heading"
    >
      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      {/* Radial Background Glow */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-orange/5 rounded-full blur-[140px] pointer-events-none" />

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
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-orange fill-orange" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-orange font-bold">
                Ecosystem Partners
              </p>
            </div>
            <h2
              id="sponsors-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              POWERED BY <br />
              <span className="text-stroke-orange">INDUSTRY LEADERS</span>
            </h2>
          </div>

          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-orange hover:text-primary transition-colors border-b border-orange/40 pb-1"
          >
            View Full Partners Page &rarr;
          </Link>
        </motion.div>

        {/* ── Title & Gold Partners Grid ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono-data text-xs uppercase tracking-widest text-orange font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} /> Premier &amp; Gold Partners
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-dim/40 via-orange-dim/10 to-transparent" />
          </div>

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
                className="group relative rounded-2xl p-6 bg-void border border-orange-dim/30 hover:border-orange transition-all duration-300 flex flex-col justify-between h-36 overflow-hidden shadow-lg"
                whileHover={{ y: -4, boxShadow: '0 0 24px rgba(255,153,0,0.25)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[9px] uppercase tracking-widest text-orange bg-orange/10 px-2.5 py-0.5 rounded border border-orange/20 font-bold">
                    {s.id.startsWith('ts') ? 'Title Sponsor' : 'Gold Partner'}
                  </span>
                  <ExternalLink size={14} className="text-muted group-hover:text-orange transition-colors" />
                </div>

                <h3 className="font-display text-2xl text-primary group-hover:text-orange transition-colors">
                  {s.name}
                </h3>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Silver & Media Partners Fast Infinite Ticker Strip ── */}
      <div className="mb-16 relative">
        <div className="flex items-center gap-3 section-container mb-6">
          <span className="font-mono-data text-xs uppercase tracking-widest text-orange font-bold">
            ⚡ Fast Silver &amp; Media Ecosystem Ticker
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#D1D5DB]/30 to-transparent" />
        </div>

        <div className="relative overflow-hidden py-5 bg-void/80 border-t border-b border-orange-dim/30">
          {/* Gradient Edge Masks for High-End Polish */}
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
                className="inline-flex items-center justify-center px-7 py-2.5 mx-3 rounded-xl bg-panel border border-[#D1D5DB]/25 font-mono-data text-xs text-primary hover:text-orange hover:border-orange transition-all shrink-0 shadow-md font-medium"
              >
                <span>{s.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Prospective Sponsor CTA */}
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-void border border-orange-dim/40 shadow-xl"
        >
          <div>
            <p className="font-body font-bold text-lg mb-1 text-primary flex items-center gap-2">
              <Handshake size={20} className="text-orange" />
              Partner With PEC Summit 2025
            </p>
            <p className="font-body text-sm text-muted">
              Reach 3,000+ student founders, software engineers, and venture capital investors.
            </p>
          </div>
          <Link
            href="/sponsors"
            className="btn-orange shrink-0"
            id="sponsor-cta-btn"
          >
            Become a Sponsor
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
