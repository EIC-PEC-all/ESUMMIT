'use client'
// components/Providers/OpeningLoader.tsx
// Ultra-Fast 1.0-Second High-Voltage Opening Loader for PEC Summit

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function OpeningLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if played in this session for instant return visits
    const played = sessionStorage.getItem('pec_summit_intro_played')
    if (played) {
      setLoading(false)
      return
    }

    const startTime = Date.now()
    const duration = 700 // 0.7s lightning fast counter

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const p = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(p)

      if (p >= 100) {
        clearInterval(timer)
      }
    }, 15)

    const finishTimer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('pec_summit_intro_played', 'true')
    }, 1000)

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
              scale: 1.05,
              filter: 'blur(8px)',
              transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center p-6 overflow-hidden select-none"
          >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#FF9900_1px,transparent_1px)] opacity-15 [background-size:32px_32px] pointer-events-none" />

            {/* Glowing Center Radial Aura */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-orange/15 blur-[120px] pointer-events-none" />

            {/* Eyebrow */}
            <div className="absolute top-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-green/40 border border-green font-mono-data text-xs uppercase tracking-[0.25em] text-orange shadow-lg">
              <Zap size={14} className="text-orange fill-orange animate-pulse" />
              <span>E-Cell PEC · Chandigarh</span>
            </div>

            {/* Center Container */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-panel border-2 border-orange flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,153,0,0.4)]">
                <Zap size={32} className="text-orange fill-orange animate-bounce" />
              </div>

              <h1 className="font-display text-5xl sm:text-6xl text-primary mb-2">
                PEC <span className="text-stroke-orange">SUMMIT 2025</span>
              </h1>

              {/* Digital Readout */}
              <div className="font-mono-data text-2xl font-bold text-orange mb-4">
                {progress}%
              </div>

              {/* Progress Bar Track */}
              <div className="w-72 sm:w-80 h-2 rounded-full bg-panel border border-orange-dim/50 overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full bg-orange shadow-[0_0_16px_#FF9900]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: loading ? 0.9 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
