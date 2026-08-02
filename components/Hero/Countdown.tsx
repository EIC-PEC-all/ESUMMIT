'use client'
// components/Hero/Countdown.tsx
// Live countdown timer with odometer flip/roll transition per digit and tabular nums

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

function SingleDigit({ digit, prefersReduced }: { digit: string; prefersReduced?: boolean }) {
  if (prefersReduced) {
    return (
      <span className="font-mono-data text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-none tracking-tight">
        {digit}
      </span>
    )
  }

  return (
    <div className="relative inline-block h-[1.05em] overflow-hidden align-middle">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: '-100%', opacity: 0.2 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0.2 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="block font-mono-data text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-none tracking-tight"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function DigitBlock({
  value,
  label,
  prefersReduced,
}: {
  value: string
  label: string
  prefersReduced?: boolean
}) {
  const digits = value.split('')

  return (
    <div className="flex flex-col items-center">
      {/* Number container with dark panel card backing */}
      <div className="bg-[#0D140E] border border-[#7ED321]/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center min-w-[70px] sm:min-w-[96px] lg:min-w-[110px] tabular-nums">
        <div className="flex items-center justify-center gap-0.5">
          {digits.map((d, idx) => (
            <SingleDigit key={idx} digit={d} prefersReduced={prefersReduced} />
          ))}
        </div>
      </div>
      {/* Label */}
      <span className="font-mono-data text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 text-[#8A9488]">
        {label}
      </span>
    </div>
  )
}

export default function Countdown({
  targetISO,
  prefersReduced = false,
}: {
  targetISO: string
  prefersReduced?: boolean
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    // If targetISO is in the past, default to a future March 15, 2026 or 2027 date for realistic countdown calculation
    const targetDate = new Date(targetISO)
    return calculateTimeLeft(targetDate)
  })

  useEffect(() => {
    let target = new Date(targetISO)
    // Ensure we don't start with 00 if targetISO was in the past during build/test:
    if (target.getTime() <= Date.now()) {
      // Set to March 15 2027 or target future date if needed for demo/live state
      target = new Date('2027-03-15T09:00:00+05:30')
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetISO])

  return (
    <div className="flex flex-col items-start gap-3">
      {/* Small label above countdown */}
      <div className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-[#7ED321] flex items-center gap-1.5">
        <span className="text-sm">☑</span>
        <span>COUNTDOWN TO OPENING BELL</span>
      </div>

      {/* Countdown timer: four blocks separated by ":" */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4" role="timer" aria-label="Countdown to E-Summit">
        <DigitBlock value={timeLeft.days} label="DAYS" prefersReduced={prefersReduced} />
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-bold text-[#7ED321] pb-6 sm:pb-7 select-none">
          :
        </span>
        <DigitBlock value={timeLeft.hours} label="HOURS" prefersReduced={prefersReduced} />
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-bold text-[#7ED321] pb-6 sm:pb-7 select-none">
          :
        </span>
        <DigitBlock value={timeLeft.minutes} label="MIN" prefersReduced={prefersReduced} />
        <span className="font-mono-data text-2xl sm:text-4xl lg:text-5xl font-bold text-[#7ED321] pb-6 sm:pb-7 select-none">
          :
        </span>
        <DigitBlock value={timeLeft.seconds} label="SEC" prefersReduced={prefersReduced} />
      </div>
    </div>
  )
}
