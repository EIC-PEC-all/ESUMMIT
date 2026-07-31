'use client'
// components/Hero/Countdown.tsx
// Live countdown timer with per-digit flip animation

import { useEffect, useState, useRef } from 'react'

interface TimeLeft {
  days: string
  hours: string
  minutes: string
  seconds: string
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00' }
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

function DigitGroup({ value, label }: { value: string; label: string }) {
  const prevRef = useRef(value)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value
      setKey((k) => k + 1)
    }
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-0.5">
        {value.split('').map((digit, i) => (
          <div key={`${key}-${i}`} className="digit-wrapper">
            <span
              className="digit font-mono-data text-4xl sm:text-5xl lg:text-6xl font-bold text-volt block leading-none"
            >
              {digit}
            </span>
          </div>
        ))}
      </div>
      <span
        className="font-mono-data text-[10px] uppercase tracking-widest mt-2 text-muted"
      >
        {label}
      </span>
    </div>
  )
}

export default function Countdown({ targetISO }: { targetISO: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(new Date(targetISO)))

  useEffect(() => {
    const target = new Date(targetISO)
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target))
    }, 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return (
    <div
      className="flex items-center gap-4 sm:gap-6"
      role="timer"
      aria-label="Countdown to PEC Summit"
    >
      <DigitGroup value={timeLeft.days} label="days" />
      <span className="font-mono-data text-3xl font-bold pb-5 text-volt">:</span>
      <DigitGroup value={timeLeft.hours} label="hours" />
      <span className="font-mono-data text-3xl font-bold pb-5 text-volt">:</span>
      <DigitGroup value={timeLeft.minutes} label="min" />
      <span className="font-mono-data text-3xl font-bold pb-5 text-volt">:</span>
      <DigitGroup value={timeLeft.seconds} label="sec" />
    </div>
  )
}
