'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Plus } from 'lucide-react'

const DEFAULT_HEIGHTS_COL1 = [460, 340, 500, 420]
const DEFAULT_HEIGHTS_COL2 = [360, 480, 400, 540]
const DEFAULT_HEIGHTS_COL3 = [540, 400, 460, 500]
const DEFAULT_HEIGHTS_COL4 = [420, 540, 400, 460]

export default function MasonryShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [galleryItems, setGalleryItems] = useState<{ id: string; imageUrl: string; slot?: number; title?: string }[]>([])

  useEffect(() => {
    let mounted = true
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

    fetch(`${apiUrl}/gallery`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setGalleryItems(data)
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  // Track scroll position through section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── 1. Headline Fade Sequence ──
  const headlineOpacity = useTransform(scrollYProgress, [0.02, 0.2], [1, 0])
  const headlineScale = useTransform(scrollYProgress, [0.02, 0.2], [1, 0.82])
  const headlineY = useTransform(scrollYProgress, [0.02, 0.2], ['0px', '-60px'])

  // ── 2. Gallery Fade Sequence ──
  const galleryOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.3, 1, 1])
  const galleryScale = useTransform(scrollYProgress, [0.85, 1], [1, 1])

  // ── 3. Opposing Scroll Parallax Transforms ──
  const colY_1 = useTransform(scrollYProgress, [0.15, 0.85], ['0px', '-800px'])
  const colY_2 = useTransform(scrollYProgress, [0.15, 0.85], ['-800px', '0px'])
  const colY_3 = useTransform(scrollYProgress, [0.15, 0.85], ['-100px', '-900px'])
  const colY_4 = useTransform(scrollYProgress, [0.15, 0.85], ['-700px', '100px'])

  const renderSlotCard = (slotNum: number, height: number) => {
    const uploaded = galleryItems.find((g) => g.slot === slotNum) || galleryItems[slotNum - 1]

    return (
      <div
        key={`slot-${slotNum}`}
        className="group relative w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-[#7ED321]/30 bg-[#0B150E] shadow-2xl transition-all duration-300 hover:scale-[0.98] hover:border-[#7ED321] hover:shadow-[0_0_30px_rgba(126,211,33,0.35)]"
        style={{ height }}
      >
        {uploaded?.imageUrl ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${uploaded.imageUrl})` }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center space-y-3 bg-[#0B150E] group-hover:bg-[#101F15] transition-colors">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7ED321]/15 border border-[#7ED321]/40 text-[#7ED321] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(126,211,33,0.2)]">
              <Plus className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#7ED321] transition-colors block">
                + Insert Image
              </span>
              <p className="font-mono text-[10px] text-[#8A9488]">
                Slot #{slotNum} &middot; Via Admin CMS
              </p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B08]/80 via-transparent to-transparent opacity-60" />
      </div>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[280vh] border-b border-white/10 bg-[#0D1812]"
    >
      {/* Pinned Full-Screen Sticky Viewport Container */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#0D1812]">
        {/* ── TOP EDGE GRADIENT MASK ── */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-36 bg-gradient-to-b from-[#0D1812] via-[#0D1812]/90 to-transparent md:h-48" />

        {/* ── BOTTOM EDGE GRADIENT MASK ── */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-36 bg-gradient-to-t from-[#0D1812] via-[#0D1812]/90 to-transparent md:h-48" />

        {/* ── INTRO HEADLINE — Shows on enter, disappears after scroll ── */}
        <motion.div
          style={{
            opacity: headlineOpacity,
            scale: headlineScale,
            y: headlineY,
          }}
          className="pointer-events-none absolute z-30 px-4 text-center"
        >
          <span className="mb-2 block font-mono-data text-xs font-bold uppercase tracking-[0.35em] text-mint">
            PEC E-SUMMIT 2026
          </span>
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-center text-mint drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
            style={{ fontSize: 'clamp(2.2rem, 10vw, 160px)' }}
          >
            SUMMIT GALLERY
          </h2>
        </motion.div>

        {/* ── PURE FULL-SCREEN OPPOSING AUTO-SCROLL & PARALLAX GALLERY ── */}
        <motion.div
          style={{
            opacity: galleryOpacity,
            scale: galleryScale,
          }}
          className="flex h-full w-full max-w-[1920px] items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-hidden px-2 sm:px-4 md:px-6"
        >
          {/* Column 1 — UP */}
          <motion.div
            style={{ y: colY_1, animationDuration: '25s' }}
            className="animate-auto-scroll-up flex flex-1 flex-col gap-2 sm:gap-3 md:gap-4 will-change-transform"
          >
            {[1, 2, 3, 4, 1, 2, 3, 4].map((slot, i) =>
              renderSlotCard(slot, DEFAULT_HEIGHTS_COL1[i % DEFAULT_HEIGHTS_COL1.length])
            )}
          </motion.div>

          {/* Column 2 — DOWN */}
          <motion.div
            style={{ y: colY_2, animationDuration: '30s' }}
            className="animate-auto-scroll-down flex flex-1 flex-col gap-2 sm:gap-3 md:gap-4 will-change-transform"
          >
            {[5, 6, 7, 8, 5, 6, 7, 8].map((slot, i) =>
              renderSlotCard(slot, DEFAULT_HEIGHTS_COL2[i % DEFAULT_HEIGHTS_COL2.length])
            )}
          </motion.div>

          {/* Column 3 — UP (Mobile, Tablet, Desktop) */}
          <motion.div
            style={{ y: colY_3, animationDuration: '22s' }}
            className="animate-auto-scroll-up flex flex-1 flex-col gap-2 sm:gap-3 md:gap-4 will-change-transform"
          >
            {[9, 10, 11, 12, 9, 10, 11, 12].map((slot, i) =>
              renderSlotCard(slot, DEFAULT_HEIGHTS_COL3[i % DEFAULT_HEIGHTS_COL3.length])
            )}
          </motion.div>

          {/* Column 4 — DOWN (Tablet & Desktop) */}
          <motion.div
            style={{ y: colY_4, animationDuration: '28s' }}
            className="animate-auto-scroll-down hidden flex-1 flex-col gap-2 sm:gap-3 md:gap-4 will-change-transform sm:flex"
          >
            {[13, 14, 15, 16, 13, 14, 15, 16].map((slot, i) =>
              renderSlotCard(slot, DEFAULT_HEIGHTS_COL4[i % DEFAULT_HEIGHTS_COL4.length])
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
