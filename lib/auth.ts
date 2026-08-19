// lib/auth.ts
// next-auth v4 config. Credentials are proxied to E_Summit_Backend's
// /auth/login and /auth/register; the backend's JWT lives on the next-auth
// session as `accessToken`.
//
// Refresh strategy: the backend sets an httpOnly `refreshToken` cookie scoped
// to localhost:4000. Browsers scope cookies by origin, so the ESUMMIT origin
// (:3000) never receives it — it is useless client-side. We instead lift the
// raw value out of the login response's Set-Cookie header and keep it *inside
// the encrypted next-auth JWT, server-side only*. The jwt callback then calls
// POST /auth/refresh with a hand-attached Cookie header when the access token
// is close to expiring.

import type { NextAuthOptions, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { API_BASE } from './api'
import type { AuthResponse, Role } from './api-types'

/** Access tokens are 15m by default (JWT_ACCESS_TTL); refresh a minute early. */
const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000
const REFRESH_SKEW_MS = 60 * 1000

/** Pulls `refreshToken=<value>` out of a Set-Cookie header. */
function extractRefreshToken(setCookie: string | null): string | undefined {
  if (!setCookie) return undefined
  return /(?:^|,\s*)refreshToken=([^;]+)/.exec(setCookie)?.[1]
}

/** Shapes a backend auth response into the next-auth `user` object. */
async function toSessionUser(res: Response): Promise<User & Record<string, unknown>> {
  const data: AuthResponse = await res.json()
  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
    role: data.user.role,
    referralCode: data.user.referralCode,
    college: data.user.college,
    phone: data.user.phone,
    accessToken: data.accessToken,
    refreshToken: extractRefreshToken(res.headers.get('set-cookie')),
    accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
  }
}

/** Reads a backend error body into a message next-auth can surface. */
async function errorMessage(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null)
  const msg = Array.isArray(body?.message) ? body.message[0] : body?.message
  return msg || fallback
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${token.refreshToken as string}` },
    })
    if (!res.ok) throw new Error('refresh rejected')

    const data: AuthResponse = await res.json()
    return {
      ...token,
      accessToken: data.accessToken,
      // The backend rotates the refresh token, so adopt the new one.
      refreshToken:
        extractRefreshToken(res.headers.get('set-cookie')) ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
      role: data.user.role,
      error: undefined,
    }
  } catch {
    // Surfaced to the client so it can prompt a fresh sign-in.
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'pec_esummit_production_session_signing_secret_2026',
  session: { strategy: 'jwt' },
  pages: { signIn: '/account' },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) {
          throw new Error(await errorMessage(res, 'Invalid email or password.'))
        }
        return toSessionUser(res)
      },
    }),

    // Signup: creates the backend account and establishes the session in one
    // call, so /register can hand off straight to signIn().
    CredentialsProvider({
      id: 'credentials-register',
      name: 'Create account',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
        college: { label: 'College', type: 'text' },
        gradYear: { label: 'Graduation year', type: 'text' },
        city: { label: 'City', type: 'text' },
        referralCode: { label: 'Referral code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials.name) {
          return null
        }

        // Only send fields the user actually supplied — the backend runs
        // forbidNonWhitelisted, and empty strings fail its validators.
        const payload: Record<string, string> = {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
        }
        for (const key of [
          'phone',
          'college',
          'gradYear',
          'city',
          'referralCode',
        ] as const) {
          const value = credentials[key]
          if (value) payload[key] = value
        }

        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          throw new Error(
            await errorMessage(res, 'Could not create your account.'),
          )
        }
        return toSessionUser(res)
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: fold the backend payload into the token.
      if (user) return { ...token, ...(user as unknown as Record<string, unknown>) }

      const expires = token.accessTokenExpires as number | undefined
      if (expires && Date.now() < expires - REFRESH_SKEW_MS) return token
      if (!token.refreshToken) return token

      return refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      session.error = token.error as string | undefined
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.referralCode = token.referralCode as string | null
        session.user.college = token.college as string | null
      }
      return session
    },
  },
}
