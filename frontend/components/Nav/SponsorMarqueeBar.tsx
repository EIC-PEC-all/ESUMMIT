'use client'

import React, { useMemo } from 'react'
import NavCountdown from './NavCountdown'
import { MASTER_SPONSORS } from '@/data/summitData'

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
  // Precompute and memoize all authentic past summit sponsors
  const sponsorItems = useMemo(
    () =>
      MASTER_SPONSORS.map((s) => ({
        id: s.id,
        name: s.name,
        logo: s.logo,
        tier: s.tier === 'Ecosystem Partner' ? s.category : s.tier,
      })),
    []
  )

  const loopItems = useMemo(() => [...sponsorItems, ...sponsorItems], [sponsorItems])

  const isTop = position === 'top'

  return (
    <div
      className={`fixed left-0 right-0 fixed-marquee z-[4000] dark:bg-[#060D0B]/95 bg-white/95 text-primary backdrop-blur-md py-2.5 shadow-md transition-all duration-500 ease-out ${
        isTop
          ? `top-0 border-b dark:border-mint/20 border-emerald-500/20 ${
              visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            }`
          : `bottom-0 border-t dark:border-mint/20 border-emerald-500/20 pb-[max(0.6rem,env(safe-area-inset-bottom))] ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`
      }`}
    >
      <div
        className={`${
          isTop ? 'hidden sm:flex' : 'flex'
        } absolute left-0 top-0 bottom-0 z-20 items-center dark:bg-[#07130F] bg-slate-50 pl-4 pr-3 border-r dark:border-mint/30 border-emerald-500/20 shadow-sm shrink-0 select-none`}
      >
        <NavCountdown targetISO={countdownTarget} />
      </div>

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

      <div
        className={`flex whitespace-nowrap animate-[marquee_65s_linear_infinite] md:animate-marquee hover:[animation-play-state:paused] items-center ${
          isTop ? 'pl-4 sm:pl-[135px] md:pl-[165px]' : 'pl-[135px] sm:pl-[165px]'
        }`}
      >
        {loopItems.map((item, i) => (
          <div
            key={`${position}-${item.id}-${i}`}
            className="inline-flex items-center gap-2 mx-4 font-mono-data text-[10px] sm:text-xs shrink-0"
          >
            <span className="dark:text-mint text-emerald-600 font-bold">•</span>
            {item.logo && (
              <span className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo}
                  alt={item.name}
                  className="max-h-3.5 max-w-4 object-contain filter brightness-90"
                />
              </span>
            )}
            <span className="font-bold tracking-widest uppercase text-gradient-white">{item.name}</span>
            <span className="text-gradient-mint font-bold uppercase tracking-widest ml-1">{item.tier}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
