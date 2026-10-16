'use client'

import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import Link from 'next/link'
import { Ticket, Sparkles, ArrowUpRight, Play } from 'lucide-react'
import { prefetchRegister } from '@/lib/prefetch'

export interface HeroPinnedContentProps {
  opacity: MotionValue<number>
  scale: MotionValue<number>
  visibility: MotionValue<string>
  subtitle?: string | null
  videoUrl?: string | null
}

export default function HeroPinnedContent({
  opacity,
  scale,
  visibility,
  subtitle,
  videoUrl,
}: HeroPinnedContentProps) {
  const displaySubtitle =
    subtitle && subtitle !== 'IGNITING ENTREPRENEURSHIP & INNOVATION'
      ? subtitle
      : "North India's largest student entrepreneurship summit at Punjab Engineering College. Join 3,000+ founders, investors, and builders for 2 days of keynotes, high-stakes pitches, and hackathons."

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      style={{ opacity, scale, visibility: visibility as any }}
      className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center sm:px-6"
    >
      {/* Floating Content without Box Container (Currency Note Fully Visible) */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-4 sm:gap-6 text-center px-4 select-none">
        {/* High-Contrast Bold Headline */}
        <h2
          className="max-w-2xl font-display font-black uppercase leading-[1.12] sm:leading-[1.16] tracking-tight sm:tracking-normal text-center select-none text-balance drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          style={{ fontSize: 'clamp(1.65rem, 4vw, 3rem)' }}
        >
          <span className="inline-block whitespace-normal sm:whitespace-nowrap mr-2 sm:mr-3">
            <span className="text-white keep-white">WHERE IDEAS MEET</span>
            <span className="text-[#74FB44] drop-shadow-[0_2px_12px_rgba(116,251,68,0.4)] ml-2.5 sm:ml-3">CAPITAL</span>
          </span>
          <br className="hidden sm:inline" />
          <span className="inline-block whitespace-normal sm:whitespace-nowrap">
            <span className="text-white keep-white">&amp; BUILD THE</span>
            <span className="text-[#74FB44] drop-shadow-[0_2px_12px_rgba(116,251,68,0.4)] ml-2.5 sm:ml-3">FUTURE</span>
          </span>
        </h2>

        {/* Subtitle with High-Contrast White Text & Deep Shadow */}
        <p className="max-w-xl font-body text-xs sm:text-sm font-medium leading-relaxed text-slate-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          {displaySubtitle}
        </p>

        {/* Clean Open Metrics Row (No Box) */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-1.5 px-4 select-none">
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-black text-base sm:text-xl text-[#74FB44] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-tight">₹10L+</span>
            <span className="font-mono-data text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Prize Pool</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-black text-base sm:text-xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-tight">3,000+</span>
            <span className="font-mono-data text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Attendees</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-black text-base sm:text-xl text-[#74FB44] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-tight">50+</span>
            <span className="font-mono-data text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Investors</span>
          </div>
        </div>

        {/* CTAs (Rounded-Full Capsule Buttons with Deep Shadows) */}
        <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/register"
            onMouseEnter={prefetchRegister}
            onTouchStart={prefetchRegister}
            onFocus={prefetchRegister}
            className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-8 font-mono-data text-xs font-black uppercase tracking-wider text-[#060D0B] bg-[#74FB44] shadow-[0_4px_24px_rgba(116,251,68,0.45)] transition-all hover:scale-105 active:scale-95 hover:brightness-110 cursor-pointer"
          >
            <Ticket size={16} strokeWidth={2.4} />
            <span>GET PASSES</span>
            <ArrowUpRight
              size={16}
              strokeWidth={2.4}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>

          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-8 font-mono-data text-xs font-bold uppercase tracking-wider text-white bg-black/50 hover:bg-black/70 border border-white/30 hover:border-[#74FB44] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              <Play size={15} strokeWidth={2} className="text-[#74FB44] fill-[#74FB44]/30" />
              <span>WATCH TEASER</span>
            </a>
          ) : (
            <Link
              href="/events"
              className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-8 font-mono-data text-xs font-bold uppercase tracking-wider text-white bg-black/50 hover:bg-black/70 border border-white/30 hover:border-[#74FB44] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              <Sparkles size={15} strokeWidth={2} className="text-[#74FB44]" />
              <span>EXPLORE TRACKS</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
