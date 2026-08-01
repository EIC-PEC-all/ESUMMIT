'use client'
// components/Nav/index.tsx
// Sticky transparent-to-solid navigation bar with Forest Green & Vibrant Orange Theme (Clean Mobile Header)

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Ticket, Zap, UserCheck, Bookmark } from 'lucide-react'
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
    const handleScroll = () => setScrolled(window.scrollY > 60)
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
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13,17,16,0.95)' : 'rgba(13,17,16,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(179,107,0,0.3)' : '1px solid rgba(179,107,0,0.15)',
      }}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl tracking-wide flex items-center gap-1 shrink-0"
          style={{ color: 'var(--text-primary)' }}
          aria-label="E-Summit — Home"
        >
          <Zap size={18} className="text-orange fill-orange" />
          <span>E-</span>
          <span className="text-orange">SUMMIT</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const targetHref = pathname === '/' && item.sectionId ? `#${item.sectionId}` : item.href
            return (
              <Link
                key={item.label}
                href={targetHref}
                onClick={(e) => handleItemClick(e, item)}
                className={`font-body text-sm transition-colors duration-150 flex items-center gap-1.5 ${
                  item.highlight ? 'text-orange font-bold' : ''
                }`}
                style={{ color: item.highlight ? 'var(--accent-orange)' : 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = item.highlight ? 'var(--accent-orange)' : 'var(--text-muted)')
                }
              >
                {item.highlight && <UserCheck size={14} className="text-orange" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/passes"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all duration-200"
            style={{
              background: 'rgba(255,153,0,0.12)',
              color: 'var(--accent-orange)',
              border: '1px solid rgba(255,153,0,0.4)',
            }}
          >
            <Ticket size={14} />
            Passes
          </Link>

          <Link
            href="/register"
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg btn-orange text-xs font-bold shrink-0"
            id="nav-register-btn"
            aria-label="Register for PEC Summit Dashboard"
          >
            Register
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted hover:text-primary transition-colors"
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
          style={{ background: 'rgba(13,17,16,0.98)', borderBottom: '1px solid rgba(179,107,0,0.3)' }}
        >
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const targetHref = pathname === '/' && item.sectionId ? `#${item.sectionId}` : item.href
              return (
                <Link
                  key={item.label}
                  href={targetHref}
                  onClick={(e) => handleItemClick(e, item)}
                  className="block py-3 font-body text-base border-b flex items-center justify-between"
                  style={{ color: item.highlight ? 'var(--accent-orange)' : 'var(--text-muted)', borderColor: 'rgba(124,142,133,0.15)' }}
                >
                  <span>{item.label}</span>
                  {item.highlight && <UserCheck size={16} className="text-orange" />}
                </Link>
              )
            })}
            <div className="pt-4 space-y-3">
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-orange w-full justify-center text-sm py-3"
                id="nav-mobile-register-btn"
              >
                Open Registration Dashboard
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
