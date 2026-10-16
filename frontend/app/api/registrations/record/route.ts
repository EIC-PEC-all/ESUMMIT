import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getCandidatePaths(): string[] {
  return [
    path.join(process.cwd(), 'data/funding-conclave-applications.json'),
    path.join(process.cwd(), 'frontend/data/funding-conclave-applications.json'),
    path.join(process.cwd(), '../frontend/data/funding-conclave-applications.json'),
  ]
}

async function resolveStoragePath(): Promise<string> {
  const candidates = getCandidatePaths()
  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // continue
    }
  }
  return candidates[0]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || !body.email || !body.name) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const filePath = await resolveStoragePath()
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    let records: any[] = []
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      records = JSON.parse(raw)
      if (!Array.isArray(records)) records = []
    } catch {
      records = []
    }

    const passCategory = String(body.category || 'Student Pass')
    const passTier = passCategory.toLowerCase().includes('diamond')
      ? 'diamond'
      : passCategory.toLowerCase().includes('silver')
      ? 'silver'
      : passCategory.toLowerCase().includes('gold')
      ? 'gold'
      : 'standard'

    const newRecord = {
      applicationId: body.applicationId || `PEC-${Math.floor(100000 + Math.random() * 900000)}`,
      passTier,
      passTierName: passCategory.toUpperCase(),
      passPrice: body.amountPaid ? `₹${body.amountPaid}` : 'FREE',
      email: String(body.email).trim().toLowerCase(),
      founderName: String(body.name).trim(),
      phone: String(body.phone || 'Not provided').trim(),
      founderLinkedIn: body.founderLinkedIn || '',
      startupName: body.teamName || body.college || body.name,
      websiteUrl: body.websiteUrl || '',
      dpiitNumber: '',
      stage: body.tracks?.[0] || 'Summit Attendee',
      sector: Array.isArray(body.tracks) ? body.tracks.join(', ') : 'General Delegate',
      revenueStage: 'General Registration',
      totalFundingRaised: 'N/A',
      currentAsk: 'N/A',
      preMoneyValuation: 'N/A',
      committedCapital: 'N/A',
      pitchDeckUrl: body.pitchDeckUrl || '',
      demoVideoUrl: '',
      mouComfortable: 'Registration Verified from Main Site',
      status: body.paymentStatus === 'PAID' || body.paymentStatus === 'FREE' ? 'PAYMENT_CONFIRMED' : 'PENDING_REVIEW',
      reviewNotes: `Registered from Main Site for ${passCategory}`,
      internalRating: 0,
      paymentMethod: body.paymentStatus || 'ONLINE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Replace if exists, else prepend
    const existingIdx = records.findIndex((r) => r.applicationId === newRecord.applicationId || r.email === newRecord.email)
    if (existingIdx >= 0) {
      records[existingIdx] = { ...records[existingIdx], ...newRecord }
    } else {
      records.unshift(newRecord)
    }

    await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8')

    return NextResponse.json({ success: true, record: newRecord })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Storage sync error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
