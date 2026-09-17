'use client'
// hooks/useSummitData.ts
// SWR hook that fetches the full CMS bundle in one request.
// Falls back to static data from summitData.ts if the backend is unreachable,
// so the site always renders even without a running backend.

import useSWR, { mutate } from 'swr'
import { api } from '@/lib/api'
import type {
  CmsBundle,
  CmsEvent,
  CmsSpeaker,
  CmsSponsor,
  CmsAlumni,
  CmsFaq,
  CmsScheduleItem,
} from '@/lib/api-types'
import {
  MASTER_EVENTS,
  MASTER_SPEAKERS,
  MASTER_SPONSORS,
  MASTER_ALUMNI,
  MASTER_FAQS,
} from '@/data/summitData'

const CACHE_KEY = 'esummit_cms_bundle_v1'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export function refreshSummitData() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (_) {}
  }
  return mutate('cms-bundle')
}

// ─── Static fallbacks (shapes are compatible with CMS types) ─────────────────

const FALLBACK_EVENTS: CmsEvent[] = MASTER_EVENTS.map((e, i) => ({
  id: e.id,
  number: e.number,
  title: e.title,
  category: e.category,
  eyebrow: e.eyebrow,
  image: e.image,
  purpose: e.purpose,
  delivery: e.delivery,
  expectedParticipation: e.expectedParticipation,
  tags: e.tags,
  partner: e.partner ?? null,
  registrationUrl: null,
  type: 'general',
  track: null,
  day: 1,
  startTime: '09:00',
  endTime: '10:00',
  venue: '',
  speakerIds: [],
  order: i + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const FALLBACK_SPEAKERS: CmsSpeaker[] = MASTER_SPEAKERS.map((s, i) => ({
  id: s.id,
  name: s.name,
  title: `${s.role}, ${s.company}`,
  role: s.role,
  company: s.company,
  badge: s.badge,
  category: s.category,
  bio: s.bio,
  track: s.track,
  avatarUrl: s.image ?? null,
  initials: s.initials,
  color: '#7ED321',
  linkedin: null,
  twitter: null,
  order: i + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const FALLBACK_SPONSORS: CmsSponsor[] = MASTER_SPONSORS.map((s, i) => ({
  id: s.id,
  name: s.name,
  tier: s.tier,
  logoUrl: s.logo,
  websiteUrl: null,
  category: s.category,
  order: i + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const FALLBACK_ALUMNI: CmsAlumni[] = MASTER_ALUMNI.map((a, i) => ({
  id: a.id,
  name: a.name,
  batch: a.batch,
  role: a.role,
  company: a.company,
  valuation: null,
  achievement: a.achievement,
  bio: '',
  imageUrl: a.image ?? null,
  linkedin: null,
  order: i + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const FALLBACK_FAQS: CmsFaq[] = MASTER_FAQS.map((f, i) => ({
  id: f.id,
  question: f.question,
  answer: f.answer,
  category: f.category,
  order: i + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

const STATIC_FALLBACK: CmsBundle = {
  siteConfig: {
    id: 'global',
    heroTitle: 'PEC E-SUMMIT 2026',
    heroSubtitle: 'IGNITING ENTREPRENEURSHIP & INNOVATION',
    summitDates: 'SEPTEMBER 26–27, 2026',
    summitVenue: 'Punjab Engineering College, Sector 12, Chandigarh',
    heroVideoUrl: null,
    announcementText: null,
    announcementLink: null,
    stats: { footfall: '2K+', startups: '100+', workshops: '50+', speakers: '30+', participation: '5K+', alumni: '1000+' },
    contacts: {},
    updatedAt: new Date().toISOString(),
  },
  events: FALLBACK_EVENTS,
  speakers: FALLBACK_SPEAKERS,
  scheduleItems: [],
  sponsors: FALLBACK_SPONSORS,
  alumni: FALLBACK_ALUMNI,
  faqs: FALLBACK_FAQS,
  gallery: [],
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseSummitDataReturn {
  data: CmsBundle
  isLoading: boolean
  isError: boolean
  /** True when data is served from the static fallback (backend unreachable) */
  isFallback: boolean
}

const fetchCmsBundleWithCache = async (): Promise<CmsBundle> => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
          return parsed.data
        }
      }
    } catch (_) {}
  }

  const fresh = await api.getBundle()
  if (typeof window !== 'undefined' && fresh) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: fresh }))
    } catch (_) {}
  }
  return fresh
}

export function useSummitData(): UseSummitDataReturn {
  const { data, error, isLoading } = useSWR<CmsBundle>(
    'cms-bundle',
    fetchCmsBundleWithCache,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      dedupingInterval: CACHE_TTL_MS,
      errorRetryCount: 1,
      shouldRetryOnError: false,
    },
  )

  const sanitizedData: CmsBundle = {
    siteConfig: (data && data.siteConfig) || STATIC_FALLBACK.siteConfig,
    events: Array.isArray(data?.events) && data.events.length > 0 ? data.events : STATIC_FALLBACK.events,
    speakers: Array.isArray(data?.speakers) && data.speakers.length > 0 ? data.speakers : STATIC_FALLBACK.speakers,
    sponsors: Array.isArray(data?.sponsors) && data.sponsors.length > 0 ? data.sponsors : STATIC_FALLBACK.sponsors,
    alumni: Array.isArray(data?.alumni) && data.alumni.length > 0 ? data.alumni : STATIC_FALLBACK.alumni,
    faqs: Array.isArray(data?.faqs) && data.faqs.length > 0 ? data.faqs : STATIC_FALLBACK.faqs,
    scheduleItems: Array.isArray(data?.scheduleItems) ? data.scheduleItems : STATIC_FALLBACK.scheduleItems,
    gallery: Array.isArray(data?.gallery) ? data.gallery : STATIC_FALLBACK.gallery,
  }

  return {
    data: sanitizedData,
    isLoading,
    isError: Boolean(error),
    isFallback: !data && Boolean(error),
  }
}

// ─── Convenience selectors ────────────────────────────────────────────────────

export function useSpeakers() {
  const { data, isLoading, isError } = useSummitData()
  return { speakers: Array.isArray(data?.speakers) ? data.speakers : [], isLoading, isError }
}

export function useEvents() {
  const { data, isLoading, isError } = useSummitData()
  return { events: Array.isArray(data?.events) ? data.events : [], isLoading, isError }
}

export function useSponsors() {
  const { data, isLoading, isError } = useSummitData()
  return { sponsors: Array.isArray(data?.sponsors) ? data.sponsors : [], isLoading, isError }
}

export function useAlumni() {
  const { data, isLoading, isError } = useSummitData()
  return { alumni: Array.isArray(data?.alumni) ? data.alumni : [], isLoading, isError }
}

export function useFaqs() {
  const { data, isLoading, isError } = useSummitData()
  return { faqs: Array.isArray(data?.faqs) ? data.faqs : [], isLoading, isError }
}

export function useSchedule(day?: 1 | 2) {
  const { data, isLoading, isError } = useSummitData()
  const list = Array.isArray(data?.scheduleItems) ? data.scheduleItems : []
  const items = day ? list.filter((i) => i.day === day) : list
  return { scheduleItems: items, isLoading, isError }
}

export function useSiteConfig() {
  const { data, isLoading, isError } = useSummitData()
  return { siteConfig: data.siteConfig, isLoading, isError }
}

