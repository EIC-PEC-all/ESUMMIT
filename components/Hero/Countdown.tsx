'use client'
// components/Hero/Countdown.tsx
// Clean, non-overlapping live countdown timer for PEC Summit

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
    <div className="flex flex-col items-center">
      {/* Number container with dark glass backing for perfect readability in light and dark themes */}
      <div className="bg-[#0B150E] border border-[var(--accent-mint)]/40 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_6px_24px_rgba(0,0,0,0.6)] flex items-center justify-center min-w-[64px] sm:min-w-[88px] lg:min-w-[100px] tabular-nums">
        <span className="font-mono-data text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-none tracking-normal">
          {value}
        </span>
      </div>
      {/* Label */}
      <span className="font-mono-data text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 text-muted">
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
      {/* Small label above countdown (Optional) */}
      {!hideHeader && (
        <div className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-mint)] flex items-center gap-1.5">
          <span className="text-sm">☑</span>
          <span>COUNTDOWN TO OPENING BELL</span>
        </div>
      )}

      {/* Countdown timer: four blocks separated by ":" */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4" role="timer" aria-label="Countdown to E-Summit">
        <DigitBlock value={timeLeft.days} label="DAYS" />
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-mint)] pb-5 select-none">
          :
        </span>
        <DigitBlock value={timeLeft.hours} label="HOURS" />
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-mint)] pb-5 select-none">
          :
        </span>
        <DigitBlock value={timeLeft.minutes} label="MIN" />
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-mint)] pb-5 select-none">
          :
        </span>
        <DigitBlock value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  )
}
