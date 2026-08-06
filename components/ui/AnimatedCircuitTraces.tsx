'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface AnimatedCircuitTracesProps {
  className?: string
  color?: string
}

export default function AnimatedCircuitTraces({
  className = '',
  color = 'var(--accent-mint)',
}: AnimatedCircuitTracesProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true

            const paths = svg.querySelectorAll('.circuit-path')
            const nodes = svg.querySelectorAll('.circuit-node')

            paths.forEach((path, index) => {
              const p = path as SVGPathElement
              const length = p.getTotalLength()
              p.style.strokeDasharray = `${length}`
              p.style.strokeDashoffset = `${length}`

              gsap.to(p, {
                strokeDashoffset: 0,
                duration: 1.8 + Math.random() * 0.8,
                delay: index * 0.15,
                ease: 'power2.inOut',
              })
            })

            gsap.fromTo(
              nodes,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 0.9,
                duration: 0.8,
                stagger: 0.12,
                delay: 0.6,
                ease: 'back.out(1.7)',
              }
            )
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        ref={svgRef}
        className="w-full h-full opacity-30"
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* PCB Traces */}
        <path
          className="circuit-path"
          d="M 50 100 L 250 100 L 350 200 L 700 200 L 800 100 L 1150 100"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="circuit-path"
          d="M 100 500 L 300 500 L 450 350 L 750 350 L 900 500 L 1100 500"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="circuit-path"
          d="M 350 200 L 350 350"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path
          className="circuit-path"
          d="M 750 200 L 750 350"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Diagonal accents */}
        <path
          className="circuit-path"
          d="M 200 50 L 200 100 L 150 150"
          stroke={color}
          strokeWidth="1.2"
        />
        <path
          className="circuit-path"
          d="M 1000 550 L 1000 500 L 1050 450"
          stroke={color}
          strokeWidth="1.2"
        />

        {/* Nodes */}
        <circle className="circuit-node opacity-0" cx="250" cy="100" r="4" fill={color} />
        <circle className="circuit-node opacity-0" cx="350" cy="200" r="5" fill={color} />
        <circle className="circuit-node opacity-0" cx="700" cy="200" r="4" fill={color} />
        <circle className="circuit-node opacity-0" cx="800" cy="100" r="5" fill={color} />
        <circle className="circuit-node opacity-0" cx="450" cy="350" r="5" fill={color} />
        <circle className="circuit-node opacity-0" cx="750" cy="350" r="5" fill={color} />
        <circle className="circuit-node opacity-0" cx="350" cy="350" r="4" fill={color} />
      </svg>
    </div>
  )
}
