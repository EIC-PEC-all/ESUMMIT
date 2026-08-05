'use client'

import React from 'react'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, Sparkles, ChevronDown, Zap, ArrowUpRight } from 'lucide-react'
import ScrollExpand from '@/components/Common/ScrollExpand'
import VerticalGalleryBg from './VerticalGalleryBg'
import Magnetic from '@/components/Common/Magnetic'
import { FEST_META } from '@/lib/data'

export default function NewHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#070B08]" aria-label="PEC E-Summit Hero">
      <ScrollExpand
        src="/hero-bg.jpg"
        mediaType="image"
        alt="PEC E-Summit 2026 Background"
        startWidth={44}
        startHeight={58}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        smoothing={0.08}
        overlayScrim={0.55}
        useWindowScroll={true}
        autoExpandDelay={1000}
        backgroundContent={<VerticalGalleryBg />}
        title={
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#50E3C2]/15 border border-[#50E3C2]/40 backdrop-blur-md mb-4">
              <Zap size={14} className="text-[#50E3C2] fill-[#50E3C2]" />
              <span className="font-mono-data text-[10px] sm:text-xs uppercase tracking-widest font-black text-[#50E3C2]">
                EIC PEC PRESENTS
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              E-SUMMIT <span className="text-[#50E3C2] italic">&apos;26</span>
            </h1>

            <p className="font-mono-data text-xs sm:text-sm text-gray-200 mt-2 tracking-wider uppercase max-w-md font-semibold drop-shadow-md">
              Chandigarh&apos;s Launchpad for Founders
            </p>
          </div>
        }
        scrollHint={
          <div className="flex flex-col items-center gap-1.5 animate-bounce text-[#50E3C2]">
            <span className="font-mono-data text-[10px] uppercase tracking-widest font-bold">
              Scroll or Wait to Expand
            </span>
            <ChevronDown size={18} />
          </div>
        }
      >
        {/* Expanded Overlay Content (fades in once expanded to full bleed over hero-bg.jpg) */}
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center px-4 sm:px-6 py-8 z-20">
          {/* Top Pill Meta */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2 rounded-full bg-[#070B08]/80 border border-[#50E3C2]/30 backdrop-blur-xl mb-6 shadow-[0_0_30px_rgba(80,227,194,0.2)]">
            <div className="flex items-center gap-1.5 font-mono-data text-xs text-[#50E3C2] font-bold">
              <Calendar size={14} />
              <span>{FEST_META.dates}</span>
            </div>
            <span className="text-white/30 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 font-mono-data text-xs text-gray-200 font-semibold">
              <MapPin size={14} className="text-[#50E3C2]" />
              <span>{FEST_META.venue}</span>
            </div>
          </div>

          {/* Main Expanded Headline */}
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            WHERE IDEAS RAISE <span className="text-[#50E3C2] italic">CAPITAL</span> <br />
            &amp; COMPOUND INTO <span className="text-[#50E3C2]">IMPACT</span>
          </h2>

          {/* Subtitle */}
          <p className="font-body text-sm sm:text-lg text-gray-200 max-w-2xl leading-relaxed mb-8 font-medium drop-shadow-md">
            North India&apos;s premier stage for student builders, startup founders, and venture thinkers.
            Join 3,000+ attendees for pitches, keynotes, hackathons, and VC networking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Magnetic strength={0.3}>
              <Link
                href="/passes"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono-data text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#50E3C2] text-[#070B08] hover:bg-[#68fcdb] transition-all shadow-[0_0_25px_rgba(80,227,194,0.5)] hover:scale-105"
              >
                <Ticket size={16} />
                <span>GET PASSES</span>
              </Link>
            </Magnetic>

            <Magnetic strength={0.3}>
              <a
                href="#esummit-tracks"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-mono-data text-xs sm:text-sm font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all hover:scale-105"
              >
                <Sparkles size={16} className="text-[#50E3C2]" />
                <span>EXPLORE TRACKS</span>
              </a>
            </Magnetic>
          </div>

          {/* Quick Highlight Pills */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono-data text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#50E3C2]" />
              <span className="font-bold text-white">₹15L+</span> Prize Pool
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3DD9FF]" />
              <span className="font-bold text-white">40+</span> Speakers
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8C42]" />
              <span className="font-bold text-white">3,000+</span> Attendees
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9B5CFF]" />
              <span className="font-bold text-white">7th</span> Edition
            </div>
          </div>
        </div>
      </ScrollExpand>
    </section>
  )
}
