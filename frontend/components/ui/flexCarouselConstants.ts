export interface FlexCarouselItem {
  src: string
  alt?: string
  title?: string
  subtitle?: string
}

export interface BendPresetConfig {
  lensWidth: number
  lensHeight: number
  tilt: number
  roundness: number
  bend: number
  reach: number
  curl: 'twist' | 'rise' | 'fall'
  dispersion: number
  liquid: number
  followCursor: boolean
}

export const BEND_PRESETS: Record<string, BendPresetConfig> = {
  liquid: {
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    roundness: 1,
    bend: 0.34,
    reach: 0.38,
    curl: 'twist',
    dispersion: 0.45,
    liquid: 0,
    followCursor: false,
  },
  ribbon: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.34,
    reach: 0.34,
    curl: 'twist',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false,
  },
  vortex: {
    lensWidth: 0.7,
    lensHeight: 0.95,
    tilt: 30,
    roundness: 1,
    bend: 0.46,
    reach: 0.3,
    curl: 'twist',
    dispersion: 0.5,
    liquid: 0,
    followCursor: false,
  },
  arch: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.3,
    reach: 0.36,
    curl: 'rise',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false,
  },
}

export const FIT_ASPECT: Record<string, number> = {
  portrait: 0.75,
  square: 1,
  landscape: 4 / 3,
}

export const PIXEL_BUDGET = 4.5e6

export const INTRO_DURATION: Record<string, number> = {
  rise: 2.1,
  bloom: 1.6,
  spin: 2.2,
  deal: 1.5,
  fade: 0.35,
}

export const wrap = (value: number, size: number) =>
  ((((value + size / 2) % size) + size) % size) - size / 2

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

export const easeOut = (value: number) => 1 - Math.pow(1 - clamp01(value), 3)

export const easeOutQuint = (value: number) => 1 - Math.pow(1 - clamp01(value), 5)

export const easeInOut = (value: number) => {
  const t = clamp01(value)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
