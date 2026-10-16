'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

interface ThemeToggleProps {
  className?: string
  variant?: 'pill' | 'icon'
}

export default function ThemeToggle({ className = '', variant = 'pill' }: ThemeToggleProps) {
  const { theme, toggleTheme, isLoaded } = useTheme()
  const isLight = isLoaded && theme === 'light'

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full btn-dark-gradient border transition-all duration-200 cursor-pointer hover:border-mint focus:outline-none focus-visible:ring-2 focus-visible:ring-mint ${className}`}
        aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isLight ? 'light' : 'dark'}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            {isLight ? (
              <Moon size={16} className="text-secondary stroke-[2.2]" />
            ) : (
              <Sun size={16} className="text-mint stroke-[2.2]" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`btn-dark-gradient min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 box-border inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider leading-none transition-all duration-200 cursor-pointer hover:border-mint focus:outline-none focus-visible:ring-2 focus-visible:ring-mint ${className}`}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isLight ? 'light' : 'dark'}
          initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          {isLight ? (
            <Moon size={14} className="text-secondary stroke-[2.2]" />
          ) : (
            <Sun size={14} className="text-mint stroke-[2.2]" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="hidden md:inline font-mono text-[11px] font-bold">
        {isLight ? 'DARK' : 'LIGHT'}
      </span>
    </button>
  )
}
