'use client'
// components/Hero/WavyDollarBill3D.tsx
// 60FPS GPU-accelerated 3D Wavy Ribbon Dollar Bill using Three.js
// Exactly matches the curved floating banknote ribbon in the reference design!

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WavyDollarBill3D({ prefersReduced }: { prefersReduced?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Offscreen Canvas Banknote Texture Generator
    const texCanvas = document.createElement('canvas')
    texCanvas.width = 1440
    texCanvas.height = 640
    const ctx = texCanvas.getContext('2d')
    if (!ctx) return

    // --- Draw Detailed High-Res $1 Banknote Texture ---
    ctx.fillStyle = '#091A0E'
    ctx.fillRect(0, 0, 1440, 640)

    // Radial green glow in texture background
    const grad = ctx.createRadialGradient(720, 320, 50, 720, 320, 600)
    grad.addColorStop(0, 'rgba(126, 211, 33, 0.25)')
    grad.addColorStop(0.5, 'rgba(126, 211, 33, 0.08)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1440, 640)

    // Outer border frame
    ctx.strokeStyle = 'var(--accent-mint)'
    ctx.lineWidth = 6
    ctx.strokeRect(16, 16, 1408, 608)

    // Inner dashed ornate frame
    ctx.strokeStyle = 'rgba(126, 211, 33, 0.6)'
    ctx.lineWidth = 3
    ctx.setLineDash([12, 6])
    ctx.strokeRect(28, 28, 1384, 584)
    ctx.setLineDash([])

    // 4 Corner $1 Seals
    const corners = [
      { x: 90, y: 90 },
      { x: 1350, y: 90 },
      { x: 90, y: 550 },
      { x: 1350, y: 550 },
    ]
    corners.forEach((c) => {
      ctx.beginPath()
      ctx.arc(c.x, c.y, 45, 0, Math.PI * 2)
      ctx.fillStyle = '#061209'
      ctx.fill()
      ctx.strokeStyle = 'var(--accent-mint)'
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.fillStyle = 'var(--accent-mint)'
      ctx.font = 'bold 42px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('$1', c.x, c.y)
    })

    // Banknote Top Typography
    ctx.fillStyle = '#9CA3AF'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('FEDERAL RESERVE NOTE', 720, 75)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 36px serif'
    ctx.fillText('THE UNITED STATES OF AMERICA', 720, 120)

    // Serial Numbers
    ctx.fillStyle = 'var(--accent-mint)'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('★ E 20260315 B ★', 220, 175)
    ctx.textAlign = 'right'
    ctx.fillText('★ PEC 2026 E ★', 1220, 175)

    // Center Medallion
    ctx.beginPath()
    ctx.ellipse(720, 340, 190, 150, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#08170D'
    ctx.fill()
    ctx.strokeStyle = 'var(--accent-mint)'
    ctx.lineWidth = 5
    ctx.stroke()

    // Inner Portrait Oval
    ctx.beginPath()
    ctx.ellipse(720, 330, 110, 100, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#0E2616'
    ctx.fill()
    ctx.strokeStyle = 'var(--accent-mint)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Giant Center $ Sign
    ctx.fillStyle = 'var(--accent-mint)'
    ctx.font = 'bold 110px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('$', 720, 325)

    // Washington / PEC Summit Label
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px monospace'
    ctx.fillText('WASHINGTON', 720, 465)

    // Left Great Seal
    ctx.beginPath()
    ctx.arc(360, 340, 90, 0, Math.PI * 2)
    ctx.fillStyle = '#07140B'
    ctx.fill()
    ctx.strokeStyle = 'var(--accent-mint)'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '16px monospace'
    ctx.fillText('GREAT SEAL', 360, 345)

    // Right Treasury Seal
    ctx.beginPath()
    ctx.arc(1080, 340, 90, 0, Math.PI * 2)
    ctx.fillStyle = '#07140B'
    ctx.fill()
    ctx.strokeStyle = 'var(--accent-mint)'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '16px monospace'
    ctx.fillText('TREASURY', 1080, 345)

    // Bottom Banner "ONE DOLLAR"
    ctx.fillStyle = '#061008'
    ctx.fillRect(520, 530, 400, 50)
    ctx.strokeStyle = 'var(--accent-mint)'
    ctx.lineWidth = 3
    ctx.strokeRect(520, 530, 400, 50)
    ctx.fillStyle = 'var(--accent-mint)'
    ctx.font = 'bold 32px serif'
    ctx.fillText('ONE DOLLAR', 720, 562)

    // Create Three.js Texture
    const texture = new THREE.CanvasTexture(texCanvas)
    texture.anisotropy = 16

    // 2. Three.js Scene Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 8.5)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0x7ed321, 2.5)
    dirLight.position.set(5, 5, 8)
    scene.add(dirLight)

    const greenPointLight = new THREE.PointLight(0x7ed321, 4, 15)
    greenPointLight.position.set(0, 0, 4)
    scene.add(greenPointLight)

    // 3. Create Curved Wavy 3D Ribbon Mesh
    const planeWidth = 7.2
    const planeHeight = 3.1
    const segmentsX = 96
    const segmentsY = 48
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY)

    // Save base vertex positions for wave displacement
    const posAttribute = geometry.attributes.position
    const initialPositions = posAttribute.array.slice()

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.4,
      emissive: new THREE.Color(0x7ed321),
      emissiveIntensity: 0.12,
    })

    const billMesh = new THREE.Mesh(geometry, material)
    // Angle in 3D like a floating wavy ribbon
    billMesh.rotation.x = 0.25
    billMesh.rotation.y = -0.35
    billMesh.rotation.z = 0.32
    scene.add(billMesh)

    // 4. Mouse Interactive Tilt
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0.25
    let targetRotY = -0.35

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) / rect.width - 0.5
      mouseY = (e.clientY - rect.top) / rect.height - 0.5

      targetRotY = -0.35 + mouseX * 0.4
      targetRotX = 0.25 - mouseY * 0.4
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 5. Animation Loop with Real 3D Ribbon Wave Motion
    let clock = new THREE.Clock()
    let animFrameId: number

    const animate = () => {
      const time = clock.getElapsedTime()

      // Wave deformation math across the geometry vertices
      if (!prefersReduced) {
        for (let i = 0; i < posAttribute.count; i++) {
          const u = initialPositions[i * 3]
          const v = initialPositions[i * 3 + 1]

          // Elegant S-curve ribbon warp + dynamic floating wave motion
          const wave1 = Math.sin(u * 1.2 + time * 1.8) * 0.35
          const wave2 = Math.cos(v * 1.5 + time * 1.4) * 0.18
          const S_curve = Math.sin(u * 0.8) * 0.4

          posAttribute.setZ(i, wave1 + wave2 + S_curve)
        }
        posAttribute.needsUpdate = true

        // Smooth rotation interpolation
        billMesh.rotation.x += (targetRotX - billMesh.rotation.x) * 0.05
        billMesh.rotation.y += (targetRotY - billMesh.rotation.y) * 0.05
        billMesh.position.y = Math.sin(time * 1.2) * 0.12
      }

      renderer.render(scene, camera)
      animFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      texture.dispose()
    }
  }, [prefersReduced])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[380px] sm:min-h-[460px] relative pointer-events-none select-none"
    />
  )
}
