'use client'

import React, { useRef, useEffect } from 'react'

export default function GeometricNodesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (!canvas || !canvas.parentElement) return
        width = canvas.width = canvas.parentElement.clientWidth
        height = canvas.height = canvas.parentElement.clientHeight
      }, 200)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const count = width < 768 ? 16 : 28
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
    }))

    let mouseX = width / 2
    let mouseY = height / 2

    let mouseTick = false
    let isVisible = true
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseTick && isVisible) {
        requestAnimationFrame(() => {
          if (canvas) {
            const rect = canvas.getBoundingClientRect()
            mouseX = e.clientX - rect.left
            mouseY = e.clientY - rect.top
          }
          mouseTick = false
        })
        mouseTick = true
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          cancelAnimationFrame(animId)
          animId = requestAnimationFrame(draw)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    const maxDistSq = 140 * 140
    const mouseRadiusSq = 180 * 180
    const PI2 = Math.PI * 2

    const draw = () => {
      if (!isVisible) return

      ctx.clearRect(0, 0, width, height)

      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      ctx.beginPath()
      ctx.strokeStyle = isLight ? 'rgba(22, 101, 52, 0.28)' : 'rgba(138, 197, 63, 0.22)'
      ctx.lineWidth = 1

      const len = nodes.length
      for (let i = 0; i < len; i++) {
        const nodeI = nodes[i]
        for (let j = i + 1; j < len; j++) {
          const nodeJ = nodes[j]
          const dx = nodeI.x - nodeJ.x
          const dy = nodeI.y - nodeJ.y
          if (dx * dx + dy * dy < maxDistSq) {
            ctx.moveTo(nodeI.x, nodeI.y)
            ctx.lineTo(nodeJ.x, nodeJ.y)
          }
        }
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = isLight ? 'rgba(22, 101, 52, 0.75)' : 'rgba(138, 197, 63, 0.65)'

      for (let i = 0; i < len; i++) {
        const node = nodes[i]
        const mdx = mouseX - node.x
        const mdy = mouseY - node.y
        const mdistSq = mdx * mdx + mdy * mdy
        if (mdistSq < mouseRadiusSq && mdistSq > 0) {
          const mdist = Math.sqrt(mdistSq)
          node.x += (mdx / mdist) * 0.2
          node.y += (mdy / mdist) * 0.2
        }

        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx.moveTo(node.x + node.radius, node.y)
        ctx.arc(node.x, node.y, node.radius, 0, PI2)
      }
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-70"
    />
  )
}
