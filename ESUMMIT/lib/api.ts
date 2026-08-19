// lib/api.ts
// Typed fetch wrapper for E_Summit_Backend (/api/v1).
//
// Public endpoints need no token. Authenticated ones (/registrations/my-passes)
// take the accessToken carried on the next-auth session — see lib/auth.ts.

import type {
  BackendEvent,
  BackendSpeaker,
  BackendSponsor,
  CreateOrderResponse,
  CreateRegistrationDto,
  CreateRegistrationResponse,
  FormattedRegistration,
  PassCatalogEntry,
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
    public body: any,
  ) {
    super(
      (Array.isArray(body?.message) ? body.message[0] : body?.message) ||
        `Request failed (${status})`,
    )
    this.name = 'ApiError'
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  /** Bearer token from the next-auth session. */
  accessToken?: string
  /** Auto-stringified and sent with a JSON content-type. */
  json?: unknown
  body?: BodyInit
}

export async function apiFetch<T>(
  path: string,
  opts: ApiFetchOptions = {},
): Promise<T> {
  const { accessToken, json, headers, ...rest } = opts

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
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
}

export const api = {
  // ── Registrations & passes ──
  getPassTypes: () => apiFetch<PassCatalogEntry[]>('/registrations/types'),

  createRegistration: (dto: CreateRegistrationDto) =>
    apiFetch<CreateRegistrationResponse>('/registrations/create', {
      method: 'POST',
      json: dto,
    }),

  getMyPasses: (accessToken: string) =>
    apiFetch<FormattedRegistration[]>('/registrations/my-passes', {
      accessToken,
    }),

  getPass: (passId: string) =>
    apiFetch<FormattedRegistration>(`/registrations/${passId}`),

  // ── Payments ──
  createOrder: (passId: string) =>
    apiFetch<CreateOrderResponse>('/payments/create-order', {
      method: 'POST',
      json: { passId },
    }),

  verifyPayment: (dto: {
    orderId: string
    transactionId: string
    signature?: string
  }) =>
    apiFetch<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      json: dto,
    }),

  // ── CMS content ──
  getEvents: () => apiFetch<BackendEvent[]>('/events'),
  getSpeakers: () => apiFetch<BackendSpeaker[]>('/speakers'),
  getSponsors: () => apiFetch<BackendSponsor[]>('/sponsors'),

  subscribe: (email: string) =>
    apiFetch<SubscribeResponse>('/subscribers', {
      method: 'POST',
      json: { email },
    }),

  // ── Teams & Competitions ──
  createTeam: (dto: import('./api-types').CreateTeamDto, accessToken: string) =>
    apiFetch<import('./api-types').Team>('/teams/create', {
      method: 'POST',
      accessToken,
      json: dto,
    }),

  joinTeam: (dto: import('./api-types').JoinTeamDto, accessToken: string) =>
    apiFetch<import('./api-types').Team>('/teams/join', {
      method: 'POST',
      accessToken,
      json: dto,
    }),

  getMyTeams: (accessToken: string) =>
    apiFetch<import('./api-types').Team[]>('/teams/my-teams', {
      accessToken,
    }),

  getLeaderboard: (type: import('./api-types').CompetitionType) =>
    apiFetch<import('./api-types').Team[]>(`/teams/leaderboard/${type}`),

  getTeam: (teamId: string, accessToken?: string) =>
    apiFetch<import('./api-types').Team>(`/teams/${teamId}`, {
      accessToken,
    }),

  submitProject: (
    teamId: string,
    dto: import('./api-types').SubmitProjectDto,
    accessToken: string,
  ) =>
    apiFetch<import('./api-types').Submission>(`/teams/${teamId}/submit`, {
      method: 'POST',
      accessToken,
      json: dto,
    }),

  // ── Concierge ──
  chatConcierge: (message: string, history?: Array<{ role: string; content: string }>) =>
    apiFetch<import('./api-types').ConciergeChatResponse>('/concierge/chat', {
      method: 'POST',
      json: { message, history: history || [] },
    }),
}
