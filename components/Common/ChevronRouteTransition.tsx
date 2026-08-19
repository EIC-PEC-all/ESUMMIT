'use client'

import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// 5 Stacked horizontal color bands that sweep up in a layered curtain effect
const LAYERS = [
  { color: '#B8F068', height: '100%', id: 'stripe-lime' },
  { color: '#7ED321', height: '100%', id: 'stripe-mint' },
  { color: '#1A4D32', height: '100%', id: 'stripe-emerald-light' },
  { color: '#0F3022', height: '100%', id: 'stripe-emerald-dark' },
  { color: '#07130F', height: '100%', id: 'stripe-void' },
]

export default function ChevronRouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayPathname, setDisplayPathname] = useState(pathname)
  
  // 'idle' = normal page showing. 'enter' = sweeping up to cover. 'exit' = sweeping up to reveal
  const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle')
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (pathname !== displayPathname) {
      setPhase('enter')

      const timer = setTimeout(() => {
        setDisplayPathname(pathname)
        window.scrollTo(0, 0)
        setPhase('exit')
      }, 750)

      const endTimer = setTimeout(() => {
        setPhase('idle')
      }, 1500)

      return () => {
        clearTimeout(timer)
        clearTimeout(endTimer)
      }
    }
  }, [pathname, displayPathname])

  // Support same-page anchor link transitions triggered by Nav
  useEffect(() => {
    const handleCustomTrigger = (e: Event) => {
      const customEvt = e as CustomEvent<{ targetId?: string; targetTop?: boolean }>
      setPhase('enter')
      
      setTimeout(() => {
        if (customEvt.detail?.targetTop) {
          window.scrollTo({ top: 0, behavior: 'auto' })
        } else if (customEvt.detail?.targetId) {
          const el = document.getElementById(customEvt.detail.targetId)
          if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
        setPhase('exit')
      }, 750)

      setTimeout(() => {
        setPhase('idle')
      }, 1500)
    }

    window.addEventListener('trigger-chevron-transition', handleCustomTrigger)
    return () => window.removeEventListener('trigger-chevron-transition', handleCustomTrigger)
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Active Route Children */}
      {children}

      {/* ── Multi-Layered Stacked Horizontal Transition ── */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            key="chevron-transition-overlay"
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {LAYERS.map((layer, i) => {
              // Staggered delays create visible stacked horizontal bands as the wave sweeps up
              const delay = phase === 'enter' ? i * 0.08 : (4 - i) * 0.08

              return (
                <motion.div
                  key={layer.id}
                  className="absolute inset-0 flex flex-col justify-start"
                  initial={{ y: '100%' }}
                  animate={{ y: phase === 'enter' ? '0%' : '-100%' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.76, 0, 0.24, 1],
                    delay: delay,
                  }}
                  style={{
                    backgroundColor: layer.color,
                  }}
                >
                  {/* Leading accent line on each layer to emphasize stacked stripes */}
                  <div
                    className="w-full h-1 shrink-0"
                    style={{
                      backgroundColor: i === 0 ? '#FFFFFF' : LAYERS[Math.max(0, i - 1)].color,
                      boxShadow: i === 4 ? '0 0 20px rgba(126,211,33,0.9)' : 'none',
                    }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
