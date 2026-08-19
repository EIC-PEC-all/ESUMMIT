'use client'
// components/ui/AnimatedText.tsx
// Character-by-character scroll-driven opacity reveal.
// Each character animates from opacity 0.2 → 1 based on scroll progress.

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const characters = text.split('')

  return (
    <p ref={containerRef} className={className} style={style} aria-label={text}>
      {characters.map((char, i) => {
        // Map each character's position to a fraction of total scroll progress
        const charStart = i / characters.length
        const charEnd = (i + 1) / characters.length

        // Each character goes from dim → bright as scroll reaches its window
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [charStart, charEnd], [0.2, 1])

        return (
          <span key={i} className="relative inline-block whitespace-pre">
            {/* Invisible placeholder keeps layout */}
            <span aria-hidden className="invisible">{char}</span>
            {/* Animated overlay */}
            <motion.span
              aria-hidden
              className="absolute inset-0"
              initial={{ opacity: 0.2 }}
              style={{ opacity }}
            >
              {char}
            </motion.span>
          </span>
        )
      })}
    </p>
  )
}
