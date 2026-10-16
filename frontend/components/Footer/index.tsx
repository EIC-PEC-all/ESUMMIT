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
import dynamic from 'next/dynamic'
import DynamicWeightHeading from '../DynamicWeightHeading'

const CRTWarp = dynamic(() => import('@/components/ui/CRTWarp'), { ssr: false })
import { ScrollGradientFill, GlitchText } from '@/components/Common/TextAnims'
import StackedSlicedText from '@/components/ui/StackedSlicedText'
import { FEST_META } from '@/lib/data'
import { TOAST_STYLE } from '@/lib/constants'
import { useSiteConfig } from '@/hooks/useSummitData'
import { api } from '@/lib/api'
import { prefetchRegister } from '@/lib/prefetch'
import { useTheme } from '@/context/ThemeContext'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
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
        className="flex-1 rounded-xl border border-mint/30 bg-panel-alt px-4 py-3 font-body text-sm text-primary outline-none placeholder:text-muted focus:border-mint/60 transition-colors"
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
  { label: 'Passes', href: '/passes' },
  { label: 'Events', href: '/events' },
  { label: 'Speakers', href: '/speakers' },
  { label: 'Schedule', href: '/timeline' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Brochure (PDF)', href: '/e-summit-brochure.pdf' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Register', href: '/register' },
]

export function RegisterCTA() {
  const { theme, isLoaded } = useTheme()
  const isDark = !isLoaded || theme === 'dark'

  return (
    <div
      id="register"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] dark:bg-[#081310] bg-white text-slate-900 dark:text-white sm:-mt-12 sm:rounded-t-[50px] md:rounded-t-[60px] border-t dark:border-mint/20 border-emerald-500/15 py-16 sm:py-20 md:py-24 shadow-2xl"
      aria-labelledby="footer-cta-heading"
    >
      {/* ── CRT Warp Interactive Plasma Background (Visible in Dark Mode Only) ── */}
      {isDark && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
          <CRTWarp
            color="#74FB44"
            backgroundColor="#081310"
            speed={0.35}
            curvature={0.2}
            scanlineStrength={0.18}
            scanlineFrequency={180}
            waveAmplitude={0.2}
            waveFrequency={2.2}
            bloom={0.95}
            bloomRadius={1}
            noise={0.06}
            vignette={0.55}
            brightness={0.9}
            pixelation={1}
            rgbShift={0.01}
            mouseReact={true}
            mouseStrength={0.45}
            dpr={1}
            fps={30}
            paused={false}
          />
        </div>
      )}

      {/* ── Light Mode Luminous Soft Mint & Pure Canvas Backdrop ── */}
      <div className="absolute inset-0 z-0 pointer-events-none dark:hidden bg-gradient-to-b from-white via-[#F0F7F3] to-white" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] dark:hidden opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(5, 150, 105, 0.12) 0%, transparent 70%)',
        }}
      />
      {/* Soft Top and Bottom Luminous Fade for pristine section blending */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-[2] dark:hidden bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-[2] dark:hidden bg-gradient-to-t from-white to-transparent" />

      {/* Dark gradient vignettes for dark mode */}
      <div className="register-vignette pointer-events-none absolute inset-0 z-[1] hidden dark:block bg-gradient-to-b from-[#081310] via-transparent to-[#081310]" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-25 hidden dark:block"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(116, 251, 68, 0.12) 0%, transparent 68%)',
        }}
      />

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
            <span className="hidden dark:inline text-gradient-mint drop-shadow-[0_0_35px_var(--border-glow)]">REGISTER</span>
            <span className="dark:hidden font-black text-emerald-950 tracking-tight" style={{ background: 'linear-gradient(180deg, #064E3B 0%, #047857 60%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>REGISTER</span>
          </h2>

          {/* Subtitle */}
          <p className="mb-10 max-w-xl font-body text-base sm:text-lg leading-relaxed dark:text-gray-200 text-slate-800 font-medium">
            Join 3,000+ builders, founders, and investors at Punjab Engineering College. Secure your summit pass for keynote sessions, hackathons, and pitch tracks.
          </p>

          {/* Single Primary Pill CTA */}
          <div className="flex items-center justify-center">
            <Link
              href="/register"
              onMouseEnter={prefetchRegister}
              onTouchStart={prefetchRegister}
              onFocus={prefetchRegister}
              className="btn-mint-gradient flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer dark:text-[#060D0B] text-white"
              id="footer-register-btn"
              aria-label="Claim Your Pass for E-Summit"
            >
              <span>Claim Your Pass</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Footer({ hideCTA = false }: { hideCTA?: boolean }) {
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
      {!hideCTA && <RegisterCTA />}

      {/* Corporate EIC / PEC Footer */}
      <div 
        className="border-mint/20 relative z-10 border-t py-12 text-primary shadow-inner overflow-hidden"
        style={{ backgroundColor: 'var(--bg-section-1)' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
        <div className="section-container relative z-10">
          {/* Top Social Bar */}
          <div className="border-mint/20 mb-10 flex flex-col items-center justify-between gap-4 border-b pb-8 sm:flex-row">
            <p className="font-body text-base font-medium text-secondary">
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
                  className="border-mint/30 flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-xl border bg-panel text-primary shadow-sm transition-all hover:scale-105 hover:border-mint hover:text-mint"
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
              <div className="mb-6 flex flex-col gap-4">
                <Link href="/" className="footer-logo-badge inline-flex items-center px-4 py-2 rounded-full dark:bg-transparent bg-[#061A12] border border-emerald-500/30 dark:border-transparent transition-all max-w-fit shadow-md dark:shadow-none" aria-label="PEC E-Summit '26 — Home">
                  <Image
                    src="/esummit-logo.png"
                    alt="PEC E-Summit '26 - Legacies Beyond Time"
                    width={280}
                    height={60}
                    className="h-10 sm:h-12 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-[0_0_20px_var(--border-glow)] hover:scale-[1.02] transition-transform"
                  />
                </Link>
                <div className="flex items-center gap-6 sm:gap-7 pt-1.5">
                  <Image
                    src="/pec-logo.png"
                    alt="Punjab Engineering College Logo"
                    width={150}
                    height={60}
                    className="h-12 sm:h-14 w-auto object-contain brightness-115 opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="h-10 sm:h-12 w-px bg-border-subtle" />
                  <Image
                    src="/eic-logo.png"
                    alt="EIC Logo"
                    width={70}
                    height={70}
                    className="h-14 sm:h-16 w-auto object-contain brightness-115 opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
              <p className="max-w-md font-body text-sm leading-relaxed text-secondary">
                Entrepreneurship and Incubation Cell at PEC operates under the Ministry of
                Education&apos;s Innovation Cell Programs since 2015. EIC Provides mentoring in
                entrepreneurship, achieving its goal of nurturing businesses.
              </p>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-primary">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-body text-sm font-semibold text-secondary transition-colors hover:text-mint inline-block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Team Leadership */}
            <div className="space-y-6 min-h-[420px] lg:min-h-0">
              <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-primary">
                Contact Us
              </h3>
              
              {/* Address */}
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-1.5">
                  CAMPUS VENUE
                </span>
                <p className="font-body text-xs sm:text-sm leading-relaxed text-secondary font-medium">
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
                    <span className="font-body text-secondary font-medium text-xs sm:text-sm">Helpdesk Support</span>
                    <a
                      href={`tel:${contacts.phone.replace(/\s+/g, '')}`}
                      className="font-mono-data text-xs text-mint/90 hover:text-mint hover:underline transition-colors shrink-0"
                    >
                      {contacts.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Student Leadership */}
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint block mb-2">
                  STUDENT CONVENERS
                </span>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2 py-0.5 border-b border-border-subtle">
                    <span className="font-body text-primary font-semibold">Vansh Gupta</span>
                    <a href="tel:+919041309108" className="font-mono-data text-xs text-mint font-bold hover:underline shrink-0">
                      +91 90413 09108
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-body text-primary font-semibold">Bhrigu Verma</span>
                    <a href="tel:+919478335331" className="font-mono-data text-xs text-mint font-bold hover:underline shrink-0">
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
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2 py-0.5 border-b border-border-subtle">
                    <span className="font-body text-primary font-semibold">General / Secretariat</span>
                    <a
                      href="mailto:eicpec@pec.edu.in"
                      className="font-mono-data text-xs text-mint font-bold hover:underline transition-colors shrink-0"
                      aria-label="Email EIC PEC Secretariat at eicpec@pec.edu.in"
                    >
                      eicpec@pec.edu.in
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="font-body text-primary font-semibold">Media &amp; Sponsorship</span>
                    <a
                      href="mailto:esummitpr.pec@gmail.com"
                      className="font-mono-data text-xs text-mint font-bold hover:underline transition-colors shrink-0"
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
          <div className="border-border-subtle flex flex-col items-center justify-between gap-4 border-t pt-8 pb-16 sm:pb-0 font-mono-data text-xs text-secondary font-medium sm:flex-row text-center sm:text-left">
            <p>© {new Date().getFullYear()} E-Cell PEC · Punjab Engineering College, Chandigarh</p>
            <p className="font-bold text-mint">PEC E-Summit 2026</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
