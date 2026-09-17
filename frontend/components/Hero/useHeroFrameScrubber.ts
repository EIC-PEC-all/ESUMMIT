'use client'

import { useEffect, useRef, useCallback } from 'react'

export const TOTAL_RAW_FRAMES = 600
export const FRAME_STEP = 4
export const FRAME_COUNT = Math.floor(TOTAL_RAW_FRAMES / FRAME_STEP) // 150
export const FRAMES_PER_SHEET = 25
export const SHEET_COUNT = Math.ceil(FRAME_COUNT / FRAMES_PER_SHEET) // 6

export interface FrameManifest {
  cellWidth: number
  cellHeight: number
  cellMobileWidth: number
  cellMobileHeight: number
  frameCount: number
  framesPerSheet: number
  sheetCols: number
  sheetCount: number
}

export const getRawFrameNum = (i: number) => Math.min(TOTAL_RAW_FRAMES, i * FRAME_STEP + 1)
export const padFrame = (n: number) => String(n).padStart(4, '0')

const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false
  const mem = (navigator as any).deviceMemory
  const cores = navigator.hardwareConcurrency
  return (mem && mem <= 4) || (cores && cores <= 4)
}

const isUltraLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false
  const mem = (navigator as any).deviceMemory
  return mem && mem <= 2
}

export function useHeroFrameScrubber({
  containerRef,
  canvasRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
}) {
  const workerRef = useRef<Worker | null>(null)
  const usingWorkerRef = useRef(false)
  const bitmapCtxRef = useRef<ImageBitmapRenderingContext | null>(null)

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sheetsRef = useRef<(ImageBitmap | null)[]>(new Array(SHEET_COUNT).fill(null))
  const lowresRef = useRef<(ImageBitmap | null)[]>(new Array(FRAME_COUNT).fill(null))
  const manifestRef = useRef<FrameManifest | null>(null)

  const currentFrameRef = useRef(0)
  const isVisibleRef = useRef(true)
  const dimensionsRef = useRef({ w: 0, h: 0 })

  const targetFrameRef = useRef(0)
  const displayFrameRef = useRef(0)
  const springVelRef = useRef(0)
  const lastDispatchedRef = useRef(-1)
  const rafRef = useRef<number | null>(null)

  const nearestLowres = useCallback((target: number): ImageBitmap | null => {
    const list = lowresRef.current
    if (list[target]) return list[target]
    for (let off = 1; off < FRAME_COUNT; off++) {
      if (target - off >= 0 && list[target - off]) return list[target - off]
      if (target + off < FRAME_COUNT && list[target + off]) return list[target + off]
    }
    return null
  }, [])

  const renderFrameFallback = useCallback(
    (index: number) => {
      if (usingWorkerRef.current) return
      const canvas = canvasRef.current
      if (!canvas || !isVisibleRef.current) return
      if (!ctxRef.current) {
        ctxRef.current = canvas.getContext('2d', { alpha: true })
        if (ctxRef.current) {
          ctxRef.current.imageSmoothingEnabled = !isLowEndDevice()
          ctxRef.current.imageSmoothingQuality = window.innerWidth < 768 ? 'low' : 'high'
        }
      }
      const ctx = ctxRef.current
      if (!ctx || !manifestRef.current) return

      const w = dimensionsRef.current.w || canvas.width || 1280
      const h = dimensionsRef.current.h || canvas.height || 720

      const drawCoverFit = (src: ImageBitmap, sx: number, sy: number, sw: number, sh: number) => {
        const ratio = Math.max(w / sw, h / sh)
        const dx = (w - sw * ratio) / 2
        const dy = (h - sh * ratio) / 2
        ctx.clearRect(0, 0, w, h)
        ctx.drawImage(src, sx, sy, sw, sh, dx, dy, sw * ratio, sh * ratio)
      }

      const manifest = manifestRef.current
      const sheetIdx = Math.floor(index / FRAMES_PER_SHEET)
      const sheet = sheetsRef.current[sheetIdx]

      if (sheet) {
        const cell = index % FRAMES_PER_SHEET
        const col = cell % manifest.sheetCols
        const row = Math.floor(cell / manifest.sheetCols)
        const isMobile = window.innerWidth < 768
        const cW = isMobile ? manifest.cellMobileWidth : manifest.cellWidth
        const cH = isMobile ? manifest.cellMobileHeight : manifest.cellHeight
        drawCoverFit(sheet, col * cW, row * cH, cW, cH)
        return
      }

      const lr = nearestLowres(index)
      if (lr) drawCoverFit(lr, 0, 0, lr.width, lr.height)
    },
    [canvasRef, nearestLowres]
  )

  // IntersectionObserver
  useEffect(() => {
    if (isUltraLowEndDevice()) return
    const target = containerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting) return
        if (usingWorkerRef.current && workerRef.current) {
          workerRef.current.postMessage({ type: 'visibility', visible: true })
        } else {
          renderFrameFallback(currentFrameRef.current)
        }
      },
      { threshold: 0 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [containerRef, renderFrameFallback])

  // Worker initialization with bitmaprenderer (Chromium / Firefox, Safari routes to stable RAF 2D pipeline)
  useEffect(() => {
    if (isUltraLowEndDevice()) return
    const isMobileUserAgent =
      typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari =
      typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const canUseOffscreen =
      typeof window !== 'undefined' &&
      'OffscreenCanvas' in window &&
      !isMobileUserAgent &&
      !isSafari

    if (!canUseOffscreen) return
    const canvas = canvasRef.current
    if (!canvas) return

    const bitmapCtx = canvas.getContext('bitmaprenderer')
    if (!bitmapCtx) return
    bitmapCtxRef.current = bitmapCtx

    const worker = new Worker('/workers/hero-renderer.js?v=' + Date.now())
    workerRef.current = worker
    usingWorkerRef.current = true

    worker.onmessage = ({ data }) => {
      if (data.type === 'frame_bitmap' && bitmapCtxRef.current) {
        bitmapCtxRef.current.transferFromImageBitmap(data.bitmap)
      }
    }

    fetch('/sequence/manifest.json')
      .then((r) => r.json())
      .then((manifest: FrameManifest) => {
        const isAndroid = /android/i.test(navigator.userAgent)
        let dpr = Math.min(window.devicePixelRatio || 1, isAndroid ? 1.15 : 1.5)
        if (isLowEndDevice()) dpr = Math.min(dpr, 1.0)
        const w = Math.min(2560, Math.round(window.innerWidth * dpr))
        const h = Math.min(1440, Math.round(window.innerHeight * dpr))
        const isMobile = window.innerWidth < 768
        dimensionsRef.current = { w, h }
        worker.postMessage({ type: 'init', manifest, width: w, height: h, isMobile })
      })
      .catch(() => {
        usingWorkerRef.current = false
        bitmapCtxRef.current = null
        worker.terminate()
        workerRef.current = null
      })

    return () => {
      usingWorkerRef.current = false
      bitmapCtxRef.current = null
      worker.postMessage({ type: 'destroy' })
      worker.terminate()
    }
  }, [canvasRef])

  // Fallback Sprite Sheet & Manifest Loader (Safari, iOS, Mobile, Non-Worker fallback)
  useEffect(() => {
    if (isUltraLowEndDevice()) return
    const isMobileUserAgent =
      typeof navigator !== 'undefined' && /android|iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari =
      typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const canUseOffscreen =
      typeof window !== 'undefined' &&
      'OffscreenCanvas' in window &&
      !isMobileUserAgent &&
      !isSafari

    // Only run fallback sprite loader if worker cannot run
    if (canUseOffscreen) return

    let isMounted = true

    const initFallback = async () => {
      try {
        const res = await fetch('/sequence/manifest.json')
        if (isMounted && res.ok) {
          manifestRef.current = await res.json()
        }
      } catch {}

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const dir = isMobile ? 'vdo1-sheets-mobile' : 'vdo1-sheets'

      const loadSheet = async (s: number) => {
        try {
          const res = await fetch(`/sequence/${dir}/sheet_${String(s).padStart(2, '0')}.webp`, {
            cache: 'force-cache',
          })
          if (!res.ok || !isMounted) return
          sheetsRef.current[s] = await createImageBitmap(await res.blob())
          if (Math.floor(currentFrameRef.current / FRAMES_PER_SHEET) === s) {
            renderFrameFallback(currentFrameRef.current)
          }
        } catch {}
      }

      await loadSheet(0)
      if (!isMounted) return

      // Defer loading remaining sheets until browser idle to prioritize FCP and LCP
      const loadRemaining = () => {
        if (!isMounted) return
        for (let i = 1; i < SHEET_COUNT; i++) {
          loadSheet(i)
        }
      }

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        ;(window as any).requestIdleCallback(loadRemaining, { timeout: 3500 })
      } else {
        setTimeout(loadRemaining, 2000)
      }
    }

    initFallback()

    return () => {
      isMounted = false
    }
  }, [renderFrameFallback])

  // Resize handler
  useEffect(() => {
    if (isUltraLowEndDevice()) return
    const handleResize = () => {
      const isAndroid = /android/i.test(navigator.userAgent)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      let dpr = Math.min(window.devicePixelRatio || 1, isAndroid || isSafari ? 1.25 : 1.5)
      if (isLowEndDevice()) dpr = Math.min(dpr, 1.0)
      const w = Math.min(2560, Math.round(window.innerWidth * dpr))
      const h = Math.min(1440, Math.round(window.innerHeight * dpr))
      dimensionsRef.current = { w, h }

      if (usingWorkerRef.current && workerRef.current) {
        workerRef.current.postMessage({ type: 'resize', width: w, height: h })
      } else {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = w
        canvas.height = h
        ctxRef.current = null
        renderFrameFallback(currentFrameRef.current)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef, renderFrameFallback])

  // Direct 1:1 frame dispatch loop
  useEffect(() => {
    if (isUltraLowEndDevice()) return
    const isMobile = window.innerWidth < 768

    const tick = () => {
      if (isVisibleRef.current) {
        let frame = Math.round(targetFrameRef.current)
        if (isLowEndDevice()) {
          frame = Math.round(frame / 4) * 4
        } else if (isMobile) {
          frame = Math.round(frame / 2) * 2
        }

        if (frame !== lastDispatchedRef.current) {
          lastDispatchedRef.current = frame
          currentFrameRef.current = frame
          if (usingWorkerRef.current && workerRef.current) {
            workerRef.current.postMessage({ type: 'frame', index: frame })
          } else {
            renderFrameFallback(frame)
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [renderFrameFallback])

  const setTargetProgress = useCallback((latest: number) => {
    targetFrameRef.current = Math.min(FRAME_COUNT - 1, Math.max(0, latest * (FRAME_COUNT - 1)))
  }, [])

  return { setTargetProgress }
}
