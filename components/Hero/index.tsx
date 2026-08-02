'use client'
// components/Hero/index.tsx
// High-Performance Money/Finance Hero — warped 3D dollar bill, canvas money rain,
// GSAP parallax, throttled mouse tilt, stock ticker tape, live countdown

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import Countdown from './Countdown'
import CircuitBoard from './CircuitBoard'
import MoneyCanvas from './MoneyCanvas'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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

  // GSAP Animations with Throttled Mousemove
  useEffect(() => {
    let ctx: any = null
    let rafId: number | null = null

    const initGSAP = async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          if (prefersReduced) return

          // 1. Idle sway on main bill
          gsap.to(mainBillRef.current, {
            rotateZ: '+=2.5',
            y: '+=8',
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

          // 2. Floating pill bob
          gsap.to(pillRef.current, {
            y: '-=6',
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

          // 3. Ticker scroll animation
          if (tickerRef.current) {
            const tickerWidth = tickerRef.current.scrollWidth / 2
            gsap.to(tickerRef.current, {
              x: -tickerWidth,
              duration: 36,
              repeat: -1,
              ease: 'none',
            })
          }

          // 4. Throttled Mouse reactive 3D tilt
          const xTo = gsap.quickTo(mainBillRef.current, 'rotateY', { duration: 0.5, ease: 'power2.out' })
          const yTo = gsap.quickTo(mainBillRef.current, 'rotateX', { duration: 0.5, ease: 'power2.out' })

          let pendingEvent: MouseEvent | null = null

          const updateTilt = () => {
            if (pendingEvent && sectionRef.current) {
              const rect = sectionRef.current.getBoundingClientRect()
              const relX = (pendingEvent.clientX - rect.left) / rect.width - 0.5
              const relY = (pendingEvent.clientY - rect.top) / rect.height - 0.5
              xTo(relX * 16)
              yTo(-relY * 16)
              pendingEvent = null
            }
            rafId = null
          }

          const handleMouseMove = (e: MouseEvent) => {
            pendingEvent = e
            if (!rafId) {
              rafId = requestAnimationFrame(updateTilt)
            }
          }

          sectionRef.current?.addEventListener('mousemove', handleMouseMove, { passive: true })

          // 5. Scroll parallax
          if (sectionRef.current) {
            gsap.to(mainBillRef.current, {
              scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
              xPercent: 20,
              yPercent: 15,
              opacity: 0,
              ease: 'none',
            })
          }

          return () => {
            if (rafId) cancelAnimationFrame(rafId)
            sectionRef.current?.removeEventListener('mousemove', handleMouseMove)
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
      style={{ perspective: '1200px' }}
    >
      {/* Layer 0: Canvas money rain */}
      <MoneyCanvas prefersReduced={prefersReduced} />

      {/* Layer 1: Circuit board overlay */}
      <CircuitBoard prefersReduced={prefersReduced} />

      {/* Layer 2: Deep radial glow */}
      <div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(126,211,33,0.18) 0%, rgba(126,211,33,0.04) 45%, transparent 70%)',
        }}
      />

      {/* Layer 3: Left scrim */}
      <div
        className="absolute left-0 top-0 bottom-0 w-full lg:w-[65%] pointer-events-none z-1"
        style={{ background: 'linear-gradient(90deg, rgba(7,11,8,0.98) 0%, rgba(7,11,8,0.85) 65%, transparent 100%)' }}
      />

      {/* MAIN CONTENT */}
      <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 flex-1 pb-12 mt-8">

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

        {/* RIGHT: Warped 3D Dollar Bill */}
        <div className="flex-1 w-full relative flex items-center justify-center lg:justify-end py-4 lg:py-0 min-h-[340px] sm:min-h-[420px]">

          {/* "My Plan" floating pill */}
          <div
            ref={pillRef}
            className="absolute top-2 right-4 sm:right-16 z-20 bg-[#0D140E]/95 border border-[#7ED321]/50 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-mono-data text-white font-bold"
          >
            <span>🔖 My Plan</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] -ml-5" />
          </div>

          {/* Main 3D Warped Dollar Bill Container with CSS Shadow (No Filter Drop-shadow) */}
          <motion.div
            ref={mainBillRef}
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.8, rotateZ: 22 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 18 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[660px] translate-x-2 lg:translate-x-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(126,211,33,0.25)] rounded-xl"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            <LargeDollarBill />
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

// ── Lightweight, High-Performance SVG Dollar Bill ──
function LargeDollarBill() {
  return (
    <div
      className="relative w-full select-none pointer-events-none rounded-xl overflow-hidden"
      style={{
        aspectRatio: '2.4 / 1',
      }}
    >
      <svg
        viewBox="0 0 720 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hBillBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A1D11" />
            <stop offset="50%" stopColor="#142B1B" />
            <stop offset="100%" stopColor="#081309" />
          </linearGradient>

          <linearGradient id="hBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ED321" />
            <stop offset="50%" stopColor="#4A8A13" />
            <stop offset="100%" stopColor="#7ED321" />
          </linearGradient>
        </defs>

        <rect x="2" y="2" width="716" height="296" rx="12" fill="url(#hBillBg)" stroke="url(#hBorderGrad)" strokeWidth="2.5" />
        <rect x="12" y="12" width="696" height="276" rx="8" fill="none" stroke="#7ED321" strokeWidth="1.5" strokeOpacity="0.85" />
        <rect x="18" y="18" width="684" height="264" rx="6" fill="none" stroke="#7ED321" strokeWidth="0.8" strokeDasharray="6 3" strokeOpacity="0.55" />

        {/* HEADER */}
        <text x="360" y="42" textAnchor="middle" fill="#8A9488" fontSize="9" letterSpacing="5" fontFamily="monospace" fontWeight="bold">
          FEDERAL RESERVE NOTE
        </text>
        <text x="360" y="63" textAnchor="middle" fill="#F5F5F0" fontSize="16" letterSpacing="4" fontWeight="900" fontFamily="serif">
          THE UNITED STATES OF AMERICA
        </text>

        {/* SERIAL NUMBERS */}
        <text x="112" y="94" fill="#7ED321" fontSize="11" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
          ★ E 20260315 B ★
        </text>
        <text x="608" y="94" textAnchor="end" fill="#7ED321" fontSize="11" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
          ★ PEC 2026 E ★
        </text>

        {/* CORNERS */}
        {[
          { x: 50, y: 48 },
          { x: 670, y: 48 },
          { x: 50, y: 258 },
          { x: 670, y: 258 },
        ].map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="24" fill="#081209" stroke="#7ED321" strokeWidth="1.8" />
            <text x={c.x} y={c.y + 6} textAnchor="middle" fill="#7ED321" fontSize="18" fontWeight="900" fontFamily="serif">
              $1
            </text>
          </g>
        ))}

        {/* LEFT GREAT SEAL */}
        <g transform="translate(155, 165)">
          <circle cx="0" cy="0" r="50" fill="#091811" stroke="#7ED321" strokeWidth="2" />
          <polygon points="0,-24 24,16 -24,16" fill="none" stroke="#7ED321" strokeWidth="2" />
          <circle cx="0" cy="-24" r="4" fill="#7ED321" />
          <text x="0" y="30" textAnchor="middle" fill="#8A9488" fontSize="7" letterSpacing="1.5" fontFamily="monospace">GREAT SEAL</text>
        </g>

        {/* CENTER MEDALLION */}
        <g transform="translate(360, 168)">
          <ellipse cx="0" cy="0" rx="100" ry="78" fill="#091710" stroke="#7ED321" strokeWidth="2.5" />
          <circle cx="0" cy="-6" r="52" fill="#0E2416" stroke="#7ED321" strokeWidth="1.5" />
          <text x="0" y="10" textAnchor="middle" fill="#7ED321" fontSize="42" fontWeight="900" fontFamily="sans-serif">
            $
          </text>
          <text x="0" y="62" textAnchor="middle" fill="#F5F5F0" fontSize="10" letterSpacing="3" fontFamily="monospace" fontWeight="bold">
            PEC SUMMIT
          </text>
        </g>

        {/* RIGHT TREASURY SEAL */}
        <g transform="translate(565, 165)">
          <circle cx="0" cy="0" r="50" fill="#091811" stroke="#7ED321" strokeWidth="2" />
          <path d="M0,-30 L22,-18 L22 6 Q22 24 0 32 Q-22 24-22 6 L-22,-18 Z" fill="#0F2215" stroke="#7ED321" strokeWidth="1.8" />
          <text x="0" y="-8" textAnchor="middle" fill="#7ED321" fontSize="10" fontWeight="bold" fontFamily="sans-serif">PEC</text>
          <text x="0" y="38" textAnchor="middle" fill="#8A9488" fontSize="7" letterSpacing="1.5" fontFamily="monospace">TREASURY</text>
        </g>

        {/* BOTTOM BANNER */}
        <rect x="248" y="258" width="224" height="28" rx="5" fill="#071209" stroke="#7ED321" strokeWidth="1.2" />
        <text x="360" y="277" textAnchor="middle" fill="#7ED321" fontSize="16" letterSpacing="6" fontWeight="900" fontFamily="serif">
          ONE DOLLAR
        </text>

        {/* SIGNATURES */}
        <text x="185" y="248" textAnchor="middle" fill="#8A9488" fontSize="7.5" fontFamily="cursive" fontStyle="italic">
          Treasurer, E-Summit 2026
        </text>
        <text x="535" y="248" textAnchor="middle" fill="#8A9488" fontSize="7.5" fontFamily="cursive" fontStyle="italic">
          Secretary, E-Cell PEC
        </text>
      </svg>
    </div>
  )
}
