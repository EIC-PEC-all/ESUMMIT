'use client'
// components/Common/FlipFlopTransition.tsx
// Scroll-Driven Horizontal Entry (Left & Right Slide-In) + Pinned Marquee Pause + Strip Collapse

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const ALL_IMGS = [
  '/gallery/pec_admin_building.jpg',
  '/gallery/pec_centenary_hall.jpg',
  '/gallery/pec_mig21.jpg',
  '/gallery/pec_aerial_night.jpg',
  '/gallery/pec_auditorium_facade.jpg',
  '/gallery/pec_iaf_helicopter.jpg',
  '/gallery/pec_pitch.jpg',
  '/gallery/pec_team.png',
  '/gallery/pec_group.png',
  '/gallery/pec_auditorium.png',
  '/gallery/pec_startup_fair.png',
  '/gallery/pec_senate_roundtable.png',
  '/gallery/pec_keynote_speaker.png',
  '/gallery/pec_innovation_stage.png',
  '/gallery/pec_pitch_table.png',
  '/gallery/pec_investor_poster.png',
  '/gallery/pec_funding_conclave.png',
  '/gallery/pec_lawn_mosaic.png',
  '/gallery/pec_senate_hall.png',
]

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function PhotoCard({ src }: { src: string }) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-void/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-void"
      style={{ width: '380px', height: '230px' }}
    >
      <img
        src={src}
        alt="PEC E-Summit photo"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-void opacity-0 shadow-[0_0_20px_rgba(7,11,8,0.4)] transition-all duration-300 group-hover:opacity-100" />
    </div>
  )
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

  // Staggered scroll window per strip (collapses FIRST to unfold vibrant lime stage)
  const startRange = (index / totalSlats) * 0.08
  const endRange = startRange + 0.10

  const collapseScaleY = useTransform(smoothProgress, [startRange, endRange], [1, 0])
  const collapseOpacity = useTransform(
    smoothProgress,
    [startRange, endRange - 0.02, endRange],
    [1, 1, 0]
  )

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
        height: `calc(${slatHeightPercent}% + 1px)`,
      }}
    >
      <motion.div
        className="absolute inset-0 bg-[#070b08]"
        style={{
          scaleY: collapseScaleY,
          opacity: collapseOpacity,
          transformOrigin: 'top',
          willChange: 'transform, opacity',
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-mint shadow-[0_0_20px_#7ed321]"
          style={{ opacity: laserOpacity }}
        />
      </motion.div>
    </div>
  )
}

export default function FlipFlopTransition({ slatCount = 10 }: { slatCount?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [loop1, setLoop1] = useState<string[]>(() => {
    const row1 = ALL_IMGS.slice(0, 9)
    return [...row1, ...row1, ...row1, ...row1]
  })
  const [loop2, setLoop2] = useState<string[]>(() => {
    const row2 = ALL_IMGS.slice(9)
    return [...row2, ...row2, ...row2, ...row2]
  })

  useEffect(() => {
    const shuffled = shuffleArray(ALL_IMGS)
    const mid = Math.ceil(shuffled.length / 2)
    const r1 = shuffled.slice(0, mid)
    const r2 = shuffled.slice(mid)
    setLoop1([...r1, ...r1, ...r1, ...r1])
    setLoop2([...r2, ...r2, ...r2, ...r2])
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  })

  // Scroll-driven horizontal entry: Row 1 from LEFT (-100vw -> 0vw), Row 2 from RIGHT (100vw -> 0vw)
  const row1X = useTransform(smoothProgress, [0.08, 0.38], ['-100vw', '0vw'])
  const row2X = useTransform(smoothProgress, [0.08, 0.38], ['100vw', '0vw'])

  const slats = Array.from({ length: slatCount }, (_, i) => i)

  return (
    <section
      ref={containerRef}
      id="flip-flop-transition"
      className="relative z-20 h-[160vh] bg-mint -mt-[180px] sm:-mt-[220px]"
      aria-label="Interactive scroll-driven photo marquee transition"
    >
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeScrollReverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>

      {/* Sticky Fullscreen Viewport — Stays pinned on stage during middle scroll phase */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-mint">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_75%)]" />

        {/* REVEALED LAYER: Dual Photo Marquee Rows sliding in from Left & Right on scroll */}
        <div className="relative z-0 flex flex-col justify-center w-full gap-4 px-4 py-8 overflow-hidden">
          {/* Row 1 — Slides in from LEFT on scroll */}
          <motion.div style={{ x: row1X }} className="w-full overflow-hidden">
            <div
              className="flex w-max gap-4"
              style={{
                animation: 'marqueeScroll 45s linear infinite',
                willChange: 'transform',
              }}
            >
              {loop1.map((src, i) => (
                <PhotoCard key={`row1-${src}-${i}`} src={src} />
              ))}
            </div>
          </motion.div>

          {/* Row 2 — Slides in from RIGHT on scroll */}
          <motion.div style={{ x: row2X }} className="w-full overflow-hidden">
            <div
              className="flex w-max gap-4"
              style={{
                animation: 'marqueeScrollReverse 40s linear infinite',
                willChange: 'transform',
              }}
            >
              {loop2.map((src, i) => (
                <PhotoCard key={`row2-${src}-${i}`} src={src} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* OVERLAY LAYER: Dark Slats Collapsing Top-to-Bottom on Scroll with Laser Slice Edges */}
        <div className="absolute inset-0 z-10 select-none overflow-hidden pointer-events-none">
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
