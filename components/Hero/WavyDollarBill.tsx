'use client'
// components/Hero/WavyDollarBill.tsx
// High-precision Wavy 3D Dollar Bill Ribbon matching the reference design exactly!
// 100% cross-browser compatible, ultra-fast 60fps CSS 3D transforms & SVG vector detail.

import React from 'react'
import { motion } from 'framer-motion'

export default function WavyDollarBill({ prefersReduced }: { prefersReduced?: boolean }) {
  return (
    <div className="relative w-full max-w-[660px] sm:max-w-[760px] lg:max-w-[850px] aspect-[2.2/1] select-none pointer-events-none">
      {/* Glow aura behind dollar bill */}
      <div
        className="absolute inset-0 rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(126,211,33,0.4) 0%, rgba(126,211,33,0.1) 60%, transparent 80%)',
          transform: 'scale(1.2)',
        }}
      />

      {/* Main 3D Warped Dollar Bill Ribbon */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.85, rotateZ: 12, rotateX: 15 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateZ: [14, 18, 14],
          rotateX: [12, 16, 12],
          translateY: [0, -14, 0],
        }}
        transition={{
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          rotateZ: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          translateY: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.85)) drop-shadow(0 0 30px rgba(126,211,33,0.3))',
        }}
      >
        <svg
          viewBox="0 0 880 400"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dark green banknote gradient */}
            <linearGradient id="wavyBillBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1E12" />
              <stop offset="35%" stopColor="#15331E" />
              <stop offset="70%" stopColor="#0E2415" />
              <stop offset="100%" stopColor="#08140B" />
            </linearGradient>

            {/* Glowing border gradient */}
            <linearGradient id="wavyBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ED321" stopOpacity="1" />
              <stop offset="50%" stopColor="#4C9E0D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7ED321" stopOpacity="1" />
            </linearGradient>

            {/* Guilloche pattern */}
            <pattern id="wavyGuilloche" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 15 Q 7.5 0 15 15 T 30 15" fill="none" stroke="#7ED321" strokeWidth="0.6" strokeOpacity="0.18" />
              <path d="M 0 7.5 Q 7.5 22.5 15 7.5 T 30 7.5" fill="none" stroke="#7ED321" strokeWidth="0.4" strokeOpacity="0.12" />
            </pattern>

            {/* Shimmer effect */}
            <linearGradient id="shimmerLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7ED321" stopOpacity="0" />
              <stop offset="50%" stopColor="#7ED321" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7ED321" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Curved S-Ribbon Background Mesh Path */}
          <g transform="translate(10, 10)">
            {/* Outer Banknote Curved Base Shape */}
            <path
              d="M 30 50 Q 220 -20 440 40 T 830 30 Q 860 160 840 330 Q 620 380 420 310 T 20 340 Z"
              fill="url(#wavyBillBg)"
              stroke="url(#wavyBorder)"
              strokeWidth="3.5"
            />

            {/* Guilloche pattern overlay on curved path */}
            <path
              d="M 30 50 Q 220 -20 440 40 T 830 30 Q 860 160 840 330 Q 620 380 420 310 T 20 340 Z"
              fill="url(#wavyGuilloche)"
            />

            {/* Inner dashed ornate border line following ribbon curve */}
            <path
              d="M 45 62 Q 225 -5 440 52 T 815 45 Q 840 160 822 315 Q 615 362 420 295 T 38 322 Z"
              fill="none"
              stroke="#7ED321"
              strokeWidth="1.5"
              strokeDasharray="8 4"
              strokeOpacity="0.75"
            />

            {/* Top Federal Reserve Note Typography */}
            <text x="440" y="55" textAnchor="middle" fill="#8A9488" fontSize="11" letterSpacing="5" fontFamily="monospace" fontWeight="bold">
              FEDERAL RESERVE NOTE
            </text>
            <text x="440" y="85" textAnchor="middle" fill="#F5F5F0" fontSize="22" letterSpacing="4" fontWeight="900" fontFamily="serif">
              THE UNITED STATES OF AMERICA
            </text>

            {/* Serial numbers */}
            <text x="140" y="125" fill="#7ED321" fontSize="13" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
              ★ E 20260315 B ★
            </text>
            <text x="730" y="115" textAnchor="end" fill="#7ED321" fontSize="13" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
              ★ PEC 2026 E ★
            </text>

            {/* Corner $1 Badges */}
            <g transform="translate(70, 75)">
              <circle cx="0" cy="0" r="28" fill="#08150C" stroke="#7ED321" strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fill="#7ED321" fontSize="22" fontWeight="900" fontFamily="serif">$1</text>
            </g>
            <g transform="translate(800, 65)">
              <circle cx="0" cy="0" r="28" fill="#08150C" stroke="#7ED321" strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fill="#7ED321" fontSize="22" fontWeight="900" fontFamily="serif">$1</text>
            </g>
            <g transform="translate(60, 310)">
              <circle cx="0" cy="0" r="28" fill="#08150C" stroke="#7ED321" strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fill="#7ED321" fontSize="22" fontWeight="900" fontFamily="serif">$1</text>
            </g>
            <g transform="translate(800, 300)">
              <circle cx="0" cy="0" r="28" fill="#08150C" stroke="#7ED321" strokeWidth="2" />
              <text x="0" y="7" textAnchor="middle" fill="#7ED321" fontSize="22" fontWeight="900" fontFamily="serif">$1</text>
            </g>

            {/* Center Portrait Oval Medallion */}
            <g transform="translate(440, 200)">
              <ellipse cx="0" cy="0" rx="125" ry="95" fill="#091A0F" stroke="#7ED321" strokeWidth="3" />
              <ellipse cx="0" cy="0" rx="115" ry="86" fill="none" stroke="#7ED321" strokeWidth="1" strokeDasharray="5 3" />
              <circle cx="0" cy="-6" r="62" fill="#0F2A18" stroke="#7ED321" strokeWidth="1.8" />

              {/* Giant $ symbol */}
              <text x="0" y="12" textAnchor="middle" fill="#7ED321" fontSize="54" fontWeight="900" fontFamily="sans-serif">
                $
              </text>
              <text x="0" y="76" textAnchor="middle" fill="#F5F5F0" fontSize="12" letterSpacing="3" fontFamily="monospace" fontWeight="bold">
                GEORGE WASHINGTON
              </text>
            </g>

            {/* Left Great Seal */}
            <g transform="translate(200, 215)">
              <circle cx="0" cy="0" r="56" fill="#07150C" stroke="#7ED321" strokeWidth="2" />
              <polygon points="0,-28 26,18 -26,18" fill="none" stroke="#7ED321" strokeWidth="2" />
              <circle cx="0" cy="-28" r="4" fill="#7ED321" />
              <text x="0" y="32" textAnchor="middle" fill="#8A9488" fontSize="8" letterSpacing="1.5" fontFamily="monospace">GREAT SEAL</text>
            </g>

            {/* Right Treasury Seal */}
            <g transform="translate(680, 205)">
              <circle cx="0" cy="0" r="56" fill="#07150C" stroke="#7ED321" strokeWidth="2" />
              <path d="M0,-30 L24,-18 L24 8 Q24 26 0 34 Q-24 26 -24 8 L-24,-18 Z" fill="#0F2416" stroke="#7ED321" strokeWidth="1.8" />
              <text x="0" y="-8" textAnchor="middle" fill="#7ED321" fontSize="12" fontWeight="bold">PEC</text>
              <text x="0" y="40" textAnchor="middle" fill="#8A9488" fontSize="8" letterSpacing="1.5" fontFamily="monospace">TREASURY</text>
            </g>

            {/* Bottom Banner "ONE DOLLAR" */}
            <rect x="310" y="310" width="260" height="34" rx="6" fill="#061209" stroke="#7ED321" strokeWidth="1.5" />
            <text x="440" y="334" textAnchor="middle" fill="#7ED321" fontSize="18" letterSpacing="7" fontWeight="900" fontFamily="serif">
              ONE DOLLAR
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
