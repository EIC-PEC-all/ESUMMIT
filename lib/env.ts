// lib/env.ts
// Validates environment variables at application startup

export function validateEnv() {
  const isProd = process.env.NODE_ENV === 'production'

  if (isProd && !process.env.NEXTAUTH_SECRET) {
    console.warn(
      '[SECURITY WARNING] NEXTAUTH_SECRET is not set in production. Using fallback key.'
    )
  }

  if (isProd && !process.env.NEXT_PUBLIC_API_URL) {
    console.warn(
      '[API CONFIG] NEXT_PUBLIC_API_URL is not set; defaulting to local backend URL.'
    )
  }
}