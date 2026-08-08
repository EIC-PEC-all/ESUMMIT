'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Masonry, { MasonryItem } from '@/components/Masonry'

const MASONRY_ITEMS: MasonryItem[] = [
  { id: '1', img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', url: '#', height: 580 },
  { id: '2', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', url: '#', height: 420 },
  { id: '3', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', url: '#', height: 720 },
  { id: '4', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80', url: '#', height: 460 },
  { id: '5', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', url: '#', height: 540 },
  { id: '6', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', url: '#', height: 390 },
  { id: '7', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', url: '#', height: 680 },
  { id: '8', img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80', url: '#', height: 360 },
  { id: '9', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', url: '#', height: 500 },
  { id: '10', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', url: '#', height: 620 },
  { id: '11', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', url: '#', height: 450 },
  { id: '12', img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', url: '#', height: 580 },
  { id: '13', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', url: '#', height: 480 },
  { id: '14', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', url: '#', height: 640 },
  { id: '15', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', url: '#', height: 400 },
  { id: '16', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', url: '#', height: 560 },
  { id: '17', img: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=80', url: '#', height: 700 },
  { id: '18', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', url: '#', height: 430 },
  { id: '19', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', url: '#', height: 520 },
  { id: '20', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', url: '#', height: 600 },
  { id: '21', img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80', url: '#', height: 380 },
  { id: '22', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', url: '#', height: 660 },
  { id: '23', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', url: '#', height: 490 },
  { id: '24', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80', url: '#', height: 570 },
  { id: '25', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', url: '#', height: 410 },
  { id: '26', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', url: '#', height: 630 },
  { id: '27', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', url: '#', height: 510 },
  { id: '28', img: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80', url: '#', height: 470 },
  { id: '29', img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80', url: '#', height: 690 },
  { id: '30', img: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80', url: '#', height: 350 },
  { id: '31', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', url: '#', height: 590 },
  { id: '32', img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80', url: '#', height: 440 },
  { id: '33', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', url: '#', height: 610 },
  { id: '34', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', url: '#', height: 480 },
  { id: '35', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80', url: '#', height: 530 },
  { id: '36', img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80', url: '#', height: 670 },
]

export default function MasonryShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll position through 250vh section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Headline fades out quickly on scroll entry (0% -> 12%)
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const headlineScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.82])
  const headlineY = useTransform(scrollYProgress, [0, 0.12], ['0px', '-50px'])

  // Masonry grid moves with smooth scroll-driven parallax across 36 images
  const masonryY = useTransform(scrollYProgress, [0, 1], ['5%', '-55%'])
  const masonryOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.3, 1, 1, 0.2])

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-void border-b border-border-subtle"
    >
      {/* Pinned Full-Screen Sticky Viewport Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-void flex items-center justify-center">
        {/* Intro Headline — Fades away on scroll */}
        <motion.div
          style={{
            opacity: headlineOpacity,
            scale: headlineScale,
            y: headlineY,
          }}
          className="absolute z-20 text-center pointer-events-none px-4"
        >
          <span className="font-mono-data text-xs uppercase tracking-[0.35em] text-mint font-bold block mb-2">
            PEC E-SUMMIT 2026
          </span>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
            SUMMIT GALLERY
          </h2>
        </motion.div>

        {/* Pure Full-Screen Edge-to-Edge Parallax Masonry (36+ Images) */}
        <motion.div
          style={{
            y: masonryY,
            opacity: masonryOpacity,
          }}
          className="w-full max-w-[1920px] px-2 sm:px-4 md:px-6 h-full flex items-center"
        >
          <Masonry
            items={MASONRY_ITEMS}
            ease="power3.out"
            duration={0.7}
            stagger={0.04}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.96}
            blurToFocus={true}
            colorShiftOnHover={true}
          />
        </motion.div>
      </div>
    </section>
  )
}
