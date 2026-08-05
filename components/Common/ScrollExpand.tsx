'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import './ScrollExpand.css'

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1)
  return t * t * (3 - 2 * t)
}

export interface ScrollExpandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  src?: string
  mediaType?: 'image' | 'video'
  poster?: string
  alt?: string
  title?: React.ReactNode
  scrollHint?: React.ReactNode
  startWidth?: number
  startHeight?: number
  startRadius?: number
  endRadius?: number
  mediaZoom?: number
  scrollDistance?: number
  holdDistance?: number
  smoothing?: number
  overlayScrim?: number
  useWindowScroll?: boolean
  enabled?: boolean
  autoExpandDelay?: number
  lockUntilExpanded?: boolean
  backgroundContent?: React.ReactNode
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 44,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  overlayScrim = 0.55,
  enabled = true,
  autoExpandDelay = 1500,
  lockUntilExpanded = true,
  backgroundContent,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const isUnlockedRef = useRef(false)

  const propsRef = useRef({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    overlayScrim,
  })

  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    overlayScrim,
  }

  const unlockScroll = useCallback(() => {
    if (isUnlockedRef.current) return
    isUnlockedRef.current = true
    document.body.classList.remove('hero-scroll-locked')
    document.documentElement.classList.remove('hero-scroll-locked')
  }, [])

  const lockScroll = useCallback(() => {
    isUnlockedRef.current = false
    document.body.classList.add('hero-scroll-locked')
    document.documentElement.classList.add('hero-scroll-locked')
  }, [])

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current
    const media = mediaRef.current
    if (!frame || !media) return
    const c = propsRef.current

    const e = smoothstep(0, 1, p)

    const w = c.startWidth + (100 - c.startWidth) * e
    const h = c.startHeight + (100 - c.startHeight) * e
    const ix = Math.max(0, (100 - w) / 2)
    const iy = Math.max(0, (100 - h) / 2)
    const r = c.startRadius + (c.endRadius - c.startRadius) * e
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p)
      titleRef.current.style.opacity = `${1 - out}`
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p)
      hintRef.current.style.opacity = `${1 - gone}`
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p)
      overlayRef.current.style.opacity = `${inn}`
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`
      overlayRef.current.style.pointerEvents = inn > 0.5 ? 'auto' : 'none'
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      applyProgress(1)
      unlockScroll()
      return
    }

    let rafId = 0
    let startTime: number | null = null
    const duration = 900 // 900ms smooth single-pass expansion

    if (lockUntilExpanded) {
      lockScroll()
    }

    applyProgress(0)

    const animateExpansion = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const p = Math.min(1, elapsed / duration)

      applyProgress(p)

      if (p < 1) {
        rafId = requestAnimationFrame(animateExpansion)
      } else {
        if (lockUntilExpanded) {
          unlockScroll()
        }
      }
    }

    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(animateExpansion)
    }, autoExpandDelay)

    return () => {
      clearTimeout(timer)
      if (rafId) cancelAnimationFrame(rafId)
      unlockScroll()
    }
  }, [enabled, autoExpandDelay, lockUntilExpanded, applyProgress, lockScroll, unlockScroll])

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef as React.RefObject<HTMLVideoElement>}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={mediaRef as React.RefObject<HTMLImageElement>}
        className="scroll-expand__media"
        src={src}
        alt={alt}
        draggable={false}
      />
    )

  return (
    <div
      ref={rootRef}
      className={`scroll-expand relative w-full min-h-screen ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div className="relative w-full h-screen sticky top-0 overflow-hidden">
        {/* Background content (6-8 vertical column gallery) */}
        {backgroundContent && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {backgroundContent}
          </div>
        )}

        <div ref={frameRef} className="scroll-expand__frame">
          {media}
          <div ref={scrimRef} className="scroll-expand__scrim" />
          {children ? (
            <div ref={overlayRef} className="scroll-expand__overlay">
              {children}
            </div>
          ) : null}
        </div>

        {title ? (
          <div ref={titleRef} className="scroll-expand__title">
            {title}
          </div>
        ) : null}

        {scrollHint ? (
          <div ref={hintRef} className="scroll-expand__hint">
            {scrollHint}
          </div>
        ) : null}
      </div>
    </div>
  )
}
