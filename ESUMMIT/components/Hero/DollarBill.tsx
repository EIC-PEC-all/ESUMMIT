'use client'
// components/Hero/DollarBill.tsx
// High-precision vector $1 Dollar Bill component for hero visual theme

import React from 'react'

interface DollarBillProps {
  className?: string
  style?: React.CSSProperties
  variant?: 'main' | 'background'
}

export default function DollarBill({ className = '', style = {}, variant = 'main' }: DollarBillProps) {
  const isMain = variant === 'main'

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: '100%',
        maxWidth: isMain ? '640px' : '420px',
        aspectRatio: '2.35 / 1',
        filter: isMain
          ? 'drop-shadow(0 20px 50px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 35px rgba(126, 211, 33, 0.35))'
          : 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.6))',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 705 300"
        className="w-full h-full rounded-lg overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main green paper gradient */}
          <linearGradient id="billBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A10" />
            <stop offset="50%" stopColor="#142B1B" />
            <stop offset="100%" stopColor="#09140C" />
          </linearGradient>

          {/* Glowing border gradient */}
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-mint)" />
            <stop offset="50%" stopColor="#4A8A13" />
            <stop offset="100%" stopColor="var(--accent-mint)" />
          </linearGradient>

          {/* Radial green spotlight */}
          <radialGradient id="centerSpot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-mint)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-mint)" stopOpacity="0" />
          </radialGradient>

          {/* Guilloche pattern */}
          <pattern id="guilloche" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 0 10 Q 5 0 10 10 T 20 10"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
            <path
              d="M 10 0 Q 15 10 20 0 T 30 0"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </pattern>

          {/* Edge vignette mask */}
          <mask id="vignetteMask">
            <rect width="705" height="300" fill="white" rx="12" />
            <rect
              width="705"
              height="300"
              fill="url(#vignetteGrad)"
              style={{ mixBlendMode: 'multiply' }}
            />
          </mask>

          <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="65%">
            <stop offset="70%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
        </defs>

        {/* Outer Shadow Container */}
        <rect
          x="4"
          y="4"
          width="697"
          height="292"
          rx="12"
          fill="url(#billBg)"
          stroke="url(#borderGrad)"
          strokeWidth="3"
        />

        {/* Guilloche Background Texture */}
        <rect x="10" y="10" width="685" height="280" rx="8" fill="url(#guilloche)" />

        {/* Center Glow Spot */}
        <rect x="10" y="10" width="685" height="280" rx="8" fill="url(#centerSpot)" />

        {/* Double Inner Ornate Border Frame */}
        <rect
          x="18"
          y="18"
          width="669"
          height="264"
          rx="6"
          fill="none"
          stroke="var(--accent-mint)"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />
        <rect
          x="24"
          y="24"
          width="657"
          height="252"
          rx="4"
          fill="none"
          stroke="var(--accent-mint)"
          strokeWidth="0.75"
          strokeDasharray="6 3"
          strokeOpacity="0.6"
        />

        {/* 4 Corners: Ornate "$1" Badges */}
        {[
          { x: 45, y: 52, anchor: 'middle' },
          { x: 660, y: 52, anchor: 'middle' },
          { x: 45, y: 255, anchor: 'middle' },
          { x: 660, y: 255, anchor: 'middle' },
        ].map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x}
              cy={c.y - 4}
              r="22"
              fill="#08140B"
              stroke="var(--accent-mint)"
              strokeWidth="1.5"
            />
            <circle
              cx={c.x}
              cy={c.y - 4}
              r="18"
              fill="none"
              stroke="var(--accent-mint)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <text
              x={c.x}
              y={c.y + 3}
              textAnchor="middle"
              fill="var(--accent-mint)"
              fontSize="20"
              fontWeight="900"
              fontFamily="serif"
            >
              $1
            </text>
          </g>
        ))}

        {/* Header Banknote Typography */}
        <text
          x="352.5"
          y="46"
          textAnchor="middle"
          fill='#9CA3AF'
          fontSize="11"
          letterSpacing="4"
          fontWeight="bold"
          fontFamily="monospace"
        >
          FEDERAL RESERVE NOTE
        </text>

        <text
          x="352.5"
          y="68"
          textAnchor="middle"
          fill='#FFFFFF'
          fontSize="20"
          letterSpacing="5"
          fontWeight="900"
          fontFamily="serif"
          style={{ textShadow: '0 0 10px rgba(126, 211, 33, 0.4)' }}
        >
          THE UNITED STATES OF AMERICA
        </text>

        {/* Serial Numbers (Left & Right) */}
        <text
          x="120"
          y="95"
          fill="var(--accent-mint)"
          fontSize="13"
          letterSpacing="2"
          fontWeight="bold"
          fontFamily="monospace"
        >
          ★ E 20260315 C ★
        </text>

        <text
          x="585"
          y="95"
          textAnchor="end"
          fill="var(--accent-mint)"
          fontSize="13"
          letterSpacing="2"
          fontWeight="bold"
          fontFamily="monospace"
        >
          ★ PEC 2026 $ ★
        </text>

        {/* Center Oval Medallion */}
        <g transform="translate(352.5, 160)">
          {/* Outer Ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="95"
            ry="75"
            fill="#09170D"
            stroke="var(--accent-mint)"
            strokeWidth="2.5"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="88"
            ry="68"
            fill="none"
            stroke="var(--accent-mint)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />

          {/* Central Eagle / Money Symbol Artwork */}
          <circle cx="0" cy="-6" r="42" fill="#0E2415" stroke="var(--accent-mint)" strokeWidth="1" />
          <path
            d="M -22 6 L 0 -28 L 22 6 L 10 6 L 0 -10 L -10 6 Z"
            fill="var(--accent-mint)"
            opacity="0.95"
          />
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fill="var(--accent-mint)"
            fontSize="32"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            $
          </text>

          {/* Medallion Text Arc / Label */}
          <text
            x="0"
            y="56"
            textAnchor="middle"
            fill='#FFFFFF'
            fontSize="10"
            letterSpacing="3"
            fontWeight="bold"
            fontFamily="monospace"
          >
            GEORGE WASHINGTON
          </text>
        </g>

        {/* Treasury Seals (Left & Right of Oval) */}
        {/* Left Seal: Great Seal Pyramid Motif */}
        <g transform="translate(160, 165)">
          <circle cx="0" cy="0" r="32" fill="#08140B" stroke="var(--accent-mint)" strokeWidth="1.5" />
          <polygon points="0,-18 20,16 -20,16" fill="none" stroke="var(--accent-mint)" strokeWidth="1.5" />
          <circle cx="0" cy="-6" r="4" fill="var(--accent-mint)" />
          <text
            x="0"
            y="26"
            textAnchor="middle"
            fill='#9CA3AF'
            fontSize="7"
            letterSpacing="1"
            fontFamily="monospace"
          >
            GREAT SEAL
          </text>
        </g>

        {/* Right Seal: Treasury Shield */}
        <g transform="translate(545, 165)">
          <circle cx="0" cy="0" r="32" fill="#08140B" stroke="var(--accent-mint)" strokeWidth="1.5" />
          <path
            d="M 0 -16 L 14 -8 L 14 6 Q 14 16 0 20 Q -14 16 -14 6 L -14 -8 Z"
            fill="none"
            stroke="var(--accent-mint)"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="var(--accent-mint)"
            fontSize="12"
            fontWeight="bold"
          >
            PEC
          </text>
          <text
            x="0"
            y="26"
            textAnchor="middle"
            fill='#9CA3AF'
            fontSize="7"
            letterSpacing="1"
            fontFamily="monospace"
          >
            TREASURY
          </text>
        </g>

        {/* Bottom Banner Typography */}
        <rect
          x="250"
          y="252"
          width="205"
          height="22"
          rx="4"
          fill="#071209"
          stroke="var(--accent-mint)"
          strokeWidth="1"
        />
        <text
          x="352.5"
          y="267"
          textAnchor="middle"
          fill="var(--accent-mint)"
          fontSize="14"
          letterSpacing="6"
          fontWeight="900"
          fontFamily="serif"
        >
          ONE DOLLAR
        </text>

        {/* Signatures */}
        <text
          x="200"
          y="240"
          textAnchor="middle"
          fill='#9CA3AF'
          fontSize="8"
          fontFamily="cursive"
        >
          Treasurer of E-Summit
        </text>
        <text
          x="505"
          y="240"
          textAnchor="middle"
          fill='#9CA3AF'
          fontSize="8"
          fontFamily="cursive"
        >
          Secretary of E-Cell PEC
        </text>
      </svg>
    </div>
  )
}
