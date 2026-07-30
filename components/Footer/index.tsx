'use client'
// components/Footer/index.tsx
// Register CTA + email capture + social links + credits

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Instagram, Twitter, Linkedin, Send, Github } from 'lucide-react'
import toast from 'react-hot-toast'
import { FEST_META } from '@/lib/data'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.', {
        style: { background: 'var(--bg-panel)', color: 'var(--text-primary)' },
      })
      return
    }
    // Client-side only — store in localStorage
    const existing: string[] = JSON.parse(localStorage.getItem('pec_summit_subscribers') || '[]')
    if (!existing.includes(email)) {
      existing.push(email)
      localStorage.setItem('pec_summit_subscribers', JSON.stringify(existing))
    }
    setSubmitted(true)
    toast.success(`${email} — you're on the list!`, {
      duration: 4000,
      style: {
        background: 'var(--bg-panel)',
        color: 'var(--text-primary)',
        border: '1px solid rgba(61,217,255,0.3)',
      },
      iconTheme: { primary: '#3DD9FF', secondary: '#131829' },
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
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(61,217,255,0.15)', border: '1px solid rgba(61,217,255,0.3)' }}
          aria-hidden="true"
        >
          <Send size={14} style={{ color: 'var(--accent-signal)' }} />
        </div>
        <p className="font-mono-data text-sm" style={{ color: 'var(--accent-signal)' }}>
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
        className="flex-1 font-body text-sm outline-none"
        style={{
          background: 'rgba(138,144,166,0.07)',
          border: '1px solid rgba(138,144,166,0.15)',
          borderRadius: '6px',
          padding: '12px 16px',
          color: 'var(--text-primary)',
          minWidth: '220px',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(61,217,255,0.4)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(138,144,166,0.15)')}
        aria-label="Enter your email to get PEC Summit updates"
      />
      <button
        type="submit"
        className="btn-ignite"
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
      style={{ background: 'var(--bg-panel)', borderTop: '1px solid rgba(138,144,166,0.08)' }}
      aria-labelledby="footer-cta-heading"
    >
      {/* Main CTA block */}
      <div
        className="py-24 lg:py-32"
        style={{
          background: `linear-gradient(160deg, rgba(255,77,61,0.06) 0%, transparent 50%)`,
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
              <p
                className="font-mono-data text-xs uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--accent-ignite)' }}
              >
                Ready to Ignite?
              </p>
              <h2
                id="footer-cta-heading"
                className="font-display leading-none mb-6"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: 'var(--text-primary)' }}
              >
                REGISTER<br />
                <span style={{ color: 'var(--accent-ignite)' }}>NOW</span>
              </h2>
              <p className="font-body text-base mb-8 max-w-md leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Early-bird passes are limited. Lock in your spot and be part of the tricity&apos;s biggest student entrepreneurship summit.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <a
                  href="#"
                  className="btn-ignite"
                  id="footer-register-btn"
                  aria-label="Register for PEC Summit"
                  style={{ fontSize: '1rem', padding: '16px 40px' }}
                  // TODO: replace href with real registration link
                >
                  Register Now
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
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
                <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                  Get Summit Updates
                </p>
                <EmailCapture />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div
        className="py-8"
        style={{ borderTop: '1px solid rgba(138,144,166,0.06)' }}
      >
        <div className="section-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
              PEC SUMMIT
            </p>
            <p className="font-mono-data text-xs" style={{ color: 'var(--text-muted)' }}>
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
                    className="font-body text-sm transition-colors duration-150 hover:text-primary"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
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
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{
                  background: 'rgba(138,144,166,0.08)',
                  border: '1px solid rgba(138,144,166,0.1)',
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,77,61,0.3)'
                  e.currentTarget.style.color = 'var(--accent-ignite)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(138,144,166,0.1)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
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
