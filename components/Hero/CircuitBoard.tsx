'use client'
// components/Hero/CircuitBoard.tsx
// High-tech vector circuit-board pattern overlay with lightweight SVG animations (No SVG filters)

import React from 'react'

export default function CircuitBoard({ prefersReduced }: { prefersReduced?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Tile pattern background overlay */}
      <svg
        className="w-full h-full opacity-[0.10]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="circuit-grid"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Grid line traces */}
            <path
              d="M 20 0 L 20 60 L 60 100 L 140 100 L 180 140 L 180 200"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <path
              d="M 100 0 L 100 40 L 160 100 L 200 100"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="1"
            />
            <path
              d="M 0 160 L 40 160 L 80 120 L 80 40 L 120 0"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="1"
            />
            <path
              d="M 0 40 L 40 40 L 60 20 L 160 20 L 200 60"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="1.5"
            />

            {/* Nodes and pads */}
            <circle cx="60" cy="100" r="3" fill="var(--accent-mint)" />
            <circle cx="140" cy="100" r="3" fill="var(--accent-mint)" />
            <circle cx="160" cy="20" r="2.5" fill="var(--accent-mint)" />
            <circle cx="80" cy="120" r="2.5" fill="var(--accent-mint)" />
            <circle cx="40" cy="40" r="2" fill="var(--accent-mint)" />
            <circle cx="180" cy="140" r="3" fill="var(--accent-mint)" />

            {/* Microchip representation */}
            <rect
              x="85"
              y="85"
              width="30"
              height="30"
              rx="4"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="1"
            />
            <circle cx="100" cy="100" r="4" fill="var(--accent-mint)" opacity="0.6" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit-grid)" />
      </svg>

      {/* Dynamic Animated Pulse Overlays (Lightweight, zero SVG blur overhead) */}
      {!prefersReduced && (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <g>
            {/* Pulse 1 */}
            <circle r="3.5" fill="var(--accent-mint)">
              <animateMotion
                path="M 100 0 L 100 120 L 300 300 L 600 300 L 900 600"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.1;0.9;1"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Pulse 2 */}
            <circle r="3" fill="var(--accent-mint)">
              <animateMotion
                path="M 800 100 L 500 100 L 300 300 L 300 700"
                dur="10s"
                begin="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.15;0.85;1"
                dur="10s"
                begin="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Pulse 3 */}
            <circle r="4" fill="var(--accent-mint)">
              <animateMotion
                path="M 1200 400 L 900 400 L 700 200 L 300 200"
                dur="7s"
                begin="1s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                keyTimes="0;0.2;0.8;1"
                dur="7s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      )}
    </div>
  )
}
