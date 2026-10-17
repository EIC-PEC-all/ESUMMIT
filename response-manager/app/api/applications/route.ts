import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { randomBytes } from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim().toLowerCase() || ''
    const status = searchParams.get('status') || ''
    const stage = searchParams.get('stage') || ''

    const db = await getDatabase()

    // 1. Fetch startup funding conclave applications
    const fundingApps = await db
      .collection('funding_conclave_applications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // 2. Fetch student delegate & builder registrations with User lookup
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

    // 3. Map registrations to unified FundingApplication interface
    const mappedStudentApps = studentRegs.map((reg: any) => {
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

      const tracksList = Array.isArray(reg.tracks) ? reg.tracks : []
      const motive = tracksList.length > 0 ? tracksList.join(', ') : 'Student Delegate'
      const userName = reg.user?.name || 'Student Delegate'
      const userCollege = reg.user?.college || 'Punjab Engineering College'
      const userEmail = reg.user?.email || ''
      const userPhone = reg.user?.phone || 'Not provided'
      const userGrad = reg.user?.gradYear ? `Class of ${reg.user.gradYear}` : 'Delegate'

      const appStatus = reg.isRevoked
        ? 'REJECTED'
        : reg.status
        ? reg.status
        : reg.paymentStatus === 'PAID' || reg.paymentStatus === 'PAYMENT_CONFIRMED'
        ? 'PAYMENT_CONFIRMED'
        : isPaid
        ? 'PENDING_REVIEW'
        : 'PAYMENT_CONFIRMED'

      return {
        _id: String(reg._id),
        applicationId: reg.passId || `PEC-REG-${String(reg._id).slice(-6).toUpperCase()}`,
        passTier: tierKey,
        passTierName: tierName,
        passPrice: isPaid ? `₹${reg.amountPaid}` : 'FREE',
        email: userEmail,
        founderName: userName,
        phone: userPhone,
        founderLinkedIn: '',
        startupName: userCollege,
        organization: userCollege,
        role: 'Student Delegate',
        motive,
        websiteUrl: '',
        dpiitNumber: '',
        stage: userGrad,
        sector: tracksList[0] || 'Delegate',
        revenueStage: 'General Registration',
        totalFundingRaised: 'N/A',
        currentAsk: 'N/A',
        preMoneyValuation: 'N/A',
        committedCapital: 'N/A',
        pitchDeckUrl: reg.badgePdfUrl || '',
        demoVideoUrl: '',
        mouComfortable: reg.isCheckedIn ? 'Checked-In at Gate' : appStatus === 'PAYMENT_CONFIRMED' ? 'Payment Verified' : 'Payment Pending',
        status: appStatus,
        paymentMethod: isPaid ? (reg.paymentStatus === 'PAID' ? 'PAID_OFFLINE_VERIFIED' : 'PENDING_OFFLINE') : 'FREE',
        reviewNotes: reg.reviewNotes || (reg.isCheckedIn ? 'Checked in at Summit Desk' : appStatus === 'PAYMENT_CONFIRMED' ? 'Confirmed Delegate' : 'Payment Pending'),
        internalRating: 5,
        createdAt: reg.createdAt ? new Date(reg.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: reg.updatedAt ? new Date(reg.updatedAt).toISOString() : new Date().toISOString(),
      }
    })

    // 4. Combine both datasets
    const allApplications = [...fundingApps, ...mappedStudentApps]

    // 5. Apply filters
    const filtered = allApplications.filter((app: any) => {
      if (status && status !== 'ALL' && app.status !== status) return false
      if (stage && stage !== 'ALL' && app.stage !== stage) return false
      if (search) {
        const matchesName = String(app.startupName || '').toLowerCase().includes(search)
        const matchesFounder = String(app.founderName || '').toLowerCase().includes(search)
        const matchesEmail = String(app.email || '').toLowerCase().includes(search)
        const matchesSector = String(app.sector || '').toLowerCase().includes(search)
        const matchesId = String(app.applicationId || '').toLowerCase().includes(search)
        const matchesTier = String(app.passTierName || '').toLowerCase().includes(search)
        if (!matchesName && !matchesFounder && !matchesEmail && !matchesSector && !matchesId && !matchesTier) {
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
