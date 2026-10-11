'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Renderer, Program, Mesh, Triangle, Plane, Texture, RenderTarget } from 'ogl'

import './FlexCarousel.css'
import { cardVertex, cardFragment, lensVertex, lensFragment } from './flexCarouselShaders'
import {
  BEND_PRESETS,
  FIT_ASPECT,
  PIXEL_BUDGET,
  INTRO_DURATION,
  wrap,
  clamp01,
  easeOut,
  easeOutQuint,
  easeInOut,
  FlexCarouselItem,
} from './flexCarouselConstants'

export interface FlexCarouselProps {
  items?: FlexCarouselItem[]
  preset?: 'liquid' | 'ribbon' | 'vortex' | 'arch'
  intro?: 'rise' | 'bloom' | 'spin' | 'deal' | 'none'
  cardHeight?: number
  gap?: number
  radius?: number
  fit?: 'natural' | 'portrait' | 'square' | 'landscape'
  lensWidth?: number
  lensHeight?: number
  tilt?: number
  roundness?: number
  bend?: number
  reach?: number
  curl?: 'twist' | 'rise' | 'fall'
  dispersion?: number
  liquid?: number
  followCursor?: boolean
  squeeze?: number
  focusOnClick?: boolean
  autoplay?: boolean
  interval?: number
  captions?: boolean
  captureWheel?: boolean
  scrollProgress?: number
  infinite?: boolean
  onChange?: (index: number, item: FlexCarouselItem) => void
  onSelect?: (index: number, item: FlexCarouselItem) => void
  className?: string
  style?: React.CSSProperties
}

const Digits = ({ value }: { value: number }) => (
  <span className="flex-carousel__digits">
    {String(value)
      .padStart(2, '0')
      .split('')
      .map((digit, index) => (
        <span key={index} className="flex-carousel__digit">
          <span
            className="flex-carousel__reel"
            style={{ transform: `translateY(${-Number(digit) * 10}%)` }}
          >
            {'0123456789'.split('').map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
  </span>
)

const FlexCarousel: React.FC<FlexCarouselProps> = ({
  items = [],
  preset = 'liquid',
  intro = 'rise',
  cardHeight = 0.5,
  gap = 12,
  radius = 0,
  fit = 'natural',
  lensWidth,
  lensHeight,
  tilt,
  roundness,
  bend,
  reach,
  curl,
  dispersion,
  liquid,
  followCursor,
  squeeze = 0.2,
  focusOnClick = true,
  autoplay = false,
  interval = 4,
  captions = true,
  captureWheel = true,
  scrollProgress,
  infinite = true,
  onChange,
  onSelect,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const settingsRef = useRef<any>(null)
  const itemsRef = useRef(items)
  const engineRef = useRef<any>(null)
  const callbacksRef = useRef({ onChange, onSelect })
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [focusOpen, setFocusOpen] = useState(false)

  const base = BEND_PRESETS[preset] || BEND_PRESETS.liquid
  const pick = (value: any, key: string) =>
    value === undefined || value === null ? (base as any)[key] : value

  const list = items && items.length ? items : []
  const itemsKey = list.map((item) => item.src).join('|')

  useEffect(() => {
    itemsRef.current = list
    callbacksRef.current = { onChange, onSelect }
    settingsRef.current = {
      intro,
      cardHeight,
      gap,
      radius,
      fit,
      lensWidth: pick(lensWidth, 'lensWidth'),
      lensHeight: pick(lensHeight, 'lensHeight'),
      tilt: pick(tilt, 'tilt'),
      roundness: pick(roundness, 'roundness'),
      bend: pick(bend, 'bend'),
      reach: pick(reach, 'reach'),
      curl: pick(curl, 'curl'),
      dispersion: pick(dispersion, 'dispersion'),
      liquid: pick(liquid, 'liquid'),
      followCursor: pick(followCursor, 'followCursor'),
      squeeze,
      focusOnClick,
      autoplay,
      interval,
      captureWheel,
      scrollProgress,
      infinite,
    }
    engineRef.current?.wake()
  })

  useEffect(() => {
    engineRef.current?.setItems(itemsRef.current)
  }, [itemsKey])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let renderer: any
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
      })
    } catch {
      return undefined
    }

    const gl = renderer.gl
    if (!renderer.isWebgl2) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      return undefined
    }
    gl.clearColor(0, 0, 0, 0)
    const canvas = gl.canvas
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.setAttribute('aria-hidden', 'true')
    container.prepend(canvas)

    const cardProgram = new Program(gl, {
      vertex: cardVertex,
      fragment: cardFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tMap: { value: new Texture(gl) },
        uRect: { value: [0, 0, 1, 1] },
        uResolution: { value: [1, 1] },
        uSize: { value: [1, 1] },
        uImage: { value: [1, 1] },
        uRadius: { value: 16 },
        uAlpha: { value: 1 },
        uReady: { value: 0 },
        uShift: { value: 0 },
        uDpr: { value: 1 },
        uPlaceholder: { value: [0.5, 0.5, 0.5] },
      },
    })
    cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram })

    const target = new RenderTarget(gl, {
      width: 2,
      height: 2,
      depth: false,
      minFilter: gl.LINEAR_MIPMAP_LINEAR,
      magFilter: gl.LINEAR,
    })

    const lensUniforms: any = {
      tScene: { value: target.texture },
      uResolution: { value: [1, 1] },
      uDpr: { value: 1 },
      uCenter: { value: [0, 0] },
      uHalf: { value: [1, 1] },
      uAngle: { value: 0 },
      uExponent: { value: 2 },
      uInner: { value: 60 },
      uOuter: { value: 80 },
      uFlow: { value: 0 },
      uCurl: { value: 0 },
      uDispersion: { value: 0 },
      uStrength: { value: 0 },
      uSceneAlpha: { value: 0 },
    }
    const lensMesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: lensVertex,
        fragment: lensFragment,
        uniforms: lensUniforms,
        depthTest: false,
        depthWrite: false,
      }),
    })

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const anisotropy = renderer.getExtension('EXT_texture_filter_anisotropic') ? 8 : 0

    let slots: any[] = []
    let width = 1
    let height = 1
    let pos = 0
    let vel = 0
    let goal = 0
    let mode = 'spring'
    let wheelAt = 0
    let raf = 0
    let last = performance.now()
    let visible = true
    let alive = true
    let dirty = true
    let activeIndex = -1
    let interactedAt = -Infinity
    let autoplayAt = performance.now()
    let hasFocus = false
    let deform = 0
    let deformVel = 0
    let layout: any = null
    let resnap = false
    let hover = ''
    let lift = 1
    let energy = 0
    let lastPos = 0
    const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false }
    const pointer: any = {
      x: 0,
      y: 0,
      over: false,
      down: false,
      id: -1,
      startX: 0,
      startY: 0,
      startPos: 0,
      dragging: false,
      touch: false,
      samples: [],
    }
    const introState: any = { kind: 'none', t: 0, running: false, done: false, readyAt: 0 }
    const focus: any = { index: -1, pending: -1, t: 0, v: 0, target: 0 }
    let instances: any[] = []

    const loadSlot = (item: any, index: number) => {
      const texture = new Texture(gl, {
        generateMipmaps: true,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR,
        anisotropy,
      })
      const slot: any = {
        item,
        index,
        texture,
        aspect: 0.8,
        loaded: false,
        failed: false,
        ready: 0,
        color: [0.5, 0.5, 0.5],
        image: [1, 1],
        dispose: () => {},
      }
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.decoding = 'async'
      image.onload = () => {
        if (!alive || !slots.includes(slot)) return
        texture.image = image
        texture.update()
        slot.image = [image.naturalWidth || 1, image.naturalHeight || 1]
        slot.aspect = slot.image[0] / slot.image[1]
        try {
          const probe = document.createElement('canvas')
          probe.width = 8
          probe.height = 8
          const ctx = probe.getContext('2d', { willReadFrequently: true })
          if (ctx) {
            ctx.drawImage(image, 0, 0, 8, 8)
            const data = ctx.getImageData(0, 0, 8, 8).data
            const avg = [0, 0, 0]
            for (let i = 0; i < data.length; i += 4) {
              avg[0] += data[i]
              avg[1] += data[i + 1]
              avg[2] += data[i + 2]
            }
            slot.color = avg.map((v) => v / 64 / 255)
          }
        } catch {
          slot.color = [0.5, 0.5, 0.5]
        }
        slot.loaded = true
        dirty = true
        start()
      }
      image.onerror = () => {
        if (!alive) return
        slot.failed = true
        dirty = true
        start()
      }
      image.src = item.src
      slot.dispose = () => {
        image.onload = null
        image.onerror = null
        gl.deleteTexture(texture.texture)
      }
      return slot
    }

    const setItems = (next: any[]) => {
      slots.forEach((slot) => slot.dispose())
      slots = next.map(loadSlot)
      activeIndex = -1
      layout = null
      resnap = true
      focus.target = 0
      focus.t = 0
      focus.v = 0
      focus.pending = -1
      setFocusOpen(false)
      introState.readyAt = performance.now()
      dirty = true
      start()
    }

    const metrics = (s: any) => {
      const cardH = Math.max(24, s.cardHeight * height)
      const fixed = FIT_ASPECT[s.fit]
      const widths = slots.map((slot) => (fixed || slot.aspect) * cardH)
      const centers = []
      let cursor = 0
      for (let i = 0; i < widths.length; i++) {
        centers.push(cursor + widths[i] / 2)
        cursor += widths[i] + s.gap
      }
      return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) }
    }

    const nearest = (m: any, at: number) => {
      const s = settingsRef.current
      const isFinite = s?.infinite === false
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < m.centers.length; i++) {
        const dist = isFinite
          ? Math.abs(m.centers[i] - at)
          : Math.abs(wrap(m.centers[i] - at, m.loop))
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      }
      return best
    }

    const snapPoint = (m: any, at: number) => {
      const s = settingsRef.current
      const isFinite = s?.infinite === false
      const i = nearest(m, at)
      if (isFinite) {
        return m.centers[i]
      }
      return at + wrap(m.centers[i] - at, m.loop)
    }

    const remap = (from: any, to: any, at: number) => {
      const i = nearest(from, at)
      const offset = wrap(at - from.centers[i], from.loop)
      const cycles = Math.round((at - offset - from.centers[i]) / from.loop)
      return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i])
    }

    const step = (m: any, delta: number) => {
      const s = settingsRef.current
      const isFinite = s?.infinite === false
      const n = m.centers.length
      let at = snapPoint(m, goal)
      let index = nearest(m, at)
      if (isFinite) {
        const next = Math.max(0, Math.min(n - 1, index + delta))
        goal = m.centers[next]
      } else {
        for (let k = 0; k < Math.abs(delta); k++) {
          const next = (index + (delta > 0 ? 1 : n - 1)) % n
          const distance =
            delta > 0
              ? m.widths[index] / 2 + m.gap + m.widths[next] / 2
              : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2)
          at += distance
          index = next
        }
        goal = at
      }
      mode = 'spring'
      dirty = true
      start()
    }

    const goTo = (m: any, index: number) => {
      const i = ((index % m.centers.length) + m.centers.length) % m.centers.length
      goal = goal + wrap(m.centers[i] - goal, m.loop)
      mode = 'spring'
      dirty = true
      start()
    }

    const openFocus = (index: number) => {
      focus.index = index
      focus.pending = -1
      focus.target = 1
      setFocusOpen(true)
      dirty = true
      start()
    }

    const closeFocus = () => {
      focus.pending = -1
      if (focus.target === 0) return false
      focus.target = 0
      setFocusOpen(false)
      dirty = true
      start()
      return true
    }

    const skipIntro = () => {
      if (introState.running) introState.t = 1
    }

    const introEffects = () => {
      const t = introState.running ? introState.t : introState.done ? 1 : 0
      const e: any = { sceneAlpha: 1, strength: 1, card: null }
      if (!introState.done && !introState.running) {
        e.sceneAlpha = 0
        e.strength = 0
        return e
      }
      if (t >= 1) return e
      const kind = introState.kind
      if (kind === 'rise') {
        e.strength = easeInOut((t - 0.3) / 0.65)
        e.card = (rel: number) => {
          const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34
          const local = clamp01((t - delay) / 0.6)
          return {
            alpha: clamp01(local * 4),
            x: 0,
            y: (1 - easeOutQuint(local)) * height * 0.62,
            scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82),
          }
        }
      } else if (kind === 'bloom') {
        e.strength = easeInOut((t - 0.2) / 0.8)
        e.card = (rel: number) => {
          const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25
          const local = easeOut((t - delay) / 0.55)
          return { alpha: local, x: 0, y: 0, scale: 0.92 + 0.08 * local }
        }
      } else if (kind === 'spin') {
        e.sceneAlpha = easeOut(t / 0.25)
        e.strength = easeOut((t - 0.55) / 0.45)
      } else if (kind === 'deal') {
        e.strength = easeOut((t - 0.45) / 0.5)
        e.card = (rel: number) => {
          const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3
          const local = easeOut((t - 0.12 - spread) / 0.5)
          return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - local), y: 0, scale: 1 }
        }
      } else {
        e.sceneAlpha = easeOut(t)
        e.strength = easeOut(t)
      }
      return e
    }

    const beginIntro = (s: any, m: any) => {
      const kind = reducedMotion && s.intro !== 'none' ? 'fade' : s.intro
      introState.kind = INTRO_DURATION[kind] ? kind : 'none'
      introState.running = introState.kind !== 'none'
      introState.done = !introState.running
      introState.t = 0
      if (introState.done) setRevealed(true)
      if (introState.kind === 'spin') {
        const distance = m.loop * 1.6 + width
        pos = goal + distance
        vel = -distance * 3
        mode = 'spring'
      }
    }

    const resize = () => {
      width = Math.max(1, container.clientWidth)
      height = Math.max(1, container.clientHeight)
      renderer.dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(PIXEL_BUDGET / (width * height))
      )
      renderer.setSize(width, height)
      target.setSize(
        Math.max(2, Math.round(width * renderer.dpr)),
        Math.max(2, Math.round(height * renderer.dpr))
      )
      lensUniforms.tScene.value = target.texture
      dirty = true
      start()
    }

    const frame = (now: number) => {
      raf = 0
      if (!alive) return
      const s = settingsRef.current
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      if (!s || !slots.length) {
        if (visible) raf = requestAnimationFrame(frame)
        return
      }

      const m = metrics(s)
      const n = slots.length
      let animating = false

      if (resnap) {
        goal = snapPoint(m, goal)
        pos = goal
        vel = 0
        resnap = false
      } else if (layout && layout.loop !== m.loop) {
        pos = remap(layout, m, pos)
        goal = remap(layout, m, goal)
        pointer.startPos = pos + (pointer.x - pointer.startX)
        animating = true
      }
      layout = m

      if (!introState.running && !introState.done) {
        const allSettled = slots.every((slot) => slot.loaded || slot.failed)
        if (allSettled || now - introState.readyAt > 3500) {
          goal = snapPoint(m, goal)
          pos = goal
          beginIntro(s, m)
        }
      }
      if (introState.running) {
        introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1))
        if (introState.t >= 1) {
          introState.running = false
          introState.done = true
          setRevealed(true)
        }
        animating = true
      }

      if (s.scrollProgress !== undefined && s.scrollProgress !== null && !pointer.dragging) {
        const p = clamp01(s.scrollProgress)
        const idx = p * (n - 1)
        const i0 = Math.floor(idx)
        const i1 = Math.min(n - 1, i0 + 1)
        const frac = idx - i0
        const targetPos = m.centers[i0] + frac * (m.centers[i1] - m.centers[i0])
        goal = targetPos
        mode = 'scroll'
        animating = true

        if (!introState.done) {
          introState.running = false
          introState.done = true
          setRevealed(true)
        }
        if (focus.target > 0 && Math.abs(goal - pos) > 6) {
          closeFocus()
        }
      } else if (mode === 'wheel' && now - wheelAt > 150) {
        goal = snapPoint(m, goal)
        mode = 'spring'
      }
      if (!pointer.dragging) {
        const spinning = introState.running && introState.kind === 'spin'
        const stiffness = spinning ? 9 : mode === 'scroll' ? 110 : mode === 'wheel' ? 80 : 55
        const damping = 2 * Math.sqrt(stiffness)
        const steps = Math.ceil(dt / (1 / 240))
        const h = dt / steps
        for (let i = 0; i < steps; i++) {
          const acc = stiffness * (goal - pos) - damping * vel
          vel += acc * h
          pos += vel * h
        }
        if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
          pos = goal
          vel = 0
        } else {
          animating = true
        }
      } else {
        animating = true
      }

      if (s.infinite !== false && Math.abs(pos) > m.loop * 8) {
        const shift = Math.round(pos / m.loop) * m.loop
        pos -= shift
        goal -= shift
        pointer.startPos -= shift
      }

      const current = nearest(m, pos)
      if (current !== activeIndex) {
        activeIndex = current
        setActive(current)
        callbacksRef.current.onChange?.(current, itemsRef.current[current])
      }

      if (
        focus.pending >= 0 &&
        mode === 'spring' &&
        Math.abs(goal - pos) < 1.5 &&
        Math.abs(vel) < 30
      ) {
        if (current === focus.pending) openFocus(current)
        else focus.pending = -1
      }

      if (
        s.autoplay &&
        (s.scrollProgress === undefined || s.scrollProgress === null) &&
        !reducedMotion &&
        introState.done &&
        focus.target === 0 &&
        focus.t < 0.01 &&
        !pointer.over &&
        !pointer.down &&
        !hasFocus &&
        mode === 'spring' &&
        Math.abs(goal - pos) < 1 &&
        now - interactedAt > 3000 &&
        now - autoplayAt > s.interval * 1000
      ) {
        autoplayAt = now
        step(m, 1)
      }
      if (s.autoplay && !reducedMotion) animating = true

      const travel = Math.abs(pos - lastPos) / dt
      lastPos = pos
      const energyTarget = reducedMotion ? 0 : Math.min(travel / 2600, 1)
      energy +=
        (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.35)))
      if (energy > 0.001) animating = true
      const liquidAmount = reducedMotion ? 0 : s.liquid
      const push = Math.max(-1, Math.min(1, vel / 2200))
      const deformStiffness = 120
      const deformDamping = 2 * Math.sqrt(deformStiffness) * 0.32
      deformVel += (deformStiffness * (push - deform) - deformDamping * deformVel) * dt
      deform += deformVel * dt
      if (Math.abs(deform) > 0.0005 || Math.abs(deformVel) > 0.005) animating = true

      const focusStiffness = 64
      focus.v +=
        (focusStiffness * (focus.target - focus.t) - 2 * Math.sqrt(focusStiffness) * focus.v) * dt
      focus.t += focus.v * dt
      if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) {
        focus.t = focus.target
        focus.v = 0
      } else {
        animating = true
      }
      const focusAmount = clamp01(focus.t)
      const focusEase = easeInOut(focusAmount)
      const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH
      const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW))
      const nextLift = 1 + (focusScale - 1) * focusEase
      if (Math.abs(nextLift - lift) > 0.0005) {
        lift = nextLift
        container.style.setProperty('--flex-carousel-lift', lift.toFixed(4))
      }

      const effects = introEffects()

      const homeX = width / 2
      const homeY = height / 2
      const follow =
        s.followCursor && pointer.over && !pointer.dragging && !pointer.touch && focus.target === 0
      const aimX = follow ? pointer.x : homeX
      const aimY = follow ? pointer.y : homeY
      if (!lens.ready) {
        lens.x = homeX
        lens.y = homeY
        lens.ready = true
      }
      const lensK = 110
      const lensC = 2 * Math.sqrt(lensK) * 0.8
      lens.vx += (lensK * (aimX - lens.x) - lensC * lens.vx) * dt
      lens.vy += (lensK * (aimY - lens.y) - lensC * lens.vy) * dt
      lens.x += lens.vx * dt
      lens.y += lens.vy * dt
      if (
        Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 ||
        Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5
      )
        animating = true

      const cardH = m.cardH
      let halfW = (s.lensWidth * width) / 2
      let halfH = (s.lensHeight * width) / 2
      const squash = Math.abs(deform) * liquidAmount
      halfW *= 1 + squash * 0.16
      halfH *= 1 - squash * 0.08
      const lensX = lens.x - deform * 14 * liquidAmount

      for (let i = 0; i < n; i++) {
        const slot = slots[i]
        if (slot.loaded && slot.ready < 1) {
          slot.ready = Math.min(1, slot.ready + dt / 0.45)
          animating = true
        }
      }

      const waiting = !introState.done
      if (dirty || animating || pointer.dragging) {
        dirty = false
        instances = []
        const dpr = renderer.dpr
        cardProgram.uniforms.uResolution.value = [width, height]
        cardProgram.uniforms.uDpr.value = dpr
        cardProgram.uniforms.uRadius.value = s.radius
        const shrink = 1 - clamp01(s.squeeze) * energy
        const draws: any[] = []
        for (let i = 0; i < n; i++) {
          const w = m.widths[i]
          if (s.infinite === false) {
            const rel = m.centers[i] - pos
            if (Math.abs(rel) - w / 2 > width + 40) continue
            const fx = effects.card ? effects.card(rel) : null
            let x = homeX + rel + (fx ? fx.x : 0)
            let scale = shrink * (fx ? fx.scale : 1)
            let alpha = fx ? fx.alpha : 1
            if (focusAmount > 0) {
              if (i === focus.index && Math.abs(rel) < w) {
                scale *= 1 + (focusScale - 1) * focusEase
              } else {
                const order = Math.min(Math.abs(rel) / width, 1) * 0.25
                const part = easeInOut(focusAmount * 1.25 - order)
                x += Math.sign(rel) * part * width * 0.7
                alpha *= 1 - part
              }
            }
            const cw = w * scale
            if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue
            draws.push({ i, rel, x, y: homeY + (fx ? fx.y : 0), cw, ch: cardH * scale, alpha })
          } else {
            const baseRel = wrap(m.centers[i] - pos, m.loop)
            for (let k = -3; k <= 3; k++) {
              const rel = baseRel + k * m.loop
              if (Math.abs(rel) - w / 2 > width + 40) continue
              const fx = effects.card ? effects.card(rel) : null
              let x = homeX + rel + (fx ? fx.x : 0)
              let scale = shrink * (fx ? fx.scale : 1)
              let alpha = fx ? fx.alpha : 1
              if (focusAmount > 0) {
                if (i === focus.index && Math.abs(rel) < w) {
                  scale *= 1 + (focusScale - 1) * focusEase
                } else {
                  const order = Math.min(Math.abs(rel) / width, 1) * 0.25
                  const part = easeInOut(focusAmount * 1.25 - order)
                  x += Math.sign(rel) * part * width * 0.7
                  alpha *= 1 - part
                }
              }
              const cw = w * scale
              if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue
              draws.push({ i, rel, x, y: homeY + (fx ? fx.y : 0), cw, ch: cardH * scale, alpha })
            }
          }
        }
        draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel))
        let first = true
        for (const draw of draws) {
          const slot = slots[draw.i]
          cardProgram.uniforms.tMap.value = slot.texture
          cardProgram.uniforms.uRect.value = [draw.x, draw.y, draw.cw + 2, draw.ch + 2]
          cardProgram.uniforms.uSize.value = [draw.cw, draw.ch]
          cardProgram.uniforms.uImage.value = slot.image
          cardProgram.uniforms.uAlpha.value = draw.alpha
          cardProgram.uniforms.uReady.value = slot.ready
          cardProgram.uniforms.uShift.value = reducedMotion
            ? 0
            : Math.max(-1, Math.min(1, draw.rel / (width * 0.75)))
          cardProgram.uniforms.uPlaceholder.value = slot.color
          renderer.render({ scene: cardMesh, target, clear: first })
          first = false
          instances.push({
            index: draw.i,
            x0: draw.x - draw.cw / 2,
            x1: draw.x + draw.cw / 2,
            y0: draw.y - draw.ch / 2,
            y1: draw.y + draw.ch / 2,
          })
        }
        if (first) {
          renderer.bindFramebuffer(target)
          gl.viewport(0, 0, target.width, target.height)
          gl.clear(gl.COLOR_BUFFER_BIT)
        }
        renderer.bindFramebuffer()
        target.texture.bind()
        gl.generateMipmap(gl.TEXTURE_2D)

        lensUniforms.uResolution.value = [width, height]
        lensUniforms.uDpr.value = dpr
        lensUniforms.uCenter.value = [lensX, lens.y]
        lensUniforms.uHalf.value = [Math.max(halfW, 1), Math.max(halfH, 1)]
        lensUniforms.uAngle.value = (s.tilt * Math.PI) / 180
        lensUniforms.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10
        const spanW = Math.max(halfW, 1)
        const spanH = Math.max(halfH, 1)
        const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5)
        lensUniforms.uInner.value = inner
        lensUniforms.uOuter.value = inner * 1.6
        lensUniforms.uFlow.value = s.bend * (spanW + spanH) * 0.45
        lensUniforms.uCurl.value = s.curl === 'rise' ? 1 : s.curl === 'fall' ? -1 : 0
        lensUniforms.uDispersion.value =
          s.dispersion * 0.12 * (1 + Math.abs(deform) * liquidAmount * 1.2)
        lensUniforms.uStrength.value = effects.strength * (1 - focusEase)
        lensUniforms.uSceneAlpha.value = effects.sceneAlpha
        renderer.render({ scene: lensMesh })
      }

      let nextHover = ''
      if (pointer.over && !pointer.dragging && introState.done && s.focusOnClick) {
        const hit = instances.find(
          (inst) =>
            pointer.x >= inst.x0 &&
            pointer.x <= inst.x1 &&
            pointer.y >= inst.y0 &&
            pointer.y <= inst.y1
        )
        if (focus.target > 0) nextHover = 'close'
        else if (hit) nextHover = 'open'
      }
      if (nextHover !== hover) {
        hover = nextHover
        if (hover) container.setAttribute('data-hover', hover)
        else container.removeAttribute('data-hover')
      }

      if (visible && (animating || waiting || dirty || pointer.down))
        raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || !visible || !alive) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const localPoint = (e: any) => {
      const rect = container.getBoundingClientRect()
      return [e.clientX - rect.left, e.clientY - rect.top]
    }

    const onPointerDown = (e: any) => {
      if (e.button !== undefined && e.button > 0) return
      skipIntro()
      const [x, y] = localPoint(e)
      pointer.down = true
      pointer.id = e.pointerId
      pointer.touch = e.pointerType === 'touch'
      pointer.startX = x
      pointer.startY = y
      pointer.x = x
      pointer.y = y
      pointer.startPos = pos
      pointer.dragging = false
      pointer.samples = [{ x, t: performance.now() }]
      interactedAt = performance.now()
      if (Math.abs(vel) > 40) {
        goal = pos
        vel = 0
      }
      dirty = true
      start()
    }

    const onPointerMove = (e: any) => {
      const [x, y] = localPoint(e)
      pointer.x = x
      pointer.y = y
      pointer.over = true
      if (pointer.down && e.pointerId === pointer.id) {
        const dx = x - pointer.startX
        const dy = y - pointer.startY
        const slop = pointer.touch ? 10 : 5
        if (!pointer.dragging) {
          if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
            pointer.down = false
            return
          }
          if (Math.abs(dx) > slop) {
            pointer.dragging = true
            pointer.startX = x
            pointer.startPos = pos
            closeFocus()
            try {
              container.setPointerCapture(e.pointerId)
            } catch {
              pointer.dragging = true
            }
            container.setAttribute('data-dragging', '')
          }
        }
        if (pointer.dragging) {
          pos = pointer.startPos - (x - pointer.startX)
          goal = pos
          vel = 0
          const now = performance.now()
          pointer.samples.push({ x, t: now })
          while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100)
            pointer.samples.shift()
        }
      }
      dirty = true
      start()
    }

    const onPointerUp = (e: any) => {
      if (!pointer.down || e.pointerId !== pointer.id) return
      pointer.down = false
      container.removeAttribute('data-dragging')
      const s = settingsRef.current
      if (!s) return
      const m = metrics(s)
      const n = m.centers.length
      interactedAt = performance.now()
      if (pointer.dragging) {
        pointer.dragging = false
        const now = performance.now()
        const first = pointer.samples[0]
        const lastSample = pointer.samples[pointer.samples.length - 1]
        let velocity = 0
        if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 70) {
          velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1000
        }
        vel = velocity
        let landing = snapPoint(m, pos + velocity * 0.32)
        if (s.infinite === false) {
          landing = Math.max(m.centers[0], Math.min(m.centers[n - 1], landing))
        }
        goal = landing
        if (Math.abs(velocity) > 400 && Math.abs(landing - pos) < 1)
          step(m, velocity > 0 ? 1 : -1)
        mode = 'spring'
        start()
        return
      }
      if (closeFocus()) return
      const [x, y] = localPoint(e)
      const hit = instances.find(
        (inst) => x >= inst.x0 && x <= inst.x1 && y >= inst.y0 && y <= inst.y1
      )
      if (!hit) return
      if (hit.index === activeIndex && Math.abs(goal - pos) < 2) {
        callbacksRef.current.onSelect?.(hit.index, itemsRef.current[hit.index])
        if (s.focusOnClick) openFocus(hit.index)
      } else {
        const rel = (hit.x0 + hit.x1) / 2 - width / 2
        let targetLanding = snapPoint(m, pos + rel)
        if (s.infinite === false) {
          targetLanding = Math.max(m.centers[0], Math.min(m.centers[n - 1], targetLanding))
        }
        goal = targetLanding
        mode = 'spring'
        if (s.focusOnClick) focus.pending = hit.index
        start()
      }
    }

    const onPointerLeave = () => {
      pointer.over = false
      dirty = true
      start()
    }

    const onPointerCancel = () => {
      pointer.down = false
      pointer.dragging = false
      container.removeAttribute('data-dragging')
      const s = settingsRef.current
      if (!s) return
      const m = metrics(s)
      let landing = snapPoint(m, pos)
      if (s.infinite === false) {
        landing = Math.max(m.centers[0], Math.min(m.centers[m.centers.length - 1], landing))
      }
      goal = landing
      mode = 'spring'
      start()
    }

    const onWheel = (e: any) => {
      const s = settingsRef.current
      if (!s || e.ctrlKey) return
      let dx = e.deltaX
      let dy = e.deltaY
      if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
        dx = dy
        dy = 0
      }
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      const horizontal = Math.abs(dx) > Math.abs(dy)
      if (!horizontal && (!s.captureWheel || s.scrollProgress !== undefined)) {
        e.preventDefault()
        window.scrollBy({ top: dy * unit, behavior: 'auto' })
        return
      }
      e.preventDefault()
      skipIntro()
      interactedAt = performance.now()
      if (closeFocus()) return
      const delta = Math.max(-120, Math.min(120, (horizontal ? dx : dy) * unit))
      goal += delta * 1.25
      if (s.infinite === false) {
        const m = metrics(s)
        goal = Math.max(m.centers[0], Math.min(m.centers[m.centers.length - 1], goal))
      }
      mode = 'wheel'
      wheelAt = performance.now()
      start()
    }

    const onKeyDown = (e: any) => {
      const s = settingsRef.current
      if (!s) return
      const m = metrics(s)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        skipIntro()
        closeFocus()
        interactedAt = performance.now()
        step(m, 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        skipIntro()
        closeFocus()
        interactedAt = performance.now()
        step(m, -1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        closeFocus()
        goTo(m, 0)
      } else if (e.key === 'End') {
        e.preventDefault()
        closeFocus()
        goTo(m, slots.length - 1)
      } else if (e.key === 'Escape') {
        if (closeFocus()) e.preventDefault()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (closeFocus() || activeIndex < 0) return
        callbacksRef.current.onSelect?.(activeIndex, itemsRef.current[activeIndex])
        if (s.focusOnClick) openFocus(activeIndex)
      }
    }

    const onFocus = () => {
      hasFocus = true
    }
    const onBlur = () => {
      hasFocus = false
    }
    const onVisibility = () => {
      if (!document.hidden) start()
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointerleave', onPointerLeave)
    container.addEventListener('pointercancel', onPointerCancel)
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('keydown', onKeyDown)
    container.addEventListener('focus', onFocus)
    container.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    intersectionObserver.observe(container)

    engineRef.current = {
      wake: () => {
        dirty = true
        start()
      },
      setItems,
    }

    resize()
    setItems(itemsRef.current)

    return () => {
      alive = false
      visible = false
      engineRef.current = null
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('pointercancel', onPointerCancel)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('keydown', onKeyDown)
      container.removeEventListener('focus', onFocus)
      container.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      slots.forEach((slot) => slot.dispose())
      slots = []
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [])

  const current = list[active] || list[0]
  const label = current ? current.title || current.alt || `Image ${active + 1}` : ''

  return (
    <div
      ref={containerRef}
      className={`flex-carousel ${className}`.trim()}
      style={
        {
          ...style,
          '--flex-carousel-half': `${Math.min(Math.max(cardHeight, 0.05), 1) * 50}%`,
        } as React.CSSProperties
      }
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
    >
      {captions && current && revealed && (
        <div className="flex-carousel__caption" aria-hidden="true">
          <span key={active} className="flex-carousel__title">
            {current.title || current.alt}
            {current.subtitle && (
              <span className="flex-carousel__subtitle">{current.subtitle}</span>
            )}
          </span>
          <span className="flex-carousel__count" data-hidden={focusOpen ? '' : undefined}>
            <Digits value={active + 1} />
            <span className="flex-carousel__slash">/</span>
            <span>{String(list.length).padStart(2, '0')}</span>
          </span>
        </div>
      )}
      <div className="flex-carousel__live" aria-live="polite" aria-atomic="true">
        {`${label}, ${active + 1} of ${list.length}`}
      </div>
    </div>
  )
}

export default FlexCarousel
