'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { FEST_META } from '@/lib/data'
import { useSiteConfig } from '@/hooks/useSummitData'
import { Download, Bot, Sparkles } from 'lucide-react'
import NavHeader from './NavHeader'
import SponsorMarqueeBar from './SponsorMarqueeBar'
import NavMobileDrawer, { NavItem } from './NavMobileDrawer'

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', code: '01', href: '/', sectionId: null },
  { label: 'ABOUT', code: '02', href: '/#esummit-about', sectionId: 'esummit-about' },
  { label: 'EVENTS', code: '03', href: '/events', sectionId: null },
  { label: 'SPEAKERS', code: '04', href: '/speakers', sectionId: null },
  { label: 'TIMELINE', code: '05', href: '/timeline', sectionId: null },
  { label: 'ALUMNI', code: '06', href: '/#alumni', sectionId: 'alumni' },
  { label: 'GALLERY', code: '07', href: '/#gallery', sectionId: 'gallery' },
  { label: 'SPONSORS', code: '08', href: '/sponsors', sectionId: null },
  { label: 'FAQ', code: '09', href: '/faq', sectionId: null },
  { label: 'REGISTER', code: '10', href: '/register', sectionId: null },
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

  const { siteConfig } = useSiteConfig()
  const countdownTarget = siteConfig?.stats?.countdownTarget || FEST_META.countdownTarget

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

  const isHomePage = pathname === '/'
  const isHeroIntro = isHomePage && scrollYPos < 120

  const showHeader = useMemo(() => {
    if (isLoaderActive || isModalOpen) return false
    if (menuOpen) return true

    if (isHomePage) {
      if (isHeroIntro) return false
      return scrollDirection === 'up'
    }

    return !scrolled || scrollDirection === 'up'
  }, [isLoaderActive, isModalOpen, menuOpen, isHomePage, isHeroIntro, scrollDirection, scrolled])

  const showTopMarquee = useMemo(
    () => {
      if (isLoaderActive || isModalOpen || menuOpen) return false
      return scrolled && scrollDirection === 'down'
    },
    [isLoaderActive, isModalOpen, menuOpen, scrolled, scrollDirection]
  )

  const showBottomMarquee = useMemo(
    () => {
      if (isLoaderActive || isModalOpen) return false
      if (menuOpen) return true
      return !scrolled || scrollDirection === 'up'
    },
    [isLoaderActive, isModalOpen, scrolled, scrollDirection, menuOpen]
  )

  if (pathname === '/register') return null

  return (
    <>
      <NavHeader
        showHeader={showHeader}
        menuOpen={menuOpen}
        planCount={planCount}
        onToggleMenu={() => setMenuOpen((prev) => !prev)}
        headerButtonRef={headerButtonRef}
      />

      <SponsorMarqueeBar
        position="top"
        visible={showTopMarquee}
        countdownTarget={countdownTarget}
      />

      <SponsorMarqueeBar
        position="bottom"
        visible={showBottomMarquee}
        countdownTarget={countdownTarget}
      />

      {/* Mobile Bottom Action Bar (Visible when scrolling down on mobile) */}
      <div className={`fixed sm:hidden bottom-0 left-0 right-0 z-[2500] bg-[#07130F]/80 backdrop-blur-2xl border-t border-white/10 rounded-t-[24px] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-out shadow-[0_-8px_30px_rgba(0,0,0,0.5)] ${
        showTopMarquee ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center gap-3">
          <a
            href="/e-summit-brochure.pdf"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/10 py-3.5 shadow-md text-white font-mono-data text-[11px] font-bold tracking-wider uppercase active:scale-[0.98] transition-transform"
          >
            <Download size={16} className="text-mint" />
            <span>DOWNLOAD BROCHURE</span>
          </a>
          
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('toggle-concierge'))
              }
            }}
            className="w-[48px] h-[48px] shrink-0 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-[0.95] transition-transform relative"
            aria-label="Open AI Assistant"
          >
            <Sparkles size={20} strokeWidth={2.5} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-mint border border-white animate-pulse" />
          </button>
        </div>
      </div>

      <NavMobileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        navItems={NAV_ITEMS}
        onItemClick={handleItemClick}
      />
    </>
  )
}
