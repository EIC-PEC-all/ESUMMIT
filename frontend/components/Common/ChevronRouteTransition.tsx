'use client'

import React, { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// 5 Stacked horizontal color bands baked into a raw CSS linear-gradient for 60fps performance

export default function ChevronRouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle')
  const isNavigatingRef = useRef(false)
  const targetHrefRef = useRef<string | null>(null)

  // 1. Intercept all internal Link / Anchor clicks before Next.js can flash the new route
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Ignore external links, new tab clicks, hash-only anchors, or mailto/tel
      if (
        anchor.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return
      }

      // Check if href is the same page
      try {
        const targetUrl = new URL(href, window.location.origin)
        if (targetUrl.pathname === pathname) {
          if (targetUrl.hash) {
            const hashId = targetUrl.hash.replace('#', '')
            const el = document.getElementById(hashId)
            if (el) {
              e.preventDefault()
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }
          return
        }
      } catch (_) {
        return
      }

      // Intercept navigation: Cover screen FIRST with Chevron curtain
      e.preventDefault()
      if (isNavigatingRef.current) return
      isNavigatingRef.current = true
      targetHrefRef.current = href

      setPhase('enter')

      // Once screen is 100% covered at 450ms, execute Next.js router navigation
      setTimeout(() => {
        router.push(href)
      }, 450)
    }

    document.addEventListener('click', handleDocumentClick, { capture: true })
    return () => document.removeEventListener('click', handleDocumentClick, { capture: true })
  }, [pathname, router])

  // 2. When pathname changes, scroll to top and sweep the curtain out
  useEffect(() => {
    if (isNavigatingRef.current) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      const exitTimer = setTimeout(() => {
        setPhase('exit')
      }, 100)

      const idleTimer = setTimeout(() => {
        setPhase('idle')
        isNavigatingRef.current = false
        targetHrefRef.current = null
      }, 700)

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(idleTimer)
      }
    }
  }, [pathname])

  // 3. Support same-page anchor link transitions triggered by Nav
  useEffect(() => {
    const handleCustomTrigger = (e: Event) => {
      const customEvt = e as CustomEvent<{ targetId?: string; targetTop?: boolean }>
      setPhase('enter')

      setTimeout(() => {
        if (customEvt.detail?.targetTop) {
          window.scrollTo({ top: 0, behavior: 'auto' })
          window.history.pushState(null, '', window.location.pathname)
        } else if (customEvt.detail?.targetId) {
          // Setting the hash forces a native browser scroll jump. 
          // Since the screen is fully covered by the chevron right now, the jump is hidden.
          // This completely bypasses iOS Safari's async scroll-blocking protections.
          window.location.hash = `#${customEvt.detail.targetId}`
        }
        setPhase('exit')
      }, 450)

      setTimeout(() => {
        setPhase('idle')
      }, 1050)
    }

    window.addEventListener('trigger-chevron-transition', handleCustomTrigger)
    return () => window.removeEventListener('trigger-chevron-transition', handleCustomTrigger)
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Active Route Children */}
      {children}

      {/* ── Single-Layer Hardware Accelerated Transition ── */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            key="chevron-transition-overlay"
            className="fixed inset-0 z-[12000] pointer-events-none overflow-hidden select-none"
            initial={{ y: '100%' }}
            animate={{ y: phase === 'enter' ? '0%' : '-100%' }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{
              willChange: 'transform',
              background: `linear-gradient(to bottom, 
                #B8F068 0%, #B8F068 20%, 
                #7ED321 20%, #7ED321 40%, 
                #1A4D32 40%, #1A4D32 60%, 
                #0F3022 60%, #0F3022 80%, 
                #07130F 80%, #07130F 100%
              )`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
