'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './crtWarpShaders'
import './CRTWarp.css'

export interface CRTWarpProps {
  color?: string
  backgroundColor?: string
  speed?: number
  curvature?: number
  scanlineStrength?: number
  scanlineFrequency?: number
  waveAmplitude?: number
  waveFrequency?: number
  bloom?: number
  bloomRadius?: number
  noise?: number
  vignette?: number
  brightness?: number
  pixelation?: number
  rgbShift?: number
  mouseReact?: boolean
  mouseStrength?: number
  dpr?: number
  fps?: number
  paused?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function CRTWarp({
  color = '#8AC53F',
  backgroundColor = '#081310',
  speed = 0.35,
  curvature = 0.2,
  scanlineStrength = 0.18,
  scanlineFrequency = 180,
  waveAmplitude = 0.22,
  waveFrequency = 2.2,
  bloom = 1.0,
  bloomRadius = 1,
  noise = 0.06,
  vignette = 0.5,
  brightness = 0.95,
  pixelation = 1,
  rgbShift = 0.01,
  mouseReact = true,
  mouseStrength = 0.45,
  dpr = 1,
  fps = 30,
  paused = false,
  className,
  style,
}: CRTWarpProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number | null>(null)
  const pausedRef = useRef(paused)
  const pointerTargetRef = useRef(new THREE.Vector2(0, 0))
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0))
  const visibleRef = useRef(true)
  const fpsRef = useRef(fps)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    fpsRef.current = Math.max(1, fps)
  }, [fps])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: 0.5 },
        uColor: { value: new THREE.Color(color) },
        uBackgroundColor: { value: new THREE.Color(backgroundColor) },
        uCurvature: { value: 0.25 },
        uScanlineStrength: { value: 0.25 },
        uScanlineFrequency: { value: 200 },
        uWaveAmplitude: { value: 0.3 },
        uWaveFrequency: { value: 2.5 },
        uBloom: { value: 1.5 },
        uBloomRadius: { value: 1 },
        uNoise: { value: 0.1 },
        uVignette: { value: 0 },
        uBrightness: { value: 1.25 },
        uPixelation: { value: 1 },
        uRgbShift: { value: 0.015 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseStrength: { value: 0.5 },
        uMouseReact: { value: 1 },
      },
    })
    materialRef.current = material

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'low-power',
      })
    } catch {
      return undefined
    }

    rendererRef.current = renderer
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const resize = () => {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      renderer.setSize(width, height, false)
      material.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let lastTime = performance.now()
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
    })
    visibilityObserver.observe(container)

    const render = (now: number) => {
      frameRef.current = requestAnimationFrame(render)
      if (!visibleRef.current || document.hidden) return

      const interval = 1000 / fpsRef.current
      if (now - lastFrameRef.current < interval) return
      lastFrameRef.current = now - ((now - lastFrameRef.current) % interval)

      const currentTime = performance.now()
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime
      if (!pausedRef.current) {
        material.uniforms.uTime.value += delta * material.uniforms.uSpeed.value
      }

      pointerCurrentRef.current.lerp(pointerTargetRef.current, 0.08)
      material.uniforms.uPointer.value.copy(pointerCurrentRef.current)

      renderer.render(scene, camera)
    }

    render(0)

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerTargetRef.current.set(
        ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1)
      )
    }

    const onPointerLeave = () => pointerTargetRef.current.set(0, 0)

    const target =
      (container.closest('#register') as HTMLElement) ||
      (container.closest('section') as HTMLElement) ||
      (container.parentElement?.parentElement as HTMLElement) ||
      (container.parentElement as HTMLElement) ||
      container
    target.addEventListener('pointermove', onPointerMove as EventListener, { passive: true })
    target.addEventListener('pointerleave', onPointerLeave as EventListener)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      target.removeEventListener('pointermove', onPointerMove as EventListener)
      target.removeEventListener('pointerleave', onPointerLeave as EventListener)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.remove()
      }
      materialRef.current = null
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    const material = materialRef.current
    const renderer = rendererRef.current
    if (!material || !renderer) return

    const uniforms = material.uniforms
    uniforms.uColor.value.set(color)
    uniforms.uBackgroundColor.value.set(backgroundColor)
    uniforms.uSpeed.value = speed
    uniforms.uCurvature.value = curvature
    uniforms.uScanlineStrength.value = scanlineStrength
    uniforms.uScanlineFrequency.value = scanlineFrequency
    uniforms.uWaveAmplitude.value = waveAmplitude
    uniforms.uWaveFrequency.value = waveFrequency
    uniforms.uBloom.value = bloom
    uniforms.uBloomRadius.value = bloomRadius
    uniforms.uNoise.value = noise
    uniforms.uVignette.value = vignette
    uniforms.uBrightness.value = brightness
    uniforms.uPixelation.value = pixelation
    uniforms.uRgbShift.value = rgbShift
    uniforms.uMouseReact.value = mouseReact ? 1 : 0
    uniforms.uMouseStrength.value = mouseStrength

    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, dpr))
    const container = containerRef.current
    if (container) {
      renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1), false)
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }
  }, [
    backgroundColor,
    bloom,
    bloomRadius,
    brightness,
    color,
    curvature,
    dpr,
    mouseReact,
    mouseStrength,
    noise,
    pixelation,
    rgbShift,
    scanlineFrequency,
    scanlineStrength,
    speed,
    fps,
    vignette,
    waveAmplitude,
    waveFrequency,
  ])

  return (
    <div
      ref={containerRef}
      className={`crt-warp-container ${className || ''}`}
      style={style}
    />
  )
}
