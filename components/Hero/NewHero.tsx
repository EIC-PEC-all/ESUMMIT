'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Ticket, Calendar, MapPin, Sparkles, ArrowUpRight, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { FEST_META } from '@/lib/data'

const TOTAL_RAW_FRAMES = 260
const FRAME_STEP = 3 // Sample every 3rd frame => ~86 fast, lightweight frames
const FRAME_COUNT = Math.floor(TOTAL_RAW_FRAMES / FRAME_STEP)

export default function NewHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)

  // Track scroll progress throughout the Hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Initial title fades out smoothly (0% -> 12%)
  const initialOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  // Main hero content fades in at 0.12, STAYS FULLY VISIBLE & PINNED from 0.25 to 0.78, then fades out at 0.95
  const mainContentOpacity = useTransform(scrollYProgress, [0.12, 0.25, 0.78, 0.95], [0, 1, 1, 0])
  const mainContentScale = useTransform(
    scrollYProgress,
    [0.12, 0.25, 0.78, 0.95],
    [0.95, 1, 1, 0.95]
  )

  // Soothing end-of-video blur & blackening overlay when video completes
  const endBlur = useTransform(scrollYProgress, [0.72, 0.96], ['blur(0px)', 'blur(24px)'])
  const endBlackenOpacity = useTransform(scrollYProgress, [0.72, 0.96], [0, 0.95])

  // Initial Expand-on-scroll animation (starts as rounded floating card at 0%, expands to full screen by 14% scroll)
  const expandClip = useTransform(
    scrollYProgress,
    [0, 0.14],
    ['inset(3% 5% 3% 5% round 24px)', 'inset(0% 0% 0% 0% round 0px)']
  )

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

  // Use Framer Motion's scrollYProgress to scrub canvas video frames
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * FRAME_COUNT))

    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex
      requestAnimationFrame(() => renderFrame(frameIndex))
    }
  })

  return (
    <section
      ref={containerRef}
      className="relative h-[150vh] md:h-[210vh] bg-void"
      aria-label="PEC E-Summit Hero"
    >
      {/* Sticky Fullscreen Container — Pins Canvas and Content during entire scroll */}
      <div className="sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />{/* Ambient Dark Scrim Radial Gradient */}
        <div
          className="z-1 pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(7,11,8,0.45) 0%, rgba(7,11,8,0.88) 100%)',
          }}
        />

        {/* Soothing End-of-Video Blur & Blackening Layer */}
        <motion.div
          className="z-2 pointer-events-none absolute inset-0 bg-void"
          style={{
            opacity: endBlackenOpacity,
            filter: endBlur,
            backdropFilter: endBlur,
          }}
        />

        {/* Initial Viewport Hero Banner Overlay */}
        <motion.div
          style={{ opacity: initialOpacity }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
        >
          {/* Subtle central dark burst for text contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,transparent_40%)] sm:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,transparent_50%)]" />

          <h1 
            className="relative font-display font-black leading-none tracking-tighter text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] flex items-baseline justify-center gap-2 sm:gap-4"
            style={{ fontSize: 'clamp(2.5rem, 9.5vw, 8.5rem)' }}
          >
            E-SUMMIT <span className="text-mint">&apos;26</span>
          </h1>

          <p className="relative mt-4 max-w-2xl font-mono-data text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest text-white drop-shadow-[0_2px_15px_rgba(0,0,0,1)]">
            Chandigarh&apos;s Launchpad for Founders
          </p>
        </motion.div>

        {/* Pinned Main Hero Content Overlay — Stays 100% visible & centered throughout middle scroll range (0.25 -> 0.78) */}
        <motion.div
          style={{ opacity: mainContentOpacity, scale: mainContentScale }}
          className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center sm:px-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:gap-6 text-center">
            {/* Cyber Glass Date & Location Badge */}
            <div className="border-mint/40 group mb-1 sm:mb-2 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-full border bg-[#07130F]/90 px-3.5 py-1.5 sm:px-6 sm:py-2 font-mono-data text-[10px] sm:text-xs uppercase tracking-wider backdrop-blur-2xl transition-all hover:border-mint">
              <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-mint">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                </span>
                <Calendar size={13} strokeWidth={2} />
                <span>{FEST_META.dates}</span>
              </div>
              <span className="text-mint/40 hidden font-bold sm:inline">•</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-200">
                <MapPin size={13} strokeWidth={2} className="text-mint" />
                <span>{FEST_META.venue}</span>
              </div>
            </div>

            {/* Main Headline — Compact 2 Lines */}
            <h2 
              className="mb-1 sm:mb-2 max-w-3xl font-display font-black uppercase leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
              style={{ fontSize: 'clamp(1.25rem, 4.2vw, 3.25rem)' }}
            >
              WHERE IDEAS RAISE <span className="text-mint">CAPITAL</span>
              <br />
              &amp; COMPOUND INTO <span className="text-mint">IMPACT</span>
            </h2>

            {/* Subtitle Paragraph */}
            <p className="mb-3 max-w-xl font-body text-xs font-normal leading-relaxed text-gray-300 drop-shadow-md sm:text-sm md:text-base">
              North India&apos;s premier stage for student builders, startup founders, and venture
              thinkers. Join 3,000+ attendees for pitches, keynotes, hackathons, and VC networking.
            </p>

            {/* Action CTAs — Compact Buttons */}
            <div className="mb-1 flex w-full flex-wrap items-center justify-center gap-3">
              <Link
                href="/passes"
                className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-mint px-6 font-mono-data text-xs font-bold uppercase tracking-wider text-void transition-transform hover:scale-105"
              >
                <Ticket size={15} strokeWidth={1.5} />
                <span>GET PASSES</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="opacity-70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </Link>

              <a
                href="#schedule"
                className="bg-panel/90 group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-border-subtle px-6 font-mono-data text-xs font-bold uppercase tracking-wider text-primary shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-mint"
              >
                <Sparkles
                  size={15}
                  strokeWidth={1.5}
                  className="text-mint group-hover:animate-pulse"
                />
                <span>EXPLORE TRACKS</span>
              </a>
            </div>


          </div>
        </motion.div>
      </div>
    </section>
  )
}
