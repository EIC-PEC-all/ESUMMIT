'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Header } from '@/components/Header'
import { MetricsOverview } from '@/components/MetricsOverview'
import { UserMetricsOverview } from '@/components/UserMetricsOverview'
import { StatusBadge } from '@/components/StatusBadge'
import { ApplicationDetailModal } from '@/components/ApplicationDetailModal'
import { UserProfileModal } from '@/components/UserProfileModal'
import { NewApplicationModal } from '@/components/NewApplicationModal'
import { FundingApplication, UserProfile, UsersMetricsStats } from '@/lib/types'
import {
  Search,
  Eye,
  Inbox,
  Plus,
  Briefcase,
  GraduationCap,
  Clock,
  Users,
  Radio,
  Laptop,
  Ticket,
  Mail,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'ALL STATUSES' },
  { id: 'PENDING_REVIEW', label: 'PENDING' },
  { id: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
  { id: 'SHORTLISTED', label: 'SHORTLISTED' },
  { id: 'MOU_SENT', label: 'MOU SENT' },
  { id: 'MOU_ACCEPTED', label: 'MOU ACCEPTED' },
  { id: 'PAYMENT_CONFIRMED', label: 'CONFIRMED' },
  { id: 'REJECTED', label: 'NOT SELECTED' },
]

const USER_ROLES: { id: string; label: string }[] = [
  { id: 'ALL', label: 'ALL ROLES' },
  { id: 'USER', label: 'STANDARD USERS' },
  { id: 'ADMIN', label: 'ADMINISTRATORS' },
  { id: 'SUPER_ADMIN', label: 'SUPER ADMINS' },
  { id: 'ORGANIZER', label: 'ORGANIZERS' },
  { id: 'GATE', label: 'GATE GUARDS' },
  { id: 'VOLUNTEER_CHECKIN', label: 'CHECKIN VOLUNTEERS' },
  { id: 'INVESTOR', label: 'INVESTORS' },
  { id: 'DELEGATE', label: 'DELEGATES' },
]

function isStudentPass(app: FundingApplication): boolean {
  const tier = (app.passTier || '').toLowerCase()
  const name = (app.passTierName || '').toLowerCase()
  const price = (app.passPrice || '').toLowerCase()
  const role = (app.role || '').toLowerCase()
  const rev = (app.revenueStage || '').toLowerCase()

  if (['silver', 'gold', 'diamond'].includes(tier)) return false
  if (name.includes('silver') || name.includes('gold') || name.includes('diamond')) return false

  if (['delegate', 'hackathon', 'all-access', 'combo', 'standard'].includes(tier)) return true
  if (
    name.includes('delegate') ||
    name.includes('student') ||
    name.includes('hackathon') ||
    name.includes('combo') ||
    name.includes('builder')
  ) {
    return true
  }
  if (rev.includes('general registration') || role.includes('student') || price.includes('free')) {
    return true
  }

  return false
}

export default function Home() {
  const [applications, setApplications] = useState<FundingApplication[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [usersStats, setUsersStats] = useState<UsersMetricsStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true)
  const [activeCategory, setActiveCategory] = useState<'startup' | 'student' | 'users'>('startup')

  // Search & Filter States for Applications
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [stageFilter, setStageFilter] = useState<string>('ALL')
  const [tierFilter, setTierFilter] = useState<string>('ALL')

  // Filter States for Users Directory
  const [userSessionFilter, setUserSessionFilter] = useState<'ALL' | 'LOGGED_IN' | 'OFFLINE'>('ALL')
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL')
  const [userPassFilter, setUserPassFilter] = useState<'ALL' | 'WITH_PASS' | 'NO_PASS'>('ALL')

  // Modals & Selected Records
  const [selectedApp, setSelectedApp] = useState<FundingApplication | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications)
      } else {
        toast.error('Failed to load applications')
      }
    } catch {
      toast.error('Network error loading applications')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users)
        if (data.stats) setUsersStats(data.stats)
      } else {
        toast.error('Failed to load users directory')
      }
    } catch {
      toast.error('Network error loading users directory')
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true)
    await Promise.all([fetchApplications(), fetchUsers()])
    setIsRefreshing(false)
  }, [fetchApplications, fetchUsers])

  useEffect(() => {
    fetchApplications()
    fetchUsers()
  }, [fetchApplications, fetchUsers])

  // Category counts for passes
  const startupApps = useMemo(() => applications.filter((a) => !isStudentPass(a)), [applications])
  const studentApps = useMemo(() => applications.filter((a) => isStudentPass(a)), [applications])

  const activeApps = useMemo(() => {
    return activeCategory === 'student' ? studentApps : startupApps
  }, [activeCategory, studentApps, startupApps])

  // Extract unique stages for filter dropdown within active category
  const uniqueStages = useMemo(() => {
    const set = new Set<string>()
    activeApps.forEach((a) => {
      if (a.stage) set.add(a.stage)
    })
    return Array.from(set)
  }, [activeApps])

  // Applications filtering
  const filteredApplications = useMemo(() => {
    return activeApps.filter((app) => {
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false
      if (stageFilter !== 'ALL' && app.stage !== stageFilter) return false
      if (tierFilter !== 'ALL') {
        const t = (app.passTier || '').toLowerCase()
        const n = (app.passTierName || '').toLowerCase()
        const tf = tierFilter.toLowerCase()
        if (t !== tf && !n.includes(tf)) return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesName = app.startupName?.toLowerCase().includes(q)
        const matchesFounder = app.founderName?.toLowerCase().includes(q)
        const matchesEmail = app.email?.toLowerCase().includes(q)
        const matchesSector = app.sector?.toLowerCase().includes(q)
        const matchesId = app.applicationId?.toLowerCase().includes(q)
        const matchesTier = app.passTierName?.toLowerCase().includes(q)
        if (!matchesName && !matchesFounder && !matchesEmail && !matchesSector && !matchesId && !matchesTier) {
          return false
        }
      }
      return true
    })
  }, [activeApps, statusFilter, stageFilter, tierFilter, search])

  // Users Directory filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Session filter
      if (userSessionFilter === 'LOGGED_IN' && !u.isLoggedIn) return false
      if (userSessionFilter === 'OFFLINE' && u.isLoggedIn) return false

      // Role filter
      if (userRoleFilter !== 'ALL' && u.role.toUpperCase() !== userRoleFilter.toUpperCase()) {
        return false
      }

      // Pass filter
      if (userPassFilter === 'WITH_PASS' && u.registrations.length === 0) return false
      if (userPassFilter === 'NO_PASS' && u.registrations.length > 0) return false

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesName = u.name?.toLowerCase().includes(q)
        const matchesEmail = u.email?.toLowerCase().includes(q)
        const matchesPhone = u.phone?.toLowerCase().includes(q)
        const matchesCollege = u.college?.toLowerCase().includes(q)
        const matchesCity = u.city?.toLowerCase().includes(q)
        const matchesId = u._id?.toLowerCase().includes(q)
        const matchesRole = u.role?.toLowerCase().includes(q)
        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesCollege &&
          !matchesCity &&
          !matchesId &&
          !matchesRole
        ) {
          return false
        }
      }

      return true
    })
  }, [users, userSessionFilter, userRoleFilter, userPassFilter, search])

  const handleUpdateApplication = (updated: FundingApplication) => {
    setApplications((prev) =>
      prev.map((app) => (app.applicationId === updated.applicationId ? updated : app))
    )
    if (selectedApp?.applicationId === updated.applicationId) {
      setSelectedApp(updated)
    }
  }

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.applicationId !== id))
    if (selectedApp?.applicationId === id) {
      setSelectedApp(null)
    }
  }

  // Active count for header
  const currentTotalCount = activeCategory === 'users' ? users.length : activeApps.length

  const getRoleBadgeClass = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30'
      case 'ORGANIZER':
        return 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
      case 'GATE':
      case 'VOLUNTEER_CHECKIN':
        return 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-500/20 dark:text-mint dark:border-emerald-500/30'
    }
  }

  return (
    <div className="manager-app min-h-screen">
      {/* Top Header */}
      <Header
        totalCount={currentTotalCount}
        onRefresh={refreshAll}
        isRefreshing={isRefreshing}
        category={activeCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ── Category Segmented Toggle ── */}
        <div className="flex items-center justify-start mb-6 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100 dark:bg-[#0D1C18] border border-slate-200 dark:border-white/10 shadow-md max-w-full flex-nowrap">
            {/* Startup Passes Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory('startup')
                setTierFilter('ALL')
                setStageFilter('ALL')
                setSearch('')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeCategory === 'startup'
                  ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase
                size={14}
                className={activeCategory === 'startup' ? 'text-void stroke-[2.5]' : 'text-emerald-600 dark:text-mint'}
              />
              <span>STARTUP PASSES</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeCategory === 'startup'
                    ? 'bg-black/25 text-white dark:bg-void dark:text-mint'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {startupApps.length}
              </span>
            </button>

            {/* Student Passes Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory('student')
                setTierFilter('ALL')
                setStageFilter('ALL')
                setSearch('')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeCategory === 'student'
                  ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap
                size={15}
                className={activeCategory === 'student' ? 'text-void stroke-[2.5]' : 'text-emerald-600 dark:text-mint'}
              />
              <span>STUDENT PASSES</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeCategory === 'student'
                    ? 'bg-black/25 text-white dark:bg-void dark:text-mint'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {studentApps.length}
              </span>
            </button>

            {/* Users Directory Pill */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory('users')
                setSearch('')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeCategory === 'users'
                  ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users
                size={15}
                className={activeCategory === 'users' ? 'text-void stroke-[2.5]' : 'text-emerald-600 dark:text-mint'}
              />
              <span>USERS DIRECTORY</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeCategory === 'users'
                    ? 'bg-black/25 text-white dark:bg-void dark:text-mint'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {users.length}
              </span>
              {usersStats && usersStats.activeLoggedInUsers > 0 && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono-data font-bold bg-emerald-500/20 text-emerald-800 dark:text-mint border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{usersStats.activeLoggedInUsers} LIVE</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Section Header ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
          <div>
            <span className="font-mono-data text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-mint flex items-center gap-2 mb-2">
              {activeCategory === 'users'
                ? 'AUTHENTICATED USER & SESSION DIRECTORY'
                : activeCategory === 'student'
                ? 'DELEGATE CMS PORTAL'
                : 'EXECUTIVE CMS PORTAL'}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">
              {activeCategory === 'users' ? (
                <>
                  PLATFORM <span className="text-emerald-700 dark:text-mint">USERS</span>
                </>
              ) : activeCategory === 'student' ? (
                <>
                  STUDENT &amp; BUILDER <span className="text-emerald-700 dark:text-mint">PASSES</span>
                </>
              ) : (
                <>
                  STARTUP PASS <span className="text-emerald-700 dark:text-mint">RESPONSES</span>
                </>
              )}
            </h1>
            <p className="font-mono-data text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest mt-3">
              {activeCategory === 'users'
                ? 'AUTHENTICATED ACCOUNTS • ACTIVE LOGIN SESSIONS • PROFILES • TICKET LINKAGE'
                : activeCategory === 'student'
                ? 'DELEGATE ACCREDITATION • HACKATHON BUILDERS • ALL-ACCESS • ENTRY BADGES'
                : 'SCREENING • INVESTOR FIT • MOU WORKFLOW • OFFLINE DIRECT PAYMENTS'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeCategory === 'users' ? (
              <button
                type="button"
                onClick={fetchUsers}
                disabled={isRefreshing}
                className="min-h-[42px] px-5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#0D1C18] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} className={`text-emerald-700 dark:text-mint stroke-[2.5] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>SYNC DIRECTORY</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="min-h-[42px] px-5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#0D1C18] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} className="text-emerald-700 dark:text-mint stroke-[2.5]" />
                <span>{activeCategory === 'student' ? 'ADD DELEGATE' : 'ADD APPLICATION'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Metrics Overview Cards ── */}
        {activeCategory === 'users' ? (
          <UserMetricsOverview
            stats={
              usersStats || {
                totalUsers: users.length,
                activeLoggedInUsers: users.filter((u) => u.isLoggedIn).length,
                totalActiveSessions: users.reduce((acc, u) => acc + u.activeSessionsCount, 0),
                usersWithPasses: users.filter((u) => u.registrations.length > 0).length,
                totalRegistrations: users.reduce((acc, u) => acc + u.registrations.length, 0),
              }
            }
          />
        ) : (
          <MetricsOverview applications={activeApps} category={activeCategory} />
        )}

        {/* ── Filter & Search Control Panel ── */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10 mb-8 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeCategory === 'users'
                    ? 'Search name, email, phone, college, city, ID...'
                    : activeCategory === 'student'
                    ? 'Search student, college, email, pass ID...'
                    : 'Search startup, founder, email, sector, ID...'
                }
                className="w-full pl-11 pr-5 py-2.5 rounded-full bg-slate-50 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-body focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0D1C18] transition-colors"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
              {activeCategory === 'users' ? (
                <>
                  {/* Role Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono-data font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      ROLE:
                    </span>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-4 py-2 rounded-full bg-slate-50 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono-data font-bold uppercase focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                    >
                      {USER_ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pass Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono-data font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      PASS:
                    </span>
                    <select
                      value={userPassFilter}
                      onChange={(e) => setUserPassFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-full bg-slate-50 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono-data font-bold uppercase focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                    >
                      <option value="ALL">ALL USERS</option>
                      <option value="WITH_PASS">HAS PASS / TICKET</option>
                      <option value="NO_PASS">NO PASS YET</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Pass Tier Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono-data font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      TIER:
                    </span>
                    <select
                      value={tierFilter}
                      onChange={(e) => setTierFilter(e.target.value)}
                      className="px-4 py-2 rounded-full bg-slate-50 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono-data font-bold uppercase focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                    >
                      <option value="ALL">ALL PASSES</option>
                      {activeCategory === 'startup' ? (
                        <>
                          <option value="diamond">DIAMOND PASS</option>
                          <option value="gold">GOLD PASS</option>
                          <option value="silver">SILVER PASS</option>
                        </>
                      ) : (
                        <>
                          <option value="delegate">FREE DELEGATE</option>
                          <option value="hackathon">HACKATHON BUILDER</option>
                          <option value="all-access">ALL-ACCESS PASS</option>
                          <option value="combo">ULTIMATE COMBO</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Stage Filter */}
                  {uniqueStages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono-data font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        {activeCategory === 'student' ? 'TRACK:' : 'STAGE:'}
                      </span>
                      <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="px-4 py-2 rounded-full bg-slate-50 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono-data font-bold uppercase focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                      >
                        <option value="ALL">ALL {activeCategory === 'student' ? 'TRACKS' : 'STAGES'}</option>
                        {uniqueStages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs no-scrollbar flex-nowrap">
            {activeCategory === 'users' ? (
              <>
                <button
                  type="button"
                  onClick={() => setUserSessionFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-full font-mono-data text-[10px] tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    userSessionFilter === 'ALL'
                      ? 'btn-mint-gradient text-void shadow-md scale-[1.01] font-black'
                      : 'bg-slate-100/80 dark:bg-[#12241F] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-slate-900 dark:hover:text-white font-bold shadow-xs'
                  }`}
                >
                  ALL USERS ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserSessionFilter('LOGGED_IN')}
                  className={`px-3.5 py-1.5 rounded-full font-mono-data text-[10px] tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    userSessionFilter === 'LOGGED_IN'
                      ? 'btn-mint-gradient text-void shadow-md scale-[1.01] font-black'
                      : 'bg-slate-100/80 dark:bg-[#12241F] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-slate-900 dark:hover:text-white font-bold shadow-xs'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    CURRENTLY LOGGED IN ({users.filter((u) => u.isLoggedIn).length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserSessionFilter('OFFLINE')}
                  className={`px-3.5 py-1.5 rounded-full font-mono-data text-[10px] tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    userSessionFilter === 'OFFLINE'
                      ? 'btn-mint-gradient text-void shadow-md scale-[1.01] font-black'
                      : 'bg-slate-100/80 dark:bg-[#12241F] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-slate-900 dark:hover:text-white font-bold shadow-xs'
                  }`}
                >
                  OFFLINE ({users.filter((u) => !u.isLoggedIn).length})
                </button>
              </>
            ) : (
              STATUS_FILTERS.map((filter) => {
                const isActive = statusFilter === filter.id
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setStatusFilter(filter.id)}
                    className={`px-3.5 py-1.5 rounded-full font-mono-data text-[10px] tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'btn-mint-gradient text-void shadow-md scale-[1.01] font-black'
                        : 'bg-slate-100/80 dark:bg-[#12241F] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-slate-900 dark:hover:text-white font-bold shadow-xs'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Content Table ── */}
        <div className="rounded-3xl bg-white dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {activeCategory === 'users' ? (
              /* ── USERS TABLE ── */
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] text-[11px] font-mono-data font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em]">
                    <th className="py-4 px-5 font-bold">USER &amp; IDENTITY</th>
                    <th className="py-4 px-5 font-bold">CONTACT &amp; ROLE</th>
                    <th className="py-4 px-5 font-bold">COLLEGE &amp; BATCH</th>
                    <th className="py-4 px-5 font-bold">LOGIN STATUS &amp; SESSIONS</th>
                    <th className="py-4 px-5 font-bold">SUMMIT PASSES</th>
                    <th className="py-4 px-5 font-bold text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center text-slate-500 dark:text-slate-400 font-mono-data">
                        <div className="w-7 h-7 border-2 border-emerald-600 dark:border-mint border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        LOADING USERS DIRECTORY...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                          <Inbox className="w-7 h-7" />
                        </div>
                        <span className="font-display text-xl font-bold text-slate-900 dark:text-white block mb-1">
                          NO USERS FOUND
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-data max-w-sm mx-auto font-medium">
                          {search || userSessionFilter !== 'ALL' || userRoleFilter !== 'ALL' || userPassFilter !== 'ALL'
                            ? 'TRY ADJUSTING SEARCH CRITERIA OR RESETTING ROLE/SESSION FILTERS.'
                            : 'NO USERS REGISTERED IN DATABASE YET.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const initials = u.name
                        ? u.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : 'U'

                      return (
                        <tr
                          key={u._id}
                          className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer"
                          onClick={() => setSelectedUser(u)}
                        >
                          {/* Name & ID */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-display font-black text-sm shrink-0 shadow-xs">
                                {initials}
                              </div>
                              <div>
                                <div className="font-display font-black text-slate-900 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-mint transition-colors">
                                  {u.name}
                                </div>
                                <div className="font-mono-data text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                  ID: {u._id}
                                </div>
                                {u.createdAt && (
                                  <div className="flex items-center gap-1 text-[10px] font-mono-data text-slate-400 dark:text-slate-500 mt-1">
                                    <Clock className="w-3 h-3 text-emerald-600 dark:text-mint shrink-0" />
                                    <span>Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Contact & Role */}
                          <td className="py-4 px-5">
                            <div className="font-mono-data text-xs text-slate-900 dark:text-white font-medium break-all flex items-center gap-1.5">
                              <Mail size={12} className="text-emerald-700 dark:text-mint shrink-0" />
                              <span>{u.email}</span>
                            </div>
                            {u.phone && (
                              <div className="font-mono-data text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                {u.phone}
                              </div>
                            )}
                            <div className="mt-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono-data font-black uppercase tracking-wider border ${getRoleBadgeClass(
                                  u.role
                                )}`}
                              >
                                {u.role}
                              </span>
                            </div>
                          </td>

                          {/* College & Education */}
                          <td className="py-4 px-5 max-w-[200px]">
                            <div className="font-body text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                              {u.college || '—'}
                            </div>
                            <div className="font-mono-data text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {u.gradYear || 'Grad year not specified'}
                            </div>
                            {(u.city || u.state) && (
                              <div className="font-mono-data text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {u.city && u.state ? `${u.city}, ${u.state}` : u.city || u.state}
                              </div>
                            )}
                          </td>

                          {/* Login Status & Sessions */}
                          <td className="py-4 px-5">
                            {u.isLoggedIn ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-data font-black bg-emerald-500/15 text-emerald-700 dark:text-mint border border-emerald-500/30">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>LOGGED IN ({u.activeSessionsCount})</span>
                                </span>
                                {u.sessions[0]?.ipAddress && (
                                  <div className="text-[10px] font-mono-data text-slate-500 dark:text-slate-400">
                                    IP: <span className="font-mono">{u.sessions[0].ipAddress}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  <span>OFFLINE</span>
                                </span>
                                {u.lastLoginAt && (
                                  <div className="text-[10px] font-mono-data text-slate-400 dark:text-slate-500">
                                    Last: {new Date(u.lastLoginAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Linked Passes */}
                          <td className="py-4 px-5">
                            {u.registrations.length > 0 ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-data font-bold bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30">
                                  <Ticket size={11} />
                                  <span>{u.registrations.length} PASS{u.registrations.length > 1 ? 'ES' : ''}</span>
                                </span>
                                <div className="text-[10px] font-mono-data text-slate-600 dark:text-slate-400 line-clamp-1">
                                  {u.registrations.map((r) => r.passType.replace(/_/g, ' ')).join(', ')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] font-mono-data text-slate-400 dark:text-slate-500 italic">
                                No passes
                              </span>
                            )}
                          </td>

                          {/* Quick Actions */}
                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedUser(u)
                              }}
                              className="px-3.5 py-1.5 rounded-full font-mono-data text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12241F] hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all inline-flex items-center gap-1.5 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-xs cursor-pointer"
                            >
                              <Eye size={12} className="text-emerald-700 dark:text-mint stroke-[2.5]" />
                              <span>PROFILE</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            ) : (
              /* ── APPLICATIONS TABLE ── */
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] text-[11px] font-mono-data font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em]">
                    <th className="py-4 px-5 font-bold">
                      {activeCategory === 'student' ? 'DELEGATE & PASS TIER' : 'STARTUP & PASS TIER'}
                    </th>
                    <th className="py-4 px-5 font-bold">
                      {activeCategory === 'student' ? 'STUDENT DETAILS' : 'PRIMARY FOUNDER'}
                    </th>
                    <th className="py-4 px-5 font-bold">
                      {activeCategory === 'student' ? 'COLLEGE / INSTITUTION' : 'STAGE & SECTOR'}
                    </th>
                    <th className="py-4 px-5 font-bold">
                      {activeCategory === 'student' ? 'TRACKS / MOTIVE' : 'FUNDRAISE ASK'}
                    </th>
                    <th className="py-4 px-5 font-bold">
                      {activeCategory === 'student' ? 'VERIFICATION' : 'MOU READINESS'}
                    </th>
                    <th className="py-4 px-5 font-bold">STATUS</th>
                    <th className="py-4 px-5 font-bold text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center text-slate-500 dark:text-slate-400 font-mono-data">
                        <div className="w-7 h-7 border-2 border-emerald-600 dark:border-mint border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        LOADING {activeCategory === 'student' ? 'REGISTRATIONS' : 'SUBMISSIONS'}...
                      </td>
                    </tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                          <Inbox className="w-7 h-7" />
                        </div>
                        <span className="font-display text-xl font-bold text-slate-900 dark:text-white block mb-1">
                          NO {activeCategory === 'student' ? 'STUDENT PASSES' : 'APPLICATIONS'} FOUND
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-data max-w-sm mx-auto font-medium">
                          {search || statusFilter !== 'ALL' || stageFilter !== 'ALL' || tierFilter !== 'ALL'
                            ? 'TRY ADJUSTING SEARCH CRITERIA OR RESETTING STATUS FILTERS.'
                            : `NO ${activeCategory === 'student' ? 'STUDENT PASSES' : 'STARTUP APPLICATIONS'} RECORDED YET.`}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr
                        key={app.applicationId}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer"
                        onClick={() => setSelectedApp(app)}
                      >
                        {/* Name / Startup & ID & Pass Tier */}
                        <td className="py-4 px-5">
                          <div className="font-display font-black text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-mint transition-colors flex items-center gap-2">
                            {activeCategory === 'student' ? app.founderName : app.startupName}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="font-mono-data text-[10px] text-emerald-700 dark:text-mint font-extrabold tracking-wider">
                              {app.applicationId}
                            </span>
                            {app.passTierName && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono-data font-bold uppercase tracking-wider border ${
                                  app.passTier === 'diamond'
                                    ? 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/20'
                                    : app.passTier === 'silver'
                                    ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/20'
                                    : app.passTier === 'hackathon' || app.passTierName.toLowerCase().includes('hackathon')
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-500/15 dark:text-mint dark:border-emerald-500/20'
                                    : 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20'
                                }`}
                              >
                                {app.passTierName} {app.passPrice ? `(${app.passPrice})` : ''}
                              </span>
                            )}
                          </div>
                          {app.createdAt && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono-data text-slate-500 dark:text-slate-400 font-medium">
                              <Clock className="w-3 h-3 text-emerald-600 dark:text-mint shrink-0" />
                              <span>
                                {new Date(app.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                                ,{' '}
                                {new Date(app.createdAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Founder / Contact Info */}
                        <td className="py-4 px-5">
                          <div className="font-mono-data font-bold text-slate-900 dark:text-white text-xs">
                            {activeCategory === 'student' ? app.founderName : app.founderName}
                          </div>
                          <div className="font-mono-data text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            {app.email}
                          </div>
                          <div className="font-mono-data text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                            {app.phone}
                          </div>
                        </td>

                        {/* College / Stage & Sector */}
                        <td className="py-4 px-5">
                          <div className="font-display font-bold text-slate-900 dark:text-white text-xs">
                            {activeCategory === 'student'
                              ? app.startupName || app.organization || 'PEC'
                              : app.stage || 'EARLY'}
                          </div>
                          <div className="font-mono-data text-emerald-700 dark:text-mint text-xs mt-0.5 uppercase tracking-wide font-bold">
                            {app.sector}
                          </div>
                        </td>

                        {/* Motive / Tracks or Ask */}
                        <td className="py-4 px-5">
                          <div className="font-mono-data text-slate-700 dark:text-slate-300 text-xs max-w-xs truncate">
                            {activeCategory === 'student' ? app.motive || 'Delegate Registration' : app.currentAsk}
                          </div>
                          {activeCategory !== 'student' && app.totalFundingRaised && (
                            <div className="font-mono-data text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                              Raised: {app.totalFundingRaised}
                            </div>
                          )}
                        </td>

                        {/* Verification / MoU */}
                        <td className="py-4 px-5 max-w-[200px]">
                          <span
                            className={`text-xs leading-relaxed line-clamp-2 ${
                              app.mouComfortable?.toLowerCase().includes('comfortable') ||
                              app.mouComfortable?.toLowerCase().includes('verified') ||
                              app.status === 'PAYMENT_CONFIRMED'
                                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                                : 'text-amber-800 dark:text-amber-400 font-bold'
                            }`}
                          >
                            {app.mouComfortable || 'Registration Recorded'}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5">
                          <StatusBadge status={app.status} />
                        </td>

                        {/* Quick Actions */}
                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApp(app)
                            }}
                            className="px-3.5 py-1.5 rounded-full font-mono-data text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12241F] hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all inline-flex items-center gap-1.5 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-xs cursor-pointer"
                          >
                            <Eye size={12} className="text-emerald-700 dark:text-mint stroke-[2.5]" />
                            <span>REVIEW</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Application Detail Slide-Over Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={handleUpdateApplication}
          onDelete={handleDeleteApplication}
        />
      )}

      {/* User Profile Detail Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* New Application Modal */}
      {isCreateOpen && (
        <NewApplicationModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(application) => setApplications((current) => [application, ...current])}
        />
      )}
    </div>
  )
}
