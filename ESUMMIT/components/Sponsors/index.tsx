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
  const strategic = BORDERLESS_SPONSORS.filter(s => ['Google Cloud', 'AWS', 'Sequoia'].includes(s.name))
  const ecosystem = BORDERLESS_SPONSORS.filter(s => !['Google Cloud', 'AWS', 'Sequoia'].includes(s.name))

  return (
    <section
      id="sponsors"
      className="relative bg-[#07150E] text-white py-24 sm:py-32 px-4 sm:px-6 md:px-12 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 border-t border-white/10"
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Headline */}
        <div className="text-center mb-20">
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

        {/* United Apple-Style Mesh Grid (Zero Gap) */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-[1px] bg-white/10 border border-white/10 rounded-3xl overflow-hidden max-w-5xl mx-auto shadow-2xl">
          
          {/* Strategic Partners (Top Row - Prominent) */}
          {strategic.map((sponsor, idx) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="col-span-2 sm:col-span-2 flex items-center justify-center p-10 sm:p-14 bg-[#091a12] hover:bg-[#0e271c] transition-colors duration-300 relative group"
            >
              {/* Subtle inner hover glow */}
              <div className="absolute inset-0 bg-mint/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className={`h-9 sm:h-11 w-auto max-w-[150px] object-contain transition-all duration-300 group-hover:scale-105 ${
                  sponsor.invert ? 'brightness-0 invert' : ''
                }`}
                loading="lazy"
              />
            </motion.a>
          ))}

          {/* Ecosystem Partners (Secondary Rows) */}
          {ecosystem.map((sponsor, idx) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="col-span-1 sm:col-span-2 last:col-span-2 sm:last:col-span-2 flex items-center justify-center p-8 sm:p-10 bg-[#07150e] hover:bg-[#0b2015] transition-colors duration-300 relative group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className={`h-6 sm:h-7 w-auto max-w-[110px] object-contain opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 ${
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
