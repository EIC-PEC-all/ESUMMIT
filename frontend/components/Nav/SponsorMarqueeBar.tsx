'use client'

import React, { useMemo } from 'react'
import NavCountdown from './NavCountdown'
import { SPONSORS } from '@/lib/data'

export interface SponsorMarqueeBarProps {
  position: 'top' | 'bottom'
  visible: boolean
  countdownTarget: string
}

export default function SponsorMarqueeBar({
  position,
  visible,
  countdownTarget,
}: SponsorMarqueeBarProps) {
  // Precompute and memoize sponsor items
  const sponsorItems = useMemo(
    () => [
      ...SPONSORS.title.map((s) => ({ ...s, tier: 'Title Partner' })),
      ...SPONSORS.gold.map((s) => ({ ...s, tier: 'Gold Sponsor' })),
      ...SPONSORS.silver.map((s) => ({ ...s, tier: 'Ecosystem Partner' })),
      ...SPONSORS.media.map((s) => ({ ...s, tier: 'Media Partner' })),
    ],
    []
  )

  // 2 copies total for seamless -50% loop
  const loopItems = useMemo(() => [...sponsorItems, ...sponsorItems], [sponsorItems])

  const isTop = position === 'top'

  return (
    <div
      className={`fixed left-0 right-0 fixed-marquee z-[2500] bg-section-1 [.light_&]:bg-[#2A3B18] text-white backdrop-blur-md py-2.5 shadow-2xl transition-all duration-500 ease-out ${
        isTop
          ? `top-(--announcement-height,0px) border-b border-mint/20 [.light_&]:border-[#4E6527]/50 ${
              visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            }`
          : `bottom-0 border-t border-mint/20 [.light_&]:border-[#4E6527]/50 pb-[max(0.6rem,env(safe-area-inset-bottom))] ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`
      }`}
    >
      {/* Countdown Badge */}
      <div
        className={`${
          isTop ? 'hidden sm:flex' : 'flex'
        } absolute left-0 top-0 bottom-0 z-20 items-center bg-[#132620] [.light_&]:bg-[#1A2510] pl-4 pr-3 border-r border-mint/30 [.light_&]:border-[#4E6527]/40 shadow-[4px_0_15px_rgba(0,0,0,0.4)] shrink-0 select-none`}
      >
        <NavCountdown targetISO={countdownTarget} />
      </div>

      {/* Fade Gradients */}
      <div
        className={`absolute top-0 bottom-0 w-16 z-10 pointer-events-none ${
          isTop
            ? 'left-0 sm:left-[125px] md:left-[155px]'
            : 'left-[125px] sm:left-[155px]'
        }`}
        style={{ background: 'linear-gradient(to right, var(--bg-section-1), transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-section-1), transparent)' }}
      />

      {/* Ticker Track */}
      <div
        className={`flex whitespace-nowrap animate-[marquee_50s_linear_infinite] md:animate-marquee hover:[animation-play-state:paused] items-center ${
          isTop ? 'pl-4 sm:pl-[135px] md:pl-[165px]' : 'pl-[135px] sm:pl-[165px]'
        }`}
      >
        {loopItems.map((item, i) => (
          <div
            key={`${position}-${item.id}-${i}`}
            className="inline-flex items-center gap-2 mx-5 font-mono-data text-[10px] sm:text-xs shrink-0"
          >
            <span className="text-mint [.light_&]:text-[#A0C868] font-bold">•</span>
            <span className="font-bold tracking-widest uppercase text-gradient-white">{item.name}</span>
            <span className="text-gradient-mint font-bold uppercase tracking-widest ml-1">{item.tier}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
