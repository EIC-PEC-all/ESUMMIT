'use client'
// components/ui/AnimatedText.tsx
// High-performance word-by-word scroll-driven opacity reveal.
// Animates word opacity from 0.25 → 1 without violating hook rules or overloading motion listeners.

import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

function Word({
  word,
  progress,
  range,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.85, 1])
  return (
    <motion.span className="inline-block mr-[0.28em]" style={{ opacity }}>
      {word}
    </motion.span>
  )
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.3'],
  })

  const words = useMemo(() => text.split(' '), [text])

  return (
    <p ref={containerRef} className={className} style={style} aria-label={text}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = (i + 1) / words.length
        return <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={[start, end]} />
      })}
    </p>
  )
}
