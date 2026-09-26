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

      {/* Accessible SEO Heading */}
      <h1 className="sr-only">PEC E-Summit &apos;26 — Legacies Beyond Time</h1>

      {/* Official Centered Logo Artwork */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 select-none">
        <Image
          src="/esummit-logo.png"
          alt="PEC's E-Summit '26 — Legacies Beyond Time"
          width={880}
          height={290}
          priority
          fetchPriority="high"
          className="w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[540px] md:max-w-[680px] lg:max-w-[800px] h-auto object-contain drop-shadow-[0_0_35px_rgba(0,245,212,0.4)] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
        />
      </div>
    </motion.div>
  )
}
