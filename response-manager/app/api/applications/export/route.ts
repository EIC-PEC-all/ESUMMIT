import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')?.toLowerCase()

    const db = await getDatabase()
    
    let allRecords: any[] = []

    if (category !== 'student') {
      const startupApps = await db
        .collection('funding_conclave_applications')
        .find({})
        .sort({ createdAt: -1 })
        .toArray()
      allRecords.push(
        ...startupApps.map((a: any) => ({
          type: 'Startup Pass',
          id: a.applicationId,
          tier: a.passTierName || a.passTier,
          name: a.founderName,
          org: a.startupName || a.organization,
          email: a.email,
          phone: a.phone,
          stage: a.stage,
          sector: a.sector,
          status: a.status,
          date: a.createdAt,
        }))
      )
    }

    if (category !== 'startup') {
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

      allRecords.push(
        ...studentRegs.map((r: any) => ({
          type: 'Student Pass',
          id: r.passId,
          tier: r.passType === 'HACKATHON_BUILDER' ? 'HACKATHON BUILDER' : r.amountPaid > 0 ? 'ALL-ACCESS PASS' : 'FREE DELEGATE PASS',
          name: r.user?.name || 'Student Delegate',
          org: r.user?.college || 'Punjab Engineering College',
          email: r.user?.email || '',
          phone: r.user?.phone || 'Not provided',
          stage: r.user?.gradYear ? `Class of ${r.user.gradYear}` : 'Delegate',
          sector: Array.isArray(r.tracks) && r.tracks.length > 0 ? r.tracks.join('; ') : 'General',
          status: r.isRevoked ? 'REJECTED' : 'PAYMENT_CONFIRMED',
          date: r.createdAt ? new Date(r.createdAt).toISOString() : '',
        }))
      )
    }

    const headers = [
      'Type',
      'Pass / Application ID',
      'Tier / Category',
      'Name',
      'College / Startup',
      'Email',
      'Phone',
      'Stage / Year',
      'Sector / Tracks',
      'Status',
      'Created At',
    ]

    const escapeCsv = (str: unknown) => {
      if (str === null || str === undefined) return '""'
      const stringValue = String(str).replace(/"/g, '""')
      return `"${stringValue}"`
    }

    const rows = allRecords.map((r: any) => [
      escapeCsv(r.type),
      escapeCsv(r.id),
      escapeCsv(r.tier),
      escapeCsv(r.name),
      escapeCsv(r.org),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.stage),
      escapeCsv(r.sector),
      escapeCsv(r.status),
      escapeCsv(r.date),
    ])

    const csvContent = [headers.join(','), ...rows.map((row: string[]) => row.join(','))].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="pec_esummit_responses_${category || 'all'}_${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
