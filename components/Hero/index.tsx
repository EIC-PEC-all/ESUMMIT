'use client'
// components/Hero/index.tsx
// High-Voltage Hero: Current-Line Trace-In + Split-Text Headline Reveal + 3D Materializing Last

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useAnimate, stagger } from 'framer-motion'
import { MapPin, Calendar, Ticket, Zap } from 'lucide-react'
import Countdown from './Countdown'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Link from 'next/link'

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center opacity-30">
      <div className="w-32 h-32 border border-[#F5D400] rounded-full animate-pulse" />
    </div>
  ),
})

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const [scope, animate] = useAnimate()
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollYRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    const handleScroll = () => { scrollYRef.current = window.scrollY }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Precise Choreographed Opening Sequence: Eyebrow -> Split-Text Headline -> Meta & Countdown -> 3D Materializes LAST
  useEffect(() => {
    if (prefersReduced) {
      setSceneReady(true)
      return
    }

    const runOpeningSequence = async () => {
      // 1. Current-line trace
      await animate('[data-hero-line]', { width: ['0%', '100%'] }, { duration: 0.8, ease: 'easeOut' })
      
      // 2. Eyebrow
      await animate('[data-hero-eyebrow]', { opacity: [0, 1], y: [16, 0] }, { duration: 0.4 })
      
      // 3. Split-text headline words
      await animate(
        '[data-hero-split-text]',
        { opacity: [0, 1], y: [48, 0], filter: ['blur(8px)', 'blur(0px)'] },
        { duration: 0.7, delay: stagger(0.12), ease: [0.16, 1, 0.3, 1] }
      )
      
      // 4. Subtitle & Metadata
      await animate('[data-hero-sub]', { opacity: [0, 1], y: [16, 0] }, { duration: 0.4 })
      await animate('[data-hero-meta]', { opacity: [0, 1], y: [12, 0] }, { duration: 0.4 })
      await animate('[data-hero-cta]', { opacity: [0, 1], y: [12, 0] }, { duration: 0.4, delay: stagger(0.08) })
      
      // 5. 3D Materializing LAST with electric scale-in
      setTimeout(() => {
        setSceneReady(true)
      }, 200)
    }

    const t = setTimeout(runOpeningSequence, 300)
    return () => clearTimeout(t)
  }, [animate, prefersReduced])

  return (
    <section
      id="hero"
      ref={scope}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--bg-void)' }}
      aria-label="PEC Summit Hero"
    >
      {/* 1. Animated Current Line Top Border (Trace-In) */}
      <motion.div
        data-hero-line
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5D400] to-transparent shadow-[0_0_12px_#F5D400] pointer-events-none z-20"
        style={{ width: prefersReduced ? '100%' : '0%' }}
      />

      {/* Radial Voltage Glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(245,212,0,0.15) 0%, transparent 70%)',
          transform: 'translateY(-50%) translateX(20%)',
        }}
      />

      <div className="section-container w-full py-32 lg:py-0 lg:min-h-screen flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-0">

        {/* Left: Text content */}
        <div className="flex-1 lg:pr-8 z-10">
          {/* Eyebrow */}
          <div
            data-hero-eyebrow
            className="mb-6 flex items-center gap-3"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            <Zap size={14} className="text-volt" />
            <span
              className="font-mono-data text-xs uppercase tracking-[0.25em]"
              style={{ color: 'var(--accent-volt)' }}
            >
              E-Cell PEC &nbsp;·&nbsp; Chandigarh
            </span>
          </div>

          {/* 2. Split-Text Headline Reveal */}
          <h1
            className="font-display mb-6 leading-none"
            style={{
              fontSize: 'clamp(72px, 12vw, 160px)',
              letterSpacing: '-0.01em',
            }}
            aria-label="PEC Summit"
          >
            <span
              data-hero-split-text
              className="block text-primary"
              style={{ opacity: prefersReduced ? 1 : 0 }}
            >
              PEC
            </span>
            <span
              data-hero-split-text
              className="block text-stroke-volt"
              style={{ opacity: prefersReduced ? 1 : 0 }}
            >
              SUMMIT
            </span>
          </h1>

          {/* Tagline */}
          <p
            data-hero-sub
            className="text-lg sm:text-xl max-w-md mb-8 leading-relaxed text-muted"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            North India&apos;s boldest high-voltage platform for student founders and campus innovators.
          </p>

          {/* Date + Venue */}
          <div
            data-hero-meta
            className="flex flex-col sm:flex-row gap-4 mb-10"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-volt" />
              <span className="font-mono-data text-sm text-muted">
                {FEST_META.dates}
                <span className="ml-2 text-xs opacity-50">{"// TODO: confirm"}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-volt" />
              <span className="font-mono-data text-sm text-muted">
                {FEST_META.venue}
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div
            data-hero-cta
            className="mb-10"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3 text-volt font-bold">
              ⚡ Countdown to Ignition
            </p>
            <Countdown targetISO={FEST_META.countdownTarget} />
          </div>

          {/* CTAs */}
          <div
            data-hero-cta
            className="flex flex-wrap gap-4"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            <Link
              href="/passes"
              className="btn-volt"
              id="hero-passes-btn"
            >
              <Ticket size={16} />
              Get Summit Passes
            </Link>
            <a
              href="#tracks"
              className="btn-ghost"
              id="hero-explore-btn"
            >
              Explore Tracks
            </a>
          </div>
        </div>

        {/* Right: 3. 3D Scene Materializing LAST */}
        <div className="flex-1 relative flex items-center justify-center lg:justify-end">
          <motion.div
            className="relative w-full max-w-xl"
            style={{ height: isMobile ? '280px' : '560px' }}
            initial={{ opacity: 0, scale: 0.75, filter: 'blur(12px)' }}
            animate={sceneReady || prefersReduced ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.75, filter: 'blur(12px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {!isMobile ? (
              <HeroScene mouse={mouseRef} scrollY={scrollYRef} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full border border-volt/40 flex items-center justify-center font-display text-5xl text-volt">
                  ⚡
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="font-mono-data text-[10px] uppercase tracking-widest text-volt">
          Scroll
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-volt to-transparent"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
