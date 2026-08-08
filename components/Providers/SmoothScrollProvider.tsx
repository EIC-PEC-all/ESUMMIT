'use client'

import { useEffect } from 'react'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenisInstance: any = null
    const initLenis = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      try {
        const Lenis = (await import('lenis')).default
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')

        gsap.registerPlugin(ScrollTrigger)

        lenisInstance = new Lenis({
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.2,
        })

        lenisInstance.on('scroll', ScrollTrigger.update)

        const updateFn = (time: number) => {
          lenisInstance?.raf(time * 1000)
        }

        gsap.ticker.add(updateFn)
        gsap.ticker.lagSmoothing(500, 33)
      } catch (err) {
        console.warn('Lenis smooth scroll failed to initialize:', err)
      }
    }

    initLenis()

    return () => {
      if (lenisInstance) lenisInstance.destroy()
    }
  }, [])

  return <>{children}</>
}
