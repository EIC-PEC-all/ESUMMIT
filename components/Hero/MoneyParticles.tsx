'use client'
// components/Hero/MoneyParticles.tsx
// Ambient floating dollar signs ($ / 💲) and coin glyphs drifting upward continuously

import React, { useMemo } from 'react'

interface Particle {
  id: number
  symbol: string
  left: number // percentage
  size: number // px
  duration: number // seconds
  delay: number // seconds
  opacity: number
}

const SYMBOLS = ['$', '💲', '💵', '¢', '$', '💲', '₮', '$']

export default function MoneyParticles({ prefersReduced }: { prefersReduced?: boolean }) {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      left: 10 + (i * 7.5) + (Math.random() * 4 - 2),
      size: 14 + Math.floor(Math.random() * 16),
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.25,
    }))
  }, [])

  if (prefersReduced) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-1">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute font-mono-data font-bold text-[var(--accent-mint)] animate-particle-float"
          style={{
            left: `${p.left}%`,
            bottom: '-40px',
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 0 6px rgba(126, 211, 33, 0.4))',
          }}
        >
          {p.symbol}
        </div>
      ))}

      <style jsx global>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.35;
          }
          85% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(-105vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-particle-float {
          animation-name: particleFloat;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
