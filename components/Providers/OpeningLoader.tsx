'use client'
// components/Providers/OpeningLoader.tsx
// 3-Second High-Voltage Opening Intro Sequence for PEC Summit (Forest Green & Vibrant Orange Theme)

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'

export default function OpeningLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'charging' | 'title' | 'discharge'>('charging')

  useEffect(() => {
    const startTime = Date.now()
    const duration = 1800 // 1.8s for counter phase

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const p = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(p)

      if (p >= 100) {
        clearInterval(timer)
        setPhase('title')
      }
    }, 20)

    const titleTimer = setTimeout(() => {
      setPhase('title')
    }, 1800)

    const dischargeTimer = setTimeout(() => {
      setPhase('discharge')
    }, 2500)

    const finishTimer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(titleTimer)
      clearTimeout(dischargeTimer)
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
              scale: 1.08,
              filter: 'brightness(1.8) blur(10px)',
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center p-6 overflow-hidden select-none"
          >
            {/* Background Grid & Pulse Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(#FF9900_1px,transparent_1px)] opacity-15 [background-size:32px_32px] pointer-events-none" />

            {/* Glowing Center Radial Aura */}
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full bg-orange/15 blur-[140px] pointer-events-none"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Top Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-green/40 border border-green font-mono-data text-xs uppercase tracking-[0.25em] text-orange shadow-lg"
            >
              <Zap size={14} className="text-orange fill-orange animate-pulse" />
              <span>E-Cell PEC · Chandigarh</span>
            </motion.div>

            {/* Center Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full text-center">

              {/* PHASE 1 & 2: CHARGING COUNTER (0s - 1.8s) */}
              {phase === 'charging' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  {/* Glowing ⚡ Emblem Ring */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-panel border-2 border-orange flex items-center justify-center mb-6 shadow-[0_0_36px_rgba(255,153,0,0.4)]"
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap size={36} className="text-orange fill-orange" />
                  </motion.div>

                  {/* 110px Digital Readout Counter */}
                  <div className="font-display leading-none mb-3 tracking-tighter" style={{ fontSize: 'clamp(72px, 12vw, 120px)' }}>
                    <span className="text-primary">{String(progress).padStart(2, '0')}</span>
                    <span className="text-orange">%</span>
                  </div>

                  {/* Dynamic Status Text */}
                  <div className="h-6 mb-6">
                    <p className="font-mono-data text-xs uppercase tracking-[0.25em] text-orange font-bold">
                      {progress < 40 && '⚡ CHARGING E-CELL PEC CORE...'}
                      {progress >= 40 && progress < 85 && '⚡ POWERING SUMMIT ARCHITECTURE...'}
                      {progress >= 85 && '⚡ IGNITION READY'}
                    </p>
                  </div>

                  {/* Orange Progress Bar */}
                  <div className="w-72 sm:w-80 h-2.5 rounded-full bg-panel border border-orange-dim/50 p-0.5 overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full rounded-full bg-orange shadow-[0_0_20px_#FF9900]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.div>
              )}

              {/* PHASE 3: TITLE FLASH & DISCHARGE (1.8s - 3.0s) */}
              {(phase === 'title' || phase === 'discharge') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-orange/20 border border-orange mb-4">
                    <Sparkles size={14} className="text-orange" />
                    <span className="font-mono-data text-xs uppercase tracking-widest text-orange font-bold">
                      FLAGSHIP ENTREPRENEURSHIP SUMMIT
                    </span>
                  </div>

                  <h1
                    className="font-display leading-none mb-4"
                    style={{ fontSize: 'clamp(56px, 10vw, 110px)' }}
                  >
                    <span className="block text-primary">PEC</span>
                    <span className="block text-stroke-orange tracking-tight">SUMMIT 2025</span>
                  </h1>

                  <p className="font-mono-data text-xs uppercase tracking-[0.25em] text-orange font-bold">
                    ⚡ Ignition Initiated
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Footer Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-8 flex items-center gap-4 font-mono-data text-xs text-muted"
            >
              <span>Punjab Engineering College</span>
              <span className="text-orange font-bold">•</span>
              <span>Chandigarh</span>
            </motion.div>

            {/* Electric Discharge Shockwave Ring */}
            {phase === 'discharge' && (
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute w-80 h-80 rounded-full border-4 border-orange pointer-events-none shadow-[0_0_60px_#FF9900]"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: loading ? 2.8 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}
