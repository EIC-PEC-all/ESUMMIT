/**
 * /api/profile — thin proxy to the NestJS backend.
 *
 * GET  /api/profile?email=<addr>  ?  GET  /api/v1/users/profile?email=<addr>
 * POST /api/profile               ?  PATCH /api/v1/users/profile?email=<body.email>
 *
 * No database logic lives here. All reads/writes go through the backend.
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'email query parameter is required' },
      { status: 400 },
    )
  }

  try {
    const upstream = await fetch(
      `${BACKEND_URL}/users/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`,
      { headers: { 'Cache-Control': 'no-cache' } },
    )
    const data = await upstream.json()
    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Backend unavailable'
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null
  if (!email) {
    return NextResponse.json({ success: false, error: 'email is required' }, { status: 400 })
  }

  try {
    const upstream = await fetch(
      `${BACKEND_URL}/users/profile?email=${encodeURIComponent(email)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    const data = await upstream.json()
    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Backend unavailable'
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}
