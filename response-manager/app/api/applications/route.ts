import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() || ''
    const status = searchParams.get('status') || ''
    const stage = searchParams.get('stage') || ''

    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')

    const query: Record<string, unknown> = {}

    if (status && status !== 'ALL') {
      query.status = status
    }

    if (stage && stage !== 'ALL') {
      query.stage = stage
    }

    if (search) {
      query.$or = [
        { startupName: { $regex: search, $options: 'i' } },
        { founderName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { sector: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } },
      ]
    }

    const applications = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
