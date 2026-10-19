import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { randomBytes } from 'crypto'
import type { Registration } from '@/lib/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim().toLowerCase() || ''
    const status = searchParams.get('status') || ''

    const db = await getDatabase()

    // 1. Fetch startup pass applications from funding_conclave_applications
    const fundingApps = await db
      .collection('funding_conclave_applications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const mappedStartupApps: Registration[] = fundingApps.map((doc: any) => ({
      _id: String(doc._id),
      applicationId: doc.applicationId || `PEC-FC-${String(doc._id).slice(-6).toUpperCase()}`,
      category: 'startup' as const,

      fullName: doc.founderName || doc.fullName || '',
      email: doc.email || '',
      phone: doc.phone || '',
      linkedin: doc.founderLinkedIn || doc.linkedin || '',
      motive: doc.motive || '',

      organization: doc.startupName || doc.organization || '',
      role: doc.role || 'Founder',

      passTier: doc.passTier || 'gold',
      passTierName: doc.passTierName || 'GOLD PASS',
      passPrice: doc.passPrice || '',
      paymentMethod: String(doc.paymentMethod || '').replace(/_?MOU_?/gi, '_').replace(/^_+|_+$/g, '') || 'OFFLINE_DIRECT_TRANSFER',

      status: doc.status || 'PENDING_REVIEW',
      reviewNotes: doc.reviewNotes || '',
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    }))

    // 2. Fetch student registrations with joined User
    const studentRegs = await db
      .collection('Registration')
      .aggregate([
        {
          $lookup: {
            from: 'User',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    // 3. Map student registrations to Registration interface
    const mappedStudentApps: Registration[] = studentRegs.map((reg: any) => {
      const pType = String(reg.passType || '').toUpperCase()
      const isHack = pType.includes('HACKATHON')
      const isAmb = pType.includes('AMBASSADOR')
      const isPaid = Number(reg.amountPaid) > 0

      const tierKey = isHack ? 'hackathon' : isAmb ? 'ambassador' : isPaid ? 'all-access' : 'delegate'
      const tierName = isHack
        ? 'HACKATHON BUILDER'
        : isAmb
        ? 'CAMPUS AMBASSADOR'
        : isPaid
        ? 'ALL-ACCESS PASS'
        : 'FREE DELEGATE PASS'

      const tracksList: string[] = Array.isArray(reg.tracks) ? reg.tracks : []

      const appStatus: Registration['status'] = reg.isRevoked
        ? 'REJECTED'
        : reg.status === 'PAYMENT_CONFIRMED' || reg.status === 'SHORTLISTED' || reg.status === 'REJECTED'
        ? reg.status
        : reg.paymentStatus === 'PAID' || reg.paymentStatus === 'PAYMENT_CONFIRMED'
        ? 'PAYMENT_CONFIRMED'
        : isPaid
        ? 'PENDING_REVIEW'
        : 'PAYMENT_CONFIRMED' // free pass = confirmed by default

      return {
        _id: String(reg._id),
        applicationId: reg.passId || `PEC-REG-${String(reg._id).slice(-6).toUpperCase()}`,
        category: 'student' as const,

        fullName: reg.user?.name || 'Student',
        email: reg.user?.email || '',
        phone: reg.user?.phone || '',
        linkedin: '',
        motive: tracksList.length > 0 ? tracksList.join(', ') : '',

        college: reg.user?.college || '',
        state: reg.user?.state || '',
        city: reg.user?.city || '',
        courseYear: reg.user?.gradYear ? `Class of ${reg.user.gradYear}` : '',

        passTier: tierKey,
        passTierName: tierName,
        passPrice: isPaid ? `₹${reg.amountPaid}` : 'FREE',
        paymentMethod: isPaid
          ? reg.paymentStatus === 'PAID'
            ? 'OFFLINE_VERIFIED'
            : 'PENDING_OFFLINE'
          : 'FREE',

        status: appStatus,
        reviewNotes: reg.reviewNotes || '',
        createdAt: reg.createdAt ? new Date(reg.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: reg.updatedAt ? new Date(reg.updatedAt).toISOString() : new Date().toISOString(),
      }
    })

    // 4. Combine datasets
    const allApplications: Registration[] = [...mappedStartupApps, ...mappedStudentApps]

    // 5. Apply filters
    const filtered = allApplications.filter((app) => {
      if (status && status !== 'ALL' && app.status !== status) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !app.fullName?.toLowerCase().includes(q) &&
          !app.email?.toLowerCase().includes(q) &&
          !app.phone?.toLowerCase().includes(q) &&
          !app.organization?.toLowerCase().includes(q) &&
          !app.college?.toLowerCase().includes(q) &&
          !app.applicationId?.toLowerCase().includes(q) &&
          !app.passTierName?.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })

    return NextResponse.json({
      success: true,
      count: filtered.length,
      applications: filtered,
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

    const fullName = String(body.fullName || body.founderName || '').trim()
    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Applicant name is required' }, { status: 400 })
    }

    const phone = String(body.phone || '').trim()
    if (phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ success: false, error: 'Enter a valid phone number (at least 10 digits)' }, { status: 400 })
    }

    const category = body.category === 'student' ? 'student' : 'startup'
    const now = new Date().toISOString()

    const passDetails: Record<string, { name: string; price: string }> = {
      diamond: { name: 'DIAMOND PASS', price: '₹8,000 + GST' },
      gold: { name: 'GOLD PASS', price: '₹3,500 + GST' },
      silver: { name: 'SILVER PASS', price: '₹1,000 + GST' },
    }
    const tier = String(body.passTier || 'gold').trim().toLowerCase()

    const application: Partial<Registration> & Record<string, unknown> = {
      applicationId: body.applicationId || `PEC-FC-${randomBytes(3).toString('hex').toUpperCase()}`,
      category,
      fullName,
      email,
      phone,
      linkedin: String(body.linkedin || body.founderLinkedIn || '').trim(),
      motive: String(body.motive || '').trim(),
      organization: String(body.organization || body.startupName || '').trim(),
      role: String(body.role || 'Founder').trim(),
      college: String(body.college || '').trim(),
      state: String(body.state || '').trim(),
      city: String(body.city || '').trim(),
      courseYear: String(body.courseYear || '').trim(),
      passTier: passDetails[tier] ? tier : 'gold',
      passTierName: String(body.passTierName || passDetails[tier]?.name || passDetails.gold.name).trim(),
      passPrice: String(body.passPrice || passDetails[tier]?.price || passDetails.gold.price).trim(),
      paymentMethod: String(body.paymentMethod || 'OFFLINE_DIRECT_TRANSFER').trim(),
      status: body.status || 'PENDING_REVIEW',
      reviewNotes: String(body.reviewNotes || '').trim(),
      createdAt: body.createdAt || now,
      updatedAt: now,
    }

    const db = await getDatabase()
    await db.collection('funding_conclave_applications').insertOne(application as any)
    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create application'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
