'use client'
// components/Footer/index.tsx
// Register CTA + EIC/PEC Corporate Footer layout

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Instagram, Twitter, Linkedin, Send, Zap, Youtube, Facebook, Briefcase, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import DynamicWeightHeading from '../DynamicWeightHeading'
import CircuitBoard from '../Hero/CircuitBoard'
import { ScrollGradientFill, GlitchText } from '@/components/Common/TextAnims'
import { FEST_META } from '@/lib/data'

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

              <div
                id="footer-cta-heading"
                className="font-display leading-none mb-6 flex flex-col items-start"
                style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
              >
                <DynamicWeightHeading 
                  label="REGISTER"
                  style={{ color: 'var(--text-primary)' }}
                />
                <span className="text-white/60"><ScrollGradientFill text="NOW" /></span>
              </div>
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
                  <GlitchText text="Register Now" />
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:info@ecellpec.in"
                  className="btn-ghost py-4 px-8 rounded-xl"
                  id="footer-contact-btn"
                  aria-label="Contact E-Cell PEC"
                >
                  <GlitchText text="Contact Us" />
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
    </div>
  )
}

export default function Footer({ hideCTA = false }: { hideCTA?: boolean }) {
  return (
    <footer className="w-full">
      {!hideCTA && <RegisterCTA />}

      {/* Corporate EIC / PEC Footer */}
      <div className="py-12 relative z-10 bg-[#070B08] border-t border-[#7ED321]/20">
        <div className="section-container">
          
          {/* Top Social Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-[#7ED321]/15 mb-10 gap-4">
            <p className="font-body text-[#8A9488] text-base">
              Get connected with us on social networks:
            </p>
            <div className="flex items-center gap-4 sm:gap-6" role="list" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  role="listitem"
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0D140E] border border-[#7ED321]/20 text-[#8A9488] hover:text-[#7ED321] hover:border-[#7ED321] hover:shadow-[0_0_12px_rgba(126,211,33,0.3)] transition-all"
                >
                  <Icon size={18} aria-hidden="true" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* 4 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Column 1 & 2: Branding and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-6 mb-6">
                <Image 
                  src="/pec-logo.png" 
                  alt="Punjab Engineering College Logo" 
                  width={120} 
                  height={80} 
                  className="object-contain brightness-110"
                />
                <Image 
                  src="/eic-logo.png" 
                  alt="EIC Logo" 
                  width={90} 
                  height={90} 
                  className="object-contain brightness-110"
                />
              </div>
              <p className="font-body text-sm text-[#8A9488] leading-relaxed max-w-md">
                Entrepreneurship and Incubation Cell at PEC operates under the Ministry of Education&apos;s Innovation Cell Programs since 2015. EIC Provides mentoring in entrepreneurship, achieving its goal of nurturing businesses.
              </p>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h4 className="font-display text-2xl text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-body text-[#8A9488] hover:text-[#7ED321] transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="font-display text-2xl text-white mb-6">Contact</h4>
              <p className="font-body text-sm text-[#8A9488] mb-6 leading-relaxed">
                Entrepreneurship and Incubation Cell, Punjab Engineering College, Chandigarh 160012
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-[#8A9488]">
                    <Briefcase size={16} className="text-[#7ED321]" />
                    <span className="font-body text-sm font-medium text-white">For Queries And Collaboration</span>
                  </div>
                  <a href="mailto:eicpec@pec.edu.in" className="font-body text-sm text-[#7ED321] hover:underline block pl-6">
                    eicpec@pec.edu.in
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-[#8A9488]">
                    <Phone size={16} className="text-[#7ED321]" />
                    <span className="font-body text-sm font-medium text-white">For General Contact</span>
                  </div>
                  <a href="mailto:info@ecellpec.in" className="font-body text-sm text-[#7ED321] hover:underline block pl-6">
                    info@ecellpec.in
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright line */}
          <div className="mt-12 pt-6 border-t border-[#7ED321]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A9488] gap-4 font-mono-data">
            <p>© {new Date().getFullYear()} E-Cell PEC · Punjab Engineering College, Chandigarh</p>
            <p>PEC E-Summit 2026</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
