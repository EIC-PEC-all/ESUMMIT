'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface CardItem {
  id: string
  img: string
  height: number
}

const RAW_COL_1: CardItem[] = [
  {
    id: 'c1-1',
    img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    height: 460,
  },
  {
    id: 'c1-2',
    img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    height: 340,
  },
  {
    id: 'c1-3',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    height: 500,
  },
  {
    id: 'c1-4',
    img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    height: 420,
  },
  {
    id: 'c1-5',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    height: 480,
  },
  {
    id: 'c1-6',
    img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80',
    height: 560,
  },
  {
    id: 'c1-7',
    img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80',
    height: 360,
  },
  {
    id: 'c1-8',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    height: 440,
  },
]

const RAW_COL_2: CardItem[] = [
  {
    id: 'c2-1',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    height: 360,
  },
  {
    id: 'c2-2',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    height: 480,
  },
  {
    id: 'c2-3',
    img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    height: 400,
  },
  {
    id: 'c2-4',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    height: 540,
  },
  {
    id: 'c2-5',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    height: 440,
  },
  {
    id: 'c2-6',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    height: 500,
  },
  {
    id: 'c2-7',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    height: 420,
  },
  {
    id: 'c2-8',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    height: 460,
  },
]

const RAW_COL_3: CardItem[] = [
  {
    id: 'c3-1',
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    height: 540,
  },
  {
    id: 'c3-2',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    height: 400,
  },
  {
    id: 'c3-3',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    height: 460,
  },
  {
    id: 'c3-4',
    img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    height: 500,
  },
  {
    id: 'c3-5',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    height: 360,
  },
  {
    id: 'c3-6',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    height: 520,
  },
  {
    id: 'c3-7',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    height: 440,
  },
  {
    id: 'c3-8',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    height: 480,
  },
]

const RAW_COL_4: CardItem[] = [
  {
    id: 'c4-1',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    height: 420,
  },
  {
    id: 'c4-2',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    height: 540,
  },
  {
    id: 'c4-3',
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    height: 400,
  },
  {
    id: 'c4-4',
    img: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80',
    height: 460,
  },
  {
    id: 'c4-5',
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    height: 580,
  },
  {
    id: 'c4-6',
    img: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80',
    height: 340,
  },
  {
    id: 'c4-7',
    img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    height: 500,
  },
  {
    id: 'c4-8',
    img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    height: 420,
  },
]

// Duplicate columns for continuous auto-scroll loop
const COL_1 = [...RAW_COL_1, ...RAW_COL_1.map((item) => ({ ...item, id: `${item.id}-dup` }))]
const COL_2 = [...RAW_COL_2, ...RAW_COL_2.map((item) => ({ ...item, id: `${item.id}-dup` }))]
const COL_3 = [...RAW_COL_3, ...RAW_COL_3.map((item) => ({ ...item, id: `${item.id}-dup` }))]
const COL_4 = [...RAW_COL_4, ...RAW_COL_4.map((item) => ({ ...item, id: `${item.id}-dup` }))]

export default function MasonryShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll position through section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── 1. Headline Fade Sequence (Enters visible, disappears after scrolling into section) ──
  const headlineOpacity = useTransform(scrollYProgress, [0.02, 0.2], [1, 0])
  const headlineScale = useTransform(scrollYProgress, [0.02, 0.2], [1, 0.82])
  const headlineY = useTransform(scrollYProgress, [0.02, 0.2], ['0px', '-60px'])

  // ── 2. Gallery Fade Sequence (Subtle 0.3 opacity behind title at start, 1.0 full opacity through section end) ──
  const galleryOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0.3, 1, 1])
  const galleryScale = useTransform(scrollYProgress, [0.85, 1], [1, 1])

  // ── 3. Opposing Scroll Parallax Transforms ──
  const colY_1 = useTransform(scrollYProgress, [0.15, 0.85], ['0px', '-400px'])
  const colY_2 = useTransform(scrollYProgress, [0.15, 0.85], ['-400px', '0px'])
  const colY_3 = useTransform(scrollYProgress, [0.15, 0.85], ['-50px', '-450px'])
  const colY_4 = useTransform(scrollYProgress, [0.15, 0.85], ['-350px', '50px'])

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
            style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
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
          className="flex h-full w-full max-w-[1920px] items-center justify-center gap-3 overflow-hidden px-2 sm:gap-4 sm:px-4 md:gap-6 md:px-6"
        >
          {/* Column 1 — Auto Scroll UP + Scroll Parallax UP */}
          <motion.div
            style={{ y: colY_1 }}
            className="animate-auto-scroll-up flex flex-1 flex-col gap-3 will-change-transform sm:gap-4 md:gap-6"
          >
            {COL_1.map((item) => (
              <div
                key={item.id}
                className="hover:border-mint/60 group w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_0_30px_rgba(126,211,33,0.35)]"
                style={{ height: item.height }}
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
              </div>
            ))}
          </motion.div>

          {/* Column 2 — Auto Scroll DOWN + Scroll Parallax DOWN */}
          <motion.div
            style={{ y: colY_2 }}
            className="animate-auto-scroll-down flex flex-1 flex-col gap-3 will-change-transform sm:gap-4 md:gap-6"
          >
            {COL_2.map((item) => (
              <div
                key={item.id}
                className="hover:border-mint/60 group w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_0_30px_rgba(126,211,33,0.35)]"
                style={{ height: item.height }}
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
              </div>
            ))}
          </motion.div>

          {/* Column 3 — Auto Scroll UP + Scroll Parallax UP */}
          <motion.div
            style={{ y: colY_3 }}
            className="animate-auto-scroll-up hidden flex-1 flex-col gap-3 will-change-transform sm:flex sm:gap-4 md:gap-6"
          >
            {COL_3.map((item) => (
              <div
                key={item.id}
                className="hover:border-mint/60 group w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_0_30px_rgba(126,211,33,0.35)]"
                style={{ height: item.height }}
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
              </div>
            ))}
          </motion.div>

          {/* Column 4 — Auto Scroll DOWN + Scroll Parallax DOWN */}
          <motion.div
            style={{ y: colY_4 }}
            className="animate-auto-scroll-down hidden flex-1 flex-col gap-3 will-change-transform sm:gap-4 md:flex md:gap-6"
          >
            {COL_4.map((item) => (
              <div
                key={item.id}
                className="hover:border-mint/60 group w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_0_30px_rgba(126,211,33,0.35)]"
                style={{ height: item.height }}
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.img})` }}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
