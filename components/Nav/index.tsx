'use client'
// components/Nav/index.tsx
// Minimal Header + Fixed Sponsor Marquee + Right-Side Off-Canvas Sidebar Drawer with Page Shrink Effect

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Ticket, Zap, ArrowUpRight, Calendar, MapPin, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SPONSORS, FEST_META } from '@/lib/data'

import Magnetic from '@/components/Common/Magnetic'

const NAV_ITEMS = [
  { label: 'HOME', code: '01', href: '/', sectionId: null },
  { label: 'ABOUT', code: '02', href: '/#esummit-about', sectionId: 'esummit-about' },
  { label: 'EVENTS', code: '03', href: '/#event-portfolio', sectionId: 'event-portfolio' },
  { label: 'ALUMNI', code: '04', href: '/#alumni', sectionId: 'alumni' },
  { label: 'SPEAKERS', code: '05', href: '/speakers', sectionId: null },
  { label: 'SPONSORS', code: '06', href: '/#sponsors', sectionId: 'sponsors' },
  { label: 'FAQ', code: '07', href: '/#faq', sectionId: 'faq' },
  { label: 'REGISTER', code: '08', href: '/register', sectionId: null },
]

const SPONSOR_ITEMS = [
  ...SPONSORS.title.map((s) => ({ ...s, tier: 'Title Partner' })),
  ...SPONSORS.gold.map((s) => ({ ...s, tier: 'Gold Sponsor' })),
  ...SPONSORS.silver.map((s) => ({ ...s, tier: 'Ecosystem Partner' })),
  ...SPONSORS.media.map((s) => ({ ...s, tier: 'Media Partner' })),
]

function NavCountdown({ targetISO }: { targetISO: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string } | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const target = new Date(targetISO)

    const checkState = () => {
      const curNow = Date.now()
      const start = target.getTime()
      const end = start + 2 * 24 * 60 * 60 * 1000 // 2 days duration
      const live = curNow >= start && curNow <= end
      setIsLive(live)

      if (!live) {
        const diff = start - curNow
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((diff / (1000 * 60)) % 60)
          const seconds = Math.floor((diff / 1000) % 60)
          
          const pad = (n: number) => String(n).padStart(2, '0')
          setTimeLeft({
            days: pad(days),
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds),
          })
        } else {
          setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        }
      }
    }

    checkState()
    const timer = setInterval(checkState, 1000)
    return () => clearInterval(timer)
  }, [targetISO])

  if (isLive) {
    return (
      <div className="flex items-center gap-1.5 text-mint select-none uppercase tracking-widest text-[9px] sm:text-xs">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        <span className="font-extrabold text-mint drop-shadow-[0_0_8px_rgba(0, 229, 153,0.8)]">LIVE</span>
      </div>
    )
  }

  if (!timeLeft) return <span className="opacity-0">--:--:--</span>

  return (
    <span className="font-mono-data text-[9px] sm:text-[11px] tracking-wider text-mint font-extrabold tabular-nums select-none uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(0, 229, 153,0.5)]">
      {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
    </span>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const pathname = usePathname()
  if (pathname === '/register' || pathname === '/speakers') return null
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (window.__SCROLL_LOADER_ACTIVE__ === false) return false
      if (window.__SCROLL_LOADER_ACTIVE__ === true || document.body.classList.contains('loader-active')) return true
      return pathname === '/'
    }
    return pathname === '/'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Listen to loader and modal state updates
  useEffect(() => {
    const checkState = () => {
      if (typeof window !== 'undefined') {
        setIsLoaderActive(Boolean(window.__SCROLL_LOADER_ACTIVE__ || document.body.classList.contains('loader-active')))
      }
    }
    checkState()

    const handleLoaderState = (e: Event) => {
      const customEvt = e as CustomEvent<{ active: boolean }>
      if (customEvt.detail !== undefined) {
        setIsLoaderActive(customEvt.detail.active)
      }
    }

    window.addEventListener('scroll-loader-state', handleLoaderState)

    const observer = new MutationObserver(() => {
      setIsModalOpen(document.body.classList.contains('modal-open'))
      checkState()
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => {
      window.removeEventListener('scroll-loader-state', handleLoaderState)
      observer.disconnect()
    }
  }, [])

  const [planCount, setPlanCount] = useState<number>(0)

  // Track personal itinerary plan items count
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('pec_summit_my_plan')
        if (saved) {
          const parsed = JSON.parse(saved)
          setPlanCount(Array.isArray(parsed) ? parsed.length : 0)
        } else {
          setPlanCount(0)
        }
      } catch {
        setPlanCount(0)
      }
    }

    updateCount()
    const handlePlanUpdated = (e: Event) => {
      const custom = e as CustomEvent<number>
      if (typeof custom.detail === 'number') {
        setPlanCount(custom.detail)
      } else {
        updateCount()
      }
    }

    window.addEventListener('pec_plan_updated', handlePlanUpdated)
    window.addEventListener('storage', updateCount)
    return () => {
      window.removeEventListener('pec_plan_updated', handlePlanUpdated)
      window.removeEventListener('storage', updateCount)
    }
  }, [])

  // Initialize theme from localStorage or document
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    const current = saved || document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(current as 'dark' | 'light')
    if (current === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.classList.remove('light')
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', nextTheme)
  }

  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const prevScrollY = useRef(0)

  // Framer Motion useScroll hook
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isScrolled = latest > 40
    setScrolled(isScrolled)

    const diff = latest - prevScrollY.current
    if (Math.abs(diff) > 5) {
      if (diff > 0 && latest > 80) {
        setScrollDirection('down')
      } else if (diff < 0) {
        setScrollDirection('up')
      }
    }
    prevScrollY.current = latest
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

  const headerButtonRef = useRef<HTMLButtonElement>(null)

  // Click-outside drawer listener
  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        headerButtonRef.current &&
        !headerButtonRef.current.contains(e.target as Node)
      ) {
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

  // Handle cross-page hash navigation on mount / route change
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '')
      if (hashId) {
        const timer = setTimeout(() => {
          const el = document.getElementById(hashId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 400)
        return () => clearTimeout(timer)
      }
    }
  }, [pathname])

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[0]) => {
    setMenuOpen(false)
    document.body.classList.remove('drawer-open')

    if (item.label === 'HOME' && pathname === '/') {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('trigger-chevron-transition', { detail: { targetTop: true } }))
      return
    }

    if (pathname === '/' && item.sectionId) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('trigger-chevron-transition', { detail: { targetId: item.sectionId } }))
      return
    }
  }

  const showHeader = !isLoaderActive && !isModalOpen && (!scrolled || scrollDirection === 'up' || menuOpen)
  const showTopMarquee = !isLoaderActive && !isModalOpen && scrolled && scrollDirection === 'down' && !menuOpen
  const showBottomMarquee = !isLoaderActive && !isModalOpen && (!scrolled || scrollDirection === 'up' || menuOpen)

  return (
    <>
      <header
        className={`fixed z-[2500] transition-all duration-500 ease-out 
          top-2 left-1/2 w-[calc(100%-1rem)] max-w-7xl rounded-full sm:top-4 sm:w-[calc(100%-2rem)] 
          bg-[#0A110E]/90 text-white backdrop-blur-2xl shadow-2xl border border-white/20
          ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'} 
          ${menuOpen 
            ? 'lg:w-[calc(100%-380px-3rem)] -translate-x-1/2 lg:-translate-x-[calc(50%+190px)]' 
            : 'lg:w-[calc(100%-3rem)] -translate-x-1/2'}`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-8">
          {/* Left: Logo */}
          <Link
            href="/"
            className="font-display text-xl sm:text-2xl tracking-wider flex items-center gap-1.5 sm:gap-2 shrink-0 group"
            aria-label="E-Summit '26 — Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-mint/20 border border-mint/40 flex items-center justify-center group-hover:border-mint transition-colors">
              <Zap size={16} className="text-mint fill-mint sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="font-black tracking-widest text-gradient-white text-xs sm:text-base">E-SUMMIT</span>
          </Link>

          {/* Center: Empty to push buttons to right */}
          <div className="hidden lg:flex flex-1" />

          {/* Right: Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!menuOpen && (
              <>
                <Magnetic strength={0.3}>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-my-plan'))}
                    className="hidden md:inline-flex btn-dark-gradient h-[34px] sm:h-[36px] box-border items-center justify-center gap-1.5 px-3.5 sm:px-4 rounded-full font-mono-data text-[11px] sm:text-xs font-bold uppercase tracking-wider leading-none transition-all duration-200 cursor-pointer"
                    aria-label="Open My Plan"
                  >
                    <span>MY PLAN</span>
                    {planCount > 0 && (
                      <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-mint text-void font-mono-data text-[10px] font-black leading-none">
                        {planCount}
                      </span>
                    )}
                  </button>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link
                    href="/register"
                    className="btn-mint-gradient h-[34px] sm:h-[36px] box-border inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-6 rounded-full font-mono-data text-[11px] sm:text-xs font-black uppercase tracking-wider leading-none transition-all duration-200 text-void cursor-pointer"
                    id="nav-passes-btn"
                  >
                    <Ticket size={13} className="text-void stroke-[2.5] sm:w-[14px] sm:h-[14px]" />
                    <span>REGISTER</span>
                  </Link>
                </Magnetic>
              </>
            )}

            {/* Hamburger Trigger Button */}
            <Magnetic strength={0.3}>
              <button
                ref={headerButtonRef}
                className="btn-dark-gradient h-[34px] sm:h-[36px] box-border inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider leading-none cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close navigation sidebar" : "Open navigation sidebar"}
                aria-expanded={menuOpen}
              >
                <Menu size={14} />
                <span className="hidden sm:inline">{menuOpen ? 'CLOSE' : 'MENU'}</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>


      {/* TOP SPONSOR MARQUEE BAR — Slides in when navbar hides */}
      <div
        className={`fixed top-0 left-0 right-0 z-[2500] bg-[#0A1A17] [.light_&]:bg-[#2A3B18] text-white backdrop-blur-md border-b border-mint/20 [.light_&]:border-[#4E6527]/50 py-2.5 shadow-2xl transition-all duration-500 ease-out ${
          isModalOpen
            ? '-translate-y-full opacity-0 pointer-events-none'
            : showTopMarquee
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Countdown — desktop only */}
        <div className="hidden sm:flex absolute left-0 top-0 bottom-0 z-20 items-center bg-[#07130F] [.light_&]:bg-[#1A2510] pl-4 pr-3 border-r border-mint/30 [.light_&]:border-[#4E6527]/40 shadow-[4px_0_15px_rgba(0,0,0,0.8)] shrink-0 select-none">
          <NavCountdown targetISO={FEST_META.countdownTarget} />
        </div>
        <div className="absolute left-0 sm:left-[125px] md:left-[155px] top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#0A1A17] [.light_&]:from-[#2A3B18] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#0A1A17] [.light_&]:from-[#2A3B18] to-transparent" />
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] items-center pl-4 sm:pl-[135px] md:pl-[165px]">
          {[...SPONSOR_ITEMS, ...SPONSOR_ITEMS, ...SPONSOR_ITEMS].map((item, i) => (
            <div
              key={`top-${item.id}-${i}`}
              className="inline-flex items-center gap-2 mx-5 font-mono-data text-[10px] sm:text-xs shrink-0"
            >
              <span className="text-mint [.light_&]:text-[#A0C868] font-bold">•</span>
              <span className="font-bold tracking-widest uppercase text-gradient-white">{item.name}</span>
              <span className="text-gradient-mint font-bold uppercase tracking-widest ml-1">{item.tier}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* BOTTOM SPONSOR MARQUEE BAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[2500] bg-[#0A1A17] [.light_&]:bg-[#2A3B18] text-white backdrop-blur-md border-t border-mint/20 [.light_&]:border-[#4E6527]/50 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-all duration-500 ease-out ${
          showBottomMarquee
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-[#07130F] [.light_&]:bg-[#1A2510] pl-4 pr-3 border-r border-mint/30 [.light_&]:border-[#4E6527]/40 shadow-[4px_0_15px_rgba(0,0,0,0.8)] shrink-0 select-none">
          <NavCountdown targetISO={FEST_META.countdownTarget} />
        </div>
        <div className="absolute left-[125px] sm:left-[155px] top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#0A1A17] [.light_&]:from-[#2A3B18] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#0A1A17] [.light_&]:from-[#2A3B18] to-transparent" />
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] items-center pl-[135px] sm:pl-[165px]">
          {[...SPONSOR_ITEMS, ...SPONSOR_ITEMS, ...SPONSOR_ITEMS].map((item, i) => (
            <div
              key={`bot-${item.id}-${i}`}
              className="inline-flex items-center gap-2 mx-5 font-mono-data text-[10px] sm:text-xs shrink-0"
            >
              <span className="text-mint [.light_&]:text-[#A0C868] font-bold">•</span>
              <span className="font-bold tracking-widest uppercase text-gradient-white">{item.name}</span>
              <span className="text-gradient-mint font-bold uppercase tracking-widest ml-1">{item.tier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OFF-CANVAS SIDEBAR MENU DRAWER (RIGHT-SIDE) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay (All screens with 2xl glassmorphic blur) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-2xl z-[11000]"
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
              className="fixed top-0 right-0 bottom-0 w-full lg:w-[380px] z-[11001] bg-mint text-void shadow-[0_0_60px_rgba(0, 229, 153,0.4)] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto border-l-4 border-void"
              role="dialog"
              aria-label="Navigation Menu Drawer"
            >
              {/* Drawer Top Header & Close Box */}
              <div>
                <div className="flex items-center justify-between pb-5 border-b-2 border-void/20 mb-8">
                  <div className="flex items-center gap-2">
                    <Zap size={22} className="text-void fill-void" />
                    <span className="font-mono-data text-xs font-black uppercase tracking-[0.25em] text-void">
                      E-SUMMIT &apos;26
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* High-Contrast Black Close Button */}
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-10 h-10 rounded-xl bg-void text-white font-bold flex items-center justify-center border border-void/30 hover:bg-black/90 transition-all cursor-pointer shadow-md"
                      aria-label="Close navigation sidebar"
                    >
                      <X size={20} className="stroke-[2.5]" />
                    </button>
                  </div>
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
                        className="group flex items-baseline justify-between py-2 border-b border-void/15 transition-all"
                      >
                        <span
                          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight transition-colors ${
                            isActive ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]' : 'text-void group-hover:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="font-mono-data text-xs text-void/70 group-hover:text-white transition-colors font-black tracking-widest">
                          {item.code}
                        </span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Socials & Quick Meta */}
              <div className="pt-6 border-t-2 border-void/20 mt-6 flex flex-col gap-5">
                <div>
                  <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-void font-black block mb-2.5">
                    SOCIALS &amp; CONNECT
                  </span>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono-data text-xs text-void font-bold">
                    <a href={FEST_META.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      <span>Instagram</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <a href={FEST_META.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-void hover:underline transition-colors flex items-center gap-1">
                      <span>LinkedIn</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <a href={FEST_META.social.twitter} target="_blank" rel="noreferrer" className="hover:text-void hover:underline transition-colors flex items-center gap-1">
                      <span>Twitter</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <a href="mailto:eic@pec.edu.in" className="hover:text-void hover:underline transition-colors flex items-center gap-1">
                      <span>Email</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono-data text-void/80 font-bold pt-2 border-t border-void/15">
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
