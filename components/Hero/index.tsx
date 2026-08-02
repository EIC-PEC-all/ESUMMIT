'use client'
// components/Hero/index.tsx
// High-Performance Money/Finance Hero — 3D Wavy Ribbon Dollar Bill, Canvas Money Rain,
// GSAP Parallax, Stock Ticker Tape, Live Countdown

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import Countdown from './Countdown'
import CircuitBoard from './CircuitBoard'
import MoneyCanvas from './MoneyCanvas'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Dynamically import 3D Wavy Ribbon Mesh to prevent SSR window issues
const WavyDollarBill3D = dynamic(() => import('./WavyDollarBill3D'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px]" />,
})

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
  const heroContentRef = useRef<HTMLDivElement>(null)
  const mainBillRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any = null

    const initGSAP = async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          if (prefersReduced) return

          // Floating pill bob
          gsap.to(pillRef.current, {
            y: '-=8',
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

          // Ticker scroll animation
          if (tickerRef.current) {
            const tickerWidth = tickerRef.current.scrollWidth / 2
            gsap.to(tickerRef.current, {
              x: -tickerWidth,
              duration: 36,
              repeat: -1,
              ease: 'none',
            })
          }

          // Scroll parallax
          if (sectionRef.current) {
            gsap.to(mainBillRef.current, {
              scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
              xPercent: 15,
              yPercent: 15,
              opacity: 0,
              ease: 'none',
            })
          }
        }, sectionRef)
      } catch (err) {
        console.warn('GSAP Hero init:', err)
      }
    }

    initGSAP()
    return () => { if (ctx) ctx.revert() }
  }, [prefersReduced])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#070B08] pt-20"
      aria-label="PEC E-Summit Hero"
    >
      {/* Layer 0: Canvas money rain */}
      <MoneyCanvas prefersReduced={prefersReduced} />

      {/* Layer 1: Circuit board overlay */}
      <CircuitBoard prefersReduced={prefersReduced} />

      {/* Layer 2: Deep radial glow */}
      <div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full pointer-events-none z-0 opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(126,211,33,0.22) 0%, rgba(126,211,33,0.05) 50%, transparent 70%)',
        }}
      />

      {/* Layer 3: Left scrim */}
      <div
        className="absolute left-0 top-0 bottom-0 w-full lg:w-[60%] pointer-events-none z-1"
        style={{ background: 'linear-gradient(90deg, rgba(7,11,8,0.98) 0%, rgba(7,11,8,0.85) 65%, transparent 100%)' }}
      />

      {/* MAIN CONTENT */}
      <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 flex-1 pb-12 mt-4">

        {/* LEFT: Hero Content */}
        <div ref={heroContentRef} className="flex-1 max-w-2xl z-10 pt-4">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7ED321]/15 border border-[#7ED321]/40 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-ping" />
            <span className="font-mono-data text-xs uppercase tracking-widest text-[#7ED321] font-bold">
              LIVE REGISTRATION OPEN
            </span>
            <ArrowUpRight size={14} className="text-[#7ED321]" />
          </motion.div>

          {/* Headline */}
          <h1 className="font-display leading-[0.88] mb-6 tracking-tight select-none">
            <motion.span
              initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block font-black text-white"
              style={{ fontSize: 'clamp(74px, 12.5vw, 158px)' }}
            >
              PEC
            </motion.span>

            <motion.span
              initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="block font-black relative"
              style={{
                fontSize: 'clamp(82px, 14vw, 172px)',
                WebkitTextStroke: '3px #7ED321',
                color: 'transparent',
                textShadow: '0 0 35px rgba(126,211,33,0.5)',
              }}
            >
              SUMMIT
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="font-body text-lg sm:text-xl text-[#F5F5F0]/90 mb-7 leading-relaxed max-w-lg"
          >
            Where ideas raise capital &amp; compound into impact.
          </motion.p>

          {/* Info pills */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 bg-[#0D140E]/90 border border-[#7ED321]/25 px-3.5 py-1.5 rounded-full">
              <Calendar size={15} className="text-[#7ED321]" />
              <span className="font-mono-data text-sm font-semibold text-gray-200">{FEST_META.dates}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0D140E]/90 border border-[#7ED321]/25 px-3.5 py-1.5 rounded-full">
              <MapPin size={15} className="text-[#7ED321]" />
              <span className="font-mono-data text-sm font-semibold text-gray-200">{FEST_META.venue}</span>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46 }}
            className="mb-10"
          >
            <Countdown targetISO={FEST_META.countdownTarget} prefersReduced={prefersReduced} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.56 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/passes"
              id="hero-passes-btn"
              className="btn-green text-sm sm:text-base font-bold py-4 px-8 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(126,211,33,0.4)] text-[#070B08]"
            >
              <Ticket size={18} />
              🎫 GET SUMMIT PASSES
            </Link>

            <a
              href="#tracks"
              id="hero-explore-btn"
              className="btn-ghost text-sm sm:text-base py-4 px-8 rounded-xl flex items-center gap-2 border-white/30 text-white hover:border-[#7ED321] hover:text-[#7ED321] transition-all"
            >
              EXPLORE TRACKS
              <ChevronRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* RIGHT: Real 3D Wavy Ribbon Dollar Bill (GPU Accelerated, Three.js Mesh Wave Animation) */}
        <div className="flex-1 w-full relative flex items-center justify-center lg:justify-end py-4 lg:py-0 min-h-[420px] sm:min-h-[500px]">

          {/* "My Plan" floating pill */}
          <div
            ref={pillRef}
            className="absolute top-0 right-4 sm:right-12 z-20 bg-[#0D140E]/95 border border-[#7ED321]/50 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-mono-data text-white font-bold backdrop-blur-md"
          >
            <span>🔖 My Plan</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] -ml-5" />
          </div>

          {/* Three.js 3D Wavy Ribbon Container */}
          <motion.div
            ref={mainBillRef}
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="w-full max-w-[620px] sm:max-w-[720px] h-[440px] sm:h-[500px] relative"
          >
            <WavyDollarBill3D prefersReduced={prefersReduced} />
          </motion.div>
        </div>
      </div>

      {/* BOTTOM: Stock Ticker Tape */}
      <div className="relative z-10 border-t border-[#7ED321]/25 bg-[#060A07] overflow-hidden">
        <div className="py-2.5 flex items-center gap-0 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #060A07 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #060A07 0%, transparent 100%)' }} />

          <div ref={tickerRef} className="flex items-center gap-0 whitespace-nowrap" style={{ willChange: 'transform' }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-6 border-r border-[#7ED321]/15">
                <span className="font-mono-data text-xs font-bold text-[#7ED321]">{item.sym}</span>
                <span className="font-mono-data text-xs text-white font-semibold">{item.val}</span>
                <span className={`font-mono-data text-[10px] font-bold flex items-center gap-0.5 ${item.up ? 'text-[#7ED321]' : 'text-red-400'}`}>
                  {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
