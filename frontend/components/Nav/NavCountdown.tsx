'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export interface NavCountdownProps {
  targetISO?: string
  visible?: boolean
}

export default function NavCountdown({
  targetISO = '2026-11-14T09:00:00+05:30',
  visible = true,
}: NavCountdownProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLandingPage) return
    const target = new Date(targetISO)

    const checkState = () => {
      const curNow = Date.now()
      const start = target.getTime()
      const end = start + 2 * 24 * 60 * 60 * 1000
      const live = curNow >= start && curNow <= end
      setIsLive(live)

      if (!live) {
        const diff = start - curNow
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((diff / (1000 * 60)) % 60)
          const seconds = Math.floor((diff / 1000) % 60)

          const pad = (n: number) => String(n).padStart(2, '0')
          setTimeLeft({
            days: pad(days),
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds),
          })
        } else {
          setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        }
      }
    }

    checkState()
    const timer = setInterval(checkState, 1000)
    return () => clearInterval(timer)
  }, [targetISO, isLandingPage])

  if (!mounted || !isLandingPage) return null


  return (
    <aside
      aria-label="Summit Countdown Timer"
      className={`fixed sm:hidden bottom-0 left-0 right-0 z-[2400] w-full bg-[#061510]/95 backdrop-blur-xl border-t border-mint/25 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-none py-2 px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] select-none transition-all duration-400 ease-out ${
        visible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-center gap-2 font-mono-data text-xs tracking-wider select-none text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse shrink-0" />
        <span className="text-[10px] font-bold text-mint uppercase tracking-widest shrink-0">
          {isLive ? 'SUMMIT LIVE' : 'STARTS IN'}
        </span>

        {!isLive && (
          <>
            <span className="text-mint/40 font-bold">:</span>
            <div className="flex items-center gap-1.5 tabular-nums">
              <span className="font-black text-white">
                {timeLeft.days}
                <span className="text-[9px] font-bold text-mint ml-0.5">D</span>
              </span>
              <span className="text-mint/40 font-bold">:</span>
              <span className="font-black text-white">
                {timeLeft.hours}
                <span className="text-[9px] font-bold text-mint ml-0.5">H</span>
              </span>
              <span className="text-mint/40 font-bold">:</span>
              <span className="font-black text-white">
                {timeLeft.minutes}
                <span className="text-[9px] font-bold text-mint ml-0.5">M</span>
              </span>
              <span className="text-mint/40 font-bold">:</span>
              <span className="font-black text-mint">
                {timeLeft.seconds}
                <span className="text-[9px] font-bold text-mint ml-0.5">S</span>
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
