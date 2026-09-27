// components/Common/ScrollExpandLoader.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window { __SCROLL_LOADER_ACTIVE__?: boolean }
}

export default function ScrollExpandLoader() {
  const [stage, setStage] = useState<'loading' | 'expanding' | 'done'>('loading')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__SCROLL_LOADER_ACTIVE__ === false) {
      // If we already completed the loader this session (persists on client nav, resets on F5)
      setStage('done')
      if (window.location.hash) {
        setTimeout(() => {
          const el = document.getElementById(window.location.hash.substring(1))
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
      return
    }
    // In React 18 StrictMode (dev only), effects run twice: mount → cleanup → remount.
    // Without this flag the cleanup's DOM teardown called setStage('done') on the
    // first invocation, flashing the loader away before the real run could start.
    let active = true

    const lockBody = () => {
      window.__SCROLL_LOADER_ACTIVE__ = true
      document.body.classList.add('loader-active')
      window.dispatchEvent(new CustomEvent('scroll-loader-state', { detail: { active: true } }))
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = '0px'
      document.body.style.width = '100%'
      window.scrollTo(0, 0)
    }

    const releaseBody = () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.__SCROLL_LOADER_ACTIVE__ = false
      document.body.classList.remove('loader-active')
      window.dispatchEvent(new CustomEvent('scroll-loader-state', { detail: { active: false } }))
    }

    const noScroll = (e: Event) => e.preventDefault()
    const noKeys = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault()
      }
    }

    lockBody()
    window.addEventListener('wheel', noScroll, { passive: false })
    window.addEventListener('touchmove', noScroll, { passive: false })
    window.addEventListener('keydown', noKeys, { passive: false })

    const unlock = () => {
      // Only the active invocation may transition React state.
      // The StrictMode cleanup invocation has active=false and must only
      // handle DOM cleanup, not state — otherwise it kills the loader instantly.
      if (active) setStage('done')
      releaseBody()
      window.removeEventListener('wheel', noScroll)
      window.removeEventListener('touchmove', noScroll)
      window.removeEventListener('keydown', noKeys)
    }

    const t1 = setTimeout(() => { if (active) setStage('expanding') }, 900)

    const t2 = setTimeout(() => {
      if (!active) return
      window.__SCROLL_LOADER_ACTIVE__ = false
      document.body.classList.remove('loader-active')
      window.dispatchEvent(new CustomEvent('scroll-loader-state', { detail: { active: false } }))
    }, 1300)

    const t3 = setTimeout(unlock, 1600)

    const onHide = () => { if (document.hidden) unlock() }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('blur', unlock)

    return () => {
      active = false
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('blur', unlock)
      // Restore DOM state without touching React state (safe for StrictMode cleanup)
      releaseBody()
      window.removeEventListener('wheel', noScroll)
      window.removeEventListener('touchmove', noScroll)
      window.removeEventListener('keydown', noKeys)
    }
  }, [])

  if (stage === 'done') return null

  return (
    <AnimatePresence>
      {/*
        Outer wrapper fades out with a delay so it's already semi-transparent
        by the time the aperture scale crosses 1.0 (where box-shadow leaves the
        viewport). This bridges the lime-disappearance moment cleanly.
      */}
      <motion.div
        key="loader-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'expanding' ? 0 : 1 }}
        transition={{ opacity: { duration: 0.55, delay: 0.4, ease: 'easeIn' } }}
      >
        {/*
          Aperture div: 100vw × 100vh base, scaled down to show the lime border.
          During expansion it scales up — the hero shows through (transparent bg)
          and the lime border shrinks naturally as the element fills the viewport.
        */}
        <motion.div
          className="relative flex items-end justify-center border-2 border-black/25"
          style={{
            width: '100vw',
            height: '100vh',
            transformOrigin: 'center center',
            willChange: 'transform',
            boxShadow: '0 0 0 9999px var(--accent-mint, #00F5D4)',
          }}
          initial={{ scaleX: 0.68, scaleY: 0.62, borderRadius: '24px' }}
          animate={
            stage === 'expanding'
              ? { scaleX: 1.8, scaleY: 1.8, borderRadius: '0px' }
              : { scaleX: 0.68, scaleY: 0.62, borderRadius: '24px' }
          }
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient grid on the aperture mask */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: '-9999px',
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              opacity: 0.13,
            }}
          />

          {/* Inner vignette — fades before expansion */}
          <motion.div
            animate={{ opacity: stage === 'expanding' ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.65)]"
          />

          {/* Progress bar */}
          <motion.div
            animate={{ opacity: stage === 'expanding' ? 0 : 1, y: stage === 'expanding' ? 12 : 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 mb-8"
          >
            <div className="w-44 h-[5px] bg-black/60 rounded-full overflow-hidden border border-white/20 shadow-md">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-mint rounded-full origin-left"
                style={{ willChange: 'transform', boxShadow: '0 0 8px var(--accent-mint, #00F5D4)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
