'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, Sparkles, ArrowUpRight, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Countdown from './Countdown'
import { FEST_META } from '@/lib/data'

const TOTAL_RAW_FRAMES = 600
const FRAME_STEP = 6 // Sample every 6th frame => 100 fast, lightweight frames
const FRAME_COUNT = Math.floor(TOTAL_RAW_FRAMES / FRAME_STEP)

export default function NewHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)

  // Track scroll progress throughout the 320vh Hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Clean sequential opacity transitions so content NEVER overlaps
  const initialOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const mainContentOpacity = useTransform(scrollYProgress, [0.18, 0.38], [0, 1])

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

  // Draw current frame on HTML5 canvas with cover scaling
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

  // Preload sampled 100-frame sequence into memory
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

  // Native scroll progress calculation to scrub canvas video frames
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
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
    <section ref={containerRef} className="relative h-[145vh] bg-void" aria-label="PEC E-Summit Hero">
      
      {/* Fixed Sticky Background Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        
        {/* 60fps 3D Rupee Video Canvas Frame Scrubber */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Dark Scrim Radial Gradient */}
        <div
          className="absolute inset-0 z-1 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(7,11,8,0.45) 0%, rgba(7,11,8,0.88) 100%)' }}
        />

        {/* Initial Viewport Hero Banner Overlay */}
        <motion.div
          style={{ opacity: initialOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        >
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            E-SUMMIT <span className="text-mint italic">&apos;26</span>
          </h1>

          <p className="font-mono-data text-xs sm:text-base text-gray-200 mt-4 tracking-widest uppercase max-w-md font-semibold drop-shadow-md">
            Chandigarh&apos;s Launchpad for Founders
          </p>

          <div className="flex flex-col items-center gap-1.5 text-mint mt-10 animate-pulse">
            <span className="font-mono-data text-[11px] uppercase tracking-widest font-bold">
              Scroll to Explore &amp; Scrub Experience
            </span>
            <ChevronDown size={20} />
          </div>
        </motion.div>
      </div>

      {/* Content Scrolling Overlay (Scrolls ON TOP of Fixed Background Canvas with Tight Spacing) */}
      <div className="relative z-10 -mt-[90vh] pt-[35vh] pb-12 px-4 sm:px-6">
        
        {/* Main Expanded Hero Content */}
        <motion.div
          style={{ opacity: mainContentOpacity }}
          className="max-w-5xl mx-auto flex flex-col items-center text-center gap-16"
        >
          {/* Main Headline & Metadata Group */}
          <div className="flex flex-col items-center text-center max-w-4xl">
            {/* Metadata Info */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm font-mono-data font-semibold text-gray-300 mb-6 uppercase tracking-widest drop-shadow-md">
              <div className="flex items-center gap-2 text-mint font-bold">
                <Calendar size={15} strokeWidth={1.5} />
                <span>{FEST_META.dates}</span>
              </div>
              <span className="text-secondary hidden sm:inline">•</span>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={15} strokeWidth={1.5} className="text-mint" />
                <span>{FEST_META.venue}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-6">
              WHERE IDEAS RAISE <span className="text-mint">CAPITAL</span><br />
              &amp; COMPOUND INTO <span className="text-mint">IMPACT</span>
            </h2>

            {/* Subtitle Paragraph */}
            <p className="font-body text-base sm:text-xl text-gray-200 max-w-2xl leading-relaxed font-medium mb-10 drop-shadow-md">
              North India&apos;s premier stage for student builders, startup founders, and venture thinkers. Join 3,000+ attendees for pitches, keynotes, hackathons, and VC networking.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full">
              <Link
                href="/passes"
                className="group relative inline-flex items-center justify-center gap-3 px-8 h-14 rounded-full font-mono-data text-sm font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black overflow-hidden transition-transform hover:scale-105 shadow-[0_0_25px_rgba(251,191,36,0.4)]"
              >
                <Ticket size={18} strokeWidth={1.5} className="text-black" />
                <span>GET PASSES</span>
                <ArrowUpRight size={18} strokeWidth={1.5} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-black" />
              </Link>

              <a
                href="#schedule"
                className="group relative inline-flex items-center justify-center gap-3 px-8 h-14 rounded-full font-mono-data text-sm font-bold uppercase tracking-[0.15em] bg-[#0B150E]/80 text-white border border-mint/40 backdrop-blur-md overflow-hidden transition-all hover:border-mint hover:scale-105 shadow-lg"
              >
                <Sparkles size={18} strokeWidth={1.5} className="text-mint group-hover:animate-pulse" />
                <span>EXPLORE TRACKS</span>
              </a>
            </div>
          </div>

          {/* Pure Minimalist Countdown Timer (Zero text headers, completely clean digit blocks) */}
          <div className="w-full flex justify-center pt-6 pb-4">
            <Countdown targetISO={FEST_META.countdownTarget} hideHeader={true} />
          </div>

        </motion.div>

      </div>
    </section>
  )
}
