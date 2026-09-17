'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface SponsorDisplayItem {
  name: string
  logoUrl: string
  url: string
  invert?: boolean
  tier?: string
}

// ── Authentic Brochure Partners & Previous Sponsors ─────────────────────────
const BORDERLESS_SPONSORS: SponsorDisplayItem[] = [
  { name: 'Finvasia', logoUrl: 'https://cdn.simpleicons.org/f-secure/white', url: '#' },
  { name: 'SBI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-Logo.svg', url: '#' },
  { name: 'Fireside Ventures', logoUrl: 'https://cdn.simpleicons.org/firefoxbrowser/white', url: '#' },
  { name: 'Amar Ujala', logoUrl: 'https://cdn.simpleicons.org/newsblur/white', url: '#' },
  { name: 'CII', logoUrl: 'https://cdn.simpleicons.org/civic/white', url: '#' },
  { name: 'uTrade', logoUrl: 'https://cdn.simpleicons.org/trademarked/white', url: '#' },
  { name: 'Monster Energy', logoUrl: 'https://cdn.simpleicons.org/monster/white', url: '#' },
  { name: 'Vivo', logoUrl: 'https://cdn.simpleicons.org/vivo/white', url: '#' },
  { name: 'Chiratae Ventures', logoUrl: 'https://cdn.simpleicons.org/chartdotjs/white', url: '#' },
  { name: 'Shree Ganesh', logoUrl: 'https://cdn.simpleicons.org/googlehangouts/white', url: '#' },
  { name: 'Shoutlo', logoUrl: 'https://cdn.simpleicons.org/speakerdeck/white', url: '#' },
  { name: 'Young Indians (Yi)', logoUrl: 'https://cdn.simpleicons.org/youtubekids/white', url: '#' },
  { name: 'Dainik Bhaskar', logoUrl: 'https://cdn.simpleicons.org/dailymotion/white', url: '#' },
  { name: 'CityWoofer', logoUrl: 'https://cdn.simpleicons.org/woocommerce/white', url: '#' },
  { name: 'Venture Wolf', logoUrl: 'https://cdn.simpleicons.org/wolfram/white', url: '#' },
  { name: "Victoria's Cafe", logoUrl: 'https://cdn.simpleicons.org/vlcmediaplayer/white', url: '#' },
  { name: 'JAL', logoUrl: 'https://cdn.simpleicons.org/japanairlines/white', url: '#' },
  { name: 'CITCO', logoUrl: 'https://cdn.simpleicons.org/cisco/white', url: '#' },
  { name: 'Smaaash', logoUrl: 'https://cdn.simpleicons.org/smashdotgg/white', url: '#' },
  { name: 'Decathlon Play', logoUrl: 'https://cdn.simpleicons.org/decathlon/white', url: '#' },
  { name: 'Shoonya', logoUrl: 'https://cdn.simpleicons.org/shazam/white', url: '#' },
  { name: 'Rebel Foods', logoUrl: 'https://cdn.simpleicons.org/foodpanda/white', url: '#' },
]

import { useSponsors } from '@/hooks/useSummitData'
import type { CmsSponsor } from '@/lib/api-types'

export default function Sponsors() {
  const { sponsors: cmsSponsors } = useSponsors()

  // Use CMS sponsors if available with logo URLs, otherwise fallback to curated static list
  const sponsorList: SponsorDisplayItem[] = React.useMemo(() => {
    if (Array.isArray(cmsSponsors) && cmsSponsors.length > 0) {
      const validCms = cmsSponsors.filter((s: CmsSponsor) => s.logoUrl)
      if (validCms.length > 0) {
        return validCms.map((s: CmsSponsor) => ({
          name: s.name,
          logoUrl: s.logoUrl!,
          url: s.websiteUrl || '#',
          invert: false,
          tier: s.tier,
        }))
      }
    }
    return BORDERLESS_SPONSORS
  }, [cmsSponsors])

  const strategic = sponsorList.filter(s => ['Google Cloud', 'AWS', 'Sequoia'].includes(s.name) || ('tier' in s && s.tier === 'title'))
  const ecosystem = sponsorList.filter(s => !strategic.includes(s))

  return (
    <section
      id="sponsors"
      className="relative bg-section-1 text-white py-24 sm:py-32 px-4 sm:px-6 md:px-12 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 border-t border-white/10"
      aria-labelledby="sponsors-heading"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Headline */}
        <div className="text-center mb-20">
          <h2
            id="sponsors-heading"
            className="font-display font-black uppercase tracking-tight text-center leading-none select-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            <span className="text-gradient-mint">SPONSORS</span>
          </h2>
          <p className="font-mono-data text-xs sm:text-sm text-gray-400 uppercase tracking-[0.25em] mt-4">
            POWERED BY GLOBAL TECH &amp; VENTURE INSTITUTIONS
          </p>
        </div>

        {/* United Apple-Style Mesh Grid (Zero Gap) */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-[1px] bg-white/10 border border-white/10 rounded-3xl overflow-hidden max-w-5xl mx-auto shadow-2xl">
          
          {/* Strategic Partners (Top Row - Prominent) */}
          {strategic.map((sponsor, idx) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="col-span-1 sm:col-span-2 flex items-center justify-center p-10 sm:p-14 bg-[#091a12] hover:bg-[#0e271c] transition-colors duration-300 relative group"
            >
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={150}
                height={44}
                sizes="(max-width: 640px) 120px, 150px"
                style={{ width: 'auto', height: 'auto' }}
                unoptimized={true}
                className={`h-9 sm:h-11 w-auto max-w-[150px] object-contain transition-all duration-300 group-hover:scale-105 ${
                  sponsor.invert ? 'brightness-0 invert' : ''
                }`}
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
              className="col-span-1 sm:col-span-2 last:col-span-2 sm:last:col-span-2 flex items-center justify-center p-8 sm:p-10 bg-section-1 hover:bg-[#0b2015] transition-colors duration-300 relative group"
            >
              <Image
                src={sponsor.logoUrl}
                alt={sponsor.name}
                width={110}
                height={28}
                sizes="(max-width: 640px) 90px, 110px"
                style={{ width: 'auto', height: 'auto' }}
                unoptimized={true}
                className={`h-6 sm:h-7 w-auto max-w-[110px] object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 ${
                  sponsor.invert ? 'brightness-0 invert' : ''
                }`}
              />
            </motion.a>
          ))}

        </div>

        {/* ── Minimalist Partner CTA Link ──────────────────────────────────── */}
        <div className="mt-20 sm:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-mono-data text-xs text-gray-400">
            Interested in partnering with E-Summit 2026?
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
