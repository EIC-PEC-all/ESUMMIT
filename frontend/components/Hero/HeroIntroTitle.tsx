'use client'

import React from 'react'
import { motion, MotionValue } from 'framer-motion'

export interface HeroIntroTitleProps {
  opacity: MotionValue<number>
  visibility: MotionValue<string>
}

export default function HeroIntroTitle({ opacity, visibility }: HeroIntroTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      style={{ opacity, visibility: visibility as any }}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.3)_40%,transparent_70%)] sm:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_60%)] pointer-events-none" />
      <h1
        className="relative font-display font-black leading-none tracking-tighter drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] flex items-baseline justify-center whitespace-nowrap w-full px-4 select-none"
        style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}
      >
        <span className="text-gradient-white">E-SUMMIT</span>
        <span className="text-gradient-mint ml-1 sm:ml-2">&apos;26</span>
      </h1>
      <p
        className="relative mt-3 sm:mt-5 w-full max-w-xl font-mono-data text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-white/80 drop-shadow-[0_4px_20px_rgba(0,0,0,1)] text-center animate-fade-in"
      >
        Chandigarh&apos;s Launchpad for Founders
      </p>
    </motion.div>
  )
}
