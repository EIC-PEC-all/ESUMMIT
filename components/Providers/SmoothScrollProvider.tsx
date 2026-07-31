'use client'

import { useEffect } from 'react'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenisInstance: any = null

    const initLenis = async () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      try {
        const Lenis = (await import('lenis')).default
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')

        gsap.registerPlugin(ScrollTrigger)

        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.1,
          touchMultiplier: 1.5,
        })

        lenisInstance.on('scroll', ScrollTrigger.update)

        gsap.ticker.add((time) => {
          lenisInstance?.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)
      } catch (err) {
        console.warn('Lenis smooth scroll failed to initialize:', err)
      }
    }

    initLenis()

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy()
      }
    }
  }, [])

  return <>{children}</>
}
