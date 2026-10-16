import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  process.env.RESPONSE_MANAGER_DATABASE_URL ||
  'mongodb+srv://ananay:peYyvZH5S1KSTzD5@cluster0.7gpudbl.mongodb.net/esummit?retryWrites=true&w=majority&appName=Cluster0'

let cachedClient: MongoClient | null = null

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 8000 })
    await cachedClient.connect()
  }
  return cachedClient.db('esummit')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || !body.email || !body.name) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const passId = body.applicationId || body.passId
    if (!passId) {
      return NextResponse.json({ success: true, message: 'No passId provided, skipped' })
    }

    const db = await getDb()
    const regCollection = db.collection('Registration')
    const userCollection = db.collection('User')

    const existingReg = await regCollection.findOne({ passId })
    if (existingReg) {
      return NextResponse.json({ success: true, message: 'Registration already exists in database', passId })
    }

    // Find or create user
    const email = String(body.email).trim().toLowerCase()
    let user = await userCollection.findOne({ email })
    if (!user) {
      const userRes = await userCollection.insertOne({
        name: String(body.name).trim(),
        email,
        phone: String(body.phone || '').trim(),
        college: String(body.college || 'Punjab Engineering College').trim(),
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      user = { _id: userRes.insertedId }
    }

    const category = String(body.category || 'Student Pass')
    const isHackathon = category.toLowerCase().includes('hackathon')
    const isAmbassador = category.toLowerCase().includes('ambassador')
    const passType = isHackathon ? 'HACKATHON_BUILDER' : isAmbassador ? 'CAMPUS_AMBASSADOR' : 'STUDENT_GENERAL'
    const fee = Number(body.amountPaid) || 0

    await regCollection.insertOne({
      passId,
      userId: user._id,
      passType,
      amountPaid: fee,
      qrToken: `QR-${passId}-${Date.now()}`,
      tracks: Array.isArray(body.tracks) ? body.tracks : [category],
      isCheckedIn: false,
      isRevoked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, message: 'Recorded in database successfully', passId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database sync error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
