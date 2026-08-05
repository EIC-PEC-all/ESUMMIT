'use client'
// components/Nav/index.tsx
// Minimal Header + Fixed Sponsor Marquee + Right-Side Off-Canvas Sidebar Drawer with Page Shrink Effect

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Ticket, Zap, ArrowUpRight, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SPONSORS, FEST_META } from '@/lib/data'

import Magnetic from '@/components/Common/Magnetic'

const NAV_ITEMS = [
  { label: 'HOME', code: '01', href: '/', sectionId: null },
  { label: 'PASSES', code: '02', href: '/passes', sectionId: null },
  { label: 'TRACKS', code: '03', href: '/tracks', sectionId: 'tracks' },
  { label: 'SPEAKERS', code: '04', href: '/speakers', sectionId: 'speakers' },
  { label: 'SCHEDULE', code: '05', href: '/schedule', sectionId: 'schedule' },
  { label: 'SPONSORS', code: '06', href: '/sponsors', sectionId: 'sponsors' },
  { label: 'FAQ', code: '07', href: '/faq', sectionId: 'faq' },
]

const SPONSOR_ITEMS = [
  ...SPONSORS.title.map((s) => ({ ...s, tier: 'Title Partner' })),
  ...SPONSORS.gold.map((s) => ({ ...s, tier: 'Gold Sponsor' })),
  ...SPONSORS.silver.map((s) => ({ ...s, tier: 'Ecosystem Partner' })),
  ...SPONSORS.media.map((s) => ({ ...s, tier: 'Media Partner' })),
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Framer Motion useScroll hook
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  // Toggle body class for page shrink effect
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }
    return () => {
      document.body.classList.remove('drawer-open')
    }
  }, [menuOpen])

  // Click-outside drawer listener
  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  // Escape key listener
  useEffect(() => {
    if (!menuOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[0]) => {
    if (pathname === '/' && item.sectionId) {
      e.preventDefault()
      setMenuOpen(false)
      const el = document.getElementById(item.sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      setMenuOpen(false)
    }
  }

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-500 ease-out 
          top-0 left-0 right-0 w-full rounded-none
          lg:top-4 lg:left-1/2 lg:w-[calc(100%-2rem)] lg:max-w-5xl lg:rounded-full
          ${scrolled || menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'} 
          ${menuOpen ? 'lg:-translate-x-[calc(50%+190px)]' : 'lg:-translate-x-1/2'}`}
        style={{
          background: scrolled ? 'rgba(7, 11, 8, 0.85)' : 'rgba(7, 11, 8, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(80, 227, 194, 0.2)',
          boxShadow: scrolled ? '0 10px 40px rgba(0, 0, 0, 0.6)' : 'none',
        }}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          {/* Left: Logo */}
          <Link
            href="/"
            className="font-display text-xl tracking-wider flex items-center gap-2 shrink-0 group"
            aria-label="E-Summit '26 — Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#50E3C2]/15 border border-[#50E3C2]/40 flex items-center justify-center group-hover:border-[#50E3C2] transition-colors">
              <Zap size={16} className="text-[#50E3C2] fill-[#50E3C2]" />
            </div>
            <span className="font-bold text-white tracking-widest hidden sm:inline-block">E-SUMMIT</span>
          </Link>

          {/* Center: Empty to push buttons to right */}
          <div className="hidden lg:flex flex-1" />

          {/* Right: Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!menuOpen && (
              <>
                <Magnetic strength={0.3}>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-concierge'))}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 lg:rounded-full rounded-sm font-mono-data text-xs font-semibold uppercase tracking-wider transition-all duration-200 bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    aria-label="Open My Plan"
                  >
                    MY PLAN
                  </button>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link
                    href="/passes"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 lg:rounded-full rounded-sm font-mono-data text-xs font-semibold uppercase tracking-wider transition-all duration-200 bg-[#50E3C2]/10 text-[#50E3C2] hover:bg-[#50E3C2]/20 border border-[#50E3C2]/30 hover:border-[#50E3C2]"
                    id="nav-passes-btn"
                  >
                    <Ticket size={14} />
                    <span>PASSES</span>
                  </Link>
                </Magnetic>
              </>
            )}

            {/* Hamburger Trigger Button */}
            <Magnetic strength={0.3}>
              <button
                className="p-2 sm:px-4 sm:py-2 lg:rounded-full rounded-sm text-white hover:text-[#50E3C2] bg-[#0D140E]/80 border border-white/10 hover:border-[#50E3C2] transition-all flex items-center gap-2 font-mono-data text-xs font-bold uppercase tracking-wider cursor-pointer backdrop-blur-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close navigation sidebar" : "Open navigation sidebar"}
                aria-expanded={menuOpen}
              >
                <Menu size={16} />
                <span className="hidden sm:inline">{menuOpen ? 'CLOSE' : 'MENU'}</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Sponsor Marquee (No pills, no slashes) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#070B08]/95 backdrop-blur-md border-t border-[#50E3C2]/20 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-out ${scrolled || menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#070B08] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#070B08] to-transparent" />
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] items-center">
          {[...SPONSOR_ITEMS, ...SPONSOR_ITEMS, ...SPONSOR_ITEMS].map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="inline-flex items-center gap-2 mx-5 font-mono-data text-[10px] sm:text-xs shrink-0"
            >
              <span className="text-[#50E3C2] font-bold">•</span>
              <span className="text-gray-200 font-bold tracking-widest uppercase">{item.name}</span>
              <span className="text-[#8A9488] font-bold uppercase tracking-widest ml-1">{item.tier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OFF-CANVAS SIDEBAR MENU DRAWER (RIGHT-SIDE) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay (Mobile only, no blur on desktop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 lg:hidden z-[998]"
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
            />

            {/* Right-Side Off-Canvas Drawer Panel — Solid Electric Emerald (#50E3C2) */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full lg:w-[380px] z-[999] bg-[#50E3C2] text-[#070B08] shadow-[0_0_60px_rgba(80, 227, 194,0.4)] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto border-l-4 border-[#070B08]"
              role="dialog"
              aria-label="Navigation Menu Drawer"
            >
              {/* Drawer Top Header & Close Box */}
              <div>
                <div className="flex items-center justify-between pb-5 border-b-2 border-[#070B08]/20 mb-8">
                  <div className="flex items-center gap-2">
                    <Zap size={22} className="text-[#070B08] fill-[#070B08]" />
                    <span className="font-mono-data text-xs font-black uppercase tracking-[0.25em] text-[#070B08]">
                      E-SUMMIT &apos;26
                    </span>
                  </div>

                  {/* High-Contrast Black Close Box Button */}
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-11 h-11 bg-[#070B08] text-white font-black flex items-center justify-center border-2 border-black hover:bg-black/80 transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
                    aria-label="Close navigation sidebar"
                  >
                    <X size={24} className="stroke-[3]" />
                  </button>
                </div>

                {/* Vertical Bold Navigation Links */}
                <nav className="flex flex-col gap-3" aria-label="Sidebar navigation">
                  {NAV_ITEMS.map((item) => {
                    const targetHref = pathname === '/' && item.sectionId ? `#${item.sectionId}` : item.href
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.label}
                        href={targetHref}
                        onClick={(e) => handleItemClick(e, item)}
                        className="group flex items-baseline justify-between py-2 border-b border-[#070B08]/15 transition-all"
                      >
                        <span
                          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight transition-colors ${
                            isActive ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]' : 'text-[#070B08] group-hover:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="font-mono-data text-xs text-[#070B08]/70 group-hover:text-white transition-colors font-black tracking-widest">
                          {item.code}
                        </span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Socials & Quick Meta */}
              <div className="pt-6 border-t-2 border-[#070B08]/20 mt-6 flex flex-col gap-5">
                <div>
                  <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-[#070B08] font-black block mb-2.5">
                    SOCIALS &amp; CONNECT
                  </span>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono-data text-xs text-[#070B08] font-bold">
                    <a href={FEST_META.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      <span>Instagram</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <a href={FEST_META.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#070B08] hover:underline transition-colors flex items-center gap-1">
                      <span>LinkedIn</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <a href={FEST_META.social.twitter} target="_blank" rel="noreferrer" className="hover:text-[#070B08] hover:underline transition-colors flex items-center gap-1">
                      <span>Twitter</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <a href="mailto:eic@pec.edu.in" className="hover:text-[#070B08] hover:underline transition-colors flex items-center gap-1">
                      <span>Email</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono-data text-[#070B08]/80 font-bold pt-2 border-t border-[#070B08]/15">
                  <span>{FEST_META.dates}</span>
                  <span>{FEST_META.venue}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
