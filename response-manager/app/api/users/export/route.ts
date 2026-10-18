import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase()
    const now = new Date()

    const [rawUsers, rawTokens, rawRegs] = await Promise.all([
      db
        .collection('User')
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection('RefreshToken').find({}).sort({ createdAt: -1 }).toArray(),
      db.collection('Registration').find({}).sort({ createdAt: -1 }).toArray(),
    ])

    const tokensByUser = new Map<string, any[]>()
    for (const t of rawTokens) {
      const uId = String(t.userId)
      if (!tokensByUser.has(uId)) tokensByUser.set(uId, [])
      tokensByUser.get(uId)!.push(t)
    }

    const regsByUser = new Map<string, any[]>()
    for (const r of rawRegs) {
      const uId = String(r.userId)
      if (!regsByUser.has(uId)) regsByUser.set(uId, [])
      regsByUser.get(uId)!.push(r)
    }

    const headers = [
      'User ID',
      'Name',
      'Email',
      'Phone',
      'Role',
      'College',
      'Graduation Year',
      'City',
      'Referral Code',
      'Is Logged In',
      'Active Sessions',
      'Last Login Date',
      'Registered Passes Count',
      'Pass Details',
      'Account Created At',
    ]

    const csvRows = [headers.join(',')]

    for (const u of rawUsers) {
      const uId = String(u._id)
      const userTokens = tokensByUser.get(uId) || []
      const userRegs = regsByUser.get(uId) || []

      const activeSessions = userTokens.filter((t) => {
        const exp = t.expiresAt ? new Date(t.expiresAt) : null
        return exp && exp > now && !t.revokedAt
      })

      const lastLogin = userTokens.length > 0 && userTokens[0].createdAt
        ? new Date(userTokens[0].createdAt).toISOString()
        : 'Never'

      const passesSummary = userRegs
        .map((r) => `${r.passId || r.passType} (${r.amountPaid > 0 ? '₹' + r.amountPaid : 'Free'})`)
        .join('; ')

      const row = [
        `"${uId}"`,
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${(u.phone || '').replace(/"/g, '""')}"`,
        `"${u.role || 'USER'}"`,
        `"${(u.college || '').replace(/"/g, '""')}"`,
        `"${(u.gradYear || '').replace(/"/g, '""')}"`,
        `"${(u.city || '').replace(/"/g, '""')}"`,
        `"${(u.referralCode || '').replace(/"/g, '""')}"`,
        `"${activeSessions.length > 0 ? 'YES' : 'NO'}"`,
        `"${activeSessions.length}"`,
        `"${lastLogin}"`,
        `"${userRegs.length}"`,
        `"${passesSummary.replace(/"/g, '""')}"`,
        `"${u.createdAt ? new Date(u.createdAt).toISOString() : ''}"`,
      ]
      csvRows.push(row.join(','))
    }

    const csvString = csvRows.join('\r\n')
    const filename = `esummit26_users_export_${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Export failed' },
      { status: 500 }
    )
  }
}
