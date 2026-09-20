'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { FEST_META } from '@/lib/data'
import { useSiteConfig } from '@/hooks/useSummitData'
import NavHeader from './NavHeader'
import SponsorMarqueeBar from './SponsorMarqueeBar'
import NavMobileDrawer, { NavItem } from './NavMobileDrawer'

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', code: '01', href: '/', sectionId: null },
  { label: 'ABOUT', code: '02', href: '/#esummit-about', sectionId: 'esummit-about' },
  { label: 'EVENTS', code: '03', href: '/#event-portfolio', sectionId: 'event-portfolio' },
  { label: 'TIMELINE', code: '04', href: '/#timeline', sectionId: 'timeline' },
  { label: 'ALUMNI', code: '05', href: '/#alumni', sectionId: 'alumni' },
  { label: 'SPONSORS', code: '06', href: '/#sponsors', sectionId: 'sponsors' },
  { label: 'FAQ', code: '07', href: '/#faq', sectionId: 'faq' },
  { label: 'REGISTER', code: '08', href: '/register', sectionId: null },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
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
        const el = document.getElementById(hashId)
        if (el) {
          const headerOffset = 70
          const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        }
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

  const showHeader = useMemo(
    () => !isLoaderActive && !isModalOpen && (!scrolled || scrollDirection === 'up' || menuOpen),
    [isLoaderActive, isModalOpen, scrolled, scrollDirection, menuOpen]
  )
  const showTopMarquee = useMemo(
    () => !isLoaderActive && !isModalOpen && scrolled && scrollDirection === 'down' && !menuOpen,
    [isLoaderActive, isModalOpen, scrolled, scrollDirection, menuOpen]
  )
  const showBottomMarquee = useMemo(
    () => !isLoaderActive && !isModalOpen && (!scrolled || scrollDirection === 'up' || menuOpen),
    [isLoaderActive, isModalOpen, scrolled, scrollDirection, menuOpen]
  )

  if (pathname === '/register' || pathname === '/speakers') return null

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
