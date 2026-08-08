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
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import DynamicWeightHeading from '../DynamicWeightHeading'
import CircuitBoard from '../Hero/CircuitBoard'
import { ScrollGradientFill, GlitchText } from '@/components/Common/TextAnims'
import StackedSlicedText from '@/components/ui/StackedSlicedText'
import { FEST_META } from '@/lib/data'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', {
        style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
      })
      return
    }
    const existing: string[] = JSON.parse(localStorage.getItem('pec_summit_subscribers') || '[]')
    if (!existing.includes(email)) {
      existing.push(email)
      localStorage.setItem('pec_summit_subscribers', JSON.stringify(existing))
    }
    setSubmitted(true)
    toast.success(`${email} — you're on the list!`, {
      duration: 4000,
      style: {
        background: '#0A110E',
        color: '#FFFFFF',
        border: '1px solid var(--accent-mint)',
      },
      iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
    })
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
        className="flex-1 rounded-xl border border-[#4E6527]/60 bg-[#1E2B12] px-4 py-3 font-body text-sm text-white outline-none placeholder:text-gray-400 focus:border-[#C8E696]"
        aria-label="Enter your email to get PEC Summit updates"
      />
      <button
        type="submit"
        className="btn-green shrink-0"
        id="footer-subscribe-btn"
        aria-label="Subscribe to PEC Summit updates"
      >
        Get Updates
        <ArrowRight size={16} aria-hidden="true" />
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
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-[#0D2420] text-white sm:-mt-12 sm:rounded-t-[50px] md:rounded-t-[60px]"
      aria-labelledby="footer-cta-heading"
    >
      {/* Circuit board background accent */}
      <CircuitBoard prefersReduced={false} />

      {/* Main CTA block */}
      <div className="relative z-10 py-20 lg:py-28">
        <div className="section-container">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex w-full flex-col items-center text-center"
            >
              <h2
                id="footer-cta-heading"
                className="mb-6 font-display font-black uppercase leading-none tracking-tight text-center text-mint drop-shadow-lg"
                style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
              >
                REGISTER
              </h2>

              <p className="mb-10 max-w-lg font-body text-base leading-relaxed text-gray-200 sm:text-lg">
                Early-bird passes are limited. Lock in your spot and be part of North India&apos;s premier entrepreneurship summit.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="btn-green flex items-center gap-2 rounded-full px-10 py-4 text-base font-bold shadow-lg transition-transform hover:scale-105"
                  id="footer-register-btn"
                  aria-label="Open PEC Summit Registration Dashboard"
                >
                  <span>Register Now</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>

                <a
                  href="mailto:info@ecellpec.in"
                  className="flex items-center rounded-full border border-white/40 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
                  id="footer-contact-btn"
                  aria-label="Contact E-Cell PEC"
                >
                  <span>Contact Us</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
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
