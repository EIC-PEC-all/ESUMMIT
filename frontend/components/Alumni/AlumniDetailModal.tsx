'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Sparkles } from 'lucide-react'
import BlurImage from '@/components/ui/BlurImage'

export interface AlumniMember {
  id: string
  name: string
  batch: string
  role: string
  company: string
  valuation?: string
  achievement: string
  bio: string
  imageUrl: string
  linkedin: string
}

interface AlumniDetailModalProps {
  person: AlumniMember | null
  onClose: () => void
}

export default function AlumniDetailModal({ person, onClose }: AlumniDetailModalProps) {
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (person) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [person])

  useEffect(() => {
    if (!person) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [person, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {person && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain cursor-pointer"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-backdrop backdrop-blur-md"
          />

          {/* Modal Window with Responsive Height & Scroll Safety */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto my-auto rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#0A1612] text-[#061A12] dark:text-white border border-emerald-500/25 dark:border-white/15 p-5 sm:p-7 shadow-[0_20px_60px_rgba(5,150,105,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 cursor-default"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF7F0] hover:bg-[#DDF0E5] border border-emerald-500/20 text-[#061A12] dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15 dark:text-white transition-colors cursor-pointer shadow-xs"
              aria-label="Close details"
            >
              <X size={18} />
            </button>

            {/* Header Profile Area */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Liquid Glass Circular Avatar Bubble */}
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-full p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(116,251,68,0.3)] bg-gradient-to-br from-mint/40 via-mint/20 to-transparent">
                <div className="relative h-full w-full rounded-full overflow-hidden bg-[#EBF7F0] dark:bg-panel-alt">
                  <BlurImage
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  {/* Spherical Lens Glare */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(ellipse at 35% 25%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 38%, transparent 65%)',
                    }}
                  />
                </div>
              </div>

              {/* Title / Batch */}
              <div className="flex-1">
                {/* Single Clean Main Pill */}
                <div className="flex items-center justify-center sm:justify-start mb-2">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 border border-emerald-500/25 dark:text-mint dark:bg-mint/10 dark:border-mint/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Award size={12} className="text-emerald-600 dark:text-mint shrink-0" />
                    <span>{person.valuation || person.company}</span>
                    <span className="opacity-40">•</span>
                    <span>{person.batch}</span>
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wider text-[#061A12] dark:text-white leading-tight">
                  {person.name}
                </h3>

                <p className="font-mono-data text-xs uppercase tracking-wider text-[#2E523F] dark:text-slate-300 font-semibold mt-1">
                  {person.role} {person.company && !person.valuation ? '' : `• ${person.company}`}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 h-px w-full bg-emerald-500/15 dark:bg-border-subtle" />

            {/* Bio */}
            <div className="space-y-3">
              <h4 className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-mint">
                BACKGROUND &amp; JOURNEY
              </h4>
              <p className="font-body text-xs sm:text-sm text-[#1B3B2B] dark:text-slate-200 leading-relaxed font-normal">
                {person.bio}
              </p>
            </div>

            {/* Key Achievement */}
            {person.achievement && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#EBF7F0] border border-emerald-500/20 dark:bg-white/[0.04] dark:border-white/10 flex items-start gap-2.5">
                <Sparkles size={16} className="text-emerald-600 dark:text-mint shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono-data text-[9.5px] uppercase font-bold text-emerald-700 dark:text-mint tracking-wider">
                    KEY MILESTONE
                  </p>
                  <p className="font-body text-xs text-[#061A12] dark:text-white mt-0.5 font-medium leading-snug">
                    {person.achievement}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
