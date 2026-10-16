'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

// Light mode toggle temporarily disabled
const HIDE_THEME_TOGGLE = true

export function ThemeToggle() {
  if (HIDE_THEME_TOGGLE) {
    return null
  }

  const { theme, toggleTheme, isLoaded } = useTheme()
  const isLight = isLoaded && theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12241F] text-slate-700 dark:text-amber-400 hover:border-emerald-500 hover:scale-105 active:scale-95 shadow-xs transition-all cursor-pointer"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? (
        <Moon size={16} className="text-slate-700" />
      ) : (
        <Sun size={16} className="text-amber-400" />
      )}
    </button>
  )
}
