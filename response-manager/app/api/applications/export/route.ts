import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')
    const apps = await collection.find({}).sort({ createdAt: -1 }).toArray()

    const headers = [
      'Application ID',
      'Startup Name',
      'Founder Name',
      'Email',
      'Phone',
      'LinkedIn',
      'Stage',
      'Sector',
      'Revenue Stage',
      'Total Raised (INR)',
      'Current Ask (INR)',
      'Pre-Money Valuation (INR)',
      'Committed Capital (INR)',
      'Pitch Deck Link',
      'Demo Video Link',
      'MoU Fee Comfortable',
      'Status',
      'Internal Rating',
      'Review Notes',
      'Submitted At',
    ]

    const escapeCsv = (str: unknown) => {
      if (str === null || str === undefined) return '""'
      const stringValue = String(str).replace(/"/g, '""')
      return `"${stringValue}"`
    }

    const rows = apps.map((app) => [
      escapeCsv(app.applicationId),
      escapeCsv(app.startupName),
      escapeCsv(app.founderName),
      escapeCsv(app.email),
      escapeCsv(app.phone),
      escapeCsv(app.founderLinkedIn),
      escapeCsv(app.stage),
      escapeCsv(app.sector),
      escapeCsv(app.revenueStage),
      escapeCsv(app.totalFundingRaised),
      escapeCsv(app.currentAsk),
      escapeCsv(app.preMoneyValuation),
      escapeCsv(app.committedCapital),
      escapeCsv(app.pitchDeckUrl),
      escapeCsv(app.demoVideoUrl),
      escapeCsv(app.mouComfortable),
      escapeCsv(app.status),
      escapeCsv(app.internalRating || 0),
      escapeCsv(app.reviewNotes || ''),
      escapeCsv(app.createdAt),
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="pec_funding_conclave_applications_${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
