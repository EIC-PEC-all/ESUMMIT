'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface StackedSlicedTextProps {
  text?: string
  sliceCount?: number
  className?: string
}

// Pre-built slice component so hooks are called at component level, not inside a map callback
function SliceLayer({
  scrollYProgress,
  index,
  total,
  text,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
  total: number
  text: string
}) {
  const step = 0.75 / total
  const start = 0.1 + index * step
  const end = Math.min(start + step * 1.5, 0.95)

  const heightTransform = useTransform(
    scrollYProgress,
    [start, end],
    ['0vw', '1.75vw']
  )

  const opacityTransform = useTransform(
    scrollYProgress,
    [start, start + 0.04],
    [0, 1]
  )

  return (
    <motion.div
      initial={{ height: '0vw', opacity: 0 }}
      style={{
        height: heightTransform,
        opacity: opacityTransform,
      }}
      className="w-full overflow-hidden flex justify-center items-start leading-none origin-bottom"
    >
      <span
        className="inline-block uppercase tracking-tighter text-[11vw] sm:text-[11.5vw] lg:text-[12vw] leading-[0.76] text-white select-none pointer-events-none whitespace-nowrap transform -translate-y-[1%]"
        style={{
          fontFamily: 'Kanit, sans-serif',
          fontWeight: 900,
        }}
        aria-hidden="true"
      >
        {text}
      </span>
    </motion.div>
  )
}

export default function StackedSlicedText({
  text = 'E SUMMIT 26',
  sliceCount = 9,
  className = '',
}: StackedSlicedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end end'],
  })

  const slices = Array.from({ length: sliceCount - 1 }, (_, i) => i)

  return (
    <div ref={containerRef} className={`w-full overflow-hidden select-none bg-transparent py-4 ${className}`}>
      <div className="flex flex-col-reverse items-center justify-center w-full">
        {/* Layer 0: Full Unclipped Word at Bottom */}
        <div className="w-full text-center leading-none overflow-hidden">
          <span
            className="inline-block uppercase tracking-tighter text-[11vw] sm:text-[11.5vw] lg:text-[12vw] leading-[0.76] text-white select-none whitespace-nowrap"
            style={{
              fontFamily: 'Kanit, sans-serif',
              fontWeight: 900,
            }}
          >
            {text}
          </span>
        </div>

        {/* Upper Slices: each rendered as its own component so hooks are at component level */}
        {slices.map((i) => (
          <SliceLayer
            key={i}
            scrollYProgress={scrollYProgress}
            index={i}
            total={slices.length}
            text={text}
          />
        ))}
      </div>
    </div>
  )
}
