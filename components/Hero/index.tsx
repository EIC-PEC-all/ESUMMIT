'use client'
// components/Hero/index.tsx
// Money/Finance Visual Theme Hero for PEC E-Summit
// GSAP Parallax dollar bills, Mouse tilt, Idle sway, Circuit board pulses, Real live Countdown

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { Calendar, MapPin, Ticket, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import Countdown from './Countdown'
import CircuitBoard from './CircuitBoard'
import DollarBill from './DollarBill'
import MoneyParticles from './MoneyParticles'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)

  // References for GSAP target elements
  const mainBillRef = useRef<HTMLDivElement>(null)
  const bgBill1Ref = useRef<HTMLDivElement>(null)
  const bgBill2Ref = useRef<HTMLDivElement>(null)
  const bgBill3Ref = useRef<HTMLDivElement>(null)

  // Floating pill reference
  const pillRef = useRef<HTMLDivElement>(null)

  const [strokeDrawn, setStrokeDrawn] = useState(false)

  // GSAP Animations & Interactions Setup
  useEffect(() => {
    let ctx: any = null

    const initGSAP = async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          // Trigger stroke draw-on completion indicator
          setStrokeDrawn(true)

          if (prefersReduced) return

          // 1. Idle Sway Animation on Main Dollar Bill
          gsap.to(mainBillRef.current, {
            rotate: '+=2.5',
            y: '+=8',
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

          // Idle drift on floating pill
          gsap.to(pillRef.current, {
            y: '-=10',
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

          // Idle drift on background bills
          gsap.to(bgBill1Ref.current, {
            rotate: '-=3',
            y: '-=12',
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
          gsap.to(bgBill2Ref.current, {
            rotate: '+=4',
            y: '+=15',
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

          // 2. Mouse Reactive Tilt on Main Hero Dollar Bill
          const xTo = gsap.quickTo(mainBillRef.current, 'rotateY', { duration: 0.5, ease: 'power2.out' })
          const yTo = gsap.quickTo(mainBillRef.current, 'rotateX', { duration: 0.5, ease: 'power2.out' })

          const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return
            const rect = sectionRef.current.getBoundingClientRect()
            const relativeX = (e.clientX - rect.left) / rect.width - 0.5
            const relativeY = (e.clientY - rect.top) / rect.height - 0.5

            // Tilt within a small degree range
            xTo(relativeX * 16)
            yTo(-relativeY * 16)
          }

          const currentSection = sectionRef.current
          if (currentSection) {
            currentSection.addEventListener('mousemove', handleMouseMove)
          }

          // 3. Multi-Layer Scroll Parallax with GSAP ScrollTrigger
          if (sectionRef.current) {
            // Main hero dollar bill scroll exit (moves right + down + fades out)
            gsap.to(mainBillRef.current, {
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
              },
              xPercent: 35,
              yPercent: 20,
              opacity: 0.1,
              ease: 'none',
            })

            // Layer 1 (Closest/Fastest foreground depth)
            gsap.to(bgBill1Ref.current, {
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.4,
              },
              yPercent: -45,
              xPercent: -15,
              opacity: 0,
              ease: 'none',
            })

            // Layer 2 (Medium depth)
            gsap.to(bgBill2Ref.current, {
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8,
              },
              yPercent: 40,
              xPercent: 20,
              opacity: 0,
              ease: 'none',
            })

            // Layer 3 (Far background depth)
            gsap.to(bgBill3Ref.current, {
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
              },
              yPercent: -20,
              opacity: 0,
              ease: 'none',
            })

            // Text Content parallax subtle lift
            gsap.to(heroContentRef.current, {
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.3,
              },
              yPercent: -12,
              opacity: 0.6,
              ease: 'none',
            })
          }

          return () => {
            if (currentSection) {
              currentSection.removeEventListener('mousemove', handleMouseMove)
            }
          }
        }, sectionRef)
      } catch (err) {
        console.warn('GSAP initialization in Hero:', err)
      }
    }

    initGSAP()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [prefersReduced])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070B08] pt-24 pb-16 lg:py-0"
      aria-label="PEC E-Summit Hero"
      style={{ perspective: '1000px' }}
    >
      {/* 1. Circuit Board Vector Pattern Overlay + Pulse Animations */}
      <CircuitBoard prefersReduced={prefersReduced} />

      {/* 2. Floating Ambient Money Particles */}
      <MoneyParticles prefersReduced={prefersReduced} />

      {/* 3. Deep Green Radial Glow emanating behind dollar bill area */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] lg:w-[900px] h-[700px] lg:h-[900px] rounded-full pointer-events-none opacity-40 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(126, 211, 33, 0.22) 0%, rgba(126, 211, 33, 0.05) 45%, transparent 70%)',
          transform: 'translateY(-50%) translateX(25%)',
        }}
      />

      {/* Dark gradient scrim behind left column for high text contrast */}
      <div
        className="absolute left-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none z-1"
        style={{
          background: 'linear-gradient(90deg, rgba(7,11,8,0.95) 0%, rgba(7,11,8,0.8) 60%, transparent 100%)',
        }}
      />

      {/* Background Dollar Bill Parallax Layer 2 (Top Left, smaller, low opacity) */}
      <div
        ref={bgBill2Ref}
        className="absolute left-[-60px] top-[15%] pointer-events-none z-1 hidden md:block opacity-35 blur-[1px]"
        style={{ transform: 'rotate(-18deg)' }}
      >
        <DollarBill variant="background" />
      </div>

      {/* Background Dollar Bill Parallax Layer 3 (Bottom Right, subtle) */}
      <div
        ref={bgBill3Ref}
        className="absolute right-[5%] bottom-[10%] pointer-events-none z-1 hidden md:block opacity-25 blur-[2px]"
        style={{ transform: 'rotate(24deg)' }}
      >
        <DollarBill variant="background" />
      </div>

      {/* Main Container */}
      <div className="section-container relative w-full z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 min-h-[calc(100vh-80px)]">

        {/* Left Column: Hero Content */}
        <div ref={heroContentRef} className="flex-1 max-w-2xl lg:max-w-xl xl:max-w-2xl z-10 pt-4">

          {/* Headline */}
          <h1 className="font-display leading-[0.88] mb-6 tracking-tight select-none">
            {/* Line 1: PEC (Solid White Fill, Heavy Weight) */}
            <motion.span
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block font-black text-white"
              style={{ fontSize: 'clamp(72px, 12vw, 150px)' }}
            >
              PEC
            </motion.span>

            {/* Line 2: SUMMIT (Outlined stroke-only text in neon green, subtle glow, stroke draw-on) */}
            <motion.span
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="block font-black text-stroke-green relative"
              style={{
                fontSize: 'clamp(80px, 13.5vw, 168px)',
                textShadow: '0 0 35px rgba(126, 211, 33, 0.5), 0 0 70px rgba(126, 211, 33, 0.2)',
              }}
            >
              SUMMIT
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-lg sm:text-xl text-[#F5F5F0] mb-7 leading-relaxed max-w-lg font-normal"
          >
            Where ideas raise capital &amp; compound into impact.
          </motion.p>

          {/* Info row with icons */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-5 sm:gap-8 mb-9 text-sm text-[#8A9488]"
          >
            <div className="flex items-center gap-2 bg-[#0D140E]/80 border border-[#7ED321]/20 px-3.5 py-1.5 rounded-full">
              <Calendar size={16} className="text-[#7ED321]" />
              <span className="font-mono-data font-semibold text-gray-200">
                {FEST_META.dates}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#0D140E]/80 border border-[#7ED321]/20 px-3.5 py-1.5 rounded-full">
              <MapPin size={16} className="text-[#7ED321]" />
              <span className="font-mono-data font-semibold text-gray-200">
                {FEST_META.venue}
              </span>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-10"
          >
            <Countdown targetISO={FEST_META.countdownTarget} prefersReduced={prefersReduced} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Filled green button */}
            <Link
              href="/passes"
              className="btn-green text-sm sm:text-base font-bold py-3.5 px-7 rounded-xl flex items-center gap-2 shadow-[0_0_25px_rgba(126,211,33,0.4)]"
              id="hero-passes-btn"
            >
              <Ticket size={18} />
              <span>🎫 GET SUMMIT PASSES</span>
            </Link>

            {/* Outlined button */}
            <a
              href="#tracks"
              className="btn-ghost text-sm sm:text-base py-3.5 px-7 rounded-xl flex items-center gap-2 border border-white/30 text-white hover:border-[#7ED321] hover:text-[#7ED321] transition-all"
              id="hero-explore-btn"
            >
              <span>EXPLORE TRACKS</span>
              <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Dominant Hero Dollar Bill & Interactive Art */}
        <div className="flex-1 w-full relative flex items-center justify-center lg:justify-end py-8 lg:py-0 min-h-[380px] sm:min-h-[460px]">

          {/* Background Dollar Bill Parallax Layer 1 (Scattered deeper behind main bill) */}
          <div
            ref={bgBill1Ref}
            className="absolute right-[10%] top-[5%] pointer-events-none z-1 opacity-45 blur-[0.5px]"
            style={{ transform: 'rotate(-14deg) scale(0.85)' }}
          >
            <DollarBill variant="background" />
          </div>

          {/* Main Hero Dollar Bill (Angled ~18°, dominant visual anchor, mouse tilt, idle sway) */}
          <motion.div
            ref={mainBillRef}
            initial={prefersReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, rotate: 18 }}
            animate={{ opacity: 1, scale: 1, rotate: 18 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[660px] translate-x-4 lg:translate-x-12 transform-preserve-3d"
          >
            {/* Main Dollar Bill SVG */}
            <DollarBill variant="main" />

            {/* Floating pill badge "🔖 My Plan 🟢" near top-right of hero art */}
            <div
              ref={pillRef}
              className="absolute -top-6 right-8 sm:right-16 z-20 bg-[#0D140E]/95 border border-[#7ED321]/50 shadow-[0_8px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(126,211,33,0.3)] rounded-full px-4 py-2 flex items-center gap-2 text-xs font-mono-data text-white font-bold backdrop-blur-md"
            >
              <span>🔖 My Plan</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] -ml-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
