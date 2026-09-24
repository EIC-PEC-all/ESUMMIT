'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { prefetchRegister } from '@/lib/prefetch'

export default function RegisterCTA() {
  return (
    <section
      id="register"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-section-2 text-white sm:-mt-12 sm:rounded-t-[50px] md:rounded-t-[60px] border-t border-[#7ED321]/20 pt-28 pb-44 sm:pt-36 sm:pb-56 md:pb-64"
      aria-labelledby="footer-cta-heading"
    >
      {/* Lime radial wash background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(181, 242, 61, 0.10) 0%, transparent 65%)',
        }}
      />

      {/* ── Left 3D Perspective Delegate Card (Minimal Emerald) ───────────── */}
      <motion.div
        initial={{ opacity: 0, x: -180, rotateY: 36, rotateX: 10, rotateZ: -6, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 24, rotateX: 6, rotateZ: -3, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -left-12 2xl:left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col justify-between w-[360px] h-[220px] rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-[#0a2016]/95 to-[#030a07]/95 p-6 shadow-2xl z-0 will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 30px 60px -12px rgba(16, 185, 129, 0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-wider text-emerald-200">E-SUMMIT &apos;26</span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 tracking-wide uppercase">
            All-Access
          </span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-400/60 block mb-1">Founder Pass</span>
          <span className="text-2xl font-display font-black text-white tracking-tight">VIP DELEGATE</span>
          <span className="text-xs text-emerald-200/50 block mt-1">PEC Chandigarh • Sept 26–27</span>
        </div>
      </motion.div>

      {/* ── Right 3D Perspective Attendee Card (Minimal Lime) ───────────── */}
      <motion.div
        initial={{ opacity: 0, x: 180, rotateY: -36, rotateX: 10, rotateZ: 6, scale: 0.85 }}
        whileInView={{ opacity: 1, x: 0, rotateY: -24, rotateX: 6, rotateZ: 3, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -right-12 2xl:right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col justify-between w-[360px] h-[220px] rounded-[24px] border border-[#B5F23D]/20 bg-gradient-to-bl from-[#1c280b]/95 to-[#080d03]/95 p-6 shadow-2xl z-0 will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 30px 60px -12px rgba(181, 242, 61, 0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-wider text-[#B5F23D]/80">E-SUMMIT &apos;26</span>
          <span className="px-3 py-1 rounded-full bg-[#B5F23D]/10 border border-[#B5F23D]/20 text-[10px] font-bold text-[#B5F23D] tracking-wide uppercase">
            Standard
          </span>
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B5F23D]/60 block mb-1">General Access</span>
          <span className="text-2xl font-display font-black text-white tracking-tight">ATTENDEE PASS</span>
          <span className="text-xs text-[#B5F23D]/50 block mt-1">Full 2-Day Event Access</span>
        </div>
      </motion.div>

      {/* ── Center Content Block ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {/* Main Headline */}
          <h2
            id="footer-cta-heading"
            className="mb-6 font-display font-black uppercase text-center leading-none tracking-tight select-none"
            style={{ fontSize: 'clamp(2rem, 6.5vw, 5rem)' }}
          >
            <span className="text-gradient-mint">REGISTER</span>
          </h2>

          {/* Subtitle */}
          <p className="mb-10 max-w-xl font-body text-base sm:text-lg leading-relaxed text-gray-300">
            Join 3,000+ builders, founders, and investors at Punjab Engineering College. Secure your summit pass for keynote sessions, hackathons, and pitch tracks.
          </p>

          {/* Dual Pill CTA Pair */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/passes"
              onMouseEnter={prefetchRegister}
              onTouchStart={prefetchRegister}
              onFocus={prefetchRegister}
              className="btn-mint-gradient flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold shadow-lg transition-transform hover:scale-105"
              id="footer-register-btn"
              aria-label="Claim Your Pass for E-Summit"
            >
              <span>Claim Your Pass</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/passes"
              onMouseEnter={prefetchRegister}
              onTouchStart={prefetchRegister}
              onFocus={prefetchRegister}
              className="btn-dark-gradient flex items-center justify-center rounded-full px-8 py-4 text-base font-bold text-white transition-transform hover:scale-105"
              id="footer-schedule-btn"
              aria-label="Explore Full Summit Passes"
            >
              <span>Explore Summit Passes</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
