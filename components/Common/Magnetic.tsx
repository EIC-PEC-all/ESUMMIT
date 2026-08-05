'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export default function Magnetic({ children, strength = 0.35, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let gsapObj: typeof import('gsap').default | null = null

    const initMagnetic = async () => {
      try {
        const { default: gsap } = await import('gsap')
        gsapObj = gsap
        const node = ref.current
        if (!node) return

        const xTo = gsap.quickTo(node, 'x', { duration: 0.4, ease: 'power3.out' })
        const yTo = gsap.quickTo(node, 'y', { duration: 0.4, ease: 'power3.out' })

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e
          const { left, top, width, height } = node.getBoundingClientRect()
          const x = (clientX - (left + width / 2)) * strength
          const y = (clientY - (top + height / 2)) * strength
          xTo(x)
          yTo(y)
        }

        const handleMouseLeave = () => {
          xTo(0)
          yTo(0)
        }

        node.addEventListener('mousemove', handleMouseMove)
        node.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          node.removeEventListener('mousemove', handleMouseMove)
          node.removeEventListener('mouseleave', handleMouseLeave)
        }
      } catch (err) {
        console.warn('Magnetic GSAP init error:', err)
      }
    }

    initMagnetic()
  }, [strength])

  return (
    <div ref={ref} className={`inline-block transition-transform duration-75 ${className}`}>
      {children}
    </div>
  )
}
