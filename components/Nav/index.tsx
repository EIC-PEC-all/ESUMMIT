'use client'
// components/Nav/index.tsx
// Sticky transparent-to-solid navigation bar with smooth scroll + subpage support

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Ticket } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Passes', href: '/passes', sectionId: null, highlight: true },
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
        background: scrolled ? 'rgba(11,14,26,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(138,144,166,0.1)' : '1px solid transparent',
      }}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl tracking-wide"
          style={{ color: 'var(--text-primary)' }}
          aria-label="E-Summit — Home"
        >
          E-<span style={{ color: 'var(--accent-ignite)' }}>SUMMIT</span>
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
                  item.highlight ? 'text-signal font-semibold' : ''
                }`}
                style={{ color: item.highlight ? 'var(--accent-signal)' : 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = item.highlight ? 'var(--accent-signal)' : 'var(--text-muted)')
                }
              >
                {item.highlight && <Ticket size={14} className="text-signal" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Register & Passes CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/passes"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all duration-200"
            style={{
              background: 'rgba(61,217,255,0.1)',
              color: 'var(--accent-signal)',
              border: '1px solid rgba(61,217,255,0.3)',
            }}
          >
            <Ticket size={14} />
            Passes
          </Link>

          <a
            href="/#register"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="hidden md:inline-flex btn-ignite text-xs py-2 px-4"
            id="nav-register-btn"
            aria-label="Register for PEC Summit"
          >
            Register
          </a>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{ color: 'var(--text-muted)' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-4 pt-2"
          style={{ background: 'rgba(11,14,26,0.96)', borderBottom: '1px solid rgba(138,144,166,0.1)' }}
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
                  style={{ color: item.highlight ? 'var(--accent-signal)' : 'var(--text-muted)', borderColor: 'rgba(138,144,166,0.08)' }}
                >
                  <span>{item.label}</span>
                  {item.highlight && <Ticket size={16} className="text-signal" />}
                </Link>
              )
            })}
            <Link
              href="/passes"
              onClick={() => setMenuOpen(false)}
              className="btn-ignite w-full justify-center mt-4 text-sm py-3"
              id="nav-mobile-passes-btn"
            >
              Get Summit Passes
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
