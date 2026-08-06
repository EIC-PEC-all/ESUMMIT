'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface StackedSlicedTextProps {
  text?: string
  sliceCount?: number
  className?: string
}

export default function StackedSlicedText({
  text = 'E SUMMIT 26',
  sliceCount = 9,
  className = '',
}: StackedSlicedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress of footer container as it enters viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end end'],
  })

  const slices = Array.from({ length: sliceCount - 1 })

  return (
    <div ref={containerRef} className={`w-full overflow-hidden select-none bg-transparent py-4 ${className}`}>
      <div className="flex flex-col-reverse items-center justify-center w-full">
        {/* Layer 0: Full Unclipped Word at Bottom */}
        <div className="w-full text-center leading-none overflow-hidden">
          <span
            className="inline-block uppercase tracking-tighter text-[11vw] sm:text-[11.5vw] lg:text-[12vw] leading-[0.76] text-white select-none whitespace-nowrap"
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
              fontWeight: 900,
            }}
          >
            {text}
          </span>
        </div>

        {/* Upper Slices: Scroll-Scrubbed Expansion with Scroll Wheel / Touch */}
        {slices.map((_, i) => {
          const step = 0.75 / slices.length
          const start = 0.1 + i * step
          const end = Math.min(start + step * 1.5, 0.95)

          // Scrub height dynamically with scroll progress
          const heightTransform = useTransform(
            scrollYProgress,
            [start, end],
            ['0vw', '1.75vw']
          )

          // Scrub opacity
          const opacityTransform = useTransform(
            scrollYProgress,
            [start, start + 0.04],
            [0, 1]
          )

          return (
            <motion.div
              key={i}
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="w-full overflow-hidden flex justify-center items-start leading-none origin-bottom"
            >
              <span
                className="inline-block uppercase tracking-tighter text-[11vw] sm:text-[11.5vw] lg:text-[12vw] leading-[0.76] text-white select-none pointer-events-none whitespace-nowrap transform -translate-y-[1%]"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 900,
                }}
                aria-hidden="true"
              >
                {text}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
