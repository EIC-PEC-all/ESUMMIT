'use client'
// components/Hero/Countdown.tsx
// Futuristic Neon Cyber-Finance Live Countdown Timer for E-Summit

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: string
  hours: string
  minutes: string
  seconds: string
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

function calculateTimeLeft(target: Date): TimeLeft {
  const now = Date.now()
  const diff = target.getTime() - now

  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  }
}

function DigitBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center group">
      {/* Number container with futuristic dark glass card */}
      <div className="relative bg-[#07130F]/90 border border-mint/35 rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-center min-w-[62px] sm:min-w-[84px] lg:min-w-[96px] tabular-nums backdrop-blur-xl group-hover:border-mint transition-colors overflow-hidden">
        {/* Top Gloss Line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-mint/40 via-mint to-mint/40" />
        
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-normal">
          {value}
        </span>
      </div>
      {/* Label */}
      <span className="font-mono-data text-[9px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] mt-2 text-mint">
        {label}
      </span>
    </div>
  )
}

export default function Countdown({
  targetISO,
  hideHeader = false,
}: {
  targetISO: string
  prefersReduced?: boolean
  hideHeader?: boolean
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const targetDate = new Date(targetISO)
    return calculateTimeLeft(targetDate)
  })

  useEffect(() => {
    let target = new Date(targetISO)
    if (target.getTime() <= Date.now()) {
      target = new Date('2027-03-15T09:00:00+05:30')
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetISO])

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Small label above countdown */}
      {!hideHeader && (
        <div className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-mint flex items-center gap-1.5">
          <span className="text-sm animate-pulse">⚡</span>
          <span>COUNTDOWN TO OPENING BELL</span>
        </div>
      )}

      {/* Countdown timer: four blocks separated by ":" */}
      <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-4" role="timer" aria-label="Countdown to E-Summit">
        <DigitBlock value={timeLeft.days} label="DAYS" />
        <span className="font-mono-data text-xl sm:text-3xl lg:text-4xl font-bold text-mint pb-6 select-none animate-pulse">
          :
        </span>
        <DigitBlock value={timeLeft.hours} label="HOURS" />
        <span className="font-mono-data text-xl sm:text-3xl lg:text-4xl font-bold text-mint pb-6 select-none animate-pulse">
          :
        </span>
        <DigitBlock value={timeLeft.minutes} label="MIN" />
        <span className="font-mono-data text-xl sm:text-3xl lg:text-4xl font-bold text-mint pb-6 select-none animate-pulse">
          :
        </span>
        <DigitBlock value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  )
}
