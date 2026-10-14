import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Required fields validation
    const requiredFields = [
      'email',
      'founderName',
      'phone',
      'founderLinkedIn',
      'startupName',
      'stage',
      'sector',
      'revenueStage',
      'totalFundingRaised',
      'currentAsk',
      'pitchDeckUrl',
      'mouComfortable',
    ]

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === '') {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Strict Field Validations
    const email = String(body.email).trim().toLowerCase()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      )
    }

    const phone = String(body.phone).trim()
    const cleanDigits = phone.replace(/\D/g, '')
    if (cleanDigits.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Mobile / WhatsApp number must be at least 10 digits' },
        { status: 400 }
      )
    }

    const founderLinkedIn = String(body.founderLinkedIn).trim()
    if (!founderLinkedIn.startsWith('http://') && !founderLinkedIn.startsWith('https://')) {
      return NextResponse.json(
        { success: false, error: 'Founder LinkedIn profile must start with http:// or https://' },
        { status: 400 }
      )
    }

    const pitchDeckUrl = String(body.pitchDeckUrl).trim()
    if (!pitchDeckUrl.startsWith('http://') && !pitchDeckUrl.startsWith('https://')) {
      return NextResponse.json(
        { success: false, error: 'Pitch deck link must be a valid public URL starting with http:// or https://' },
        { status: 400 }
      )
    }

    // Pass details (defaults to Gold Pass if not explicitly specified)
    const passTier = body.passTier ? String(body.passTier).trim().toLowerCase() : 'gold'
    const passTierName = body.passTierName ? String(body.passTierName).trim() : 'GOLD PASS'
    const passPrice = body.passPrice ? String(body.passPrice).trim() : '₹3,500'

    // Generate unique application ID
    const randomHex = randomBytes(3).toString('hex').toUpperCase()
    const applicationId = `PEC-FC-${randomHex}`

    const applicationRecord = {
      applicationId,
      passTier,
      passTierName,
      passPrice,
      email,
      founderName: String(body.founderName).trim(),
      phone,
      founderLinkedIn,
      startupName: String(body.startupName).trim(),
      websiteUrl: body.websiteUrl ? String(body.websiteUrl).trim() : '',
      dpiitNumber: body.dpiitNumber ? String(body.dpiitNumber).trim() : '',
      stage: String(body.stage).trim(),
      sector: String(body.sector).trim(),
      revenueStage: String(body.revenueStage).trim(),
      totalFundingRaised: String(body.totalFundingRaised).trim(),
      currentAsk: String(body.currentAsk).trim(),
      preMoneyValuation: body.preMoneyValuation ? String(body.preMoneyValuation).trim() : '',
      committedCapital: body.committedCapital ? String(body.committedCapital).trim() : '',
      pitchDeckUrl,
      demoVideoUrl: body.demoVideoUrl ? String(body.demoVideoUrl).trim() : '',
      mouComfortable: String(body.mouComfortable).trim(),
      status: 'PENDING_REVIEW',
      reviewNotes: '',
      internalRating: 0,
      paymentMethod: 'OFFLINE_MOU_DIRECT_TRANSFER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')
    const result = await collection.insertOne(applicationRecord)

    return NextResponse.json({
      success: true,
      applicationId,
      insertedId: result.insertedId,
      passTierName,
      message: 'Application submitted successfully! We will contact you ASAP for further processing.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
