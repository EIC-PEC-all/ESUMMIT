'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'
type ThemeContextValue = { theme: Theme; toggleTheme: () => void; isLoaded: boolean }
const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggleTheme: () => {}, isLoaded: false })

const PRIMARY_STORAGE_KEY = 'esummit-theme'
const SECONDARY_STORAGE_KEY = 'esummit-response-manager-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.dataset.theme = next
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.classList.toggle('light', next === 'light')
  }, [])

  useEffect(() => {
    const saved = (localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(SECONDARY_STORAGE_KEY)) as Theme | null
    const domTheme = document.documentElement.getAttribute('data-theme') as Theme | null
    const next: Theme = saved === 'light' || saved === 'dark'
      ? saved
      : domTheme === 'light' || domTheme === 'dark'
        ? domTheme
        : window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark'

    setTheme(next)
    apply(next)
    setIsLoaded(true)
  }, [apply])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(PRIMARY_STORAGE_KEY, next)
        localStorage.setItem(SECONDARY_STORAGE_KEY, next)
      } catch {
        // Ignore localStorage quota / access issues
      }
      apply(next)
      return next
    })
  }, [apply])

  return <ThemeContext.Provider value={{ theme, toggleTheme, isLoaded }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
