import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { randomBytes } from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() || ''
    const status = searchParams.get('status') || ''
    const stage = searchParams.get('stage') || ''

    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')

    const query: Record<string, unknown> = {}

    if (status && status !== 'ALL') {
      query.status = status
    }

    if (stage && stage !== 'ALL') {
      query.stage = stage
    }

    if (search) {
      query.$or = [
        { startupName: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { founderName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { motive: { $regex: search, $options: 'i' } },
        { sector: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } },
      ]
    }

    const applications = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'A valid application payload is required' }, { status: 400 })
    }

    const email = String(body.email || '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address' }, { status: 400 })
    }

    const founderName = String(body.founderName || body.fullName || '').trim()
    if (!founderName) {
      return NextResponse.json({ success: false, error: 'Founder or applicant name is required' }, { status: 400 })
    }

    const phone = String(body.phone || '').trim()
    if (phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ success: false, error: 'Enter a valid phone number (at least 10 digits)' }, { status: 400 })
    }

    const founderLinkedIn = String(body.founderLinkedIn || body.linkedin || '').trim()
    const tier = String(body.passTier || 'gold').trim().toLowerCase()
    const passDetails: Record<string, { name: string; price: string }> = {
      diamond: { name: 'DIAMOND PASS', price: '₹8,000 + GST' },
      gold: { name: 'GOLD PASS', price: '₹3,500 + GST' },
      silver: { name: 'SILVER PASS', price: '₹1,000 + GST' },
    }
    const now = new Date().toISOString()
    const application = {
      applicationId: body.applicationId || `PEC-FC-${randomBytes(3).toString('hex').toUpperCase()}`,
      passTier: passDetails[tier] ? tier : 'gold',
      passTierName: body.passTierName?.trim() || passDetails[tier]?.name || passDetails.gold.name,
      passPrice: body.passPrice?.trim() || passDetails[tier]?.price || passDetails.gold.price,
      email,
      founderName,
      phone,
      founderLinkedIn,
      startupName: String(body.startupName || body.organization || `${founderName}'s Venture`).trim(),
      organization: String(body.organization || body.startupName || '').trim(),
      motive: String(body.motive || 'Showcase & Networking').trim(),
      role: String(body.role || 'Founder').trim(),
      websiteUrl: String(body.websiteUrl || '').trim(),
      dpiitNumber: String(body.dpiitNumber || '').trim(),
      stage: String(body.stage || 'Early Stage').trim(),
      sector: String(body.sector || 'Technology / General').trim(),
      revenueStage: String(body.revenueStage || 'Pre-revenue').trim(),
      totalFundingRaised: String(body.totalFundingRaised || '0').trim(),
      currentAsk: String(body.currentAsk || 'N/A').trim(),
      preMoneyValuation: String(body.preMoneyValuation || '').trim(),
      committedCapital: String(body.committedCapital || '').trim(),
      pitchDeckUrl: String(body.pitchDeckUrl || '').trim(),
      demoVideoUrl: String(body.demoVideoUrl || '').trim(),
      mouComfortable: String(body.mouComfortable || 'Yes').trim(),
      status: body.status || 'PENDING_REVIEW',
      reviewNotes: body.reviewNotes || '',
      internalRating: body.internalRating || 0,
      paymentMethod: body.paymentMethod || 'OFFLINE_MOU_DIRECT_TRANSFER',
      createdAt: body.createdAt || now,
      updatedAt: now,
    }

    const db = await getDatabase()
    await db.collection('funding_conclave_applications').insertOne(application)
    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create application'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
