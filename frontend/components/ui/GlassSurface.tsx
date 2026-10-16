'use client'

import React, { useId } from 'react'

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string
  height?: number | string
  borderRadius?: number | string
  borderWidth?: number | string
  distortionScale?: number
  displace?: number
  backgroundOpacity?: number
  backdrop?: React.RefObject<HTMLElement | null>
  brightness?: number
  opacity?: number
  blur?: number
  saturation?: number
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  refraction?: boolean
  renderer?: 'svg' | 'webgl' | 'css'
  shape?: string
  children?: React.ReactNode
}

export default function GlassSurface({
  width,
  height,
  borderRadius = 24,
  borderWidth = 1,
  distortionScale = -120,
  displace = 0.35,
  backgroundOpacity = 0.08,
  brightness = 105,
  opacity = 0.95,
  blur = 16,
  saturation = 1.3,
  redOffset = 0,
  greenOffset = 20,
  blueOffset = 40,
  refraction = true,
  renderer = 'svg',
  shape,
  borderColor = 'var(--border-glow)',
  className = '',
  style = {},
  children,
  ...rest
}: GlassSurfaceProps & { borderColor?: string }) {
  const rawId = useId()
  const filterId = `glass-filter-${rawId.replace(/:/g, '')}`

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height
  const resolvedRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius
  const resolvedBorderWidth = typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth

  // Scale factor for displacement
  const scale = Math.abs(distortionScale || 100) * (displace || 0.3) * 0.15

  return (
    <div
      className={`glass-surface-container relative overflow-hidden transition-all ${className}`}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        borderRadius: resolvedRadius,
        borderWidth: resolvedBorderWidth,
        borderStyle: 'solid',
        borderColor: (style as any)?.borderColor || borderColor,
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: `blur(${blur}px) saturate(${saturation * 100}%) brightness(${brightness}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation * 100}%) brightness(${brightness}%)`,
        opacity: opacity,
        boxShadow:
          (style as any)?.boxShadow ||
          'var(--glass-shadow, 0 8px 24px 0 rgba(0, 0, 0, 0.25))',
        ...style,
      }}
      {...rest}
    >
      {/* SVG Refraction & Chromatic Aberration Filter */}
      {refraction && renderer === 'svg' && (
        <svg
          className="pointer-events-none absolute w-0 h-0"
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <defs>
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              {/* Chromatic aberration offsets */}
              <feOffset in="displaced" dx={redOffset * 0.05} dy={0} result="red" />
              <feOffset in="displaced" dx={greenOffset * 0.05} dy={0} result="green" />
              <feOffset in="displaced" dx={blueOffset * 0.05} dy={0} result="blue" />
              <feMerge>
                <feMergeNode in="red" />
                <feMergeNode in="green" />
                <feMergeNode in="blue" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      )}

      {/* Surface Glass Glare Sheen */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 transition-opacity"
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 100%)',
          borderRadius: resolvedRadius,
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  )
}
