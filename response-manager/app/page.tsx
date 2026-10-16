'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Header } from '@/components/Header'
import { MetricsOverview } from '@/components/MetricsOverview'
import { StatusBadge } from '@/components/StatusBadge'
import { ApplicationDetailModal } from '@/components/ApplicationDetailModal'
import { NewApplicationModal } from '@/components/NewApplicationModal'
import { FundingApplication } from '@/lib/types'
import {
  Search,
  Eye,
  Sparkles,
  Inbox,
  Plus,
  Briefcase,
  GraduationCap
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
  const [loading, setLoading] = useState<boolean>(true)
  const [activeCategory, setActiveCategory] = useState<'startup' | 'student'>('startup')
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [stageFilter, setStageFilter] = useState<string>('ALL')
  const [tierFilter, setTierFilter] = useState<string>('ALL')
  const [selectedApp, setSelectedApp] = useState<FundingApplication | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const fetchApplications = useCallback(async () => {
    try {
      setIsRefreshing(true)
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
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // Category counts
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

  // Client-side filtering & search
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

  return (
    <div className="manager-app min-h-screen">
      {/* Top Header */}
      <Header
        totalCount={activeApps.length}
        onRefresh={fetchApplications}
        isRefreshing={isRefreshing}
        category={activeCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ── Category Segmented Toggle ── */}
        <div className="flex items-center justify-start mb-6 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100 dark:bg-[#0D1C18] border border-slate-200 dark:border-white/10 shadow-md max-w-full flex-nowrap">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('startup')
                setTierFilter('ALL')
                setStageFilter('ALL')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeCategory === 'startup'
                  ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase size={14} className={activeCategory === 'startup' ? 'text-void stroke-[2.5]' : 'text-emerald-600 dark:text-mint'} />
              <span>STARTUP PASSES</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeCategory === 'startup'
                    ? 'bg-void text-mint'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {startupApps.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('student')
                setTierFilter('ALL')
                setStageFilter('ALL')
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeCategory === 'student'
                  ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap size={15} className={activeCategory === 'student' ? 'text-void stroke-[2.5]' : 'text-emerald-600 dark:text-mint'} />
              <span>STUDENT PASSES</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeCategory === 'student'
                    ? 'bg-void text-mint'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {studentApps.length}
              </span>
            </button>
          </div>
        </div>

        {/* ── Section Header ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
          <div>
            <span className="font-mono-data text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-mint flex items-center gap-2 mb-2">
              <Sparkles size={14} />
              {activeCategory === 'student' ? 'DELEGATE CMS PORTAL' : 'EXECUTIVE CMS PORTAL'}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">
              {activeCategory === 'student' ? (
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
              {activeCategory === 'student'
                ? 'DELEGATE ACCREDITATION • HACKATHON BUILDERS • ALL-ACCESS • ENTRY BADGES'
                : 'SCREENING • INVESTOR FIT • MOU WORKFLOW • OFFLINE DIRECT PAYMENTS'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="min-h-[42px] px-5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#0D1C18] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={14} className="text-emerald-700 dark:text-mint stroke-[2.5]" />
              <span>{activeCategory === 'student' ? 'ADD DELEGATE' : 'ADD APPLICATION'}</span>
            </button>
          </div>
        </div>

        {/* ── Metrics Overview Cards ── */}
        <MetricsOverview applications={activeApps} category={activeCategory} />

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
                  activeCategory === 'student'
                    ? 'Search student, college, email, pass ID...'
                    : 'Search startup, founder, email, sector, ID...'
                }
                className="w-full pl-11 pr-5 py-2.5 rounded-full bg-slate-50 dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-body focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0D1C18] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
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
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs no-scrollbar flex-nowrap">
            {STATUS_FILTERS.map((filter) => {
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
            })}
          </div>
        </div>

        {/* ── Applications / Registrations List Table ── */}
        <div className="rounded-3xl bg-white dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
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
                      </td>

                      {/* Founder / Student */}
                      <td className="py-4 px-5">
                        <div className="text-slate-900 dark:text-white font-bold text-sm">
                          {activeCategory === 'student' ? app.founderName : app.founderName}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono-data mt-0.5 font-medium">
                          {app.email}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono-data font-medium">
                          {app.phone}
                        </div>
                      </td>

                      {/* College / Organization */}
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#12241F] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-[11px] font-bold block w-fit mb-1 truncate max-w-[200px]">
                          {activeCategory === 'student'
                            ? app.startupName || app.organization || 'PEC Chandigarh'
                            : app.role || app.stage || 'Founder'}
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono-data font-medium line-clamp-1">
                          {activeCategory === 'student' ? 'Student Delegate' : app.organization || app.sector || 'General'}
                        </span>
                      </td>

                      {/* Tracks / Motive */}
                      <td className="py-4 px-5 font-mono-data max-w-[220px]">
                        <span className="text-emerald-700 dark:text-mint font-bold text-xs block line-clamp-2">
                          {activeCategory === 'student'
                            ? app.motive || app.stage || 'General Sessions'
                            : app.motive || (app.currentAsk && app.currentAsk !== 'N/A' ? `Ask: ${app.currentAsk}` : 'Networking & Collaboration')}
                        </span>
                        {app.currentAsk && app.currentAsk !== 'N/A' && app.motive && activeCategory !== 'student' && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            Ask: {app.currentAsk}
                          </span>
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
      {isCreateOpen && (
        <NewApplicationModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(application) => setApplications((current) => [application, ...current])}
        />
      )}
    </div>
  )
}
