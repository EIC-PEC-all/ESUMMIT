'use client'

import React from 'react'
import Image from 'next/image'
import { Download, RefreshCw, ExternalLink, Database } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  totalCount: number
  onRefresh: () => void
  isRefreshing: boolean
  category?: 'startup' | 'student' | 'users'
}

export function Header({ totalCount, onRefresh, isRefreshing, category = 'startup' }: HeaderProps) {
  const handleExport = () => {
    if (category === 'users') {
      window.open('/api/users/export', '_blank')
    } else {
      window.open(`/api/applications/export?category=${category}`, '_blank')
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 bg-white/95 dark:bg-[#0D1C18]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand & Emblem */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center bg-[#061A12] border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-sm">
            <Image
              src="/esummit-logo.png"
              alt="PEC E-Summit '26"
              width={160}
              height={32}
              className="h-6 sm:h-7 w-auto object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono-data text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-mint border-emerald-200 dark:border-emerald-500/25">
                CMS PORTAL
              </span>
            </div>
            <p className="font-mono-data text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-500 dark:text-slate-400">
              {category === 'users'
                ? 'AUTHENTICATED USER DIRECTORY • ACTIVE SESSIONS & PROFILES'
                : category === 'student'
                ? 'STUDENT & BUILDER PASSES • ATTENDEE RESPONSES'
                : 'STARTUP PASSES & FUNDING CONCLAVE RESPONSES'}
            </p>
          </div>
        </div>

        {/* Right: Live Connection & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live DB Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/10 text-[11px] font-mono-data font-bold uppercase tracking-wider bg-slate-50 dark:bg-[#12241F] text-slate-800 dark:text-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database size={13} className="text-emerald-700 dark:text-mint" />
            <span>
              {category === 'users'
                ? `${totalCount} REGISTERED USERS`
                : `${totalCount} LIVE RESPONSES`}
            </span>
          </div>

          <ThemeToggle />

          {/* Visit Main Site */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex min-h-[38px] h-9 sm:h-10 box-border items-center justify-center gap-1.5 px-3.5 sm:px-4 rounded-full font-mono-data text-[11px] font-bold uppercase tracking-wider leading-none cursor-pointer border border-slate-200 dark:border-white/10 transition-all bg-white dark:bg-[#12241F] text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-xs"
          >
            <span>LIVE SITE</span>
            <ExternalLink size={12} className="text-emerald-700 dark:text-mint" />
          </a>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="min-h-[38px] h-9 sm:h-10 box-border inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 rounded-full font-mono-data text-[11px] font-bold uppercase tracking-wider leading-none cursor-pointer border border-slate-200 dark:border-white/10 transition-all bg-white dark:bg-[#12241F] text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint shadow-xs disabled:opacity-50"
            title="Refresh submissions"
          >
            <RefreshCw size={13} className={`text-emerald-700 dark:text-mint ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">REFRESH</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExport}
            className="min-h-[38px] h-9 sm:h-10 box-border inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 rounded-full font-mono-data text-[11px] font-black uppercase tracking-wider leading-none bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-mint dark:text-[#060D0B] cursor-pointer hover:scale-105 active:scale-98 shadow-md border dark:border-emerald-400/40 border-transparent transition-all"
          >
            <Download size={13} className="stroke-[2.5]" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>
    </header>
  )
}
