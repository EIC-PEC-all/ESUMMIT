'use client'
// components/Hero/index.tsx
// Full hero section: asymmetric layout, 3D element, countdown, load sequence

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useAnimate, stagger } from 'framer-motion'
import Link from 'next/link'
import { ArrowDown, MapPin, Calendar, Ticket } from 'lucide-react'
import Countdown from './Countdown'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Load 3D scene client-side only (no SSR)
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center opacity-30">
      <div className="w-32 h-32 border border-[#FF4D3D] rounded-full animate-pulse" />
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

  // Track mouse for 3D scene
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

  // Track scroll for 3D scene
  useEffect(() => {
    const handleScroll = () => { scrollYRef.current = window.scrollY }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Orchestrated page-load reveal sequence
  useEffect(() => {
    if (prefersReduced) return
    const seq = async () => {
      await animate('[data-hero-eyebrow]', { opacity: [0, 1], y: [16, 0] }, { duration: 0.5 })
      await animate(
        '[data-hero-word]',
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.6, delay: stagger(0.08) }
      )
      await animate('[data-hero-sub]', { opacity: [0, 1], y: [16, 0] }, { duration: 0.5 })
      await animate('[data-hero-meta]', { opacity: [0, 1], y: [12, 0] }, { duration: 0.4 })
      await animate('[data-hero-cta]', { opacity: [0, 1], y: [12, 0] }, { duration: 0.4, delay: stagger(0.08) })
      setSceneReady(true)
    }
    // Small initial delay to let fonts settle
    const t = setTimeout(seq, 200)
    return () => clearTimeout(t)
  }, [animate, prefersReduced])

  const words = ['PEC', 'SUMMIT']

  return (
    <section
      id="hero"
      ref={scope}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--bg-void)' }}
      aria-label="PEC Summit Hero"
    >
      {/* Background grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(138,144,166,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138,144,166,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial glow behind 3D element */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,77,61,0.07) 0%, rgba(61,217,255,0.04) 40%, transparent 70%)',
          transform: 'translateY(-50%) translateX(20%)',
        }}
      />

      {/* ── Main layout: text left, 3D right ── */}
      <div className="section-container w-full py-32 lg:py-0 lg:min-h-screen flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-0">

        {/* Left: Text content */}
        <div className="flex-1 lg:pr-8 z-10">
          {/* Eyebrow */}
          <div
            data-hero-eyebrow
            className="mb-6 flex items-center gap-3"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            <div
              className="h-px w-8"
              style={{ background: 'var(--accent-ignite)' }}
            />
            <span
              className="font-mono-data text-xs uppercase tracking-[0.25em]"
              style={{ color: 'var(--accent-ignite)' }}
            >
              E-Cell PEC &nbsp;·&nbsp; Chandigarh
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display mb-6 leading-none"
            style={{
              fontSize: 'clamp(72px, 12vw, 160px)',
              letterSpacing: '-0.01em',
            }}
            aria-label="PEC Summit"
          >
            {words.map((word, i) => (
              <span
                key={word}
                data-hero-word
                className="block"
                style={{
                  opacity: prefersReduced ? 1 : 0,
                  color: i === 0 ? 'var(--text-primary)' : 'var(--accent-ignite)',
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <p
            data-hero-sub
            className="text-lg sm:text-xl max-w-md mb-8 leading-relaxed"
            style={{
              color: 'var(--text-muted)',
              opacity: prefersReduced ? 1 : 0,
            }}
          >
            {FEST_META.tagline}
          </p>

          {/* Date + Venue */}
          <div
            data-hero-meta
            className="flex flex-col sm:flex-row gap-4 mb-10"
            style={{ opacity: prefersReduced ? 1 : 0 }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: 'var(--accent-signal)' }} aria-hidden="true" />
              <span className="font-mono-data text-sm" style={{ color: 'var(--text-muted)' }}>
                {FEST_META.dates}
                <span className="ml-2 text-xs opacity-50">{"// TODO: confirm"}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: 'var(--accent-signal)' }} aria-hidden="true" />
              <span className="font-mono-data text-sm" style={{ color: 'var(--text-muted)' }}>
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
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Countdown to Ignition
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
              className="btn-ignite"
              id="hero-passes-btn"
              aria-label="Get Passes for E-Summit"
            >
              <Ticket size={16} aria-hidden="true" />
              Get Passes
            </Link>
            <a
              href="#register"
              className="btn-ghost"
              id="hero-register-btn"
              aria-label="Register for E-Summit"
            >
              Register Now
            </a>
            <a
              href="#tracks"
              className="btn-ghost"
              id="hero-explore-btn"
              aria-label="Explore E-Summit tracks"
            >
              Explore Tracks
            </a>
          </div>
        </div>

        {/* Right: 3D Scene */}
        <div className="flex-1 relative flex items-center justify-center lg:justify-end">
          <motion.div
            className="relative w-full max-w-xl"
            style={{ height: isMobile ? '280px' : '560px' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={sceneReady || prefersReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {!isMobile ? (
              <HeroScene mouse={mouseRef} scrollY={scrollYRef} />
            ) : (
              /* Mobile fallback: CSS animated rings */
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border"
                      style={{
                        borderColor: i === 0 ? 'rgba(255,77,61,0.4)' : i === 1 ? 'rgba(61,217,255,0.25)' : 'rgba(245,243,238,0.1)',
                        transform: `scale(${1 + i * 0.35})`,
                        animation: `pulse ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
                      }}
                    />
                  ))}
                  <div
                    className="absolute inset-0 flex items-center justify-center font-display text-5xl"
                    style={{ color: 'var(--accent-ignite)' }}
                  >
                    ∆
                  </div>
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
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5, duration: 1 }}
        aria-hidden="true"
      >
        <span className="font-mono-data text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Scroll
        </span>
        <motion.div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, var(--accent-ignite), transparent)' }}
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
