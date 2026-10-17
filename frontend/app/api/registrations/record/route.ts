/**
 * This route has been removed.
 *
 * Previously this was a direct-to-MongoDB fallback writer that bypassed the
 * NestJS backend. All registration persistence now goes exclusively through:
 *   POST /api/v1/registrations/create  (NestJS backend)
 *
 * Keeping this file to return a clear 410 Gone so any stale client code gets
 * an actionable error instead of a 404.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json(
    { success: false, error: 'This endpoint has been removed. Use the backend API directly.' },
    { status: 410 },
  )
}

export function POST() {
  return NextResponse.json(
    { success: false, error: 'This endpoint has been removed. Use the backend API directly.' },
    { status: 410 },
  )
}
