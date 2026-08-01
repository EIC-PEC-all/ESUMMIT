'use client'
// components/Providers/OpeningLoader.tsx
// Lightning Fast High-Precision Preloader for PEC Summit (0.4s Instant Reveal)

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function OpeningLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Session cache check
    const played = sessionStorage.getItem('pec_summit_intro_played')
    if (played) {
      setLoading(false)
      return
    }

    const startTime = Date.now()
    const duration = 400 // 0.4s ultra-fast burst

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const p = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(p)

      if (p >= 100) {
        clearInterval(timer)
      }
    }, 12)

    const finishTimer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('pec_summit_intro_played', 'true')
    }, 550)

    return () => {
      clearInterval(timer)
      clearTimeout(finishTimer)
    }
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.03,
              filter: 'blur(6px)',
              transition: { duration: 0.25, ease: 'easeOut' },
            }}
            className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center p-6 overflow-hidden select-none"
          >
            {/* Ambient Lighting Glow */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-orange/15 blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-panel border border-[#D1D5DB]/30 shadow-[0_0_24px_rgba(255,153,0,0.4)] flex items-center justify-center mb-5">
                <Zap size={28} className="text-orange fill-orange animate-pulse" />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl text-primary leading-none mb-2">
                PEC <span className="text-stroke-orange">SUMMIT</span>
              </h1>

              <div className="w-full max-w-xs space-y-1.5 mt-2">
                <div className="flex items-center justify-between font-mono-data text-[10px] uppercase text-[#D1D5DB]">
                  <span>Loading Platform</span>
                  <span className="text-orange font-bold">{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-panel border border-[#D1D5DB]/20 overflow-hidden p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-orange shadow-[0_0_12px_#FF9900]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Instant Reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: loading ? 0.5 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
