'use client'
// components/Common/TextAnims.tsx
// Core reusable text animations (MaskedWordRise, CyberDecrypt, ScrollGradientFill, GlitchText)

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Masked Word-by-Word Rise ──────────────────────────────────────────
export function MaskedWordRise({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.8,
              delay: i * 0.03,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ── Cyber Decrypt Cipher ──────────────────────────────────────────────
const GLYPHS = 'A_B_C_D_E_F_G_H_I_J_K_L_M_N_O_P_Q_R_S_T_U_V_W_X_Y_Z_0_1_2_3_4_5_6_7_8_9_@_#_$_%_&_*_+_?_!_:'

export function CyberDecrypt({
  text,
  triggerOn = 'mount',
  className = '',
}: {
  text: string
  triggerOn?: 'mount' | 'hover'
  className?: string
}) {
  const [displayText, setDisplayText] = useState(text)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  const startDecrypt = useCallback(() => {
    if (isDecrypting) return
    setIsDecrypting(true)
    let iterations = 0
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iterations) return text[index]
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join('')
      )

      if (iterations >= text.length) {
        clearInterval(interval)
        setIsDecrypting(false)
      }
      iterations += 1 / 3
    }, 20)
  }, [isDecrypting, text])

  useEffect(() => {
    if (triggerOn === 'mount') {
      const t = setTimeout(startDecrypt, 150)
      return () => clearTimeout(t)
    }
  }, [triggerOn, startDecrypt])

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={() => {
        if (triggerOn === 'hover') startDecrypt()
      }}
    >
      {displayText}
    </span>
  )
}

// ── Scroll-Driven Gradient Paint-Fill ──────────────────────────────────
export function ScrollGradientFill({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'end 50%'],
  })

  const gradientPos = useTransform(scrollYProgress, [0, 0.95], ['100%', '0%'])

  return (
    <motion.span
      ref={ref}
      className={`relative inline bg-gradient-to-r from-[#7ED321] via-[#50E3C2] to-white/15 bg-clip-text text-transparent bg-[length:200%_100%] transition-all duration-300 ${className}`}
      style={{
        backgroundPositionX: gradientPos,
      }}
    >
      {text}
    </motion.span>
  )
}

// ── Kinetic Aberration Glitch Text ─────────────────────────
export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span
      className={`relative inline-block select-none cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{text}</span>
      {isHovered && (
        <>
          <span
            className="absolute top-0 left-[-2px] text-[#7ED321] opacity-75 z-0 animate-[glitch-anim-1_0.2s_infinite] select-none pointer-events-none w-full"
            style={{ clipPath: 'inset(12% 0 28% 0)' }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-[2px] text-[#FF4D3D] opacity-75 z-0 animate-[glitch-anim-2_0.2s_infinite] select-none pointer-events-none w-full"
            style={{ clipPath: 'inset(45% 0 8% 0)' }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  )
}
