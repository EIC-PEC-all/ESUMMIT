import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON payload' },
        { status: 400 }
      )
    }

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

    // 1. Sync registration to backend NestJS API if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    try {
      await fetch(`${apiUrl}/registrations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          name: String(body.founderName).trim(),
          email,
          phone,
          college: String(body.startupName).trim(),
          passType: 'FOUNDER_PITCH',
          tracks: [
            `Startup: ${String(body.startupName).trim()}`,
            `Package: ${passTierName} (${passTier.toUpperCase()})`,
            `Stage: ${String(body.stage).trim()}`,
            `Sector: ${String(body.sector).trim()}`,
            `Revenue: ${String(body.revenueStage).trim()}`,
            `Funding Raised: ${String(body.totalFundingRaised).trim()}`,
            `Current Ask: ${String(body.currentAsk).trim()}`,
            `Deck: ${pitchDeckUrl}`,
            `MoU Comfort: ${String(body.mouComfortable).trim()}`,
            body.websiteUrl ? `Website: ${String(body.websiteUrl).trim()}` : '',
            founderLinkedIn ? `LinkedIn: ${founderLinkedIn}` : '',
          ].filter(Boolean),
        }),
      })
    } catch (backendErr) {
      console.warn('[Funding Conclave API] Backend sync warning:', backendErr)
    }

    // 2. Persist full startup application data locally
    try {
      const dataDir = path.join(process.cwd(), 'data')
      await fs.mkdir(dataDir, { recursive: true })
      const filePath = path.join(dataDir, 'funding-conclave-applications.json')
      let existing: any[] = []
      try {
        const raw = await fs.readFile(filePath, 'utf-8')
        existing = JSON.parse(raw)
        if (!Array.isArray(existing)) existing = []
      } catch {
        existing = []
      }
      existing.unshift(applicationRecord)
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8')
    } catch (fsErr) {
      console.warn('[Funding Conclave API] Local file persist notice:', fsErr)
    }

    return NextResponse.json({
      success: true,
      applicationId,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')?.trim().toLowerCase()
    const userId = searchParams.get('userId')?.trim()

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, error: 'Email or userId query parameter is required' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'data', 'funding-conclave-applications.json')
    let allApplications: any[] = []
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      allApplications = JSON.parse(raw)
      if (!Array.isArray(allApplications)) allApplications = []
    } catch {
      allApplications = []
    }

    const matched = allApplications.filter((app) => {
      if (email && app.email && String(app.email).toLowerCase() === email) return true
      if (userId && app.userId && app.userId === userId) return true
      return false
    })

    return NextResponse.json({
      success: true,
      applications: matched,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
