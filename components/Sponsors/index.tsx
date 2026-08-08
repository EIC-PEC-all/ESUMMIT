'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// ── Real High-Contrast Borderless Brand Logos ─────────────────────────────────
const BORDERLESS_SPONSORS = [
  {
    name: 'Dribbble',
    logoUrl: 'https://cdn.simpleicons.org/dribbble/white',
    url: '#',
  },
  {
    name: 'Zapier',
    logoUrl: 'https://cdn.simpleicons.org/zapier/white',
    url: '#',
  },
  {
    name: 'Perplexity',
    logoUrl: 'https://cdn.simpleicons.org/perplexity/white',
    url: '#',
  },
  {
    name: 'Cal.com',
    logoUrl: 'https://cdn.simpleicons.org/caldotcom/white',
    url: '#',
  },
  {
    name: 'Mixpanel',
    logoUrl: 'https://cdn.simpleicons.org/mixpanel/white',
    url: '#',
  },
  {
    name: 'Miro',
    logoUrl: 'https://cdn.simpleicons.org/miro/white',
    url: '#',
  },
  {
    name: 'DoorDash',
    logoUrl: 'https://cdn.simpleicons.org/doordash/white',
    url: '#',
  },
  {
    name: 'Sequoia',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sequoia_Capital_logo.svg',
    invert: true,
    url: '#',
  },
  {
    name: 'Google Cloud',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
    url: '#',
  },
  {
    name: 'AWS',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    url: '#',
  },
  {
    name: 'GitHub',
    logoUrl: 'https://cdn.simpleicons.org/github/white',
    url: '#',
  },
  {
    name: 'Solana',
    logoUrl: 'https://cdn.simpleicons.org/solana/white',
    url: '#',
  },
]

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative bg-[#07150E] text-white py-24 sm:py-32 px-4 sm:px-6 md:px-12 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 border-t border-white/10"
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Two-Tone Headline Matching Reference Image ────────────────────── */}
        <div className="text-center mb-20 sm:mb-24">
          <h2
            id="sponsors-heading"
            className="font-display font-black uppercase tracking-tight text-center leading-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
          >
            <span className="text-mint">FUNDING </span>
            <span className="text-white">PARTNERS</span>
          </h2>
          <p className="font-mono-data text-xs sm:text-sm text-gray-400 uppercase tracking-[0.25em] mt-4">
            POWERED BY GLOBAL TECH &amp; VENTURE INSTITUTIONS
          </p>
        </div>

        {/* ── Ultra-Clean Borderless Logo Grid (Exact Reference Image Style) ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-14 sm:gap-y-16 gap-x-10 sm:gap-x-16 md:gap-x-24 items-center justify-items-center max-w-5xl mx-auto my-6">
          {BORDERLESS_SPONSORS.map((sponsor, idx) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group flex items-center justify-center p-2 transition-all duration-300 opacity-75 hover:opacity-100 hover:scale-105 select-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className={`h-7 sm:h-9 md:h-10 w-auto max-w-[140px] sm:max-w-[160px] object-contain ${
                  sponsor.invert ? 'brightness-0 invert' : ''
                }`}
                loading="lazy"
              />
            </motion.a>
          ))}
        </div>

        {/* ── Minimalist Partner CTA Link ──────────────────────────────────── */}
        <div className="mt-20 sm:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-mono-data text-xs text-gray-400">
            Interested in partnering with PEC Summit 2026?
          </p>

          <Link
            href="/sponsors"
            className="inline-flex items-center gap-1.5 font-mono-data text-xs font-bold uppercase tracking-widest text-mint hover:text-white transition-colors"
          >
            Become a Partner <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
