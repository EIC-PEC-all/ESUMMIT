'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DigitProps {
  value: number
}

const Digit: React.FC<DigitProps> = ({ value }) => {
  return (
    <div className="relative w-7 h-10 sm:w-9 sm:h-13 md:w-10 md:h-14 overflow-hidden rounded-lg bg-zinc-900/90 border border-white/10 text-white font-mono text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center shadow-md select-none">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 36, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

interface UnitGroupProps {
  label: string
  digits: string
}

const UnitGroup: React.FC<UnitGroupProps> = ({ label, digits }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1">
        {digits.split('').map((d, i) => (
          <Digit key={`${label}-${i}`} value={parseInt(d, 10)} />
        ))}
      </div>
      <span className="text-[9px] sm:text-[10px] font-mono-data font-bold uppercase tracking-widest text-mint/80">
        {label}
      </span>
    </div>
  )
}

export interface FlipClockProps {
  targetDate?: string
  className?: string
}

export default function FlipClock({
  targetDate = '2026-11-14T09:00:00+05:30',
  className = 'flex justify-center items-center gap-1.5 sm:gap-3',
}: FlipClockProps) {
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  useEffect(() => {
    setMounted(true)
    const target = new Date(targetDate).getTime()

    const updateTimer = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)

      const pad = (n: number) => n.toString().padStart(2, '0')

      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)

      setCountdown({
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!mounted) return null

  return (
    <div className={className} suppressHydrationWarning>
      <UnitGroup label="DAYS" digits={countdown.days} />
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-500 -mt-3.5">:</span>
      <UnitGroup label="HOURS" digits={countdown.hours} />
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-500 -mt-3.5">:</span>
      <UnitGroup label="MINS" digits={countdown.minutes} />
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-500 -mt-3.5">:</span>
      <UnitGroup label="SECS" digits={countdown.seconds} />
    </div>
  )
}
