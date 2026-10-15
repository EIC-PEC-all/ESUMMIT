'use client'

import React from 'react'
import Image from 'next/image'
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-full h-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(138,197,63,0.15)_0%,transparent_70%)] blur-[50px] pointer-events-none" />

      {/* Accessible SEO Heading */}
      <h1 className="sr-only">PEC E-Summit &apos;26 — Legacies Beyond Time</h1>

      {/* Official Centered Logo Artwork */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-[88vw] sm:max-w-[600px] md:max-w-[740px] lg:max-w-[840px] mx-auto select-none min-w-0">
        <Image
          src="/esummit-logo.png?v=3"
          alt="PEC's E-Summit '26 — Legacies Beyond Time"
          width={1040}
          height={224}
          priority
          fetchPriority="high"
          className="w-full h-auto max-w-full min-w-0 object-contain drop-shadow-[0_0_35px_rgba(138,197,63,0.35)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </motion.div>
  )
}
