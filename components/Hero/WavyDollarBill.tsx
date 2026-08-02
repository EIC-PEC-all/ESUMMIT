'use client'
// components/Hero/WavyDollarBill.tsx
// Responsive 3D Wavy Dollar Bill Ribbon with specialized vertical ribbon mode for mobile view!

import React from 'react'
import { motion } from 'framer-motion'

export default function WavyDollarBill({ prefersReduced }: { prefersReduced?: boolean }) {
  return (
    <div className="relative w-full max-w-[660px] sm:max-w-[760px] lg:max-w-[850px] select-none pointer-events-none">
      {/* Glow aura behind dollar bill */}
      <div
        className="absolute inset-0 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(126,211,33,0.45) 0%, rgba(126,211,33,0.12) 60%, transparent 80%)',
          transform: 'scale(1.2)',
        }}
      />

      {/* ── DESKTOP & TABLET VIEW: Horizontal/Slanted Ribbon ── */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.85, rotateZ: 12 }}
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
        className="hidden sm:block w-full h-full relative aspect-[2.2/1]"
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
            <linearGradient id="wavyBillBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1E12" />
              <stop offset="35%" stopColor="#15331E" />
              <stop offset="70%" stopColor="#0E2415" />
              <stop offset="100%" stopColor="#08140B" />
            </linearGradient>

            <linearGradient id="wavyBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ED321" stopOpacity="1" />
              <stop offset="50%" stopColor="#4C9E0D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7ED321" stopOpacity="1" />
            </linearGradient>

            <pattern id="wavyGuilloche" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 15 Q 7.5 0 15 15 T 30 15" fill="none" stroke="#7ED321" strokeWidth="0.6" strokeOpacity="0.18" />
              <path d="M 0 7.5 Q 7.5 22.5 15 7.5 T 30 7.5" fill="none" stroke="#7ED321" strokeWidth="0.4" strokeOpacity="0.12" />
            </pattern>
          </defs>

          <g transform="translate(10, 10)">
            <path
              d="M 30 50 Q 220 -20 440 40 T 830 30 Q 860 160 840 330 Q 620 380 420 310 T 20 340 Z"
              fill="url(#wavyBillBg)"
              stroke="url(#wavyBorder)"
              strokeWidth="3.5"
            />
            <path
              d="M 30 50 Q 220 -20 440 40 T 830 30 Q 860 160 840 330 Q 620 380 420 310 T 20 340 Z"
              fill="url(#wavyGuilloche)"
            />
            <path
              d="M 45 62 Q 225 -5 440 52 T 815 45 Q 840 160 822 315 Q 615 362 420 295 T 38 322 Z"
              fill="none"
              stroke="#7ED321"
              strokeWidth="1.5"
              strokeDasharray="8 4"
              strokeOpacity="0.75"
            />

            <text x="440" y="55" textAnchor="middle" fill="#8A9488" fontSize="11" letterSpacing="5" fontFamily="monospace" fontWeight="bold">
              FEDERAL RESERVE NOTE
            </text>
            <text x="440" y="85" textAnchor="middle" fill="#F5F5F0" fontSize="22" letterSpacing="4" fontWeight="900" fontFamily="serif">
              THE UNITED STATES OF AMERICA
            </text>

            <text x="140" y="125" fill="#7ED321" fontSize="13" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
              ★ E 20260315 B ★
            </text>
            <text x="730" y="115" textAnchor="end" fill="#7ED321" fontSize="13" letterSpacing="2.5" fontFamily="monospace" fontWeight="bold">
              ★ PEC 2026 E ★
            </text>

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

            <g transform="translate(440, 200)">
              <ellipse cx="0" cy="0" rx="125" ry="95" fill="#091A0F" stroke="#7ED321" strokeWidth="3" />
              <ellipse cx="0" cy="0" rx="115" ry="86" fill="none" stroke="#7ED321" strokeWidth="1" strokeDasharray="5 3" />
              <circle cx="0" cy="-6" r="62" fill="#0F2A18" stroke="#7ED321" strokeWidth="1.8" />
              <text x="0" y="12" textAnchor="middle" fill="#7ED321" fontSize="54" fontWeight="900" fontFamily="sans-serif">$</text>
              <text x="0" y="76" textAnchor="middle" fill="#F5F5F0" fontSize="12" letterSpacing="3" fontFamily="monospace" fontWeight="bold">GEORGE WASHINGTON</text>
            </g>

            <g transform="translate(200, 215)">
              <circle cx="0" cy="0" r="56" fill="#07150C" stroke="#7ED321" strokeWidth="2" />
              <polygon points="0,-28 26,18 -26,18" fill="none" stroke="#7ED321" strokeWidth="2" />
              <circle cx="0" cy="-28" r="4" fill="#7ED321" />
              <text x="0" y="32" textAnchor="middle" fill="#8A9488" fontSize="8" letterSpacing="1.5" fontFamily="monospace">GREAT SEAL</text>
            </g>

            <g transform="translate(680, 205)">
              <circle cx="0" cy="0" r="56" fill="#07150C" stroke="#7ED321" strokeWidth="2" />
              <path d="M0,-30 L24,-18 L24 8 Q24 26 0 34 Q-24 26 -24 8 L-24,-18 Z" fill="#0F2416" stroke="#7ED321" strokeWidth="1.8" />
              <text x="0" y="-8" textAnchor="middle" fill="#7ED321" fontSize="12" fontWeight="bold">PEC</text>
              <text x="0" y="40" textAnchor="middle" fill="#8A9488" fontSize="8" letterSpacing="1.5" fontFamily="monospace">TREASURY</text>
            </g>

            <rect x="310" y="310" width="260" height="34" rx="6" fill="#061209" stroke="#7ED321" strokeWidth="1.5" />
            <text x="440" y="334" textAnchor="middle" fill="#7ED321" fontSize="18" letterSpacing="7" fontWeight="900" fontFamily="serif">
              ONE DOLLAR
            </text>
          </g>
        </svg>
      </motion.div>

      {/* ── MOBILE VIEW (Portrait 9:16): Vertical Wavy Ribbon Banknote ── */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          translateY: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="block sm:hidden w-full relative aspect-[1/1.6] my-4"
        style={{
          filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.9)) drop-shadow(0 0 25px rgba(126,211,33,0.35))',
        }}
      >
        <svg
          viewBox="0 0 400 640"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mobBillBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1E12" />
              <stop offset="50%" stopColor="#15331E" />
              <stop offset="100%" stopColor="#08140B" />
            </linearGradient>

            <linearGradient id="mobBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7ED321" />
              <stop offset="50%" stopColor="#4C9E0D" />
              <stop offset="100%" stopColor="#7ED321" />
            </linearGradient>
          </defs>

          {/* Vertical S-Curved Banknote Ribbon Path */}
          <g transform="translate(10, 10)">
            <path
              d="M 50 20 Q 280 40 340 180 T 60 480 Q 120 600 350 610 Q 320 440 280 320 T 20 120 Z"
              fill="url(#mobBillBg)"
              stroke="url(#mobBorder)"
              strokeWidth="3"
            />

            {/* Inner dashed line */}
            <path
              d="M 60 35 Q 260 55 320 185 T 75 465 Q 130 580 335 595 Q 305 440 265 325 T 35 130 Z"
              fill="none"
              stroke="#7ED321"
              strokeWidth="1.2"
              strokeDasharray="6 3"
              strokeOpacity="0.75"
            />

            {/* Top Federal Reserve Note */}
            <text x="200" y="70" textAnchor="middle" fill="#8A9488" fontSize="10" letterSpacing="3" fontFamily="monospace" fontWeight="bold">
              FEDERAL RESERVE NOTE
            </text>
            <text x="200" y="100" textAnchor="middle" fill="#F5F5F0" fontSize="16" letterSpacing="2" fontWeight="900" fontFamily="serif">
              THE UNITED STATES OF AMERICA
            </text>

            {/* Center Medallion */}
            <g transform="translate(200, 290)">
              <ellipse cx="0" cy="0" rx="90" ry="70" fill="#091A0F" stroke="#7ED321" strokeWidth="2.5" />
              <circle cx="0" cy="-4" r="45" fill="#0F2A18" stroke="#7ED321" strokeWidth="1.5" />
              <text x="0" y="10" textAnchor="middle" fill="#7ED321" fontSize="42" fontWeight="900" fontFamily="sans-serif">$</text>
              <text x="0" y="58" textAnchor="middle" fill="#F5F5F0" fontSize="10" letterSpacing="2" fontFamily="monospace" fontWeight="bold">PEC SUMMIT</text>
            </g>

            {/* $1 Seals */}
            <g transform="translate(60, 80)">
              <circle cx="0" cy="0" r="20" fill="#08150C" stroke="#7ED321" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#7ED321" fontSize="16" fontWeight="900" fontFamily="serif">$1</text>
            </g>
            <g transform="translate(320, 140)">
              <circle cx="0" cy="0" r="20" fill="#08150C" stroke="#7ED321" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#7ED321" fontSize="16" fontWeight="900" fontFamily="serif">$1</text>
            </g>
            <g transform="translate(80, 500)">
              <circle cx="0" cy="0" r="20" fill="#08150C" stroke="#7ED321" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#7ED321" fontSize="16" fontWeight="900" fontFamily="serif">$1</text>
            </g>

            {/* Bottom Banner */}
            <rect x="110" y="540" width="180" height="28" rx="5" fill="#061209" stroke="#7ED321" strokeWidth="1.2" />
            <text x="200" y="560" textAnchor="middle" fill="#7ED321" fontSize="14" letterSpacing="4" fontWeight="900" fontFamily="serif">
              ONE DOLLAR
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
