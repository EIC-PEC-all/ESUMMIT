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
      <div className="absolute inset-0 hero-logo-scrim pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-full h-[320px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(116,251,68,0.28)_0%,rgba(16,185,129,0.20)_50%,transparent_75%)] blur-[50px] pointer-events-none" />

      {/* Accessible SEO Heading */}
      <h1 className="sr-only">PEC E-Summit &apos;26 — Legacies Beyond Time</h1>

      {/* Official Centered Logo Artwork */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-[64vw] xs:max-w-[240px] sm:max-w-[440px] md:max-w-[580px] lg:max-w-[720px] mx-auto select-none min-w-0 px-2 sm:px-0">
        <Image
          src="/esummit-logo.png"
          alt="PEC's E-Summit '26 — Legacies Beyond Time"
          width={1040}
          height={224}
          priority
          fetchPriority="high"
          className="hero-intro-logo w-full h-auto max-w-full min-w-0 object-contain drop-shadow-[0_0_35px_rgba(116,251,68,0.45)] drop-shadow-[0_0_65px_rgba(34,197,94,0.30)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </motion.div>
  )
}
