'use client'
// components/Footer/index.tsx
// Register CTA + email capture + social links + credits (Voltage Theme)

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Instagram, Twitter, Linkedin, Send, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { FEST_META } from '@/lib/data'
import Link from 'next/link'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', {
        style: { background: '#151515', color: '#F2F2ED' },
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
        background: '#151515',
        color: '#F2F2ED',
        border: '1px solid #F5D400',
      },
      iconTheme: { primary: '#F5D400', secondary: '#0A0A0A' },
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
          className="w-8 h-8 rounded-full flex items-center justify-center bg-volt/20 border border-volt/40 text-volt"
          aria-hidden="true"
        >
          <Send size={14} />
        </div>
        <p className="font-mono-data text-sm text-volt">
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
        className="flex-1 font-body text-sm outline-none bg-void border border-volt-dim/30 rounded-lg px-4 py-3 text-primary focus:border-volt"
        aria-label="Enter your email to get PEC Summit updates"
      />
      <button
        type="submit"
        className="btn-volt"
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
      className="bg-panel border-t border-volt-dim/30 relative"
      aria-labelledby="footer-cta-heading"
    >
      {/* Current Line Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      {/* Main CTA block */}
      <div
        className="py-24 lg:py-32"
        style={{
          background: `linear-gradient(160deg, rgba(245,212,0,0.05) 0%, transparent 60%)`,
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
                <Zap size={16} className="text-volt fill-volt" />
                <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-volt">
                  Ready to Charge?
                </p>
              </div>

              <h2
                id="footer-cta-heading"
                className="font-display leading-none mb-6"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: 'var(--text-primary)' }}
              >
                REGISTER<br />
                <span className="text-volt">NOW</span>
              </h2>
              <p className="font-body text-base mb-8 max-w-md leading-relaxed text-muted">
                Early-bird passes are limited. Lock in your spot and be part of North India&apos;s premier high-voltage entrepreneurship summit.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/register"
                  className="btn-volt text-base py-4 px-10"
                  id="footer-register-btn"
                  aria-label="Open PEC Summit Registration Dashboard"
                >
                  Register Now
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:info@ecellpec.in"
                  className="btn-ghost"
                  id="footer-contact-btn"
                  aria-label="Contact E-Cell PEC"
                >
                  Contact Us
                </a>
              </div>

              {/* Email subscribe */}
              <div className="mb-6">
                <p className="font-mono-data text-xs uppercase tracking-widest mb-3 text-volt">
                  ⚡ Get Summit Updates
                </p>
                <EmailCapture />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="py-8 border-t border-[#8C8C86]/10">
        <div className="section-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl mb-1 text-primary flex items-center gap-1">
              PEC <span className="text-volt">SUMMIT</span>
            </p>
            <p className="font-mono-data text-xs text-muted">
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
                    className="font-body text-sm text-muted hover:text-volt transition-colors duration-150"
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
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-void border border-volt-dim/30 text-muted hover:text-volt hover:border-volt transition-all"
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
