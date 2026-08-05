'use client'
// components/Footer/index.tsx
// Register CTA + email capture + social links + credits (Money/Fintech Green Theme)

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Instagram, Twitter, Linkedin, Send, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { FEST_META } from '@/lib/data'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', {
        style: { background: '#0D140E', color: '#F5F5F0', border: '1px solid #7ED321' },
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
        background: '#0D140E',
        color: '#F5F5F0',
        border: '1px solid #7ED321',
      },
      iconTheme: { primary: '#7ED321', secondary: '#070B08' },
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
          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#7ED321]/20 border border-[#7ED321]/40 text-[#7ED321]"
          aria-hidden="true"
        >
          <Send size={14} />
        </div>
        <p className="font-mono-data text-sm text-[#7ED321] font-bold">
          You&apos;re on the list. Watch your inbox.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
      <label htmlFor="footer-email" className="sr-only">Email address</label>
      <input
        id="footer-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 font-body text-sm outline-none bg-[#0D140E] border border-[#7ED321]/30 rounded-lg px-4 py-3 text-white focus:border-[#7ED321] focus:shadow-[0_0_15px_rgba(126,211,33,0.3)]"
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
  { icon: Twitter, href: FEST_META.social.twitter, label: 'E-Cell PEC on Twitter/X' },
  { icon: Linkedin, href: FEST_META.social.linkedin, label: 'E-Cell PEC on LinkedIn' },
]

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Tracks', href: '#tracks' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'FAQ', href: '#faq' },
]

export default function Footer() {
  return (
    <footer
      id="register"
      className="bg-[#070B08] border-t border-[#7ED321]/25 relative overflow-hidden"
      aria-labelledby="footer-cta-heading"
    >
      {/* Circuit board closing moment */}
      <CircuitBoard prefersReduced={false} />

      {/* Top Green Glow Line Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      {/* Main CTA block */}
      <div
        className="py-24 lg:py-32 relative z-10"
        style={{
          background: `linear-gradient(160deg, rgba(126,211,33,0.06) 0%, transparent 60%)`,
        }}
      >
        <div className="section-container">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-[#7ED321] fill-[#7ED321]" />
                <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[#7ED321] font-bold">
                  Official E-Cell PEC Summit
                </p>
              </div>

              <h2
                id="footer-cta-heading"
                className="font-display leading-none mb-6"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: 'var(--text-primary)' }}
              >
                REGISTER<br />
                <span className="text-stroke-green">NOW</span>
              </h2>
              <p className="font-body text-base mb-8 max-w-md leading-relaxed text-[#8A9488]">
                Early-bird passes are limited. Lock in your spot and be part of North India&apos;s premier entrepreneurship summit.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/register"
                  className="btn-green text-base py-4 px-10 rounded-xl font-bold flex items-center gap-2"
                  id="footer-register-btn"
                  aria-label="Open PEC Summit Registration Dashboard"
                >
                  Register Now
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:info@ecellpec.in"
                  className="btn-ghost py-4 px-8 rounded-xl"
                  id="footer-contact-btn"
                  aria-label="Contact E-Cell PEC"
                >
                  Contact Us
                </a>
              </div>

              {/* Email subscribe */}
              <div className="mb-6">
                <p className="font-mono-data text-xs uppercase tracking-widest mb-3 text-[#7ED321] font-bold">
                  ⚡ Get Summit Updates
                </p>
                <EmailCapture />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="py-8 border-t border-[#7ED321]/15 relative z-10 bg-[#070B08]/90">
        <div className="section-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl mb-1 text-white flex items-center gap-1">
              PEC <span className="text-[#7ED321]">SUMMIT</span>
            </p>
            <p className="font-mono-data text-xs text-[#8A9488]">
              © {new Date().getFullYear()} E-Cell PEC · Punjab Engineering College, Chandigarh
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-[#8A9488] hover:text-[#7ED321] transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3" role="list" aria-label="Social media links">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                role="listitem"
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#0D140E] border border-[#7ED321]/20 text-[#8A9488] hover:text-[#7ED321] hover:border-[#7ED321] hover:shadow-[0_0_12px_rgba(126,211,33,0.3)] transition-all"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
