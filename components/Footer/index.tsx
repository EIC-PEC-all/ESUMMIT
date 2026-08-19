'use client'
// components/Footer/index.tsx
// Register CTA + EIC/PEC Corporate Footer layout

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
  Send,
  Zap,
  Youtube,
  Facebook,
  Briefcase,
  Phone,
  Users,
  Trophy,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import DynamicWeightHeading from '../DynamicWeightHeading'
import CircuitBoard from '../Hero/CircuitBoard'
import { ScrollGradientFill, GlitchText } from '@/components/Common/TextAnims'
import StackedSlicedText from '@/components/ui/StackedSlicedText'
import { FEST_META } from '@/lib/data'
import { api, ApiError } from '@/lib/api'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', {
        style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.subscribe(email)
      setSubmitted(true)
      toast.success(res.message || `${email} — you're on the list!`, {
        duration: 4000,
        style: {
          background: '#0A110E',
          color: '#FFFFFF',
          border: '1px solid var(--accent-mint)',
        },
        iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
      })
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Could not subscribe right now. Please try again.',
        { style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' } },
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 py-4"
      >
        <div
          className="bg-[var(--accent-mint)]/20 border-[var(--accent-mint)]/40 flex h-8 w-8 items-center justify-center rounded-full border text-[var(--accent-mint)]"
          aria-hidden="true"
        >
          <Send size={14} />
        </div>
        <p className="font-mono-data text-sm font-bold text-[var(--accent-mint)]">
          You&apos;re on the list. Watch your inbox.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 sm:flex-nowrap">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={isSubmitting}
        className="flex-1 rounded-xl border border-[#4E6527]/60 bg-[#1E2B12] px-4 py-3 font-body text-sm text-white outline-none placeholder:text-gray-400 focus:border-[#C8E696] disabled:opacity-60"
        aria-label="Enter your email to get PEC Summit updates"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-green shrink-0 disabled:opacity-60"
        id="footer-subscribe-btn"
        aria-label="Subscribe to PEC Summit updates"
      >
        {isSubmitting ? (
          <Loader2 size={16} aria-hidden="true" className="animate-spin" />
        ) : (
          <>
            Get Updates
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  )
}

const SOCIAL_LINKS = [
  { icon: Instagram, href: FEST_META.social.instagram, label: 'E-Cell PEC on Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'E-Cell PEC on YouTube' },
  { icon: Twitter, href: FEST_META.social.twitter, label: 'E-Cell PEC on X' },
  { icon: Facebook, href: 'https://facebook.com', label: 'E-Cell PEC on Facebook' },
  { icon: Linkedin, href: FEST_META.social.linkedin, label: 'E-Cell PEC on LinkedIn' },
]

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  { label: 'Tracks', href: '#tracks' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Register', href: '/register' },
]

export function RegisterCTA() {
  return (
    <div
      id="register"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-[#081C16] text-white sm:-mt-12 sm:rounded-t-[50px] md:rounded-t-[60px] border-t border-[#7ED321]/20 pt-28 pb-44 sm:pt-36 sm:pb-56 md:pb-64"
      aria-labelledby="footer-cta-heading"
    >
      {/* ── Lightweight Hardware-Accelerated Radial Mesh Glow (NO CPU Blur Filter) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(126, 211, 33, 0.12) 0%, rgba(124, 58, 237, 0.08) 45%, transparent 70%)',
        }}
      />

      {/* ── Left 3D Perspective Geometric Glass Panel (Steep 3D Tilt) ───────────── */}
      <motion.div
        initial={{ opacity: 0, x: -220, rotateY: 42, rotateX: 12, rotateZ: -8, scale: 0.8 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 28, rotateX: 6, rotateZ: -4, scale: 0.9 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 hidden xl:block w-[420px] h-[280px] rounded-[36px] border border-white/20 bg-[#0A140F]/90 p-6 shadow-2xl z-0 will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)',
        }}
      >
        <div className="h-full w-full rounded-[24px] border border-white/10 bg-[#040705] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7ED321_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="h-28 w-28 rounded-full border border-[#7ED321]/30 bg-[#7ED321]/10" />
          <div className="h-16 w-16 rounded-2xl border border-white/20 bg-white/5" />
        </div>
      </motion.div>

      {/* ── Right 3D Perspective Geometric Glass Panel (Steep 3D Tilt) ──────────── */}
      <motion.div
        initial={{ opacity: 0, x: 220, rotateY: -42, rotateX: 12, rotateZ: 8, scale: 0.8 }}
        whileInView={{ opacity: 1, x: 0, rotateY: -28, rotateX: 6, rotateZ: 4, scale: 0.9 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 hidden xl:block w-[420px] h-[280px] rounded-[36px] border border-white/20 p-6 shadow-2xl z-0 will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, rgba(124,58,237,0.2) 0%, rgba(244,63,94,0.15) 50%, rgba(7,11,8,0.9) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)',
        }}
      >
        <div className="h-full w-full rounded-[24px] border border-white/15 bg-black/60 relative overflow-hidden flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border border-purple-500/30 bg-purple-500/15" />
          <div className="h-20 w-20 rounded-full border border-pink-400/30 bg-pink-400/10" />
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
          {/* Top Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-white">
              PEC SUMMIT 2026 • MARCH 15-16
            </span>
          </div>

          {/* Main Headline */}
          <h2
            id="footer-cta-heading"
            className="mb-6 font-display font-black uppercase text-center text-mint leading-none tracking-tight drop-shadow-lg"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 180px)' }}
          >
            REGISTER
          </h2>

          {/* Subtitle */}
          <p className="mb-10 max-w-xl font-body text-base sm:text-lg leading-relaxed text-gray-300">
            Bring your startup to gallery scale — physical expo stalls, 24-hr hackathon arena, or pitch to top 50+ VCs &amp; Angels.
          </p>

          {/* Dual Pill CTA Pair */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/passes"
              className="btn-green flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold shadow-xl transition-transform hover:scale-105"
              id="footer-register-btn"
              aria-label="Claim Delegate Pass for PEC Summit"
            >
              <span>Claim Delegate Pass</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/passes"
              className="flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/15 hover:border-white"
              id="footer-schedule-btn"
              aria-label="Explore Full Summit Schedule"
            >
              <span>Explore Summit Passes</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Footer({ hideCTA = false }: { hideCTA?: boolean }) {
  return (
    <footer className="w-full bg-[#0D2420]">
      {!hideCTA && <RegisterCTA />}

      {/* Corporate EIC / PEC Footer */}
      <div className="border-mint/20 relative z-10 border-t bg-[#0D2420] py-12 text-white shadow-inner">
        <div className="section-container">
          {/* Top Social Bar */}
          <div className="border-mint/20 mb-10 flex flex-col items-center justify-between gap-4 border-b pb-8 sm:flex-row">
            <p className="font-body text-base font-medium text-gray-200">
              Get connected with us on social networks:
            </p>
            <div
              className="flex items-center gap-4 sm:gap-6"
              role="list"
              aria-label="Social media links"
            >
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  role="listitem"
                  className="border-mint/30 flex h-10 w-10 items-center justify-center rounded-xl border bg-[#07130F] text-white shadow-sm transition-all hover:scale-105 hover:border-mint hover:text-mint"
                >
                  <Icon size={18} aria-hidden="true" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* 4 Column Layout */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
            {/* Column 1 & 2: Branding and Description */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-6">
                <Image
                  src="/pec-logo.png"
                  alt="Punjab Engineering College Logo"
                  width={120}
                  height={80}
                  className="brightness-120 object-contain drop-shadow-md"
                />
                <Image
                  src="/eic-logo.png"
                  alt="EIC Logo"
                  width={90}
                  height={90}
                  className="brightness-120 object-contain drop-shadow-md"
                />
              </div>
              <p className="max-w-md font-body text-sm leading-relaxed text-gray-300">
                Entrepreneurship and Incubation Cell at PEC operates under the Ministry of
                Education&apos;s Innovation Cell Programs since 2015. EIC Provides mentoring in
                entrepreneurship, achieving its goal of nurturing businesses.
              </p>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h4 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-body text-sm font-medium text-gray-200 transition-colors hover:text-mint"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
                Contact
              </h4>
              <p className="mb-6 font-body text-sm leading-relaxed text-gray-300">
                Entrepreneurship and Incubation Cell, Punjab Engineering College, Chandigarh 160012
              </p>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Briefcase size={16} className="shrink-0 text-mint" />
                    <span className="font-body text-sm font-bold text-mint">
                      For Queries And Collaboration
                    </span>
                  </div>
                  <a
                    href="mailto:eicpec@pec.edu.in"
                    className="block pl-6 font-body text-sm font-medium text-gray-200 hover:text-mint hover:underline"
                  >
                    eicpec@pec.edu.in
                  </a>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Phone size={16} className="shrink-0 text-mint" />
                    <span className="font-body text-sm font-bold text-mint">
                      For General Contact
                    </span>
                  </div>
                  <a
                    href="mailto:info@ecellpec.in"
                    className="block pl-6 font-body text-sm font-medium text-gray-200 hover:text-mint hover:underline"
                  >
                    info@ecellpec.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="border-mint/20 flex flex-col items-center justify-between gap-4 border-t pt-10 font-mono-data text-xs text-gray-300 sm:flex-row">
            <p>© {new Date().getFullYear()} E-Cell PEC · Punjab Engineering College, Chandigarh</p>
            <p className="font-bold text-mint">PEC E-Summit 2026</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
