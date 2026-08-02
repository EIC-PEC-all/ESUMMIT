'use client'
// components/Hero/MoneyCanvas.tsx
// Canvas-based animated money rain — dollar bills and $ signs falling with rotation

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
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn particles
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 1.5 - window.innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.6 + Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        scale: 0.25 + Math.random() * 0.45,
        opacity: 0.08 + Math.random() * 0.18,
        type: Math.random() > 0.5 ? 'bill' : 'dollar',
      })
    }

    const drawBill = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.opacity

      const w = 160 * p.scale
      const h = 68 * p.scale

      // Bill body
      ctx.fillStyle = '#0B1A10'
      ctx.strokeStyle = '#7ED321'
      ctx.lineWidth = 1.5 * p.scale
      ctx.beginPath()
      ctx.roundRect(-w / 2, -h / 2, w, h, 6 * p.scale)
      ctx.fill()
      ctx.stroke()

      // Inner border
      ctx.strokeStyle = 'rgba(126,211,33,0.5)'
      ctx.lineWidth = 0.5 * p.scale
      ctx.setLineDash([4 * p.scale, 2 * p.scale])
      ctx.beginPath()
      ctx.roundRect(-w / 2 + 4 * p.scale, -h / 2 + 4 * p.scale, w - 8 * p.scale, h - 8 * p.scale, 4 * p.scale)
      ctx.stroke()
      ctx.setLineDash([])

      // Center $
      ctx.fillStyle = '#7ED321'
      ctx.font = `bold ${16 * p.scale}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('$1', 0, 0)

      // Serial number
      ctx.fillStyle = 'rgba(126,211,33,0.7)'
      ctx.font = `${5 * p.scale}px monospace`
      ctx.textAlign = 'left'
      ctx.fillText('★ PEC 2026 ★', -w / 2 + 8 * p.scale, -h / 2 + 10 * p.scale)

      ctx.restore()
    }

    const drawDollar = (p: Particle) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.opacity

      ctx.fillStyle = '#7ED321'
      ctx.font = `bold ${30 * p.scale}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('$', 0, 0)

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotSpeed

        if (p.type === 'bill') drawBill(p)
        else drawDollar(p)

        // Reset when off screen
        if (p.y > canvas.height + 100) {
          p.y = -120
          p.x = Math.random() * canvas.width
        }
        if (p.x < -200) p.x = canvas.width + 100
        if (p.x > canvas.width + 200) p.x = -100
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [prefersReduced])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  )
}
