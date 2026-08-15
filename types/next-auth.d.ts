// types/next-auth.d.ts
// Carries the backend's accessToken and user role onto the next-auth session.

import type { DefaultSession } from 'next-auth'
import type { Role } from '@/lib/api-types'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    /** Set to 'RefreshAccessTokenError' when the backend refresh fails. */
    error?: string
    user: {
      id: string
      role: Role
      referralCode: string | null
      college: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: Role
    referralCode?: string | null
    college?: string | null
    accessToken?: string
    /** Backend refresh token — server-side only, never exposed to the client. */
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}
