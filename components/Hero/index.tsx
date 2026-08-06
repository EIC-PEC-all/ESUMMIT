'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import Countdown from './Countdown'
import CircuitBoard from './CircuitBoard'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const TOTAL_RAW_FRAMES = 600
const FRAME_STEP = 6 // Sample every 6th frame => 100 fast, lightweight frames
const FRAME_COUNT = Math.floor(TOTAL_RAW_FRAMES / FRAME_STEP)

const TICKER_ITEMS = [
  { sym: 'PEC', val: '₹7,50,000', change: '+12.4%', up: true },
  { sym: 'INNOV', val: '₹5,00,000', change: '+8.7%', up: true },
  { sym: 'HACK', val: '₹3,00,000', change: '+24.2%', up: true },
  { sym: 'PITCH', val: '3,000+', change: 'DELEGATES', up: true },
  { sym: 'IDEA', val: '50+', change: 'SPEAKERS', up: true },
  { sym: 'VC', val: '₹15L', change: 'PRIZE POOL', up: true },
  { sym: 'SUMMIT', val: '2 DAYS', change: 'OF ALPHA', up: true },
  { sym: 'BETA', val: '100+', change: 'STARTUPS', up: true },
  { sym: 'NET', val: 'MARCH 15-16', change: '2026', up: true },
  { sym: 'ROI', val: '∞', change: '+CONNECTIONS', up: true },
]

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)

  // Get nearest loaded image so canvas never freezes during load
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

  // Draw target frame on HTML5 canvas
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

  // Fast sampled preloader (100 frames total)
  useEffect(() => {
    let isMounted = true
    const loadedImages: HTMLImageElement[] = []

    for (let i = 0; i < FRAME_COUNT; i++) {
      const rawFrameNum = Math.min(TOTAL_RAW_FRAMES, i * FRAME_STEP + 1)
      const frameStr = String(rawFrameNum).padStart(4, '0')

      const img = new Image()
      img.src = `/sequence/vdo1/output_${frameStr}.png`

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

  // Window resize handler
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

  // Native scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const totalScrollable = rect.height - window.innerHeight
      if (totalScrollable <= 0) return

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable))
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
    <section ref={sectionRef} className="relative h-[300vh] bg-[#070B08]" aria-label="PEC E-Summit Hero">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Canvas Background Video Scrubber (vdo1 100-frame fast sampled sequence) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Dark Scrim Overlay */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(7,11,8,0.45) 0%, rgba(7,11,8,0.85) 100%)' }}
        />

        {/* Circuit Board Decor */}
        <CircuitBoard prefersReduced={prefersReduced} />

        {/* MAIN HERO CONTENT */}
        <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 flex-1 pb-8 sm:pb-12 mt-20 sm:mt-24">
          <div className="flex-1 max-w-2xl z-10 pt-2 sm:pt-4 w-full">

            {/* Headline */}
            <h1 className="font-display leading-[0.88] mb-4 sm:mb-6 tracking-tight select-none">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="block font-black text-white drop-shadow-2xl"
                style={{ fontSize: 'clamp(52px, 13.5vw, 158px)' }}
              >
                PEC
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="block font-black relative"
                style={{
                  fontSize: 'clamp(58px, 15vw, 172px)',
                  WebkitTextStroke: '2.5px var(--accent-mint)',
                  color: 'transparent',
                  textShadow: '0 0 35px rgba(126,211,33,0.5)',
                }}
              >
                SUMMIT
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="font-body text-base sm:text-xl text-gray-200 mb-5 sm:mb-7 leading-relaxed max-w-lg font-medium drop-shadow-md"
            >
              Where ideas raise capital &amp; compound into impact.
            </motion.p>

            {/* Info pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-2 bg-panel/90 border border-[var(--accent-mint)]/25 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <Calendar size={14} className="text-[var(--accent-mint)]" />
                <span className="font-mono-data text-xs sm:text-sm font-semibold text-gray-200">{FEST_META.dates}</span>
              </div>
              <div className="flex items-center gap-2 bg-panel/90 border border-[var(--accent-mint)]/25 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <MapPin size={14} className="text-[var(--accent-mint)]" />
                <span className="font-mono-data text-xs sm:text-sm font-semibold text-gray-200">{FEST_META.venue}</span>
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.46 }}
              className="mb-8 sm:mb-10 w-full"
            >
              <Countdown targetISO={FEST_META.countdownTarget} prefersReduced={prefersReduced} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.56 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full"
            >
              <Link
                href="/passes"
                id="hero-passes-btn"
                className="btn-green text-sm sm:text-base font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(126,211,33,0.4)] text-void"
              >
                <Ticket size={18} />
                <span>🎫 GET SUMMIT PASSES</span>
              </Link>

              <a
                href="#tracks"
                id="hero-explore-btn"
                className="btn-ghost text-sm sm:text-base py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 border-border-subtle text-primary hover:border-mint hover:text-mint transition-all backdrop-blur-md"
              >
                <span>EXPLORE TRACKS</span>
                <ChevronRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM: Stock Ticker Tape */}
        <div className="relative z-10 border-t border-[var(--accent-mint)]/25 bg-[#060A07]/90 backdrop-blur-md overflow-hidden">
          <div className="py-2.5 flex items-center gap-0 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #060A07 0%, transparent 100%)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #060A07 0%, transparent 100%)' }} />

            <div className="flex items-center gap-0 whitespace-nowrap animate-marquee">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 sm:px-6 border-r border-[var(--accent-mint)]/15">
                  <span className="font-mono-data text-xs font-bold text-[var(--accent-mint)]">{item.sym}</span>
                  <span className="font-mono-data text-xs text-white font-semibold">{item.val}</span>
                  <span className={`font-mono-data text-[10px] font-bold flex items-center gap-0.5 ${item.up ? 'text-[var(--accent-mint)]' : 'text-red-400'}`}>
                    {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
