import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

import { ObjectId } from 'mongodb'

const VALID_STATUSES = new Set([
  'PENDING_REVIEW', 'UNDER_REVIEW', 'SHORTLISTED', 'MOU_SENT',
  'MOU_ACCEPTED', 'PAYMENT_CONFIRMED', 'REJECTED',
])

interface Params {
  params: Promise<{ id: string }>
}

function buildIdFilter(id: string): Record<string, unknown> {
  const isHex24 = /^[0-9a-fA-F]{24}$/.test(id)
  if (isHex24) {
    try {
      const objId = new ObjectId(id)
      return { $or: [{ _id: objId }, { _id: id }, { applicationId: id }, { passId: id }] }
    } catch {
      return { $or: [{ _id: id }, { applicationId: id }, { passId: id }] }
    }
  }
  return { $or: [{ applicationId: id }, { passId: id }] }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'A valid update payload is required' }, { status: 400 })
    }
    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return NextResponse.json({ success: false, error: 'Invalid application status' }, { status: 400 })
      }
      updateFields.status = body.status
    }
    if (body.reviewNotes !== undefined) updateFields.reviewNotes = String(body.reviewNotes).trim()
    if (body.internalRating !== undefined) {
      const rating = Number(body.internalRating)
      if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
        return NextResponse.json({ success: false, error: 'Rating must be an integer from 0 to 5' }, { status: 400 })
      }
      updateFields.internalRating = rating
    }

    const filter = buildIdFilter(id)
    let result = await collection.updateOne(filter, { $set: updateFields })

    if (result.matchedCount === 0) {
      // Check Registration collection for student pass
      const regCollection = db.collection('Registration')
      const regUpdate: Record<string, unknown> = { updatedAt: new Date() }
      if (body.status !== undefined) {
        regUpdate.status = body.status
        if (body.status === 'PAYMENT_CONFIRMED') {
          regUpdate.paymentStatus = 'PAID'
          regUpdate.isRevoked = false
        } else if (body.status === 'REJECTED') {
          regUpdate.isRevoked = true
          regUpdate.paymentStatus = 'REJECTED'
        } else {
          regUpdate.paymentStatus = 'PENDING'
          regUpdate.isRevoked = false
        }
      }
      if (body.reviewNotes !== undefined) {
        regUpdate.reviewNotes = String(body.reviewNotes).trim()
      }
      const regResult = await regCollection.updateOne(filter, { $set: regUpdate })
      if (regResult.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'Application or pass not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ success: true, message: 'Application updated successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')

    const filter = buildIdFilter(id)
    const result = await collection.deleteOne(filter)

    if (result.deletedCount === 0) {
      const regCollection = db.collection('Registration')
      const regResult = await regCollection.deleteOne(filter)
      if (regResult.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
