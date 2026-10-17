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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawEmail = searchParams.get('email')
    const rawUserId = searchParams.get('userId')

    if (!rawEmail && !rawUserId) {
      return NextResponse.json({ success: false, error: 'Email or userId is required' }, { status: 400 })
    }

    const email = rawEmail ? rawEmail.trim().toLowerCase() : ''
    const db = await getDb()
    const userCollection = db.collection('User')
    const attendeeProfileCollection = db.collection('AttendeeProfile')
    const registrationCollection = db.collection('Registration')

    // 1. Check AttendeeProfile collection first
    let attendeeDoc: any = null
    if (email) {
      attendeeDoc = await attendeeProfileCollection.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      })
    }

    // 2. Check User collection
    let userDoc: any = null
    if (email) {
      userDoc = await userCollection.findOne({
        email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      })
    }

    // 3. Fallback: Check Registration collection to harvest college/phone/gradYear if already entered
    let registrationDoc: any = null
    if ((!attendeeDoc || !userDoc?.college) && email) {
      registrationDoc = await registrationCollection.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          { delegateEmail: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        ],
      })
    }

    const mergedName =
      attendeeDoc?.name ||
      userDoc?.name ||
      registrationDoc?.name ||
      registrationDoc?.delegateName ||
      ''

    const mergedCollege =
      attendeeDoc?.college ||
      userDoc?.college ||
      registrationDoc?.college ||
      registrationDoc?.delegateCollege ||
      ''

    const mergedPhone =
      attendeeDoc?.phone ||
      userDoc?.phone ||
      registrationDoc?.phone ||
      registrationDoc?.delegatePhone ||
      ''

    const mergedGradYear =
      attendeeDoc?.gradYear ||
      userDoc?.gradYear ||
      registrationDoc?.gradYear ||
      '1st Year (Class of 2030)'

    const mergedState =
      attendeeDoc?.state ||
      userDoc?.state ||
      registrationDoc?.state ||
      'Chandigarh'

    const mergedCity =
      attendeeDoc?.city ||
      userDoc?.city ||
      registrationDoc?.city ||
      'Chandigarh'

    const mergedBranch =
      attendeeDoc?.branch ||
      userDoc?.branch ||
      ''

    const hasCollege = Boolean(mergedCollege && mergedCollege.trim().length > 0)
    const hasGrad = Boolean(mergedGradYear && mergedGradYear.trim().length > 0)
    const hasCity = Boolean(mergedCity && mergedCity.trim().length > 0)
    const isCompleted = Boolean(
      attendeeDoc?.onboardingCompleted ||
      userDoc?.onboardingCompleted ||
      (hasCollege && hasGrad && hasCity)
    )

    if (!mergedName && !hasCollege && !attendeeDoc && !userDoc) {
      return NextResponse.json({ success: true, profile: null })
    }

    const profile = {
      name: mergedName,
      email,
      phone: mergedPhone,
      college: mergedCollege,
      state: mergedState,
      city: mergedCity,
      branch: mergedBranch,
      gradYear: mergedGradYear,
      onboardingCompleted: isCompleted,
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Database query error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || !body.email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const email = String(body.email).trim().toLowerCase()
    const name = String(body.name || '').trim()
    const college = String(body.college || '').trim()
    const phone = String(body.phone || '').trim()
    const state = String(body.state || 'Chandigarh').trim()
    const city = String(body.city || 'Chandigarh').trim()
    const gradYear = String(body.gradYear || '1st Year (Class of 2030)').trim()
    const branch = String(body.branch || '').trim()
    const onboardingCompleted = body.onboardingCompleted !== undefined ? Boolean(body.onboardingCompleted) : true

    const db = await getDb()
    const userCollection = db.collection('User')
    const attendeeProfileCollection = db.collection('AttendeeProfile')

    const updatePayload = {
      name: name || undefined,
      email,
      phone,
      college,
      state,
      city,
      gradYear,
      branch,
      onboardingCompleted,
      updatedAt: new Date(),
    }

    // Clean undefined fields
    Object.keys(updatePayload).forEach((key) => {
      if ((updatePayload as any)[key] === undefined) {
        delete (updatePayload as any)[key]
      }
    })

    // Upsert into AttendeeProfile
    await attendeeProfileCollection.updateOne(
      { email },
      {
        $set: updatePayload,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    )

    // Upsert/Update into User collection as well
    await userCollection.updateOne(
      { email },
      {
        $set: updatePayload,
        $setOnInsert: {
          role: 'USER',
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully in database',
      profile: {
        name,
        email,
        phone,
        college,
        state,
        city,
        gradYear,
        branch,
        onboardingCompleted,
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Database save error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
