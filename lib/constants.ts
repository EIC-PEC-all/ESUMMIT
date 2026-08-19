// lib/constants.ts
// Centralized constants — single source of truth for shared values across the app

/** Shared toast style used across Footer, Register, Concierge */
export const TOAST_STYLE = {
  style: {
    background: '#0A110E',
    color: '#FFFFFF',
    border: '1px solid var(--accent-mint)',
  },
  iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
} as const

/**
 * Deterministic barcode widths from a string seed (e.g. ticket ID).
 * Produces consistent bars per ticket — never the same generic pattern.
 */
export function generateBarcodeWidths(seed: string, count = 17): number[] {
  const bars: number[] = []
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  for (let i = 0; i < count; i++) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    bars.push((hash % 4) + 1)
  }
  return bars
}

/** Summit date in IST — single source of truth for the countdown */
export const SUMMIT_DATE_IST = '2026-03-15T09:00:00+05:30'