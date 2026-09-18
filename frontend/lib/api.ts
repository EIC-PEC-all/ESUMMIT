// lib/api.ts
// Typed fetch wrapper for E_Summit_Backend (/api/v1).

import type {
  CmsBundle,
  CmsEvent,
  CmsSpeaker,
  CmsSponsor,
  CmsAlumni,
  CmsFaq,
  CmsScheduleItem,
  CreateOrderResponse,

  CreateRegistrationDto,
  CreateRegistrationResponse,
  FormattedRegistration,
  PassCatalogEntry,
  SiteConfig,
  SubscribeResponse,
  VerifyPaymentResponse,
} from './api-types'

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

/** Thrown for any non-2xx response. `body` keeps the parsed payload so callers
 *  can read the backend's structured errors (e.g. the 409 duplicate-pass case). */
export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    const message = (() => {
      const b = body as Record<string, unknown> | null
      const msg = b?.message
      if (Array.isArray(msg)) return msg[0] as string
      if (typeof msg === 'string') return msg
      return `Request failed (${status})`
    })()
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  accessToken?: string
  json?: unknown
  body?: BodyInit
  /** Request timeout in ms (defaults to 15000ms). */
  timeoutMs?: number
}

export async function apiFetch<T>(
  path: string,
  opts: ApiFetchOptions = {},
): Promise<T> {
  const { accessToken, json, headers, timeoutMs = 15000, signal, ...rest } = opts

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: 'no-store',
      ...rest,
      signal: controller.signal,
      headers: {
        ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    })

    const payload = res.headers.get('content-type')?.includes('application/json')
      ? await res.json().catch(() => null)
      : null

    if (!res.ok) throw new ApiError(res.status, payload)
    return payload as T
  } finally {
    clearTimeout(timeoutId)
  }
}

export const api = {
  // ── CMS Bundle (single request to bootstrap all content) ──
  getBundle: () => apiFetch<CmsBundle>('/cms/bundle'),
  getSiteConfig: () => apiFetch<SiteConfig>('/cms/site-config'),

  // ── CMS Content ──
  // EVENTS
  getEvents: (day?: number, type?: string) => {
    const params = new URLSearchParams()
    if (day !== undefined) params.set('day', String(day))
    if (type) params.set('type', type)
    const qs = params.toString()
    return apiFetch<CmsEvent[]>(`/events${qs ? `?${qs}` : ''}`)
  },
  createEvent: (data: Partial<CmsEvent>, accessToken: string) => apiFetch<CmsEvent>('/events', { method: 'POST', json: data, accessToken }),
  updateEvent: (id: string, data: Partial<CmsEvent>, accessToken: string) => apiFetch<CmsEvent>(`/events/${id}`, { method: 'PATCH', json: data, accessToken }),
  deleteEvent: (id: string, accessToken: string) => apiFetch<void>(`/events/${id}`, { method: 'DELETE', accessToken }),

  // SCHEDULE
  getSchedule: (day?: number) => {
    const params = new URLSearchParams()
    if (day !== undefined) params.set('day', String(day))
    const qs = params.toString()
    return apiFetch<CmsScheduleItem[]>(`/cms/schedule${qs ? `?${qs}` : ''}`)
  },
  createScheduleItem: (data: Partial<CmsScheduleItem>, accessToken: string) => apiFetch<CmsScheduleItem>('/cms/schedule', { method: 'POST', json: data, accessToken }),
  updateScheduleItem: (id: string, data: Partial<CmsScheduleItem>, accessToken: string) => apiFetch<CmsScheduleItem>(`/cms/schedule/${id}`, { method: 'PATCH', json: data, accessToken }),
  deleteScheduleItem: (id: string, accessToken: string) => apiFetch<void>(`/cms/schedule/${id}`, { method: 'DELETE', accessToken }),

  // SPEAKERS
  getSpeakers: () => apiFetch<CmsSpeaker[]>('/speakers'),
  createSpeaker: (data: Partial<CmsSpeaker>, accessToken: string) => apiFetch<CmsSpeaker>('/speakers', { method: 'POST', json: data, accessToken }),
  updateSpeaker: (id: string, data: Partial<CmsSpeaker>, accessToken: string) => apiFetch<CmsSpeaker>(`/speakers/${id}`, { method: 'PATCH', json: data, accessToken }),
  deleteSpeaker: (id: string, accessToken: string) => apiFetch<void>(`/speakers/${id}`, { method: 'DELETE', accessToken }),

  // SPONSORS
  getSponsors: () => apiFetch<CmsSponsor[]>('/sponsors'),
  createSponsor: (data: Partial<CmsSponsor>, accessToken: string) => apiFetch<CmsSponsor>('/sponsors', { method: 'POST', json: data, accessToken }),
  updateSponsor: (id: string, data: Partial<CmsSponsor>, accessToken: string) => apiFetch<CmsSponsor>(`/sponsors/${id}`, { method: 'PATCH', json: data, accessToken }),
  deleteSponsor: (id: string, accessToken: string) => apiFetch<void>(`/sponsors/${id}`, { method: 'DELETE', accessToken }),

  // ALUMNI
  getAlumni: () => apiFetch<CmsAlumni[]>('/alumni'),
  createAlumni: (data: Partial<CmsAlumni>, accessToken: string) => apiFetch<CmsAlumni>('/alumni', { method: 'POST', json: data, accessToken }),
  updateAlumni: (id: string, data: Partial<CmsAlumni>, accessToken: string) => apiFetch<CmsAlumni>(`/alumni/${id}`, { method: 'PATCH', json: data, accessToken }),
  deleteAlumni: (id: string, accessToken: string) => apiFetch<void>(`/alumni/${id}`, { method: 'DELETE', accessToken }),

  // FAQS
  getFaqs: (category?: string) =>
    apiFetch<CmsFaq[]>(`/cms/faqs${category ? `?category=${category}` : ''}`),
  createFaq: (data: Partial<CmsFaq>, accessToken: string) => apiFetch<CmsFaq>('/cms/faqs', { method: 'POST', json: data, accessToken }),
  updateFaq: (id: string, data: Partial<CmsFaq>, accessToken: string) => apiFetch<CmsFaq>(`/cms/faqs/${id}`, { method: 'PATCH', json: data, accessToken }),
  deleteFaq: (id: string, accessToken: string) => apiFetch<void>(`/cms/faqs/${id}`, { method: 'DELETE', accessToken }),

  // SITE CONFIG
  updateSiteConfig: (data: Partial<SiteConfig>, accessToken: string) => apiFetch<SiteConfig>('/cms/site-config', { method: 'PATCH', json: data, accessToken }),

  // ── Registrations & Passes ──
  getPassTypes: () => apiFetch<PassCatalogEntry[]>('/registrations/types'),

  createRegistration: (dto: CreateRegistrationDto) =>
    apiFetch<CreateRegistrationResponse>('/registrations/create', {
      method: 'POST',
      json: dto,
    }),

  getMyPasses: (accessToken: string) =>
    apiFetch<FormattedRegistration[]>('/registrations/my-passes', { accessToken }),

  getPass: (passId: string) =>
    apiFetch<FormattedRegistration>(`/registrations/${passId}`),

  // ── Payments ──
  createOrder: (passId: string) =>
    apiFetch<CreateOrderResponse>('/payments/create-order', {
      method: 'POST',
      json: { passId },
    }),

  verifyPayment: (dto: { orderId: string; transactionId: string; signature?: string }) =>
    apiFetch<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      json: dto,
    }),

  // ── Newsletter ──
  subscribe: (email: string) =>
    apiFetch<SubscribeResponse>('/subscribers', {
      method: 'POST',
      json: { email },
    }),
}
