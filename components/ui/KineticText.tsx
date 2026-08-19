'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface KineticTextProps {
  text: string
  className?: string
  as?: React.ElementType
  staggerDelay?: number
  highlightWords?: string[]
  highlightClassName?: string
}

export default function KineticText({
  text,
  className = '',
  as: Component = 'h2',
  staggerDelay = 0.035,
  highlightWords = [],
  highlightClassName = 'text-mint',
}: KineticTextProps) {
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 28, rotateX: -50 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        damping: 14,
        stiffness: 220,
      },
    },
  }

  return (
    <Component className={`inline-block ${className}`}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {words.map((word, wordIdx) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          const isHighlighted = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord
          )
          const wordClass = isHighlighted ? highlightClassName : ''

          return (
            <span key={wordIdx} className={`inline-block whitespace-nowrap mr-[0.28em] ${wordClass}`}>
              {word.split('').map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  variants={letterVariants}
                  className="inline-block transform-gpu origin-bottom"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          )
        })}
      </motion.span>
    </Component>
  )
}
