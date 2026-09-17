'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
  children: React.ReactNode
  /** Minimum height of the wrapper while the content is loading to prevent CLS */
  minHeight?: string
  /** Margin around the root. e.g. "600px 0px" means load when within 600px of viewport */
  rootMargin?: string
  /** Any additional class names for the wrapper */
  className?: string
}

export default function LazySection({
  children,
  minHeight = '100vh',
  rootMargin = '800px 0px',
  className = '',
}: LazySectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  })

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: inView ? 'auto' : minHeight }}
    >
      {inView ? children : null}
    </div>
  )
}
