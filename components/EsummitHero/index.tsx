'use client'
// components/EsummitHero/index.tsx
// Premium E-Summit Hero — Stock Market Bull Edition
// Dark #070B08 bg · Volt-green #7ED321 accents · Kanit font
// Features: live ticker strip · floating market badges · orbit ring · magnetic bull

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Zap, TrendingUp, BarChart2, Activity } from 'lucide-react'
import Magnet from '@/components/ui/Magnet'
import RegisterButton from '@/components/ui/RegisterButton'
import { useState, useEffect, useRef } from 'react'

const easing = [0.25, 0.1, 0.25, 1] as const

const PORTRAIT_URL = '/stock-bull-hero.png'

// Live ticker data (simulated)
const TICKERS = [
  { symbol: 'NIFTY 50', val: '24,853', change: '+2.4%', up: true },
  { symbol: 'SENSEX',   val: '81,247', change: '+1.8%', up: true },
  { symbol: 'BTC/USD',  val: '67,420', change: '+5.1%', up: true },
  { symbol: 'GOLD',     val: '₹7,240',  change: '+0.6%', up: true },
  { symbol: 'S&P 500',  val: '5,612',   change: '+0.9%', up: true },
  { symbol: 'NASDAQ',   val: '19,864',  change: '+1.3%', up: true },
]

// Floating badge data around the bull
const BADGES = [
  { label: 'NIFTY',   value: '+2.4%', color: '#7ED321', icon: '📈', delay: 0.9,  pos: { top: '14%',    left: '-22%' } },
  { label: 'BTC',     value: '+5.1%', color: '#FF8C42', icon: '₿',  delay: 1.05, pos: { top: '14%',    right: '-22%' } },
  { label: 'SENSEX',  value: '+1.8%', color: '#7ED321', icon: '📊', delay: 1.2,  pos: { bottom: '30%', left: '-26%' } },
  { label: 'GOLD',    value: '+0.6%', color: '#FFD700', icon: '🥇', delay: 1.35, pos: { bottom: '30%', right: '-26%' } },
]

// Sparkline mini-chart SVG points
const SPARKLINE_PTS = '0,40 12,32 24,36 36,20 48,28 60,12 72,18 84,6 96,14 108,4'

const NAV_LINKS = [
  { label: 'About',      href: '#esummit-about' },
  { label: 'Events',     href: '#esummit-tracks' },
  { label: 'Highlights', href: '#esummit-highlights' },
  { label: 'Register',   href: '/register' },
]

/** Animated live ticker strip */
function TickerStrip() {
  const items = [...TICKERS, ...TICKERS, ...TICKERS]
  return (
    <div className="relative overflow-hidden py-2 border-y" style={{ borderColor: 'rgba(126,211,33,0.15)', background: 'rgba(126,211,33,0.04)' }}>
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 shrink-0">
            <span className="font-mono-data text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8A9488' }}>
              {t.symbol}
            </span>
            <span className="font-mono-data text-[11px] font-bold" style={{ color: '#F5F5F0' }}>
              {t.val}
            </span>
            <span className="font-mono-data text-[11px] font-bold" style={{ color: '#7ED321' }}>
              {t.change}
            </span>
            <span className="text-[#7ED321]/30 text-xs">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/** Mini sparkline SVG used inside the orbit ring */
function Sparkline() {
  return (
    <svg viewBox="0 0 108 50" className="w-full h-full" fill="none">
      <polyline
        points={SPARKLINE_PTS}
        stroke="#7ED321"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <circle cx="108" cy="4" r="3" fill="#7ED321" opacity="0.9" />
    </svg>
  )
}

export default function EsummitHero() {
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section
      id="esummit-hero"
      className="esummit-section relative h-screen flex flex-col overflow-hidden"
      style={{ background: '#070B08', fontFamily: "'Kanit', sans-serif" }}
    >
      {/* ── Deep background grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(126,211,33,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(126,211,33,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(126,211,33,0.07) 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(126,211,33,0.06) 0%, transparent 65%)' }}
      />

      {/* ── Top: live badge + nav ── */}
      <div className="relative z-20 flex flex-col">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easing }}
          className="flex justify-center pt-4"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{ background: 'rgba(126,211,33,0.08)', borderColor: 'rgba(126,211,33,0.35)' }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#7ED321]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="font-mono-data text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#7ED321]">
              LIVE — Registration Open
            </span>
            <ArrowUpRight size={12} className="text-[#7ED321]" />
          </div>
        </motion.div>

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: easing }}
          className="flex justify-between items-center px-6 md:px-10 pt-4 md:pt-5"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider transition-colors duration-200 hover:text-[#7ED321]"
              style={{ color: '#F5F5F0' }}
            >
              {link.label}
            </a>
          ))}
        </motion.nav>
      </div>

      {/* ── Ticker strip ── */}
      <motion.div
        className="relative z-20 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <TickerStrip />
      </motion.div>

      {/* ── Hero Heading ── */}
      <div className="relative z-20 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing }}
          className="hero-heading-green font-black uppercase tracking-tight leading-none whitespace-nowrap w-full
            text-[13vw] sm:text-[14vw] md:text-[15vw] lg:text-[16vw]
            mt-3 sm:mt-2 md:-mt-1 px-6 md:px-10"
          style={{ fontFamily: "'Kanit', sans-serif" }}
        >
          PEC E&#8209;Summit
        </motion.h1>
      </div>

      {/* ── Bull portrait (centered) ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10
          top-1/2 -translate-y-[48%]
          sm:top-auto sm:translate-y-0 sm:bottom-0
          w-[240px] sm:w-[320px] md:w-[400px] lg:w-[480px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: easing }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative"
        >
          {/* Outer slow-rotating dashed orbit */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ inset: '-20%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle
                cx="100" cy="100" r="94"
                fill="none"
                stroke="rgba(126,211,33,0.18)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
            </svg>
          </motion.div>

          {/* Inner counter-rotating orbit with sparkline segment */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ inset: '-10%' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle
                cx="100" cy="100" r="88"
                fill="none"
                stroke="rgba(126,211,33,0.08)"
                strokeWidth="1"
              />
              {/* Bright arc segment */}
              <path
                d="M 100 12 A 88 88 0 0 1 185 65"
                fill="none"
                stroke="#7ED321"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Dot at arc end */}
              <circle cx="185" cy="65" r="3.5" fill="#7ED321" opacity="0.9" />
            </svg>
          </motion.div>

          {/* Radial glow beneath the bull */}
          <motion.div
            className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[110%] h-[45%] pointer-events-none rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(126,211,33,0.28) 0%, transparent 70%)' }}
            animate={{ opacity: [0.7, 1, 0.7], scaleX: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Floating market badges ── */}
          {BADGES.map((b) => (
            <motion.div
              key={b.label}
              className="absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl z-20"
              style={{
                ...b.pos,
                background: 'rgba(7,11,8,0.85)',
                border: `1px solid ${b.color}40`,
                backdropFilter: 'blur(12px)',
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${b.color}20`,
              }}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: b.delay, duration: 0.5 },
                scale:   { delay: b.delay, duration: 0.5 },
                y: { duration: 2.5 + Math.random(), repeat: Infinity, ease: 'easeInOut', delay: b.delay },
              }}
              whileHover={{ scale: 1.08, boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${b.color}30` }}
            >
              <span className="text-sm leading-none">{b.icon}</span>
              <div className="flex flex-col leading-tight">
                <span className="font-mono-data text-[9px] uppercase tracking-widest font-bold" style={{ color: '#8A9488' }}>
                  {b.label}
                </span>
                <span className="font-mono-data text-[13px] font-black" style={{ color: b.color }}>
                  {b.value}
                </span>
              </div>
            </motion.div>
          ))}

          {/* ── "BULL MARKET" floating label above head ── */}
          <motion.div
            className="absolute z-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              top: '-8%',
              background: 'rgba(7,11,8,0.9)',
              border: '1px solid rgba(126,211,33,0.45)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(126,211,33,0.15)',
              whiteSpace: 'nowrap',
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#7ED321]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <TrendingUp size={11} className="text-[#7ED321]" strokeWidth={2.5} />
            <span className="font-mono-data text-[10px] uppercase tracking-[0.2em] font-bold text-[#7ED321]">
              Bull Market
            </span>
          </motion.div>

          {/* ── Mini sparkline chart (bottom right of bull) ── */}
          <motion.div
            className="absolute z-20 hidden sm:block"
            style={{
              bottom: '18%',
              right: '-20%',
              width: '100px',
              background: 'rgba(7,11,8,0.88)',
              border: '1px solid rgba(126,211,33,0.3)',
              borderRadius: '10px',
              padding: '8px',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <p className="font-mono-data text-[8px] uppercase tracking-widest text-[#8A9488] mb-1">Live Chart</p>
            <Sparkline />
          </motion.div>

          {/* ── Magnet-wrapped bull image ── */}
          <Magnet padding={120} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.7s ease-in-out">
            <motion.div
              className="relative"
              animate={hovered
                ? { filter: 'drop-shadow(0 0 40px rgba(126,211,33,0.6)) drop-shadow(0 0 80px rgba(126,211,33,0.2))' }
                : { filter: 'drop-shadow(0 0 20px rgba(126,211,33,0.25))' }
              }
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ mixBlendMode: 'screen' }}
            >
              <motion.img
                src={PORTRAIT_URL}
                alt="E-Summit 2026 — Bull Market Mascot"
                className="w-full h-auto object-contain select-none pointer-events-none relative z-10"
                draggable={false}
                animate={hovered
                  ? { scale: 1.05 }
                  : { scale: 1 }
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ mixBlendMode: 'lighten' }}
              />
            </motion.div>
          </Magnet>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-20 mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        {/* Left: event info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: easing }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={11} className="text-[#7ED321] fill-[#7ED321]" />
            <span className="font-mono-data text-[10px] uppercase tracking-widest text-[#7ED321] font-bold">
              March 15–16, 2026
            </span>
          </div>
          <p
            className="font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
            style={{ color: '#8A9488', fontFamily: "'Kanit', sans-serif", fontSize: 'clamp(0.7rem, 1.3vw, 1.3rem)' }}
          >
            North India&apos;s premier entrepreneurship summit — where ideas raise capital
          </p>
        </motion.div>

        {/* Right: CTA + stat chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: easing }}
          className="flex flex-col items-end gap-3"
        >
          {/* Mini stat row */}
          <div className="hidden sm:flex items-center gap-3">
            {[
              { icon: <Activity size={10} />, label: '2,000+ Attendees' },
              { icon: <BarChart2 size={10} />, label: '₹50L+ in Prizes' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(126,211,33,0.06)', border: '1px solid rgba(126,211,33,0.2)' }}
              >
                <span className="text-[#7ED321]">{s.icon}</span>
                <span className="font-mono-data text-[10px] text-[#8A9488] uppercase tracking-widest font-bold">{s.label}</span>
              </div>
            ))}
          </div>
          <RegisterButton />
        </motion.div>
      </div>

      {/* ── Bottom edge glow line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.4) 50%, transparent)' }}
      />
    </section>
  )
}
