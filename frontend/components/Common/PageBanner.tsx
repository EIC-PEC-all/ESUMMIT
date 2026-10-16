import React from 'react'
import Image from 'next/image'

interface PageBannerProps {
  title: string
  subtitle?: string
  bgImage?: string
  bgImageClassName?: string
}

export default function PageBanner({ title, subtitle, bgImage, bgImageClassName }: PageBannerProps) {
  return (
    <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] overflow-hidden flex flex-col items-center justify-center pt-32 sm:pt-40 pb-20 sm:pb-24 select-none">
      {/* ── 1. Base Dark Canvas & Optional Background Image ── */}
      <div className="absolute inset-0 z-0 bg-void" />

      {bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={bgImage}
            alt={`${title} banner background`}
            fill
            priority
            className={`object-cover object-center mix-blend-luminosity filter contrast-125 ${bgImageClassName || 'opacity-35'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-transparent to-void" />
        </div>
      )}

      {/* ── 2. Fluid Mesh Aurora Gradient matching E-Summit '26 Brand Colors ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 5% 15%, rgba(138, 197, 63, 0.22) 0%, transparent 70%),
            radial-gradient(ellipse 60% 60% at 95% 10%, rgba(67, 65, 168, 0.26) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 50% 85%, rgba(168, 238, 74, 0.16) 0%, transparent 70%),
            radial-gradient(circle 350px at 80% 60%, rgba(45, 43, 122, 0.45) 0%, transparent 75%),
            radial-gradient(circle 300px at 20% 70%, rgba(138, 197, 63, 0.14) 0%, transparent 75%)
          `,
        }}
      />

      {/* ── 3. Subtle Brand Grid & Texture Overlay ── */}
      <div
        className="absolute inset-0 z-[2] opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(138, 197, 63, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(138, 197, 63, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── 4. Soft Text Contrast Isolation Scrim ── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, var(--bg-void) 0%, transparent 75%)',
          opacity: 0.85,
        }}
      />

      {/* ── 5. Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center">
        <h1
          className="font-display font-black uppercase leading-tight tracking-wider"
          style={{ fontSize: 'clamp(2.75rem, 7.5vw, 5.5rem)' }}
        >
          <span className="text-gradient-mint">
            {title}
          </span>
        </h1>
        {subtitle && (
          <p className="mt-3 sm:mt-4 font-mono-data text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-secondary leading-relaxed text-center max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── 6. Bottom Smooth Seamless Fade into Page Background ── */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 sm:h-36 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, var(--bg-section-1) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
