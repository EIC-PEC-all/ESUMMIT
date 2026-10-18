import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { UserProfile, UserSession, UserRegistrationPass, UsersMetricsStats } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const db = await getDatabase()
    const now = new Date()

    // Fetch users (excluding password hashes), refresh tokens for active sessions, and registrations
    const [rawUsers, rawTokens, rawRegs] = await Promise.all([
      db
        .collection('User')
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection('RefreshToken').find({}).sort({ createdAt: -1 }).toArray(),
      db.collection('Registration').find({}).sort({ createdAt: -1 }).toArray(),
    ])

    // Group tokens by string userId
    const tokensByUser = new Map<string, any[]>()
    for (const token of rawTokens) {
      const uId = String(token.userId)
      if (!tokensByUser.has(uId)) tokensByUser.set(uId, [])
      tokensByUser.get(uId)!.push(token)
    }

    // Group registrations by string userId
    const regsByUser = new Map<string, any[]>()
    for (const reg of rawRegs) {
      const uId = String(reg.userId)
      if (!regsByUser.has(uId)) regsByUser.set(uId, [])
      regsByUser.get(uId)!.push(reg)
    }

    let activeUsersCount = 0
    let totalActiveSessionsCount = 0
    let usersWithPassesCount = 0

    const users: UserProfile[] = rawUsers.map((u: any) => {
      const uId = String(u._id)
      const userTokens = tokensByUser.get(uId) || []
      const userRegs = regsByUser.get(uId) || []

      // Identify active, non-expired, unrevoked sessions
      const activeSessions = userTokens.filter((t) => {
        const exp = t.expiresAt ? new Date(t.expiresAt) : null
        return exp && exp > now && !t.revokedAt
      })

      const isLoggedIn = activeSessions.length > 0
      if (isLoggedIn) activeUsersCount++
      totalActiveSessionsCount += activeSessions.length

      if (userRegs.length > 0) usersWithPassesCount++

      const lastLoginAt = userTokens.length > 0 && userTokens[0].createdAt
        ? new Date(userTokens[0].createdAt).toISOString()
        : undefined

      const formattedSessions: UserSession[] = userTokens.map((t: any) => {
        const exp = t.expiresAt ? new Date(t.expiresAt) : null
        const isActive = Boolean(exp && exp > now && !t.revokedAt)
        return {
          _id: String(t._id),
          userAgent: t.userAgent || 'Unknown Device',
          ipAddress: t.ipAddress || 'Unknown IP',
          expiresAt: t.expiresAt ? new Date(t.expiresAt).toISOString() : '',
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : '',
          isActive,
        }
      })

      const formattedRegs: UserRegistrationPass[] = userRegs.map((r: any) => ({
        _id: String(r._id),
        passId: r.passId || `REG-${String(r._id).slice(-6).toUpperCase()}`,
        passType: r.passType || 'STUDENT_GENERAL',
        amountPaid: Number(r.amountPaid) || 0,
        qrToken: r.qrToken,
        isCheckedIn: Boolean(r.isCheckedIn),
        isRevoked: Boolean(r.isRevoked),
        tracks: Array.isArray(r.tracks) ? r.tracks : [],
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : '',
      }))

      return {
        _id: uId,
        email: u.email || '',
        name: u.name || 'Anonymous User',
        phone: u.phone || '',
        college: u.college || '',
        gradYear: u.gradYear || '',
        city: u.city || '',
        state: u.state || '',
        district: u.district || '',
        role: u.role || 'USER',
        referralCode: u.referralCode || '',
        referredById: u.referredById ? String(u.referredById) : undefined,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : '',
        updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : '',
        activeSessionsCount: activeSessions.length,
        isLoggedIn,
        lastLoginAt,
        sessions: formattedSessions,
        registrations: formattedRegs,
      }
    })

    const stats: UsersMetricsStats = {
      totalUsers: users.length,
      activeLoggedInUsers: activeUsersCount,
      totalActiveSessions: totalActiveSessionsCount,
      usersWithPasses: usersWithPassesCount,
      totalRegistrations: rawRegs.length,
    }

    return NextResponse.json({
      success: true,
      users,
      stats,
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users directory',
      },
      { status: 500 }
    )
  }
}
