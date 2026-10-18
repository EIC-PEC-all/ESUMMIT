/**
 * /api/profile  thin proxy to the NestJS backend.
 *
 * GET  /api/profile?email=<addr>  ->  GET  /api/v1/users/profile?email=<addr>
 * POST /api/profile               ->  PATCH /api/v1/users/profile?email=<body.email>
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
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 })
  }

  // Validate compulsory name
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name || name.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Full Name must be at least 2 characters long' },
      { status: 400 },
    )
  }

  // Validate compulsory WhatsApp number
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : ''
  if (!rawPhone) {
    return NextResponse.json(
      { success: false, error: 'WhatsApp number is compulsory' },
      { status: 400 },
    )
  }
  const digits = rawPhone.replace(/\D/g, '')
  const normalizedPhone =
    digits.startsWith('91') && digits.length === 12
      ? digits.slice(2)
      : digits.startsWith('0') && digits.length === 11
      ? digits.slice(1)
      : digits

  if (normalizedPhone.length !== 10) {
    return NextResponse.json(
      { success: false, error: 'WhatsApp number must be a valid 10-digit mobile number' },
      { status: 400 },
    )
  }

  // Validate compulsory college
  const college = typeof body.college === 'string' ? body.college.trim() : ''
  if (!college || college.length < 2) {
    return NextResponse.json(
      { success: false, error: 'College name must be at least 2 characters long' },
      { status: 400 },
    )
  }

  // Validate compulsory gradYear
  const gradYear = typeof body.gradYear === 'string' ? body.gradYear.trim() : ''
  if (!gradYear) {
    return NextResponse.json(
      { success: false, error: 'Graduation year is required' },
      { status: 400 },
    )
  }

  // Validate compulsory city
  const city = typeof body.city === 'string' ? body.city.trim() : ''
  if (!city || city.length < 2) {
    return NextResponse.json(
      { success: false, error: 'City name must be at least 2 characters long' },
      { status: 400 },
    )
  }

  // Build clean, whitelist-safe payload for the backend API
  const sanitizedPayload: Record<string, unknown> = {
    name,
    phone: normalizedPhone,
    email,
    college,
    gradYear,
    city,
  }

  if (typeof body.state === 'string' && body.state.trim()) {
    sanitizedPayload.state = body.state.trim()
  }
  if (typeof body.district === 'string' && body.district.trim()) {
    sanitizedPayload.district = body.district.trim()
  }
  if (typeof body.branch === 'string' && body.branch.trim()) {
    sanitizedPayload.branch = body.branch.trim()
  }
  if (typeof body.onboardingCompleted === 'boolean') {
    sanitizedPayload.onboardingCompleted = body.onboardingCompleted
  }
  if (typeof body.whatsappAlerts === 'boolean') {
    sanitizedPayload.whatsappAlerts = body.whatsappAlerts
  }
  if (typeof body.emailAlerts === 'boolean') {
    sanitizedPayload.emailAlerts = body.emailAlerts
  }

  try {
    const upstream = await fetch(
      `${BACKEND_URL}/users/profile?email=${encodeURIComponent(email)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedPayload),
      },
    )
    const data = await upstream.json()
    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Backend unavailable'
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}
