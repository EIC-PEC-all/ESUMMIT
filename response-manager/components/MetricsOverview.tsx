import React from 'react'
import { FundingApplication } from '@/lib/types'
import { FileCheck, Award, Handshake, TrendingUp, Gem, Crown, Shield } from 'lucide-react'

interface MetricsOverviewProps {
  applications: FundingApplication[]
}

export function MetricsOverview({ applications }: MetricsOverviewProps) {
  const total = applications.length

  const shortlisted = applications.filter(
    (a) =>
      a.status === 'SHORTLISTED' ||
      a.status === 'MOU_SENT' ||
      a.status === 'MOU_ACCEPTED' ||
      a.status === 'PAYMENT_CONFIRMED'
  ).length

  const diamondCount = applications.filter((a) => a.passTier === 'diamond').length
  const goldCount = applications.filter((a) => a.passTier === 'gold').length
  const silverCount = applications.filter((a) => a.passTier === 'silver').length

  const comfortableWithMou = applications.filter((a) =>
    a.mouComfortable?.toLowerCase().includes('comfortable')
  ).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {/* Metric 1: Total Submissions */}
      <div className="p-6 rounded-3xl bg-[#081310] border border-white/10 hover:border-mint/30 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-mint/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            TOTAL SUBMISSIONS
          </span>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-mint">
            <FileCheck size={18} />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-2">
          {total}
        </div>
        <div className="flex items-center gap-2 font-mono-data text-[11px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-mint" />
          <span>Real-time from MongoDB</span>
        </div>
      </div>

      {/* Metric 2: Shortlisted Startups */}
      <div className="p-6 rounded-3xl bg-[#081310] border border-white/10 hover:border-purple-400/30 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
            INVESTOR SHORTLIST
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Award size={18} />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-purple-300 tracking-tight leading-none mb-2">
          {shortlisted}
        </div>
        <div className="font-mono-data text-[11px] text-gray-400">
          {total > 0 ? `${Math.round((shortlisted / total) * 100)}% SELECTION RATE` : '0% SELECTION'}
        </div>
      </div>

      {/* Metric 3: Pass Tiers Breakdown */}
      <div className="p-6 rounded-3xl bg-[#081310] border border-white/10 hover:border-amber-400/30 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            PASS TIERS APPLIED
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-3 mb-2 font-mono-data">
          <span className="text-sm font-bold text-cyan-300 flex items-center gap-1">
            <Gem size={12} /> {diamondCount}D
          </span>
          <span className="text-sm font-bold text-amber-300 flex items-center gap-1">
            <Crown size={12} /> {goldCount}G
          </span>
          <span className="text-sm font-bold text-emerald-300 flex items-center gap-1">
            <Shield size={12} /> {silverCount}S
          </span>
        </div>
        <div className="font-mono-data text-[11px] text-gray-400">
          Diamond (₹8K) • Gold (₹3.5K) • Silver (₹1K)
        </div>
      </div>

      {/* Metric 4: Fee & MoU Readiness */}
      <div className="p-6 rounded-3xl bg-[#081310] border border-white/10 hover:border-emerald-400/30 transition-all duration-300 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            MOU READINESS
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Handshake size={18} />
          </div>
        </div>
        <div className="font-display text-4xl sm:text-5xl font-black text-emerald-300 tracking-tight leading-none mb-2">
          {comfortableWithMou}
        </div>
        <div className="font-mono-data text-[11px] text-gray-400">
          {total > 0 ? `${Math.round((comfortableWithMou / total) * 100)}% FEE COMFORTABLE` : 'READY TO PROCEED'}
        </div>
      </div>
    </div>
  )
}
