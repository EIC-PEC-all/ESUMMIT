'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Plus, ImagePlus } from 'lucide-react'

interface CleanStripTransitionProps {
  slatCount?: number
}

function PhotoCard({ src, slotNum }: { src?: string; slotNum: number }) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-void/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-void bg-[#070B08]"
      style={{ width: '380px', height: '230px' }}
    >
      {src ? (
        <img
          src={src}
          alt={`Summit photo slot ${slotNum}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center space-y-3 bg-[#0B150E] border-2 border-dashed border-[#7ED321]/40 rounded-2xl transition-all group-hover:border-[#7ED321] group-hover:bg-[#101F15]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/40 text-[#7ED321] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(126,211,33,0.2)]">
            <Plus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#7ED321] transition-colors block">
              + Insert Image
            </span>
            <span className="font-mono text-[10px] text-[#8A9488] block">
              Slot #{slotNum} &middot; Via Admin CMS
            </span>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-void opacity-0 shadow-[0_0_20px_rgba(7,11,8,0.4)] transition-all duration-300 group-hover:opacity-100" />
    </div>
  )
}

function PhotoRow({
  images,
  duration,
  direction = 'left',
  translateX,
  opacity,
  offset = 0,
}: {
  images: (string | undefined)[]
  duration: number
  direction?: 'left' | 'right'
  translateX: any
  opacity: any
  offset?: number
}) {
  return (
    <motion.div
      className="overflow-hidden"
      style={{
        x: translateX,
        opacity: opacity,
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="flex w-max gap-4"
        style={{
          animation: `${direction === 'right' ? 'marqueeScrollReverse' : 'marqueeScroll'} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {images.map((src, i) => (
          <PhotoCard key={i} src={src} slotNum={(i % 8) + 1 + offset} />
        ))}
      </div>
    </motion.div>
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
  const startRange = (index / totalSlats) * 0.42 + 0.02
  const endRange = startRange + 0.28

  // Collapsing Front Strip (Previous Dark Hero Section) — scaleY: 1 -> 0
  const collapseScaleY = useTransform(smoothProgress, [startRange, endRange], [1, 0])
  const collapseOpacity = useTransform(
    smoothProgress,
    [startRange, endRange - 0.02, endRange],
    [1, 1, 0]
  )

  // Sleek Lime Laser Slice Line on active collapsing border
  const laserOpacity = useTransform(
    smoothProgress,
    [startRange - 0.02, startRange + 0.05, endRange - 0.02, endRange + 0.02],
    [0, 1, 1, 0]
  )

  return (
    <div
      className="pointer-events-none absolute left-0 w-full select-none overflow-hidden"
      style={{
        top: `${topPositionPercent}%`,
        height: `calc(${slatHeightPercent}% + 1px)`, // +1px avoids subpixel gaps
      }}
    >
      {/* ── COLLAPSING STRIP (Dark Hero Panel collapsing to reveal clean Lime bg) ── */}
      <motion.div
        className="absolute inset-0 bg-[#070b08]"
        style={{
          scaleY: collapseScaleY,
          opacity: collapseOpacity,
          transformOrigin: 'top', // Collapses upward
          willChange: 'transform, opacity',
        }}
      >
        {/* Bottom edge shadow */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/80 to-transparent" />

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
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

    fetch(`${apiUrl}/gallery`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { imageUrl: string; slot?: number }[]) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const imgs: string[] = []
          data.forEach((d) => {
            if (d.slot && d.slot >= 1) {
              imgs[d.slot - 1] = d.imageUrl
            } else {
              imgs.push(d.imageUrl)
            }
          })
          setGalleryImages(imgs)
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  const row1 = galleryImages.slice(0, 8)
  const row2 = galleryImages.slice(8, 16)

  const loop1 = Array.from({ length: 8 }, (_, i) => row1[i] || undefined)
  const loop2 = Array.from({ length: 8 }, (_, i) => row2[i] || undefined)

  const fullLoop1 = [...loop1, ...loop1, ...loop1, ...loop1]
  const fullLoop2 = [...loop2, ...loop2, ...loop2, ...loop2]

  // Track scroll progress within this transition section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end end'],
  })

  // Smooth physics spring for fluid responsive scroll feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  })

  // Row 1 slides in from LEFT (-100vw -> 0vw) AFTER strip collapse completes (progress 0.45 -> 0.72)
  const row1TranslateX = useTransform(smoothProgress, [0.45, 0.72], ['-100vw', '0vw'])

  // Row 2 slides in from RIGHT (100vw -> 0vw) AFTER strip collapse completes (progress 0.50 -> 0.75)
  const row2TranslateX = useTransform(smoothProgress, [0.5, 0.75], ['100vw', '0vw'])

  // Opacity fade-in for rows as they slide in
  const marqueeOpacity = useTransform(smoothProgress, [0.45, 0.65], [0, 1])

  const slats = Array.from({ length: slatCount }, (_, i) => i)

  return (
    <section
      ref={containerRef}
      id="flip-flop-transition"
      className="relative z-20 -mt-[180px] h-[190vh] bg-mint sm:-mt-[220px]"
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

      {/* Sticky Fullscreen Stage — Solid LIME Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-mint">
        {/* Ambient Lime Lighting Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_75%)]" />

        {/* REVEALED LAYER (z-0): Photo Rows sliding in from Left & Right AFTER strip collapse */}
        <div className="relative z-0 flex w-full flex-col justify-center gap-4 px-4 py-8">
          <PhotoRow
            images={fullLoop1}
            duration={50}
            direction="left"
            translateX={row1TranslateX}
            opacity={marqueeOpacity}
            offset={0}
          />
          <PhotoRow
            images={fullLoop2}
            duration={45}
            direction="right"
            translateX={row2TranslateX}
            opacity={marqueeOpacity}
            offset={8}
          />
        </div>

        {/* OVERLAY LAYER (z-10): Dark Slats Collapsing Top-to-Bottom on Scroll */}
        <div className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden">
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
