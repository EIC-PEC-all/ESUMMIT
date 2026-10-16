'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Download, Bot, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import NavHeader from './NavHeader'
import NavCountdown from './NavCountdown'
import NavMobileDrawer, { NavItem } from './NavMobileDrawer'

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', code: '01', href: '/', sectionId: null },
  { label: 'ABOUT', code: '02', href: '/about', sectionId: null },
  { label: 'PASSES', code: '03', href: '/passes', sectionId: null },
  { label: 'EVENTS', code: '04', href: '/events', sectionId: null },
  { label: 'SPEAKERS', code: '05', href: '/speakers', sectionId: null },
  { label: 'TIMELINE', code: '06', href: '/timeline', sectionId: null },
  { label: 'SPONSORS', code: '07', href: '/sponsors', sectionId: null },
]


export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [scrollYPos, setScrollYPos] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const headerButtonRef = useRef<HTMLButtonElement>(null)
  const prevScrollY = useRef(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')

  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (window.__SCROLL_LOADER_ACTIVE__ === false) return false
      if (window.__SCROLL_LOADER_ACTIVE__ === true || document.body.classList.contains('loader-active')) return true
      return pathname === '/'
    }
    return pathname === '/'
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [planCount, setPlanCount] = useState<number>(0)

  const { user } = useAuth()
  const [hasStoredPasses, setHasStoredPasses] = useState(false)

  useEffect(() => {
    const checkPasses = () => {
      try {
        const saved = localStorage.getItem('pec_summit_registrations')
        const passApps = localStorage.getItem('pec_user_pass_applications')
        const hasRegistrations = Boolean(saved && JSON.parse(saved).length > 0)
        const hasApplications = Boolean(passApps && JSON.parse(passApps).length > 0)
        setHasStoredPasses(hasRegistrations || hasApplications)
      } catch {
        setHasStoredPasses(false)
      }
    }
    checkPasses()
    window.addEventListener('storage', checkPasses)
    window.addEventListener('pec_auth_changed', checkPasses)
    window.addEventListener('pec_registration_success', checkPasses)
    return () => {
      window.removeEventListener('storage', checkPasses)
      window.removeEventListener('pec_auth_changed', checkPasses)
      window.removeEventListener('pec_registration_success', checkPasses)
    }
  }, [])

  const isRegistered = Boolean(user || hasStoredPasses)

  // Scroll tracking with RAF throttling
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrollYPos(latest)
    const isScrolled = latest > 120
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

  // Listen for loader and modal state
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

  // Sync personal itinerary count
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('pec_summit_my_plan')
        setPlanCount(saved ? JSON.parse(saved)?.length ?? 0 : 0)
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

  // Body drawer class toggle
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }
    return () => document.body.classList.remove('drawer-open')
  }, [menuOpen])

  // Cross-page and initial hash navigation
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const scrollToHash = () => {
        if (!window.location.hash) return
        const hashId = window.location.hash.replace('#', '')
        if (!hashId) return

        let retries = 0
        const tryScroll = () => {
          const el = document.getElementById(hashId)
          if (el) {
            const headerOffset = 70
            const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
          } else if (retries < 30) {
            retries++
            setTimeout(tryScroll, 100) // Try for up to 3 seconds
          }
        }
        tryScroll()
      }

      if (window.location.hash) {
        if (isLoaderActive) {
          const handleLoaderFinished = (e: Event) => {
            const customEvt = e as CustomEvent<{ active: boolean }>
            if (customEvt.detail?.active === false) {
              setTimeout(scrollToHash, 250)
            }
          }
          window.addEventListener('scroll-loader-state', handleLoaderFinished, { once: true })
        } else {
          const timer = setTimeout(scrollToHash, 150)
          return () => clearTimeout(timer)
        }
      }

      const handleHashChange = () => {
        setTimeout(scrollToHash, 50)
      }
      window.addEventListener('hashchange', handleHashChange)
      return () => {
        window.removeEventListener('hashchange', handleHashChange)
      }
    }
  }, [pathname, isLoaderActive])

  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
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
      }
    },
    [pathname]
  )

  const [isPastHero, setIsPastHero] = useState(false)

  // Track when hero section ends on mobile to switch from countdown to action bar
  useEffect(() => {
    const checkHero = () => {
      const heroEl = document.getElementById('esummit-hero')
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect()
        setIsPastHero(rect.bottom <= window.innerHeight)
      } else {
        setIsPastHero(window.scrollY > 80)
      }
    }

    checkHero()
    window.addEventListener('scroll', checkHero, { passive: true })
    window.addEventListener('resize', checkHero, { passive: true })
    return () => {
      window.removeEventListener('scroll', checkHero)
      window.removeEventListener('resize', checkHero)
    }
  }, [pathname])

  const showHeader = useMemo(() => {
    if (isLoaderActive || isModalOpen) return false
    if (menuOpen) return true

    return !scrolled || scrollDirection === 'up'
  }, [isLoaderActive, isModalOpen, menuOpen, scrollDirection, scrolled])

  if (pathname === '/register') return null

  const isModalOrLoader = Boolean(isLoaderActive || isModalOpen)
  const isSubPage = pathname !== '/'

  return (
    <>
      <NavHeader
        showHeader={showHeader}
        menuOpen={menuOpen}
        planCount={planCount}
        isRegistered={isRegistered}
        isModalOrLoaderOpen={isModalOrLoader}
        isSubPage={isSubPage}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        headerButtonRef={headerButtonRef}
      />

      {/* ── Mobile Fixed Bottom Section ── */}
      {/* 1. Countdown Bar: Visible while inside Hero section on mobile (landing page only) */}
      {pathname === '/' && <NavCountdown visible={!isPastHero && !isModalOrLoader} />}


      {/* 2. Download Brochure + Chat Action Bar: Floating pill on mobile */}
      <div
        className={`fixed sm:hidden bottom-3 left-3 right-3 z-[2400] bg-[#07130F]/90 backdrop-blur-2xl border border-white/15 rounded-full p-1.5 transition-all duration-400 ease-out shadow-[0_8px_30px_rgba(0,0,0,0.6)] ${
          isPastHero && !isModalOrLoader
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <a
            href="/e-summit-brochure.pdf"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 py-2.5 px-4 shadow-sm text-white font-mono-data text-[11px] font-bold tracking-wider uppercase active:scale-[0.98] transition-all"
          >
            <Download size={14} className="text-mint" />
            <span>DOWNLOAD BROCHURE</span>
          </a>
          
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('toggle-concierge'))
              }
            }}
            className="w-10 h-10 shrink-0 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-95 transition-transform relative cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <Sparkles size={18} strokeWidth={2.5} />
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-mint border-2 border-white animate-pulse" />
          </button>
        </div>
      </div>

      <NavMobileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        navItems={NAV_ITEMS}
        onItemClick={handleItemClick}
        isRegistered={isRegistered}
      />
    </>
  )
}
