'use client'
// components/MasonryShowcase/index.tsx
// 5-Column (Desktop) / 3-Column (Mobile) Infinite Vertical Marquee Gallery

import { useRef, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useSummitData } from '@/hooks/useSummitData'
import BlurImage from '@/components/ui/BlurImage'

interface CardItem {
  id: string
  img: string
  height: number
}


const PEC_GALLERY_IMAGES = [
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412302/esummit/gallery/pec_admin_building.png', height: 260 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412309/esummit/gallery/pec_centenary_hall.png', height: 220 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412324/esummit/gallery/pec_mig21.png', height: 280 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412303/esummit/gallery/pec_aerial_night.png', height: 240 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412307/esummit/gallery/pec_auditorium_facade.png', height: 260 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412315/esummit/gallery/pec_iaf_helicopter.png', height: 250 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412326/esummit/gallery/pec_pitch.jpg', height: 260 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412336/esummit/gallery/pec_team.png', height: 210 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412313/esummit/gallery/pec_group.png', height: 290 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412306/esummit/gallery/pec_auditorium.png', height: 240 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412333/esummit/gallery/pec_startup_fair.png', height: 300 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412331/esummit/gallery/pec_senate_roundtable.png', height: 200 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412321/esummit/gallery/pec_keynote_speaker.png', height: 270 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412317/esummit/gallery/pec_innovation_stage.png', height: 230 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412327/esummit/gallery/pec_pitch_table.png', height: 230 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412320/esummit/gallery/pec_investor_poster.png', height: 260 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412311/esummit/gallery/pec_funding_conclave.png', height: 280 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412323/esummit/gallery/pec_lawn_mosaic.png', height: 240 },
  { img: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412329/esummit/gallery/pec_senate_hall.png', height: 230 },
]

// Stable order — shuffled once at module load, not per-render
const SHUFFLED_GALLERY = [...PEC_GALLERY_IMAGES].sort(() => Math.random() - 0.5)

// Each column is its own self-contained infinite scroll strip
function MarqueeColumn({
  items,
  direction,
  speed,
}: {
  items: CardItem[]
  direction: 'up' | 'down'
  speed: number
}) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <motion.div
        className="flex flex-col gap-3"
        animate={{
          y: direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative w-full shrink-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A1611] transition-transform duration-300 hover:border-white/20"
            style={{ height: `${item.height}px` }}
          >
            <BlurImage
              src={item.img}
              alt="E-Summit PEC event photo"
              fill
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 260px"
              quality={65}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function MasonryShowcase() {
  const { data } = useSummitData()
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState<CardItem[][]>([])
  const [isTitleVisible, setIsTitleVisible] = useState(true)

  const allGalleryItems = useMemo(() => {
    const customItems: { img: string; height: number }[] =
      data.gallery && data.gallery.length > 0
        ? data.gallery.map((g) => ({
            img: g.imageUrl,
            height: 250,
          }))
        : []
    return [...customItems, ...SHUFFLED_GALLERY]
  }, [data.gallery])

  useEffect(() => {
    const updateColumns = () => {
      const colCount = window.innerWidth < 768 ? 3 : 5
      const cols: CardItem[][] = Array.from({ length: colCount }, () => [])

      allGalleryItems.forEach((item, idx) => {
        cols[idx % colCount].push({ id: `${idx}`, ...item })
      })

      const duplicatedCols = cols.map((col) => [
        ...col,
        ...col.map((item) => ({ ...item, id: `${item.id}-dup` })),
      ])

      setColumns(duplicatedCols)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [allGalleryItems])

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const titleVisibleRef = useRef(true)
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Throttled title show/hide — only update React state at most once per 120ms
  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious()
    if (previous === undefined) return

    const progress = scrollYProgress.get()
    if (progress <= 0.02) {
      if (!isTitleVisible) setIsTitleVisible(true)
      return
    }

    const movingDown = current > previous && current - previous > 5
    const movingUp   = current < previous && previous - current > 5
    if (!movingDown && !movingUp) return

    const next = !movingDown
    if (next === titleVisibleRef.current) return
    titleVisibleRef.current = next

    if (titleTimerRef.current) clearTimeout(titleTimerRef.current)
    titleTimerRef.current = setTimeout(() => setIsTitleVisible(next), 0)
  })

  useEffect(() => () => {
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current)
  }, [])

  // The gallery images still fade in based on absolute progress
  const galleryOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0.15, 1])

  // Alternating slower speeds so columns scroll smoothly and gracefully
  const speeds = [44, 52, 42, 50, 46]

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative h-[200vh] border-b border-mint/20 bg-section-2 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10"
    >
      {/* Pinned sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: 'var(--bg-section-2, #0d1f15)' }}>
        {/* Top & bottom gradient masks */}
        <div 
          className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-32" 
          style={{ background: 'linear-gradient(to bottom, var(--bg-section-2), rgba(24, 51, 39, 0.8) 50%, transparent)' }}
        />
        <div 
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-32" 
          style={{ background: 'linear-gradient(to top, var(--bg-section-2), rgba(24, 51, 39, 0.8) 50%, transparent)' }}
        />

        {/* 5 self-contained marquee columns filling full screen height */}
        <motion.div 
          initial={{ opacity: 0.15 }}
          style={{ opacity: galleryOpacity }}
          className="flex h-full w-full gap-3 px-3 sm:gap-4 sm:px-5 md:gap-5 md:px-8"
        >
          {columns.map((colItems, colIdx) => (
            <MarqueeColumn
              key={colIdx}
              items={colItems}
              direction={colIdx % 2 === 0 ? 'up' : 'down'}
              speed={speeds[colIdx] ?? 45}
            />
          ))}
        </motion.div>

        {/* Ambient Overlay to dim images slightly so the title pops more */}
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: isTitleVisible ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 z-20 bg-black/30" 
        />

        {/* Headline overlay — fades out on scroll down, reappears on scroll up */}
        <motion.div
          initial={{ opacity: 1, scale: 1, y: '0px' }}
          animate={{ 
            opacity: isTitleVisible ? 1 : 0, 
            scale: isTitleVisible ? 1 : 0.95, 
            y: isTitleVisible ? 0 : -30 
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-4 text-center"
        >
          <h2
            className="font-display font-black uppercase leading-none tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] select-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            <span className="text-gradient-white">SUMMIT</span> <span className="text-gradient-mint">GALLERY</span>
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
