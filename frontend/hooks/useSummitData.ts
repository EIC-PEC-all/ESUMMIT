'use client'
// hooks/useSummitData.ts
// SWR hook that fetches the full CMS bundle in one request.
// Falls back to static data from summitData.ts if the backend is unreachable,
// so the site always renders even without a running backend.

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

const STATIC_TIMESTAMP = '2025-01-01T00:00:00.000Z'

export function refreshSummitData() {
  return Promise.resolve(STATIC_FALLBACK)
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
  createdAt: STATIC_TIMESTAMP,
  updatedAt: STATIC_TIMESTAMP,
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
  color: '#8AC53F',
  linkedin: null,
  twitter: null,
  order: i + 1,
  createdAt: STATIC_TIMESTAMP,
  updatedAt: STATIC_TIMESTAMP,
}))

const FALLBACK_SPONSORS: CmsSponsor[] = MASTER_SPONSORS.map((s, i) => ({
  id: s.id,
  name: s.name,
  tier: s.tier,
  logoUrl: s.logo,
  websiteUrl: null,
  category: s.category,
  order: i + 1,
  createdAt: STATIC_TIMESTAMP,
  updatedAt: STATIC_TIMESTAMP,
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
  createdAt: STATIC_TIMESTAMP,
  updatedAt: STATIC_TIMESTAMP,
}))

const FALLBACK_FAQS: CmsFaq[] = MASTER_FAQS.map((f, i) => ({
  id: f.id,
  question: f.question,
  answer: f.answer,
  category: f.category,
  order: i + 1,
  createdAt: STATIC_TIMESTAMP,
  updatedAt: STATIC_TIMESTAMP,
}))

const STATIC_FALLBACK: CmsBundle = {
  siteConfig: {
    id: 'global',
    heroTitle: 'PEC E-SUMMIT 2026',
    heroSubtitle: 'IGNITING ENTREPRENEURSHIP & INNOVATION',
    summitDates: 'NOVEMBER 14–15, 2026',
    summitVenue: 'Punjab Engineering College, Sector 12, Chandigarh',
    heroVideoUrl: null,
    announcementText: null,
    announcementLink: null,
    stats: { footfall: '5K+', startups: '50+', workshops: '50+', speakers: '30+', participation: '3K+', alumni: '1K+' },
    contacts: {},
    updatedAt: STATIC_TIMESTAMP,
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
  /** True when data is served from the static fallback (no CMS backend needed) */
  isFallback: boolean
}

export function useSummitData(): UseSummitDataReturn {
  return {
    data: STATIC_FALLBACK,
    isLoading: false,
    isError: false,
    isFallback: true,
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

