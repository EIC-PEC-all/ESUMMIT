'use client'
// components/Nav/index.tsx
// Nav bar: Dark background, subtle green glow line, neon green active link & CTA buttons

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Ticket, Zap, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Register', href: '/register', sectionId: null, highlight: true },
  { label: 'Passes', href: '/passes', sectionId: null, highlight: false },
  { label: 'Tracks', href: '/tracks', sectionId: 'tracks' },
  { label: 'Speakers', href: '/speakers', sectionId: 'speakers' },
  { label: 'Schedule', href: '/schedule', sectionId: 'schedule' },
  { label: 'Sponsors', href: '/sponsors', sectionId: 'sponsors' },
  { label: 'FAQ', href: '/faq', sectionId: 'faq' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[0]) => {
    if (pathname === '/' && item.sectionId) {
      e.preventDefault()
      setMenuOpen(false)
      const el = document.getElementById(item.sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7, 11, 8, 0.95)' : 'rgba(7, 11, 8, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(126, 211, 33, 0.3)'
          : '1px solid rgba(126, 211, 33, 0.15)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(126, 211, 33, 0.1)' : 'none',
      }}
    >
      <div className="section-container flex items-center justify-between h-16 sm:h-20">
        {/* Left: bolt/lightning icon mark + "E-SUMMIT" wordmark (bold white) */}
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl tracking-wider flex items-center gap-2 shrink-0 group"
          aria-label="E-Summit — Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#7ED321]/15 border border-[#7ED321]/40 flex items-center justify-center group-hover:border-[#7ED321] transition-colors">
            <Zap size={18} className="text-[#7ED321] fill-[#7ED321]" />
          </div>
          <span className="font-bold text-white tracking-widest">E-SUMMIT</span>
        </Link>

        {/* Center: nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const targetHref = pathname === '/' && item.sectionId ? `#${item.sectionId}` : item.href
            const isHighlight = item.highlight || (pathname === item.href && item.href !== '/')
            return (
              <Link
                key={item.label}
                href={targetHref}
                onClick={(e) => handleItemClick(e, item)}
                className={`font-body text-sm tracking-wide transition-all duration-200 flex items-center gap-1.5 py-1 ${
                  isHighlight ? 'text-[#7ED321] font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {isHighlight && <UserCheck size={14} className="text-[#7ED321]" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Outlined green button */}
          <Link
            href="/passes"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono-data text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-[#7ED321] text-[#7ED321] bg-transparent hover:bg-[#7ED321]/10"
            id="nav-passes-btn"
          >
            <Ticket size={14} />
            <span>🎫 PASSES</span>
          </Link>

          {/* Filled green button */}
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg font-body text-xs sm:text-sm font-bold transition-all duration-200 bg-[#7ED321] text-[#070B08] hover:bg-[#8FE42F] hover:shadow-[0_0_20px_rgba(126,211,33,0.5)] shrink-0"
            id="nav-register-btn"
            aria-label="Register for PEC E-Summit"
          >
            Register
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-6 pt-2"
          style={{ background: 'rgba(7, 11, 8, 0.98)', borderBottom: '1px solid rgba(126, 211, 33, 0.3)' }}
        >
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const targetHref = pathname === '/' && item.sectionId ? `#${item.sectionId}` : item.href
              const isHighlight = item.highlight || (pathname === item.href && item.href !== '/')
              return (
                <Link
                  key={item.label}
                  href={targetHref}
                  onClick={(e) => handleItemClick(e, item)}
                  className="block py-3 font-body text-base border-b flex items-center justify-between"
                  style={{
                    color: isHighlight ? '#7ED321' : '#D1D5DB',
                    borderColor: 'rgba(138, 148, 136, 0.15)',
                  }}
                >
                  <span>{item.label}</span>
                  {isHighlight && <UserCheck size={16} className="text-[#7ED321]" />}
                </Link>
              )
            })}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/passes"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#7ED321] text-[#7ED321] font-mono-data text-xs font-semibold uppercase tracking-wider"
              >
                <Ticket size={14} />
                🎫 PASSES
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center w-full py-3 rounded-lg bg-[#7ED321] text-[#070B08] font-body text-sm font-bold"
              >
                Register Now
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
