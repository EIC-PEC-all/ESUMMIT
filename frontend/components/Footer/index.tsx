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
import { ScrollGradientFill, GlitchText } from '@/components/Common/TextAnims'
import StackedSlicedText from '@/components/ui/StackedSlicedText'
import { FEST_META } from '@/lib/data'
import { TOAST_STYLE } from '@/lib/constants'
import { useSiteConfig } from '@/hooks/useSummitData'
import { api } from '@/lib/api'
import { prefetchRegister } from '@/lib/prefetch'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', TOAST_STYLE)
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    // Sync to backend DB asynchronously
    api.subscribe(cleanEmail).catch(() => {
      // Non-critical fallback
    })

    try {
      const existing: string[] = JSON.parse(localStorage.getItem('pec_summit_subscribers') || '[]')
      if (!existing.includes(cleanEmail)) {
        existing.push(cleanEmail)
        localStorage.setItem('pec_summit_subscribers', JSON.stringify(existing))
      }
    } catch {
      // non-critical — continue
    }
    setSubmitted(true)
    toast.success(`${cleanEmail} — you're on the list!`, { ...TOAST_STYLE, duration: 4000 })
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 py-4"
      >
        <div
          className="bg-mint/20 border-mint/40 flex h-8 w-8 items-center justify-center rounded-full border text-mint"
          aria-hidden="true"
        >
          <Send size={14} />
        </div>
        <p className="font-mono-data text-sm font-bold text-mint">
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
        className="flex-1 rounded-xl border border-mint/30 bg-[#1E2B12] px-4 py-3 font-body text-sm text-white outline-none placeholder:text-gray-500 focus:border-mint/60 transition-colors"
        aria-label="Enter your email to get E-Summit updates"
      />
      <button
        type="submit"
        className="btn-green shrink-0"
        id="footer-subscribe-btn"
        aria-label="Subscribe to E-Summit updates"
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
  { label: 'About', href: '/about' },
  { label: 'Events & Tracks', href: '/events' },
  { label: 'Timeline & Schedule', href: '/timeline' },
  { label: 'Keynote Speakers', href: '/speakers' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Alumni Wall of Fame', href: '/alumni' },
  { label: 'Partners & Sponsors', href: '/sponsors' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Delegate Passes', href: '/passes' },
  { label: 'Register', href: '/register' },
]

import RegisterCTA from '@/components/RegisterCTA'
export { RegisterCTA }

export default function Footer({ hideCTA }: { hideCTA?: boolean } = {}) {
  const { siteConfig } = useSiteConfig()
  const contacts = siteConfig?.contacts as Record<string, string> | undefined

  const instagramUrl = contacts?.instagram || FEST_META.social.instagram
  const isEicInsta = instagramUrl.toLowerCase().includes('eic')

  const dynamicSocials = [
    { icon: Instagram, href: instagramUrl, label: isEicInsta ? 'EIC PEC on Instagram' : 'E-Cell PEC on Instagram' },
    { icon: Youtube, href: contacts?.youtube || 'https://youtube.com', label: 'E-Cell PEC on YouTube' },
    { icon: Twitter, href: FEST_META.social.twitter, label: 'E-Cell PEC on X' },
    { icon: Facebook, href: 'https://facebook.com', label: 'E-Cell PEC on Facebook' },
    { icon: Linkedin, href: contacts?.linkedin || FEST_META.social.linkedin, label: 'E-Cell PEC on LinkedIn' },
  ]

  return (
    <footer id="footer" className="w-full bg-section-2">
      {/* Corporate EIC / PEC Footer */}
      <div className="border-mint/20 relative z-10 border-t bg-section-2 py-12 text-white shadow-inner">
        <div className="section-container">
          {/* Top Social Bar */}
          <div className="border-mint/20 mb-10 flex flex-col items-center justify-between gap-4 border-b pb-8 sm:flex-row">
            <p className="font-body text-base font-medium text-gray-200">
              Get connected with us on social networks:
            </p>
            <div
              className="flex items-center gap-4 sm:gap-6"
              aria-label="Social media links"
            >
              {dynamicSocials.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="border-mint/30 flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-xl border bg-[#07130F] text-white shadow-sm transition-all hover:scale-105 hover:border-mint hover:text-mint"
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
                  style={{ width: 'auto', height: 'auto' }}
                  className="brightness-120 object-contain drop-shadow-md"
                />
                <Image
                  src="/eic-logo.png"
                  alt="EIC Logo"
                  width={90}
                  height={90}
                  style={{ width: 'auto', height: 'auto' }}
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
              <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm font-medium text-gray-300 transition-colors hover:text-mint inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Team Leadership */}
            <div className="space-y-6 min-h-[420px] lg:min-h-0">
              <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-white">
                Contact Us
              </h3>
              
              {/* Address */}
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-1.5">
                  CAMPUS VENUE
                </span>
                <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-200 font-medium">
                  {siteConfig?.summitVenue || 'Punjab Engineering College (Deemed to be University), Sector 12, Chandigarh, 160012'}
                </p>
              </div>

              {/* Helpline Phone */}
              {contacts?.phone && (
                <div>
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-1.5">
                    HELPLINE / SUPPORT
                  </span>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-body text-gray-200 font-medium text-xs sm:text-sm">Helpdesk Support</span>
                    <a
                      href={`tel:${contacts.phone.replace(/\s+/g, '')}`}
                      className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline transition-colors shrink-0"
                    >
                      {contacts.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Faculty Coordinators */}
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-2">
                  FACULTY COORDINATORS
                </span>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2 py-0.5 border-b border-white/[0.05]">
                    <span className="font-body text-gray-200 font-medium">Dr. Simranjit Singh</span>
                    <a href="tel:+919872552898" className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline shrink-0">
                      +91 98725 52898
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-body text-gray-200 font-medium">Dr. Sudesh Rani</span>
                    <a href="tel:+919876860085" className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline shrink-0">
                      +91 98768 60085
                    </a>
                  </div>
                </div>
              </div>

              {/* Student Leadership */}
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-2">
                  STUDENT CONVENERS
                </span>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2 py-0.5 border-b border-white/[0.05]">
                    <span className="font-body text-gray-200 font-medium">Vansh Gupta</span>
                    <a href="tel:+919041309108" className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline shrink-0">
                      +91 90413 09108
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-body text-gray-200 font-medium">Bhrigu Verma</span>
                    <a href="tel:+919478335331" className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline shrink-0">
                      +91 94783 35331
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Inquiries */}
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-2">
                  OFFICIAL INQUIRIES
                </span>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2 py-0.5 border-b border-white/[0.05]">
                    <span className="font-body text-gray-200 font-medium">General / Secretariat</span>
                    <a
                      href="mailto:eicpec@pec.edu.in"
                      className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline transition-colors shrink-0"
                      aria-label="Email EIC PEC Secretariat at eicpec@pec.edu.in"
                    >
                      eicpec@pec.edu.in
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-body text-gray-200 font-medium">Media &amp; Sponsorship</span>
                    <a
                      href="mailto:esummitpr.pec@gmail.com"
                      className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline transition-colors shrink-0"
                      aria-label="Email Public Relations & Sponsorship at esummitpr.pec@gmail.com"
                    >
                      esummitpr.pec@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="border-mint/20 flex flex-col items-center justify-between gap-4 border-t pt-8 pb-16 sm:pb-0 font-mono-data text-xs text-gray-400 sm:flex-row text-center sm:text-left">
            <p>© {new Date().getFullYear()} E-Cell PEC · Punjab Engineering College, Chandigarh</p>
            <p className="font-bold text-mint">PEC E-Summit 2026</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
