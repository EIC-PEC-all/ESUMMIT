'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, ArrowUpRight, TrendingUp, ShieldCheck, Flame, Ticket } from 'lucide-react'

const TOTAL_RAW_FRAMES = 600
const FRAME_STEP = 6 // Sample every 6th frame => 100 fast, lightweight frames
const FRAME_COUNT = Math.floor(TOTAL_RAW_FRAMES / FRAME_STEP)

export default function Vdo2Showcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)

  // Motion values for smooth scroll opacity and scale reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end end'],
  })

  const contentOpacity = useTransform(scrollYProgress, [0, 0.12, 0.95, 1], [0, 1, 1, 0.85])
  const textY = useTransform(scrollYProgress, [0, 0.12], [24, 0])

  // Nearest loaded image fallback so canvas never freezes or flickers
  const getLoadedImage = (targetIndex: number): HTMLImageElement | null => {
    const list = imagesRef.current
    if (!list || list.length === 0) return null

    if (list[targetIndex] && list[targetIndex].complete && list[targetIndex].naturalWidth > 0) {
      return list[targetIndex]
    }

    for (let offset = 1; offset < FRAME_COUNT; offset++) {
      const prev = targetIndex - offset
      const next = targetIndex + offset
      if (prev >= 0 && list[prev] && list[prev].complete && list[prev].naturalWidth > 0) {
        return list[prev]
      }
      if (next < FRAME_COUNT && list[next] && list[next].complete && list[next].naturalWidth > 0) {
        return list[next]
      }
    }
    return null
  }

  // Render target frame on canvas with aspect ratio cover
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = getLoadedImage(index)
    if (!img) return

    const hRatio = canvas.width / img.width
    const vRatio = canvas.height / img.height
    const ratio = Math.max(hRatio, vRatio)

    const centerShift_x = (canvas.width - img.width * ratio) / 2
    const centerShift_y = (canvas.height - img.height * ratio) / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    )
  }

  // Preload sampled 100-frame vdo2 sequence
  useEffect(() => {
    let isMounted = true
    const loadedImages: HTMLImageElement[] = []

    for (let i = 0; i < FRAME_COUNT; i++) {
      const rawFrameNum = Math.min(TOTAL_RAW_FRAMES, i * FRAME_STEP + 1)
      const frameStr = String(rawFrameNum).padStart(4, '0')

      const img = new Image()
      img.src = `/sequence/vdo2/output_${frameStr}.png`

      img.onload = () => {
        if (!isMounted) return
        if (i === 0 || i === currentFrameRef.current) {
          renderFrame(currentFrameRef.current)
        }
      }

      loadedImages.push(img)
    }

    imagesRef.current = loadedImages

    return () => {
      isMounted = false
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        renderFrame(currentFrameRef.current)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Native scroll progress calculation to scrub vdo2 frames smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const startTrigger = windowHeight * 0.85
      const totalDist = rect.height - windowHeight + startTrigger
      if (totalDist <= 0) return

      const scrolledDist = startTrigger - rect.top
      const progress = Math.max(0, Math.min(1, scrolledDist / totalDist))
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT))

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        requestAnimationFrame(() => renderFrame(frameIndex))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative h-[105vh] bg-void text-white overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-mint/20" aria-label="Market Surge Showcase">
      {/* Sticky Full-Viewport Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* 60fps vdo2 Canvas Frame Scrubber */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Radial Dark Scrim for High-Contrast Readability */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(7,11,8,0.5) 0%, rgba(7,11,8,0.88) 100%)' }}
        />

        {/* Content Overlay — Passes Showcase */}
        <motion.div
          style={{ opacity: contentOpacity, y: textY }}
          className="relative z-10 max-w-5xl w-full mx-auto flex flex-col items-center text-center px-4 sm:px-6 py-6"
        >
          {/* Headline */}
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-center text-mint drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-3"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 160px)' }}
          >
            PASSES
          </h2>

          {/* Subtitle */}
          <p className="font-body text-xs sm:text-base text-gray-300 max-w-xl leading-relaxed font-normal mb-6 drop-shadow-md">
            Unlock 2 days of high-octane pitch battles, 24-hr hackathons, keynotes, and 1-on-1 VC deal-making at North India&apos;s flagship summit.
          </p>

          {/* Pass Tier Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl w-full mb-6">
            {/* Student Pass */}
            <Link
              href="/passes"
              className="group relative p-4 rounded-2xl bg-[#07130F]/90 border border-mint/30 backdrop-blur-xl flex flex-col items-center justify-between text-center transition-all hover:border-mint hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              <span className="font-mono-data text-[10px] font-bold text-mint uppercase tracking-widest mb-1">STUDENT DELEGATE</span>
              <span className="font-display text-xl font-black text-white">Student Pass</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-mono-data text-2xl font-bold text-mint">₹299</span>
                <span className="font-mono-data text-xs text-gray-400 line-through">₹499</span>
              </div>
              <span className="font-mono-data text-[10px] text-gray-300 group-hover:text-mint transition-colors flex items-center gap-1 font-bold">
                CLAIM PASS <ArrowUpRight size={12} />
              </span>
            </Link>

            {/* Founder & Pitch Pass */}
            <Link
              href="/passes"
              className="group relative p-4 rounded-2xl bg-[#0D241A]/95 border-2 border-mint backdrop-blur-xl flex flex-col items-center justify-between text-center transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(126,211,33,0.25)]"
            >
              <span className="font-mono-data text-[10px] font-bold text-mint uppercase tracking-widest mb-1 mt-1">FOUNDER &amp; PITCH</span>
              <span className="font-display text-xl font-black text-white">Pitch Pass</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-mono-data text-2xl font-bold text-mint">₹799</span>
                <span className="font-mono-data text-xs text-gray-400 line-through">₹1,299</span>
              </div>
              <span className="font-mono-data text-[10px] text-mint transition-colors flex items-center gap-1 font-bold">
                REGISTER TEAM <ArrowUpRight size={12} />
              </span>
            </Link>

            {/* VIP Pass */}
            <Link
              href="/passes"
              className="group relative p-4 rounded-2xl bg-[#07130F]/90 border border-mint/30 backdrop-blur-xl flex flex-col items-center justify-between text-center transition-all hover:border-mint hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
            >
              <span className="font-mono-data text-[10px] font-bold text-mint uppercase tracking-widest mb-1">VIP &amp; INVESTOR</span>
              <span className="font-display text-xl font-black text-white">VIP Pass</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="font-mono-data text-2xl font-bold text-mint">₹1,499</span>
                <span className="font-mono-data text-xs text-gray-400 line-through">₹2,499</span>
              </div>
              <span className="font-mono-data text-[10px] text-gray-300 group-hover:text-mint transition-colors flex items-center gap-1 font-bold">
                GET VIP ACCESS <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>

          {/* Main CTA Link */}
          <Link
            href="/passes"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 h-12 rounded-full font-mono-data text-xs font-bold uppercase tracking-[0.15em] bg-mint text-void overflow-hidden transition-transform hover:scale-105"
          >
            <Ticket size={16} strokeWidth={2} />
            <span>VIEW ALL PASSES &amp; PERKS</span>
            <ArrowUpRight size={16} strokeWidth={2} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
