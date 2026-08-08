'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface CleanStripTransitionProps {
  slatCount?: number
}

function CleanStripSlat({
  index,
  totalSlats,
  smoothProgress,
}: {
  index: number
  totalSlats: number
  smoothProgress: any
}) {
  const slatHeightPercent = 100 / totalSlats
  const topPositionPercent = index * slatHeightPercent

  // Staggered scroll window per strip (top strips collapse first)
  const startRange = (index / totalSlats) * 0.55 + 0.05
  const endRange = startRange + 0.3

  // Collapsing Front Strip (Previous Dark Hero Section) — scaleY: 1 -> 0
  const collapseScaleY = useTransform(smoothProgress, [startRange, endRange], [1, 0])
  const collapseOpacity = useTransform(
    smoothProgress,
    [startRange, endRange - 0.02, endRange],
    [1, 1, 0]
  )

  // Sleek Lime Laser Slice Line on the active collapsing border
  const laserOpacity = useTransform(
    smoothProgress,
    [startRange - 0.02, startRange + 0.05, endRange - 0.02, endRange + 0.02],
    [0, 1, 1, 0]
  )

  return (
    <div
      className="absolute left-0 w-full overflow-hidden select-none pointer-events-none"
      style={{
        top: `${topPositionPercent}%`,
        height: `calc(${slatHeightPercent}% + 1px)`, // +1px avoids subpixel gaps
      }}
    >
      {/* ── COLLAPSING STRIP (Dark Void Hero Panel collapsing to reveal solid Lime bg) ── */}
      <motion.div
        className="absolute inset-0 bg-[#070b08]"
        style={{
          scaleY: collapseScaleY,
          opacity: collapseOpacity,
          transformOrigin: 'top', // Collapses upward to reveal the Lime background underneath
          willChange: 'transform, opacity',
        }}
      >
        {/* Bottom edge shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Dynamic Lime Laser Slice Line on active collapse edge */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-mint shadow-[0_0_20px_#7ed321]"
          style={{ opacity: laserOpacity }}
        />
      </motion.div>
    </div>
  )
}

export default function FlipFlopTransition({ slatCount = 10 }: CleanStripTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress within this 150vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth physics spring for responsive scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    restDelta: 0.001,
  })

  const slats = Array.from({ length: slatCount }, (_, i) => i)

  return (
    <section
      ref={containerRef}
      id="flip-flop-transition"
      className="relative z-20 h-[150vh] bg-mint"
      aria-label="Strip collapse transition revealing lime section"
    >
      {/* Sticky Fullscreen Viewport — Solid Vibrant LIME Background */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-mint">
        {/* Ambient Lime Lighting Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_75%)]" />

        {/* Strips Layer (Dark strips collapsing away to reveal solid LIME) */}
        <div className="relative h-full w-full select-none overflow-hidden">
          {slats.map((index) => (
            <CleanStripSlat
              key={index}
              index={index}
              totalSlats={slatCount}
              smoothProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
