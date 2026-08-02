'use client'
// components/Hero/index.tsx
// PREMIUM Money/Finance Hero — warped 3D dollar bill, canvas money rain,
// GSAP parallax, mouse tilt, stock ticker tape, live countdown

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimate, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Ticket, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import Countdown from './Countdown'
import CircuitBoard from './CircuitBoard'
import MoneyCanvas from './MoneyCanvas'
import { FEST_META } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Stock ticker data — fake financial data for the finance theme
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

  // GSAP Animations
  useEffect(() => {
    let ctx: any = null

    const initGSAP = async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          if (prefersReduced) return

          // Idle sway on main bill
          gsap.to(mainBillRef.current, {
            rotateZ: '+=3',
            y: '+=12',
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })

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
              duration: 32,
              repeat: -1,
              ease: 'none',
            })
          }

          // Mouse reactive 3D tilt on bill
          const xTo = gsap.quickTo(mainBillRef.current, 'rotateY', { duration: 0.6, ease: 'power2.out' })
          const yTo = gsap.quickTo(mainBillRef.current, 'rotateX', { duration: 0.6, ease: 'power2.out' })

          const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return
            const rect = sectionRef.current.getBoundingClientRect()
            const relX = (e.clientX - rect.left) / rect.width - 0.5
            const relY = (e.clientY - rect.top) / rect.height - 0.5
            xTo(relX * 20)
            yTo(-relY * 20)
          }

          sectionRef.current?.addEventListener('mousemove', handleMouseMove)

          // Scroll parallax
          if (sectionRef.current) {
            gsap.to(mainBillRef.current, {
              scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
              xPercent: 30,
              yPercent: 25,
              opacity: 0,
              ease: 'none',
            })
            gsap.to(heroContentRef.current, {
              scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.3 },
              yPercent: -10,
              opacity: 0.5,
              ease: 'none',
            })
          }

          return () => sectionRef.current?.removeEventListener('mousemove', handleMouseMove)
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
      {/* ── Layer 0: Canvas money rain ── */}
      <MoneyCanvas prefersReduced={prefersReduced} />

      {/* ── Layer 1: Circuit board overlay ── */}
      <CircuitBoard prefersReduced={prefersReduced} />

      {/* ── Layer 2: Deep radial glow (right side — where bill is) ── */}
      <div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(126,211,33,0.20) 0%, rgba(126,211,33,0.06) 40%, transparent 70%)',
        }}
      />

      {/* ── Layer 3: Left scrim for text legibility ── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-full lg:w-[65%] pointer-events-none z-1"
        style={{ background: 'linear-gradient(90deg, rgba(7,11,8,0.98) 0%, rgba(7,11,8,0.85) 65%, transparent 100%)' }}
      />

      {/* ── MAIN CONTENT ── */}
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
                textShadow: '0 0 40px rgba(126,211,33,0.55), 0 0 80px rgba(126,211,33,0.2)',
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
            <div className="flex items-center gap-2 bg-[#0D140E]/90 border border-[#7ED321]/25 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              <Calendar size={15} className="text-[#7ED321]" />
              <span className="font-mono-data text-sm font-semibold text-gray-200">{FEST_META.dates}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0D140E]/90 border border-[#7ED321]/25 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
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
              className="btn-green text-sm sm:text-base font-bold py-4 px-8 rounded-xl flex items-center gap-2 shadow-[0_0_30px_rgba(126,211,33,0.5)] text-[#070B08]"
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
            className="absolute top-2 right-4 sm:right-16 z-20 bg-[#0D140E]/95 border border-[#7ED321]/50 shadow-[0_8px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(126,211,33,0.3)] rounded-full px-4 py-2 flex items-center gap-2 text-xs font-mono-data text-white font-bold backdrop-blur-md"
          >
            <span>🔖 My Plan</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ED321] -ml-5" />
          </div>

          {/* Main 3D Warped Dollar Bill */}
          <motion.div
            ref={mainBillRef}
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.75, rotateZ: 25, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 18, rotateY: -8 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[680px] translate-x-2 lg:translate-x-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Bill glow bloom behind it */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(126,211,33,0.25) 0%, transparent 70%)',
                transform: 'scale(1.25)',
                filter: 'blur(24px)',
              }}
            />

            {/* THE DOLLAR BILL — large perspective-curved SVG */}
            <LargeDollarBill />

            {/* Shine sweep overlay */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              initial={{ x: '-100%' }}
              animate={{ x: '220%' }}
              transition={{ duration: 2.4, delay: 0.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5 }}
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(126,211,33,0.18) 50%, transparent 70%)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── BOTTOM: Stock Ticker Tape ── */}
      <div className="relative z-10 border-t border-[#7ED321]/25 bg-[#060A07]/90 backdrop-blur-sm overflow-hidden">
        <div className="py-2.5 flex items-center gap-0 overflow-hidden">
          {/* Fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #060A07 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #060A07 0%, transparent 100%)' }} />

          <div ref={tickerRef} className="flex items-center gap-0 whitespace-nowrap" style={{ willChange: 'transform' }}>
            {/* Duplicate for seamless loop */}
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

// ── Massive, detailed SVG dollar bill with perspective warp ──
function LargeDollarBill() {
  return (
    <div
      className="relative w-full select-none pointer-events-none"
      style={{
        aspectRatio: '2.4 / 1',
        filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(126,211,33,0.4))',
      }}
    >
      <svg
        viewBox="0 0 720 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ borderRadius: '14px', overflow: 'hidden' }}
      >
        <defs>
          <linearGradient id="hBillBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A1D11" />
            <stop offset="40%" stopColor="#142B1B" />
            <stop offset="100%" stopColor="#081309" />
          </linearGradient>

          <linearGradient id="hBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ED321" />
            <stop offset="50%" stopColor="#4A8A13" />
            <stop offset="100%" stopColor="#7ED321" />
          </linearGradient>

          <radialGradient id="hCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7ED321" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#7ED321" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7ED321" stopOpacity="0" />
          </radialGradient>

          {/* Guilloché wave pattern */}
          <pattern id="hGuilloche" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 12 Q6 0 12 12 T24 12" fill="none" stroke="#7ED321" strokeWidth="0.6" strokeOpacity="0.18" />
            <path d="M0 6 Q6 18 12 6 T24 6" fill="none" stroke="#7ED321" strokeWidth="0.4" strokeOpacity="0.1" />
          </pattern>

          {/* Shimmer gradient */}
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7ED321" stopOpacity="0" />
            <stop offset="40%" stopColor="#7ED321" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#7ED321" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7ED321" stopOpacity="0" />
          </linearGradient>

          <filter id="billGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" />
          </filter>
        </defs>

        {/* Main bill body */}
        <rect x="3" y="3" width="714" height="294" rx="14" fill="url(#hBillBg)" stroke="url(#hBorderGrad)" strokeWidth="2.5" />

        {/* Guilloche texture fill */}
        <rect x="3" y="3" width="714" height="294" rx="14" fill="url(#hGuilloche)" />

        {/* Center glow overlay */}
        <rect x="3" y="3" width="714" height="294" rx="14" fill="url(#hCenterGlow)" />

        {/* Shimmer sweep */}
        <rect x="3" y="3" width="714" height="294" rx="14" fill="url(#shimmer)" />

        {/* ─── Double ornate border frame ─── */}
        <rect x="14" y="14" width="692" height="272" rx="9" fill="none" stroke="#7ED321" strokeWidth="1.5" strokeOpacity="0.85" />
        <rect x="20" y="20" width="680" height="260" rx="7" fill="none" stroke="#7ED321" strokeWidth="0.8" strokeDasharray="6 3" strokeOpacity="0.55" />

        {/* ─── HEADER ROW ─── */}
        <text x="360" y="42" textAnchor="middle" fill="#8A9488" fontSize="9" letterSpacing="5" fontFamily="monospace" fontWeight="bold">
          FEDERAL RESERVE NOTE
        </text>
        <text x="360" y="63" textAnchor="middle" fill="#F5F5F0" fontSize="16" letterSpacing="4" fontWeight="900" fontFamily="serif">
          THE UNITED STATES OF AMERICA
        </text>

        {/* Decorative header lines */}
        <line x1="30" y1="72" x2="190" y2="72" stroke="#7ED321" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="530" y1="72" x2="690" y2="72" stroke="#7ED321" strokeWidth="0.8" strokeOpacity="0.5" />

        {/* ─── SERIAL NUMBERS ─── */}
        <text x="112" y="94" fill="#7ED321" fontSize="11" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
          ★ E 20260315 B ★
        </text>
        <text x="608" y="94" textAnchor="end" fill="#7ED321" fontSize="11" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
          ★ PEC 2026 E ★
        </text>

        {/* ─── 4 CORNER SEALS ─── */}
        {[
          { x: 52, y: 48 },
          { x: 668, y: 48 },
          { x: 52, y: 258 },
          { x: 668, y: 258 },
        ].map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="25" fill="#081209" stroke="#7ED321" strokeWidth="1.8" />
            <circle cx={c.x} cy={c.y} r="20" fill="none" stroke="#7ED321" strokeWidth="0.6" strokeDasharray="3 2" />
            <text x={c.x} y={c.y + 7} textAnchor="middle" fill="#7ED321" fontSize="18" fontWeight="900" fontFamily="serif">
              $1
            </text>
          </g>
        ))}

        {/* ─── LEFT GREAT SEAL (pyramid eye) ─── */}
        <g transform="translate(155, 165)">
          <circle cx="0" cy="0" r="54" fill="#091811" stroke="#7ED321" strokeWidth="2" />
          <circle cx="0" cy="0" r="48" fill="none" stroke="#7ED321" strokeWidth="0.8" strokeDasharray="4 3" />
          <polygon points="0,-26 28,18 -28,18" fill="none" stroke="#7ED321" strokeWidth="2" />
          {/* Pyramid blocks */}
          <line x1="-28" y1="9" x2="28" y2="9" stroke="#7ED321" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#7ED321" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="-12" y1="-9" x2="12" y2="-9" stroke="#7ED321" strokeWidth="1" strokeOpacity="0.5" />
          {/* Eye */}
          <ellipse cx="0" cy="-26" rx="5" ry="3" fill="#7ED321" />
          <circle cx="0" cy="-26" r="2" fill="#070B08" />
          {/* Glow rays */}
          {[-35,-20,-10,0,10,20,35].map((angle, i) => (
            <line key={i}
              x1={Math.sin(angle * Math.PI/180) * 7}
              y1={-26 + Math.cos(angle * Math.PI/180) * 7}
              x2={Math.sin(angle * Math.PI/180) * 14}
              y2={-26 + Math.cos(angle * Math.PI/180) * 14}
              stroke="#7ED321" strokeWidth="0.8" strokeOpacity="0.6"
            />
          ))}
          <text x="0" y="30" textAnchor="middle" fill="#8A9488" fontSize="7" letterSpacing="1.5" fontFamily="monospace">GREAT SEAL</text>
        </g>

        {/* ─── CENTER OVAL MEDALLION ─── */}
        <g transform="translate(360, 168)">
          <ellipse cx="0" cy="0" rx="108" ry="84" fill="#091710" stroke="#7ED321" strokeWidth="2.5" />
          <ellipse cx="0" cy="0" rx="100" ry="77" fill="none" stroke="#7ED321" strokeWidth="0.8" strokeDasharray="5 3" />

          {/* Portrait circle */}
          <circle cx="0" cy="-6" r="56" fill="#0E2416" stroke="#7ED321" strokeWidth="1.5" />

          {/* George Washington silhouette placeholder — stylized */}
          <ellipse cx="0" cy="-22" rx="16" ry="20" fill="#1B3A20" stroke="#7ED321" strokeWidth="0.8" />
          <path d="M -22 4 Q 0 -8 22 4 L 28 22 Q 0 30 -28 22 Z" fill="#162E1C" stroke="#7ED321" strokeWidth="0.6" />
          {/* Powdered wig */}
          <path d="M -16 -36 Q -22 -52 0 -52 Q 22 -52 16 -36 Q 8 -28 0 -28 Q -8 -28 -16 -36 Z" fill="#1B3A20" stroke="#7ED321" strokeWidth="0.6" />

          {/* ONE label below portrait */}
          <text x="0" y="64" textAnchor="middle" fill="#F5F5F0" fontSize="10" letterSpacing="3" fontFamily="monospace" fontWeight="bold">
            WASHINGTON
          </text>
        </g>

        {/* ─── RIGHT TREASURY SEAL ─── */}
        <g transform="translate(565, 165)">
          <circle cx="0" cy="0" r="54" fill="#091811" stroke="#7ED321" strokeWidth="2" />
          <circle cx="0" cy="0" r="48" fill="none" stroke="#7ED321" strokeWidth="0.8" strokeDasharray="4 3" />
          {/* Shield */}
          <path d="M0,-34 L26,-20 L26 8 Q26 28 0 36 Q-26 28-26 8 L-26,-20 Z" fill="#0F2215" stroke="#7ED321" strokeWidth="1.8" />
          {/* Horizontal bars in shield */}
          {[-8,-1,6,13].map((y, i) => (
            <line key={i} x1="-18" y1={y} x2="18" y2={y} stroke="#7ED321" strokeWidth="1.2" strokeOpacity="0.6" />
          ))}
          <text x="0" y="-14" textAnchor="middle" fill="#7ED321" fontSize="11" fontWeight="bold" fontFamily="sans-serif">PEC</text>
          <text x="0" y="40" textAnchor="middle" fill="#8A9488" fontSize="7" letterSpacing="1.5" fontFamily="monospace">E-CELL TREASURY</text>
        </g>

        {/* ─── Curved band top & bottom (microprint security strip) ─── */}
        <rect x="3" y="104" width="714" height="10" fill="none" stroke="#7ED321" strokeWidth="0" />
        <text x="360" y="112" textAnchor="middle" fill="#7ED321" fontSize="4" letterSpacing="1.2" fontFamily="monospace" fontWeight="bold" opacity="0.6">
          ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT ESUMMIT
        </text>
        <text x="360" y="225" textAnchor="middle" fill="#7ED321" fontSize="4" letterSpacing="1.2" fontFamily="monospace" fontWeight="bold" opacity="0.6">
          PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026 PECSUMMIT2026
        </text>

        {/* ─── BOTTOM BANNER ─── */}
        <rect x="248" y="258" width="224" height="28" rx="5" fill="#071209" stroke="#7ED321" strokeWidth="1.2" />
        <text x="360" y="277" textAnchor="middle" fill="#7ED321" fontSize="16" letterSpacing="6" fontWeight="900" fontFamily="serif">
          ONE DOLLAR
        </text>

        {/* ─── Signatures ─── */}
        <text x="185" y="248" textAnchor="middle" fill="#8A9488" fontSize="7.5" fontFamily="cursive" fontStyle="italic">
          Treasurer, E-Summit 2026
        </text>
        <text x="535" y="248" textAnchor="middle" fill="#8A9488" fontSize="7.5" fontFamily="cursive" fontStyle="italic">
          Secretary, E-Cell PEC
        </text>

        {/* ─── Vertical "1" side numbers ─── */}
        <text x="30" y="155" textAnchor="middle" fill="#7ED321" fontSize="48" fontWeight="900" fontFamily="serif" opacity="0.35">1</text>
        <text x="690" y="155" textAnchor="middle" fill="#7ED321" fontSize="48" fontWeight="900" fontFamily="serif" opacity="0.35">1</text>

        {/* Security thread vertical line */}
        <line x1="470" y1="15" x2="470" y2="285" stroke="#7ED321" strokeWidth="2" strokeOpacity="0.25" />
        <text
          x="468" y="100"
          fill="#7ED321" fontSize="5.5" letterSpacing="3" fontFamily="monospace"
          transform="rotate(-90, 468, 150)" opacity="0.5"
        >
          ESUMMIT 2026 PEC CHANDIGARH INDIA
        </text>
      </svg>
    </div>
  )
}
