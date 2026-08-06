'use client'
// components/Hero/MoneyCanvas.tsx
// High-performance canvas money rain using offscreen pre-rendering and IntersectionObserver

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  rotSpeed: number
  scale: number
  opacity: number
  type: 'bill' | 'dollar'
}

export default function MoneyCanvas({ prefersReduced }: { prefersReduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId: number
    let isVisible = true

    // 1. Offscreen Canvas Caching for zero-overhead frame drawing
    const billCache = document.createElement('canvas')
    billCache.width = 160
    billCache.height = 68
    const bCtx = billCache.getContext('2d')
    if (bCtx) {
      bCtx.fillStyle = '#0B1A10'
      bCtx.strokeStyle = 'var(--accent-mint)'
      bCtx.lineWidth = 1.5
      bCtx.beginPath()
      bCtx.roundRect(2, 2, 156, 64, 6)
      bCtx.fill()
      bCtx.stroke()

      bCtx.strokeStyle = 'rgba(126,211,33,0.4)'
      bCtx.lineWidth = 0.8
      bCtx.strokeRect(6, 6, 148, 56)

      bCtx.fillStyle = 'var(--accent-mint)'
      bCtx.font = 'bold 16px serif'
      bCtx.textAlign = 'center'
      bCtx.textBaseline = 'middle'
      bCtx.fillText('$1', 80, 34)

      bCtx.fillStyle = 'rgba(126,211,33,0.7)'
      bCtx.font = '6px monospace'
      bCtx.fillText('★ PEC 2026 ★', 40, 14)
    }

    const dollarCache = document.createElement('canvas')
    dollarCache.width = 40
    dollarCache.height = 40
    const dCtx = dollarCache.getContext('2d')
    if (dCtx) {
      dCtx.fillStyle = 'var(--accent-mint)'
      dCtx.font = 'bold 28px serif'
      dCtx.textAlign = 'center'
      dCtx.textBaseline = 'middle'
      dCtx.fillText('$', 20, 20)
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // 2. Pause when section scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    // 3. Lightweight particle pool (14 particles max)
    const particles: Particle[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 800),
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.5 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      scale: 0.3 + Math.random() * 0.4,
      opacity: 0.12 + Math.random() * 0.18,
      type: Math.random() > 0.5 ? 'bill' : 'dollar',
    }))

    const animate = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          p.x += p.vx
          p.y += p.vy
          p.rot += p.rotSpeed

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.globalAlpha = p.opacity

          if (p.type === 'bill') {
            const w = 160 * p.scale
            const h = 68 * p.scale
            ctx.drawImage(billCache, -w / 2, -h / 2, w, h)
          } else {
            const size = 40 * p.scale
            ctx.drawImage(dollarCache, -size / 2, -size / 2, size, size)
          }

          ctx.restore()

          if (p.y > canvas.height + 60) {
            p.y = -60
            p.x = Math.random() * canvas.width
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [prefersReduced])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9, willChange: 'transform' }}
    />
  )
}
