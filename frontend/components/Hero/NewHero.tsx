'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import NextImage from 'next/image'
import { useSiteConfig } from '@/hooks/useSummitData'
import { useHeroFrameScrubber } from './useHeroFrameScrubber'
import HeroIntroTitle from './HeroIntroTitle'
import HeroPinnedContent from './HeroPinnedContent'

export default function NewHero() {
  const { siteConfig } = useSiteConfig()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { setTargetProgress } = useHeroFrameScrubber({
    containerRef,
    canvasRef,
  })

  // Scroll mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const initialOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const initialVisibility = useTransform(scrollYProgress, [0.16, 0.17], ['visible', 'hidden'])
  const mainContentOpacity = useTransform(scrollYProgress, [0.16, 0.28, 0.8, 0.95], [0, 1, 1, 0])
  const mainContentScale = useTransform(scrollYProgress, [0.16, 0.28, 0.8, 0.95], [0.95, 1, 1, 1.05])
  const mainContentVisibility = useTransform(
    scrollYProgress,
    [0.15, 0.16, 0.95, 0.96],
    ['hidden', 'visible', 'visible', 'hidden']
  )
  const endBlur = useTransform(scrollYProgress, [0.75, 0.96], ['blur(0px)', 'blur(24px)'])
  const endBlackenOpacity = useTransform(scrollYProgress, [0.75, 0.96], [0, 0.95])

  useMotionValueEvent(scrollYProgress, 'change', setTargetProgress)

  return (
    <section
      id="esummit-hero"
      ref={containerRef}
      data-theme-dark="true"
      className="relative h-[270vh] md:h-[350vh] bg-[#060D0B]"
      aria-label="PEC E-Summit Hero"
    >
      <div className="sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Fallback image */}
        <div className="absolute inset-0 z-[-1] w-full h-full">
          <NextImage
            src="/sequence/vdo1/output_0001.png"
            alt="E-Summit Hero Background"
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            style={{ filter: 'saturate(1.05) contrast(1.06)' }}
          />
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
          style={{
            transform: 'translate3d(0,0,0)',
            touchAction: 'pan-y',
            filter: 'saturate(1.05) contrast(1.06)',
          }}
        />

        {/* Dark Film Contrast Layer — Dims the bright banknote paper so white and volt text have deep contrast */}
        <div
          className="pointer-events-none absolute inset-0 z-1"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(4, 10, 8, 0.55) 0%, rgba(6, 13, 11, 0.72) 65%, #060D0B 100%)',
          }}
        />

        {/* Subtle Brand Green Ambient Glow using CSS Blending Mode 'screen' */}
        <div
          className="pointer-events-none absolute inset-0 z-1 opacity-80"
          style={{
            mixBlendMode: 'screen',
            background:
              'radial-gradient(ellipse 65% 55% at 50% 48%, rgba(116, 251, 68, 0.15) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)',
          }}
        />

        {/* Ambient Dark Green Contrast Blend using CSS Blending Mode 'overlay' */}
        <div
          className="pointer-events-none absolute inset-0 z-1 opacity-60"
          style={{
            mixBlendMode: 'overlay',
            background:
              'radial-gradient(circle at 48% 42%, rgba(116, 251, 68, 0.12) 0%, rgba(6, 26, 18, 0.45) 65%, transparent 100%)',
          }}
        />

        {/* Exit transition blur */}
        <motion.div
          className="hero-exit-blur z-2 pointer-events-none absolute inset-0 bg-[#060D0B]"
          style={{
            opacity: endBlackenOpacity,
            filter: endBlur,
            willChange: 'opacity, filter',
            transform: 'translateZ(0)',
          }}
        />

        <HeroIntroTitle opacity={initialOpacity} visibility={initialVisibility} />

        <HeroPinnedContent
          opacity={mainContentOpacity}
          scale={mainContentScale}
          visibility={mainContentVisibility}
          subtitle={siteConfig?.heroSubtitle}
          videoUrl={siteConfig?.heroVideoUrl}
        />
      </div>
    </section>
  )
}
