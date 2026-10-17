/**
 * /api/funding-conclave/apply  thin proxy to the NestJS backend.
 *
 * POST /api/funding-conclave/apply  ?  POST /api/v1/funding-conclave/applications
 * GET  /api/funding-conclave/apply?email=<addr>
 *                                   ?  GET  /api/v1/funding-conclave/applications?email=<addr>
 *
 * No database logic lives here. All persistence goes through the backend.
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
const RESPONSE_MANAGER_URL = process.env.RESPONSE_MANAGER_URL ?? 'http://localhost:3002/api'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  // Primary: Try NestJS Backend
  try {
    const upstream = await fetch(`${BACKEND_URL}/funding-conclave/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (upstream.ok) {
      const data = await upstream.json()
      return NextResponse.json(data, { status: upstream.status })
    }
  } catch {
    // Backend offline or route unhandled — gracefully fallback to Response Manager
  }

  // Fallback: Forward directly to Response Manager platform
  try {
    const responseManager = await fetch(`${RESPONSE_MANAGER_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await responseManager.json()
    return NextResponse.json(data, { status: responseManager.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Application service unavailable'
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ success: true, applications: [] })
  }

  const cleanEmail = encodeURIComponent(email.trim().toLowerCase())

  // Primary: Try NestJS Backend
  try {
    const upstream = await fetch(
      `${BACKEND_URL}/funding-conclave/applications?email=${cleanEmail}`,
    )
    if (upstream.ok) {
      const data = await upstream.json()
      return NextResponse.json(data, { status: upstream.status })
    }
  } catch {
    // Backend offline or route unhandled — gracefully fallback to Response Manager
  }

  // Fallback: Fetch from Response Manager
  try {
    const responseManager = await fetch(`${RESPONSE_MANAGER_URL}/applications?search=${cleanEmail}`)
    const data = await responseManager.json()
    return NextResponse.json(data, { status: responseManager.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Application service unavailable'
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}
