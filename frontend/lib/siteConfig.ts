/**
 * Centralized site configuration for domain and URL resolution.
 * Controls metadataBase, canonical URLs, OpenGraph images, JSON-LD schemas,
 * sitemaps, and social share links from a single source of truth.
 */

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://esummit.pec.ac.in'

/**
 * Base site URL without any trailing slashes.
 * Example: 'https://esummit.pec.ac.in'
 */
export const SITE_URL: string = rawSiteUrl.replace(/\/+$/, '')

/**
 * Hostname/domain for human-readable badges, story cards, etc.
 * Example: 'esummit.pec.ac.in'
 */
export const SITE_DOMAIN: string = (() => {
  try {
    return new URL(SITE_URL).host
  } catch {
    return 'esummit.pec.ac.in'
  }
})()

/**
 * Builds an absolute URL from a given relative path.
 * If the path is already absolute, it returns the path untouched.
 *
 * @param path - Relative path starting with or without a slash (e.g. '/passes' or 'passes')
 * @returns Fully-qualified URL (e.g. 'https://esummit.pec.ac.in/passes')
 */
export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

/**
 * Helper to dynamically generate OpenGraph image URLs for pages.
 * Example:
 * getOgImageUrl('Flagship Events', 'HACKATHONS & PITCHES')
 * => 'https://esummit.pec.ac.in/api/og?name=Flagship+Events&tier=HACKATHONS+%26+PITCHES'
 */
export function getOgImageUrl(name: string, tier?: string): string {
  const params = new URLSearchParams()
  if (name) params.set('name', name)
  if (tier) params.set('tier', tier)
  return `${SITE_URL}/api/og?${params.toString()}`
}

/**
 * Helper to dynamically generate OpenGraph badge image URLs for delegate passes.
 * Example:
 * getPassOgImageUrl('ALL ACCESS DELEGATE PASS')
 * => 'https://esummit.pec.ac.in/api/og/pass?tier=ALL+ACCESS+DELEGATE+PASS'
 */
export function getPassOgImageUrl(tier?: string): string {
  const params = new URLSearchParams()
  if (tier) params.set('tier', tier)
  return `${SITE_URL}/api/og/pass?${params.toString()}`
}
