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
    <section className="relative w-full overflow-hidden bg-void" aria-label="PEC E-Summit Hero">
      <ScrollExpand
        src="/rupee-bg.jpg"
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
        autoExpandDelay={1500}
        backgroundContent={<VerticalGalleryBg />}
        title={
          <div className="flex flex-col items-center justify-center text-center p-4">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              E-SUMMIT <span className="text-mint italic">&apos;26</span>
            </h1>

            <p className="font-mono-data text-xs sm:text-sm text-[#A2B0A0] mt-3 tracking-widest uppercase max-w-md font-semibold drop-shadow-md">
              Chandigarh&apos;s Launchpad for Founders
            </p>
          </div>
        }
        scrollHint={
          <div className="flex flex-col items-center gap-1.5 text-mint transition-opacity duration-1000 animate-pulse">
            <span className="font-mono-data text-[10px] uppercase tracking-widest font-bold">
              Scroll or Wait to Expand
            </span>
            <ChevronDown size={18} />
          </div>
        }
      >
        {/* Expanded Overlay Content */}
        <div className="absolute inset-0 bg-void/40 [.light_&]:bg-white/80 pointer-events-none z-0" />
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center px-4 sm:px-6 py-8 z-20">
          {/* Top Pill Meta */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-3 rounded-full bg-panel/90 border border-border-subtle backdrop-blur-xl mb-6 shadow-lg">
            <div className="flex items-center gap-2 font-mono-data text-xs text-mint font-bold tracking-widest">
              <Calendar size={14} strokeWidth={1.5} />
              <span>{FEST_META.dates}</span>
            </div>
            <span className="text-secondary hidden sm:inline">•</span>
            <div className="flex items-center gap-2 font-mono-data text-xs text-secondary font-semibold tracking-widest">
              <MapPin size={14} strokeWidth={1.5} className="text-mint" />
              <span>{FEST_META.venue}</span>
            </div>
          </div>

          {/* Text Scrim Layer for Readability */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--bg-void)_0%,_transparent_75%)] pointer-events-none z-10 opacity-70" />

          {/* Main Expanded Headline */}
          <div className="flex flex-col items-center justify-center text-center w-full mb-8 max-w-none relative z-20">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-primary leading-[0.95] w-full">
              WHERE IDEAS RAISE <span className="text-mint">CAPITAL</span><br />
              &amp; COMPOUND INTO <span className="text-mint">IMPACT</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="font-body text-base sm:text-lg text-secondary max-w-2xl leading-relaxed mb-10 font-medium tracking-wide text-center relative z-20">
            North India&apos;s premier stage for student builders, startup founders, and venture thinkers. Join 3,000+ attendees for pitches, keynotes, hackathons, and VC networking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full relative z-20">
            <Link
              href="/passes"
              className="group relative inline-flex items-center justify-center gap-3 px-8 h-14 rounded-full font-mono-data text-sm font-bold uppercase tracking-[0.15em] bg-mint text-void overflow-hidden transition-transform hover:scale-105 shadow-md"
            >
              <Ticket size={18} strokeWidth={1.5} />
              <span>GET PASSES</span>
              <ArrowUpRight size={18} strokeWidth={1.5} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>

            <a
              href="#schedule"
              className="group relative inline-flex items-center justify-center gap-3 px-8 h-14 rounded-full font-mono-data text-sm font-bold uppercase tracking-[0.15em] bg-panel text-primary border border-border-subtle backdrop-blur-md overflow-hidden transition-all hover:border-mint hover:scale-105"
            >
              <Sparkles size={18} strokeWidth={1.5} className="text-mint group-hover:animate-pulse" />
              <span>EXPLORE TRACKS</span>
            </a>
          </div>
        </div>
      </ScrollExpand>

      {/* Stats Section (Appears naturally after scrolling past the hero) */}
      <div className="relative w-full bg-void z-20 pb-32 pt-16 flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-5xl flex flex-wrap items-center justify-center gap-8 sm:gap-16 font-mono-data text-xs text-secondary bg-panel border border-border-subtle rounded-3xl px-8 py-10 shadow-2xl">
          <div className="flex flex-col items-center justify-center gap-1 hover:text-mint transition-colors cursor-default">
            <span className="font-body font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl text-primary drop-shadow-md">₹15L+</span> 
            <span className="font-mono-data uppercase tracking-widest text-[10px]">Prize Pool</span>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border-subtle" />
          <div className="flex flex-col items-center justify-center gap-1 hover:text-mint transition-colors cursor-default">
            <span className="font-body font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl text-primary drop-shadow-md">40+</span> 
            <span className="font-mono-data uppercase tracking-widest text-[10px]">Speakers</span>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border-subtle" />
          <div className="flex flex-col items-center justify-center gap-1 hover:text-mint transition-colors cursor-default">
            <span className="font-body font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl text-primary drop-shadow-md">3,000+</span> 
            <span className="font-mono-data uppercase tracking-widest text-[10px]">Attendees</span>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border-subtle" />
          <div className="flex flex-col items-center justify-center gap-1 hover:text-mint transition-colors cursor-default">
            <span className="font-body font-bold tracking-tight text-3xl sm:text-4xl md:text-5xl text-primary drop-shadow-md">7th</span> 
            <span className="font-mono-data uppercase tracking-widest text-[10px]">Edition</span>
          </div>
        </div>
      </div>
    </section>
  )
}
