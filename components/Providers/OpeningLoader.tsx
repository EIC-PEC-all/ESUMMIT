'use client'
// components/Providers/OpeningLoader.tsx
// Professional High-Precision Preloader Animation for PEC Summit

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'

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
    const duration = 1000 // 1.0s precision loading pulse

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const p = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(p)

      if (p >= 100) {
        clearInterval(timer)
      }
    }, 16)

    const finishTimer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('pec_summit_intro_played', 'true')
    }, 1300)

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
              scale: 1.04,
              filter: 'blur(8px)',
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-between p-8 sm:p-12 overflow-hidden select-none"
          >
            {/* Ambient Lighting Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-orange/10 blur-[140px] pointer-events-none" />

            {/* Top Brand Header */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex items-center justify-between z-10"
            >
              <div className="flex items-center gap-2 font-mono-data text-xs uppercase tracking-[0.25em] text-orange font-bold">
                <Zap size={14} className="text-orange fill-orange animate-pulse" />
                <span>E-Cell PEC</span>
              </div>
              <span className="font-mono-data text-[10px] uppercase tracking-widest text-[#D1D5DB]/60">
                Chandigarh · Sector 12
              </span>
            </motion.div>

            {/* Center Brand Core */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full text-center">
              {/* Minimalist Icon Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-2xl bg-panel border border-[#D1D5DB]/20 shadow-[0_0_30px_rgba(255,153,0,0.3)] flex items-center justify-center mb-6 relative"
              >
                <Zap size={30} className="text-orange fill-orange" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange animate-ping" />
              </motion.div>

              {/* Title */}
              <h1 className="font-display leading-none mb-3" style={{ fontSize: 'clamp(48px, 8vw, 88px)' }}>
                <span className="block text-primary">PEC</span>
                <span className="block text-stroke-orange tracking-tight">SUMMIT 2025</span>
              </h1>

              <p className="font-mono-data text-xs uppercase tracking-[0.3em] text-[#D1D5DB] font-medium mb-8">
                North India&apos;s Flagship Summit
              </p>

              {/* Professional Progress Meter */}
              <div className="w-full max-w-xs space-y-2">
                <div className="flex items-center justify-between font-mono-data text-xs">
                  <span className="text-muted text-[10px] uppercase tracking-widest">Initialization</span>
                  <span className="text-orange font-bold">{String(progress).padStart(2, '0')}%</span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-1.5 rounded-full bg-panel border border-[#D1D5DB]/15 overflow-hidden p-0.5 relative">
                  <motion.div
                    className="h-full rounded-full bg-orange shadow-[0_0_16px_#FF9900]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex items-center justify-between font-mono-data text-[10px] uppercase tracking-widest text-muted z-10"
            >
              <span>Punjab Engineering College</span>
              <span className="text-orange font-bold flex items-center gap-1">
                <Sparkles size={10} /> Live Platform
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: loading ? 1.2 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
