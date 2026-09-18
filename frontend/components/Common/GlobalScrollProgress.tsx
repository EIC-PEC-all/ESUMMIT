'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'esummit-hero', name: 'HERO' },
  { id: 'flip-flop-transition', name: 'WELCOME' },
  { id: 'esummit-about', name: 'ABOUT' },
  { id: 'event-portfolio', name: 'EVENTS' },
  { id: 'timeline', name: 'SPEAKERS' },
  { id: 'gallery', name: 'GALLERY' },
  { id: 'passes', name: 'PASSES' },
  { id: 'alumni', name: 'ALUMNI' },
  { id: 'sponsors', name: 'PARTNERS' },
  { id: 'register', name: 'REGISTER' },
  { id: 'faq', name: 'FAQ' },
  { id: 'footer', name: 'FOOTER' }
]

export default function GlobalScrollProgress() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex(s => s.id === entry.target.id)
            if (index !== -1) setActiveIndex(index)
          }
        })
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: 0 }
    )

    const observedIds = new Set<string>()

    const tryObserve = () => {
      SECTIONS.forEach(s => {
        if (!observedIds.has(s.id)) {
          const el = document.getElementById(s.id)
          if (el) {
            observer.observe(el)
            observedIds.add(s.id)
          }
        }
      })
    }

    tryObserve()
    
    // Poll for dynamically loaded components
    const interval = setInterval(() => {
      tryObserve()
      if (observedIds.size === SECTIONS.length) {
        clearInterval(interval)
      }
    }, 500)

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [])

  const handleDashClick = (id: string) => {
    if (id === 'esummit-hero') {
      window.dispatchEvent(new CustomEvent('trigger-chevron-transition', { detail: { targetTop: true } }))
    } else {
      window.dispatchEvent(new CustomEvent('trigger-chevron-transition', { detail: { targetId: id } }))
    }
  }

  return (
    <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 flex-col z-[2000] items-end">
      {SECTIONS.map((section, i) => {
        const isActive = i === activeIndex
        const isHovered = hoveredIndex === i

        return (
          <button
            key={section.id}
            onClick={() => handleDashClick(section.id)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative flex items-center justify-end py-1.5 pl-4 pr-1 border-none bg-transparent cursor-pointer focus:outline-none"
            aria-label={`Scroll to ${section.name}`}
          >
            {/* Tooltip — slides in from right when hovered or active */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-8 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded pointer-events-none whitespace-nowrap bg-black/80 text-white/90 border border-white/10 backdrop-blur-sm"
                >
                  {section.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dash indicator with dynamic states */}
            <motion.div
              animate={{
                width: isActive ? 24 : isHovered ? 16 : 8,
                backgroundColor: isActive
                  ? '#10b981' // emerald
                  : isHovered
                  ? 'rgba(255, 255, 255, 0.8)'
                  : 'rgba(255, 255, 255, 0.25)',
                opacity: isActive ? 1 : isHovered ? 0.9 : 0.4,
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-[2px] rounded-full"
            />
          </button>
        )
      })}
    </div>
  )
}
