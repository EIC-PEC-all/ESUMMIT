'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'esummit-hero', name: 'HOME' },
  { id: 'flip-flop-transition', name: 'WELCOME' },
  { id: 'alumni', name: 'ALUMNI' },
  { id: 'register', name: 'REGISTER' },
  { id: 'footer', name: 'FOOTER' },
]

export default function GlobalScrollProgress() {
  const pathname = usePathname()
  const isLandingPage = pathname === '/' || pathname === ''
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!isLandingPage) return

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
  }, [isLandingPage])

  const handleDashClick = (id: string) => {
    if (id === 'esummit-hero') {
      window.dispatchEvent(new CustomEvent('trigger-chevron-transition', { detail: { targetTop: true } }))
    } else {
      window.dispatchEvent(new CustomEvent('trigger-chevron-transition', { detail: { targetId: id } }))
    }
  }

  // Show side scroll indicators exclusively on the landing page
  if (!isLandingPage) {
    return null
  }

  return (
    <div className="hidden md:flex fixed bottom-6 left-16 z-[2000] flex-row items-center pointer-events-auto">
      {/* Solid Green Enclosure Dock — Horizontal at bottom-left */}
      <div className="flex flex-row items-center gap-2 px-3 py-2 rounded-full bg-[#06261B] border-2 border-[#10B981] shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_16px_rgba(16,185,129,0.35)] backdrop-blur-md">
        {SECTIONS.map((section, i) => {
          const isActive = i === activeIndex
          const isHovered = hoveredIndex === i

          return (
            <button
              key={section.id}
              onClick={() => handleDashClick(section.id)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex items-center justify-center p-1 border-none bg-transparent cursor-pointer focus:outline-none"
              aria-label={`Scroll to ${section.name}`}
            >
              {/* Tooltip — pops up directly above the hovered indicator */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap bg-[#06261B] text-[#74FB44] border border-[#10B981]/50 shadow-xl"
                  >
                    {section.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Horizontal dash indicator with dynamic expansion */}
              <motion.div
                animate={{
                  width: isActive ? 22 : isHovered ? 15 : 9,
                  backgroundColor: isActive
                    ? '#74FB44'
                    : isHovered
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.4)',
                  opacity: isActive ? 1 : isHovered ? 0.95 : 0.6,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-[3.5px] rounded-full"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
