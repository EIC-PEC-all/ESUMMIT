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
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:gap-6 text-center">
        <h2
          className="mb-2 max-w-4xl font-display font-black uppercase leading-[1.12] sm:leading-[1.18] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] text-center text-balance select-none"
          style={{ fontSize: 'clamp(1.35rem, 3.4vw, 2.85rem)' }}
        >
          <span className="inline-block whitespace-normal sm:whitespace-nowrap">
            <span className="text-gradient-white">WHERE IDEAS MEET </span>
            <span className="text-gradient-mint">CAPITAL</span>
          </span>
          <span className="inline-block ml-1.5 sm:ml-3 whitespace-normal sm:whitespace-nowrap">
            <span className="text-gradient-white">&amp; BUILD THE </span>
            <span className="text-gradient-mint">FUTURE</span>
          </span>
        </h2>

        <p className="mb-3 max-w-xl font-body text-xs font-normal leading-relaxed text-gray-300 drop-shadow-md sm:text-sm md:text-base">
          {displaySubtitle}
        </p>

        <div className="mb-1 flex w-full flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            onMouseEnter={prefetchRegister}
            onTouchStart={prefetchRegister}
            onFocus={prefetchRegister}
            className="btn-mint-gradient group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 font-mono-data text-xs font-bold uppercase tracking-wider text-void transition-transform hover:scale-105"
          >
            <Ticket size={15} strokeWidth={1.5} />
            <span>GET PASSES</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.5}
              className="opacity-70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </Link>

          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-dark-gradient group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 font-mono-data text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md transition-all hover:scale-105 hover:border-mint"
            >
              <Play size={14} strokeWidth={1.5} className="text-mint fill-mint/30 group-hover:animate-pulse" />
              <span>WATCH TEASER</span>
            </a>
          ) : (
            <Link
              href="/#event-portfolio"
              className="btn-dark-gradient group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-6 font-mono-data text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md transition-all hover:scale-105 hover:border-mint"
            >
              <Sparkles size={15} strokeWidth={1.5} className="text-mint group-hover:animate-pulse" />
              <span>EXPLORE TRACKS</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
