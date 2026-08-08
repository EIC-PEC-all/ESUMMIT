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
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 relative px-5 sm:px-8 md:px-12 py-24 sm:py-32 bg-void"
      aria-labelledby="sponsors-heading"
    >
      {/* Circuit pattern overlay with lighter color for light bg */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #E2EBD3 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col items-center text-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            id="sponsors-heading"
            className="font-display font-black uppercase leading-none tracking-tight text-[var(--accent-mint)]"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
          >
            SPONSORS
          </h2>

          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 font-mono-data text-xs sm:text-sm uppercase tracking-widest text-[#0A1C14] hover:text-[#3B6911] transition-colors border-b-2 border-[#0A1C14] pb-1 font-bold"
          >
            View Full Partners Page &rarr;
          </Link>
        </motion.div>

        {/* ── Title & Gold Partners Grid ── */}
        <div className="mb-20">
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
                className="group relative rounded-3xl p-7 bg-white/40 backdrop-blur-sm border-2 border-[#0A1C14]/10 hover:border-[#0A1C14] hover:bg-white transition-all duration-300 flex flex-col justify-between h-40 overflow-hidden shadow-sm hover:shadow-[8px_8px_0px_#0A1C14] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[10px] uppercase tracking-widest text-[#0A1C14] font-bold">
                    {s.id.startsWith('ts') ? 'TITLE SPONSOR' : 'GOLD PARTNER'}
                  </span>
                  <ExternalLink size={16} className="text-[#0A1C14]/50 group-hover:text-[#0A1C14] transition-colors" />
                </div>

                <h3 className="font-display text-2xl font-bold text-[#0A1C14]">
                  {s.name}
                </h3>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Silver & Media Partners Fast Infinite Ticker Strip ── */}
      <div className="mb-20 relative z-10">
        <div className="relative overflow-hidden py-4 border-y-2 border-[#0A1C14]/10 bg-[#E2EBD3]">
          {/* Gradient Edge Masks (Matching background) */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#E2EBD3] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#E2EBD3] to-transparent z-10 pointer-events-none" />

          {/* High-Velocity Marquee */}
          <div className="flex whitespace-nowrap animate-marquee">
            {tickerItems.map((s, idx) => (
              <a
                key={`${s.id}-${idx}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 mx-3 rounded-full bg-transparent border-2 border-[#0A1C14] font-mono-data text-xs text-[#0A1C14] hover:bg-[#0A1C14] hover:text-[#E2EBD3] transition-all shrink-0 shadow-[4px_4px_0px_#0A1C14] hover:shadow-[0px_0px_0px_#0A1C14] hover:translate-y-1 hover:translate-x-1 font-bold uppercase tracking-wider"
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
          className="p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0A1C14] border-none shadow-[8px_8px_0px_rgba(10,28,20,0.2)]"
        >
          <div>
            <p className="font-display font-bold text-2xl mb-2 text-white flex items-center gap-3 tracking-wide">
              <Handshake size={24} className="text-mint" />
              Partner With PEC Summit 2026
            </p>
            <p className="font-body text-sm md:text-base text-white/70 max-w-lg">
              Reach 3,000+ student founders, software engineers, and venture capital investors at North India's flagship summit.
            </p>
          </div>
          <Link
            href="/sponsors"
            className="btn-green shrink-0 whitespace-nowrap text-sm px-8 py-4"
            id="sponsor-cta-btn"
          >
            Become a Sponsor
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
