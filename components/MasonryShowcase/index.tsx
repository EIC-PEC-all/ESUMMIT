'use client'
// components/MasonryShowcase/index.tsx
// 5-Column (Desktop) / 3-Column (Mobile) Infinite Vertical Marquee Gallery

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface CardItem {
  id: string
  img: string
  height: number
}

const PEC_GALLERY_IMAGES = [
  { img: '/gallery/pec_admin_building.jpg', height: 260 },
  { img: '/gallery/pec_centenary_hall.jpg', height: 220 },
  { img: '/gallery/pec_mig21.jpg', height: 280 },
  { img: '/gallery/pec_aerial_night.jpg', height: 240 },
  { img: '/gallery/pec_auditorium_facade.jpg', height: 260 },
  { img: '/gallery/pec_iaf_helicopter.jpg', height: 250 },
  { img: '/gallery/pec_pitch.jpg', height: 260 },
  { img: '/gallery/pec_team.png', height: 210 },
  { img: '/gallery/pec_group.png', height: 290 },
  { img: '/gallery/pec_auditorium.png', height: 240 },
  { img: '/gallery/pec_startup_fair.png', height: 300 },
  { img: '/gallery/pec_senate_roundtable.png', height: 200 },
  { img: '/gallery/pec_keynote_speaker.png', height: 270 },
  { img: '/gallery/pec_innovation_stage.png', height: 230 },
  { img: '/gallery/pec_pitch_table.png', height: 230 },
  { img: '/gallery/pec_investor_poster.png', height: 260 },
  { img: '/gallery/pec_funding_conclave.png', height: 280 },
  { img: '/gallery/pec_lawn_mosaic.png', height: 240 },
  { img: '/gallery/pec_senate_hall.png', height: 230 },
]

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

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
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0A1611] shadow-2xl transition-all duration-300 hover:scale-[0.98] hover:border-mint/60 hover:shadow-[0_0_30px_rgba(126,211,33,0.25)]"
            style={{ height: item.height }}
          >
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${item.img})` }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function MasonryShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState<CardItem[][]>([])

  useEffect(() => {
    const shuffled = shuffleArray(PEC_GALLERY_IMAGES)
    
    const updateColumns = () => {
      const colCount = window.innerWidth < 768 ? 3 : 5
      const cols: CardItem[][] = Array.from({ length: colCount }, () => [])
      
      shuffled.forEach((item, idx) => {
        cols[idx % colCount].push({ id: `${idx}`, ...item })
      })
      
      // Double each column so we can animate by -50% for a seamless loop
      const duplicatedCols = cols.map((col) => [
        ...col,
        ...col.map((item) => ({ ...item, id: `${item.id}-dup` })),
      ])
      
      setColumns(duplicatedCols)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const headlineOpacity = useTransform(scrollYProgress, [0.02, 0.2], [1, 0])
  const headlineScale = useTransform(scrollYProgress, [0.02, 0.2], [1, 0.88])
  const headlineY = useTransform(scrollYProgress, [0.02, 0.2], ['0px', '-50px'])

  const galleryOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0.15, 1])

  // Alternating speeds so columns don't feel mechanical
  const speeds = [28, 34, 26, 32, 30]

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative h-[200vh] border-b border-[#7ED321]/20 bg-[#081C16] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10"
    >
      {/* Pinned sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#081C16]">
        {/* Top & bottom gradient masks */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-32 bg-gradient-to-b from-[#081C16] via-[#081C16]/80 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-32 bg-gradient-to-t from-[#081C16] via-[#081C16]/80 to-transparent" />

        {/* 5 self-contained marquee columns filling full screen height */}
        <motion.div 
          style={{ opacity: galleryOpacity }}
          className="flex h-full w-full gap-3 px-3 sm:gap-4 sm:px-5 md:gap-5 md:px-8"
        >
          {columns.map((colItems, colIdx) => (
            <MarqueeColumn
              key={colIdx}
              items={colItems}
              direction={colIdx % 2 === 0 ? 'up' : 'down'}
              speed={speeds[colIdx] ?? 30}
            />
          ))}
        </motion.div>

        {/* Headline overlay — fades out on scroll */}
        <motion.div
          style={{ opacity: headlineOpacity, scale: headlineScale, y: headlineY }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-4 text-center"
        >
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-mint drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 160px)' }}
          >
            SUMMIT GALLERY
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
