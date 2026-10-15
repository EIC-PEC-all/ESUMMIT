import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const db = await getDatabase()
    const collection = db.collection('funding_conclave_applications')

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (body.status !== undefined) updateFields.status = body.status
    if (body.reviewNotes !== undefined) updateFields.reviewNotes = body.reviewNotes
    if (body.internalRating !== undefined) updateFields.internalRating = Number(body.internalRating)

    let filter: Record<string, unknown> = { applicationId: id }
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { applicationId: id }] }
    }

    const result = await collection.updateOne(filter, { $set: updateFields })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
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

    let filter: Record<string, unknown> = { applicationId: id }
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { applicationId: id }] }
    }

    const result = await collection.deleteOne(filter)

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
