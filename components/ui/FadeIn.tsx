'use client'
// components/ui/FadeIn.tsx
// Framer Motion fade-in wrapper — fires once when element enters viewport

import { motion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  as?: ElementType
  className?: string
  style?: React.CSSProperties
}

const fadeVariants = (x: number, y: number): Variants => ({
  hidden: { opacity: 0, x, y },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
  },
})

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as: Tag = 'div',
  className,
  style,
}: FadeInProps) {
  // motion.create() for dynamic element types
  const MotionTag = motion.create(Tag as 'div')

  return (
    <MotionTag
      className={className}
      style={style}
      variants={fadeVariants(x, y)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}
