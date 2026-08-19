'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Plus, ExternalLink } from 'lucide-react'

interface SponsorItem {
  id: string
  name: string
  tier: string
  logoUrl?: string | null
  websiteUrl?: string | null
}

const TOTAL_SLOTS = 12

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([])

  useEffect(() => {
    let mounted = true
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

    fetch(`${apiUrl}/sponsors`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setSponsors(data)
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  // Create 12 slots mapping
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, index) => {
    return sponsors[index] || null
  })

  return (
    <section
      id="sponsors"
      className="relative bg-[#07150E] text-white py-24 sm:py-32 px-4 sm:px-6 md:px-12 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 border-t border-white/10"
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Headline */}
        <div className="text-center mb-16 sm:mb-20">
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

        {/* United Mesh Grid (12 Partner Slots) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[1px] bg-white/10 border border-white/10 rounded-3xl overflow-hidden max-w-5xl mx-auto shadow-2xl">
          {slots.map((sponsor, idx) => {
            const slotNum = idx + 1
            if (sponsor) {
              return (
                <motion.div
                  key={sponsor.id || `sponsor-${idx}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  className="flex flex-col items-center justify-center p-8 sm:p-10 bg-[#091a12] hover:bg-[#0e271c] transition-colors duration-300 relative group aspect-[4/3]"
                >
                  {sponsor.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-10 w-auto max-w-[140px] object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-1">
                      <span className="font-display text-lg font-black uppercase text-white group-hover:text-mint transition-colors">
                        {sponsor.name}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-mint/70">
                        {sponsor.tier} Partner
                      </span>
                    </div>
                  )}

                  {sponsor.websiteUrl && (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-3 right-3 text-white/30 hover:text-mint transition-colors"
                      title={sponsor.name}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              )
            }

            return (
              <motion.div
                key={`empty-slot-${slotNum}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="flex flex-col items-center justify-center p-6 text-center space-y-2.5 bg-[#07150E] hover:bg-[#0B1D13] transition-colors group aspect-[4/3]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 border border-mint/20 text-mint group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white group-hover:text-mint transition-colors block">
                    + Insert Logo
                  </span>
                  <span className="font-mono text-[10px] text-gray-500 block">
                    Slot #{slotNum} &middot; Via Admin CMS
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Minimalist Partner CTA Link ──────────────────────────────────── */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
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
