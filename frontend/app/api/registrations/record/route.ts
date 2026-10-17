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
    const isFree = fee === 0
    const status = body.status || (isFree ? 'PAYMENT_CONFIRMED' : 'PENDING_REVIEW')
    const paymentStatus = body.paymentStatus || (isFree ? 'FREE' : 'PENDING')

    // Enforce 1 active student pass per user (overwrite previous pass registration)
    await regCollection.deleteMany({
      userId: user._id,
      passType: { $in: ['STUDENT_GENERAL', 'HACKATHON_BUILDER', 'CAMPUS_AMBASSADOR', 'DELEGATE_ALL_ACCESS'] },
    })

    await regCollection.insertOne({
      passId,
      userId: user._id,
      passType,
      amountPaid: fee,
      status,
      paymentStatus,
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')?.trim().toLowerCase()
    const passId = searchParams.get('passId')?.trim()

    if (!email && !passId) {
      return NextResponse.json({ success: true, passes: [] })
    }

    const db = await getDb()
    const regCollection = db.collection('Registration')
    const userCollection = db.collection('User')

    const matchingUsers = email
      ? await userCollection
          .find({
            email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          })
          .toArray()
      : []

    const userIds = matchingUsers.map((u) => u._id)

    const regQuery: any = {}
    if (passId) {
      regQuery.passId = passId
    } else {
      const orClauses: any[] = []
      if (userIds.length > 0) {
        orClauses.push({ userId: { $in: userIds } })
      }
      if (email) {
        orClauses.push({ email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } })
        orClauses.push({ delegateEmail: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } })
      }
      regQuery.$or = orClauses
    }

    const regs = await regCollection.find(regQuery).sort({ createdAt: -1 }).toArray()

    const formatted = regs.map((r: any) => {
      const matchedUser = matchingUsers.find((u) => String(u._id) === String(r.userId))
      const name = r.name || r.delegateName || matchedUser?.name || 'Attendee'
      const userMail = r.email || r.delegateEmail || matchedUser?.email || email || ''
      const phone = r.phone || r.delegatePhone || matchedUser?.phone || 'Not provided'
      const college = r.college || r.delegateCollege || matchedUser?.college || 'Punjab Engineering College'

      let category = 'Student General Pass'
      if (r.passType === 'HACKATHON_BUILDER') category = 'Hackathon Pass'
      else if (r.passType === 'CAMPUS_AMBASSADOR') category = 'Campus Ambassador Pass'
      else if (r.passType === 'FOUNDER_PITCH') category = 'Founder Pitch Pass'
      else if (r.passType === 'DELEGATE_ALL_ACCESS') category = 'All-Access Pass'

      const tracks = Array.isArray(r.tracks) ? r.tracks : [category]
      const fee = Number(r.amountPaid) || 0
      const isRevoked = Boolean(r.isRevoked)
      const rawStatus = r.status || (fee === 0 ? 'PAYMENT_CONFIRMED' : (r.paymentStatus === 'PAID' ? 'PAYMENT_CONFIRMED' : 'PENDING_REVIEW'))
      const status = isRevoked ? 'REJECTED' : rawStatus
      const paymentStatus = r.paymentStatus || (fee === 0 ? 'FREE' : (status === 'PAYMENT_CONFIRMED' ? 'PAID' : 'PENDING'))

      return {
        id: r.passId || String(r._id),
        name,
        email: userMail,
        phone,
        college,
        category,
        tracks,
        amountPaid: fee,
        status,
        paymentStatus,
        date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(r.passId || String(r._id))}`,
      }
    })

    return NextResponse.json({ success: true, passes: formatted })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to query registrations'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
