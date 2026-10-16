import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
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
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      await cachedClient.connect()
    }
    return cachedClient.db('esummit').collection('funding_conclave_applications')
  } catch (err) {
    console.warn('[Funding Conclave API] MongoDB direct connect notice:', err)
    return null
  }
}

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

    // 1. Save directly to MongoDB Atlas
    let dbSaved = false
    try {
      const collection = await getMongoCollection()
      if (collection) {
        await collection.insertOne(applicationRecord)
        dbSaved = true
      }
    } catch (dbErr) {
      console.warn('[Funding Conclave API] MongoDB save notice:', dbErr)
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
    } catch (backendErr) {
      console.warn('[Funding Conclave API] Backend sync notice:', backendErr)
    }

    // 3. Persist to fallback JSON file
    try {
      const filePath = await resolveStoragePath()
      await fs.mkdir(path.dirname(filePath), { recursive: true })
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

    // 1. Try MongoDB first
    try {
      const collection = await getMongoCollection()
      if (collection) {
        const query: Record<string, any> = {}
        if (email) query.email = email
        if (userId) query.userId = userId

        const fromDb = await collection.find(query).sort({ createdAt: -1 }).toArray()
        if (fromDb.length > 0 || (!email && !userId)) {
          return NextResponse.json({
            success: true,
            applications: fromDb,
          })
        }
      }
    } catch (dbErr) {
      console.warn('[Funding Conclave API] MongoDB GET fallback:', dbErr)
    }

    // 2. Fallback to local file
    const filePath = await resolveStoragePath()
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
      applications: email || userId ? matched : allApplications,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
