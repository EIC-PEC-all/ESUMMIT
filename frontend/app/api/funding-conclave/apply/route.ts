import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { MongoClient } from 'mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  process.env.RESPONSE_MANAGER_DATABASE_URL ||
  'mongodb+srv://ananay:peYyvZH5S1KSTzD5@cluster0.7gpudbl.mongodb.net/esummit?retryWrites=true&w=majority&appName=Cluster0'

let cachedClient: MongoClient | null = null

async function getMongoCollection() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 8000 })
    await cachedClient.connect()
  }
  return cachedClient.db('esummit').collection('funding_conclave_applications')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON payload' },
        { status: 400 }
      )
    }

    const email = String(body.email || '').trim().toLowerCase()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    const founderName = String(body.fullName || body.founderName || '').trim()
    if (!founderName) {
      return NextResponse.json(
        { success: false, error: 'Full Name is required' },
        { status: 400 }
      )
    }

    const phone = String(body.phone || '').trim()
    const cleanDigits = phone.replace(/\D/g, '')
    if (cleanDigits.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be at least 10 digits' },
        { status: 400 }
      )
    }

    const linkedin = String(body.linkedin || body.founderLinkedIn || '').trim()
    if (!linkedin) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn profile is required' },
        { status: 400 }
      )
    }

    const motive = String(body.motive || 'Showcase & Networking').trim()
    const role = String(body.role || 'Founder').trim()
    const organization = String(body.organization || body.startupName || `${founderName}'s Venture`).trim()

    // Pass details
    const rawTier = String(body.passTier || 'gold').trim().toLowerCase()
    const passTier = rawTier === 'diamond' || rawTier === 'silver' ? rawTier : 'gold'
    const tierNames: Record<string, string> = {
      diamond: 'DIAMOND PASS',
      gold: 'GOLD PASS',
      silver: 'SILVER PASS',
    }
    const tierPrices: Record<string, string> = {
      diamond: '₹8,000 + GST',
      gold: '₹3,500 + GST',
      silver: '₹1,000 + GST',
    }
    const passTierName = body.passTierName ? String(body.passTierName).trim() : tierNames[passTier]
    const passPrice = body.passPrice ? String(body.passPrice).trim() : tierPrices[passTier]

    // Generate unique application ID
    const randomHex = randomBytes(3).toString('hex').toUpperCase()
    const applicationId = `PEC-FC-${randomHex}`
    const now = new Date().toISOString()

    const applicationRecord = {
      applicationId,
      passTier,
      passTierName,
      passPrice,
      userId: body.userId ? String(body.userId).trim() : undefined,
      email,
      founderName,
      phone,
      founderLinkedIn: linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin.replace(/^@/, '')}`,
      startupName: organization,
      organization,
      motive,
      role,
      stage: String(body.stage || 'Early Stage').trim(),
      sector: String(body.sector || 'Technology / General').trim(),
      revenueStage: String(body.revenueStage || 'Pre-revenue').trim(),
      totalFundingRaised: String(body.totalFundingRaised || '0').trim(),
      currentAsk: String(body.currentAsk || 'N/A').trim(),
      pitchDeckUrl: String(body.pitchDeckUrl || '').trim(),
      mouComfortable: String(body.mouComfortable || 'Yes, comfortable with MoU process').trim(),
      status: 'PENDING_REVIEW',
      reviewNotes: '',
      internalRating: 0,
      paymentMethod: 'OFFLINE_MOU_DIRECT_TRANSFER',
      createdAt: now,
      updatedAt: now,
    }

    // 1. Save directly to MongoDB Atlas (Overwrite any previous application for this applicant)
    let dbSaved = false
    try {
      const collection = await getMongoCollection()
      await collection.deleteMany({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      })
      await collection.insertOne(applicationRecord)
      dbSaved = true
    } catch (dbErr) {
      console.warn('[Funding Conclave API] MongoDB save error:', dbErr)
    }

    // 2. Sync registration to backend NestJS API if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    try {
      await fetch(`${apiUrl}/registrations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          name: founderName,
          email,
          phone,
          college: organization,
          passType: 'FOUNDER_PITCH',
          tracks: [
            `Startup: ${organization}`,
            `Package: ${passTierName} (${passTier.toUpperCase()})`,
            `Role: ${role}`,
            `Motive: ${motive}`,
            `LinkedIn: ${linkedin}`,
          ].filter(Boolean),
        }),
      })
    } catch {
      // Backend sync is non-blocking
    }

    return NextResponse.json({
      success: true,
      applicationId,
      passTierName,
      dbSaved,
      message: 'Application submitted successfully! Our team will review your details and send an MoU.',
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
      return NextResponse.json({ success: true, applications: [] })
    }

    const collection = await getMongoCollection()
    const orConditions: any[] = []
    if (email) {
      orConditions.push({ email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } })
    }
    if (userId) {
      orConditions.push({ userId })
    }

    const query = orConditions.length > 1 ? { $or: orConditions } : orConditions[0]
    const fromDb = await collection.find(query).sort({ createdAt: -1 }).toArray()

    // Ensure all real startup applications are returned
    const validStartupApps = fromDb.filter((app: any) => {
      const tier = String(app.passTier || '').toLowerCase()
      const tierName = String(app.passTierName || '').toLowerCase()
      if (['diamond', 'gold', 'silver'].includes(tier)) return true
      if (tierName.includes('diamond') || tierName.includes('gold') || tierName.includes('silver')) return true
      if (app.applicationId && (app.startupName || app.organization || app.founderName)) return true
      return false
    })

    return NextResponse.json({
      success: true,
      applications: validStartupApps,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
