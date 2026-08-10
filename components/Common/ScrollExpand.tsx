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
  customMedia?: React.ReactNode
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
  scrollDistance = 1200,
  holdDistance = 400,
  smoothing = 0.1,
  useWindowScroll = false,
  overlayScrim = 0.55,
  enabled = true,
  autoExpandDelay = 1500,
  lockUntilExpanded = true,
  backgroundContent,
  customMedia,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement | HTMLImageElement | HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

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

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current
    const media = mediaRef.current
    if (!frame || !media) return
    const c = propsRef.current

    const e = smoothstep(0, 1, p)

    if (bgRef.current) {
      bgRef.current.style.opacity = `${e}`
    }

    const w = c.startWidth + (100 - c.startWidth) * e
    const h = c.startHeight + (100 - c.startHeight) * e
    const ix = Math.max(0, (100 - w) / 2)
    const iy = Math.max(0, (100 - h) / 2)
    const r = c.startRadius + (c.endRadius - c.startRadius) * e
    if (c.mediaZoom !== 1) {
      media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`
    } else {
      media.style.transform = 'none'
    }

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
      return
    }

    if (autoExpandDelay > 0) {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
        window.scrollTo(0, 0)
      }
    }

    let autoProgress = 0
    let startTime: number | null = null
    const duration = 900
    let rafId = 0

    const updateProgress = () => {
      const scrollY = typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop || 0) : 0
      const scrollProgress = clamp(scrollY / 300, 0, 1)
      const effectiveProgress = Math.max(scrollProgress, autoProgress)
      applyProgress(effectiveProgress)
    }

    const animateAuto = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      autoProgress = Math.min(1, elapsed / duration)

      updateProgress()

      if (autoProgress < 1) {
        rafId = requestAnimationFrame(animateAuto)
      }
    }

    // Always start at 0
    applyProgress(0)

    // Start auto-expansion animation smoothly after delay
    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(animateAuto)
    }, autoExpandDelay)

    const handleScroll = () => {
      updateProgress()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [enabled, autoExpandDelay, applyProgress])

  const media = customMedia ? (
    <div ref={mediaRef as React.RefObject<HTMLDivElement>} className="scroll-expand__media w-full h-full">
      {customMedia}
    </div>
  ) : mediaType === 'video' ? (
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
        {/* Background content (fades in as card expands) */}
        {backgroundContent && (
          <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-0">
            {backgroundContent}
          </div>
        )}

        <div ref={frameRef} className="scroll-expand__frame">
          {media}
          <div ref={scrimRef} className="scroll-expand__scrim z-[2]" />
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
