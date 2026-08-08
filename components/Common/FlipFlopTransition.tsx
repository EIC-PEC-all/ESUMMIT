'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// E-Summit photo gallery images
const ALL_IMGS = [
  // Row 1 — Keynotes, pitch competitions, tech stages
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=840&q=80&auto=format&fit=crop',
  // Row 2 — Investor meets, networking, workshops, hackathon teams
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=840&q=80&auto=format&fit=crop',
]

const ROW_1 = ALL_IMGS.slice(0, 8)
const ROW_2 = ALL_IMGS.slice(8)
const LOOP_1 = [...ROW_1, ...ROW_1, ...ROW_1, ...ROW_1]
const LOOP_2 = [...ROW_2, ...ROW_2, ...ROW_2, ...ROW_2]

interface CleanStripTransitionProps {
  slatCount?: number
}

function PhotoCard({ src }: { src: string }) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-void/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-void"
      style={{ width: '380px', height: '230px' }}
    >
      <img
        src={src}
        alt="E-Summit event photo"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-void opacity-0 shadow-[0_0_20px_rgba(7,11,8,0.4)] transition-all duration-300 group-hover:opacity-100" />
    </div>
  )
}

function PhotoRow({
  images,
  duration,
  direction = 'left',
}: {
  images: string[]
  duration: number
  direction?: 'left' | 'right'
}) {
  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max gap-4"
        style={{
          animation: `${direction === 'right' ? 'marqueeScrollReverse' : 'marqueeScroll'} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {images.map((src, i) => (
          <PhotoCard key={i} src={src} />
        ))}
      </div>
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

  // Staggered scroll window per strip (top strips collapse first)
  const startRange = (index / totalSlats) * 0.5 + 0.02
  const endRange = startRange + 0.35

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
      {/* ── COLLAPSING STRIP (Dark Hero Panel collapsing to reveal photo marquee beneath) ── */}
      <motion.div
        className="absolute inset-0 bg-[#070b08]"
        style={{
          scaleY: collapseScaleY,
          opacity: collapseOpacity,
          transformOrigin: 'top', // Collapses upward to reveal the Photo Marquee underneath
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

  // Track scroll progress within this transition section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end end'],
  })

  // Smooth physics spring for responsive scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  })

  const slats = Array.from({ length: slatCount }, (_, i) => i)

  return (
    <section
      ref={containerRef}
      id="flip-flop-transition"
      className="relative z-20 h-[170vh] bg-mint -mt-[180px] sm:-mt-[220px]"
      aria-label="Strip collapse transition revealing marquee gallery"
    >
      {/* Marquee animation keyframes */}
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

      {/* Sticky Fullscreen Stage — Photo Marquee sitting on solid LIME stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-mint">
        {/* Ambient Lime Lighting Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_75%)]" />

        {/* REVEALED LAYER (z-0): Photo Marquee Gallery on Lime Canvas */}
        <div className="relative z-0 flex flex-col justify-center w-full gap-4 px-4 py-8">
          <PhotoRow images={LOOP_1} duration={50} direction="left" />
          <PhotoRow images={LOOP_2} duration={45} direction="right" />
        </div>

        {/* OVERLAY LAYER (z-10): Dark Slats Collapsing Top-to-Bottom on Scroll */}
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
