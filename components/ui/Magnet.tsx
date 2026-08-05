'use client'
// components/ui/Magnet.tsx
// Mouse-following magnetic hover effect — tracks cursor relative to element centre
// and applies a translate3d offset scaled by strength factor

import { useRef, useCallback, type ReactNode, type CSSProperties } from 'react'

interface MagnetProps {
  children: ReactNode
  padding?: number       // px distance from edge that activates the effect
  strength?: number      // divisor — higher = weaker pull
  activeTransition?: string
  inactiveTransition?: string
  className?: string
  style?: CSSProperties
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    // Check if cursor is within the activation zone (element bounds + padding)
    const inZone =
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding

    if (!inZone) {
      ref.current.style.transition = inactiveTransition
      ref.current.style.transform = 'translate3d(0,0,0)'
      return
    }

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) / strength
    const dy = (e.clientY - centerY) / strength

    ref.current.style.transition = activeTransition
    ref.current.style.transform = `translate3d(${dx}px,${dy}px,0)`
  }, [padding, strength, activeTransition, inactiveTransition])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transition = inactiveTransition
    ref.current.style.transform = 'translate3d(0,0,0)'
  }, [inactiveTransition])

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
