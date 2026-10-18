import React from 'react'
import { UsersMetricsStats } from '@/lib/types'
import { Users, Radio, Ticket, ShieldCheck } from 'lucide-react'

interface UserMetricsOverviewProps {
  stats: UsersMetricsStats
  activeFilter?: string
  onFilterActiveChange?: (filter: string) => void
}

export function UserMetricsOverview({
  stats,
}: UserMetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {/* Metric 1: Total Registered Users */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            TOTAL USERS
          </span>
          <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-mint">
            <Users size={18} />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
          {stats.totalUsers}
        </div>
        <div className="flex items-center gap-2 font-mono-data text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Registered accounts in database</span>
        </div>
      </div>

      {/* Metric 2: Currently Logged In (Active Sessions) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1C18] border border-emerald-500/30 dark:border-mint/30 hover:border-emerald-500/50 dark:hover:border-mint/50 transition-all duration-300 shadow-sm relative overflow-hidden group bg-gradient-to-br from-emerald-500/[0.03] to-transparent">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-mint">
              LOGGED IN NOW
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono-data font-black bg-emerald-500/15 text-emerald-700 dark:text-mint border border-emerald-500/30 animate-pulse">
              LIVE
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-mint">
            <Radio size={18} className="animate-pulse" />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-emerald-700 dark:text-mint tracking-tight leading-none mb-2 flex items-baseline gap-2">
          <span>{stats.activeLoggedInUsers}</span>
          <span className="text-xs font-mono-data font-semibold text-slate-500 dark:text-slate-400 tracking-normal">
            / {stats.totalUsers} users
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono-data text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{stats.totalActiveSessions} valid JWT device sessions</span>
        </div>
      </div>

      {/* Metric 3: Pass Holders */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            PASS HOLDERS
          </span>
          <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-400">
            <Ticket size={18} />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
          {stats.usersWithPasses}
        </div>
        <div className="flex items-center gap-2 font-mono-data text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span>{stats.totalRegistrations} total summit pass registrations</span>
        </div>
      </div>

      {/* Metric 4: Profile Completion Rate */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            AUTHENTICATION HEALTH
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400">
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
          {stats.totalUsers > 0 ? `${Math.round((stats.activeLoggedInUsers / stats.totalUsers) * 100)}%` : '0%'}
        </div>
        <div className="flex items-center gap-2 font-mono-data text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Active user engagement ratio</span>
        </div>
      </div>
    </div>
  )
}
