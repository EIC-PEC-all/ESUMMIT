'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, RefreshCw, ExternalLink, Database } from 'lucide-react'

interface HeaderProps {
  totalCount: number
  onRefresh: () => void
  isRefreshing: boolean
}

export function Header({ totalCount, onRefresh, isRefreshing }: HeaderProps) {
  const handleExport = () => {
    window.open('/api/applications/export', '_blank')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060D0B]/85 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand & Emblem */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-inner">
            <Image
              src="/esummit-mark.png"
              alt="PEC E-Summit Mark"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display text-base sm:text-xl font-black uppercase tracking-tight text-white leading-none">
                E-SUMMIT &apos;26
              </span>
              <span className="font-mono-data text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-mint/10 text-mint border border-mint/20">
                CMS PORTAL
              </span>
            </div>
            <p className="font-mono-data text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              STARTUP PASSES &amp; FUNDING CONCLAVE RESPONSES
            </p>
          </div>
        </div>

        {/* Right: Live Connection & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live DB Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1C18] border border-white/10 text-[11px] font-mono-data text-gray-300 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <Database size={13} className="text-mint" />
            <span>{totalCount} LIVE RESPONSES</span>
          </div>

          {/* Visit Main Site */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-dark-gradient min-h-[38px] h-9 sm:h-10 box-border items-center justify-center gap-1.5 px-3.5 sm:px-4 rounded-full font-mono-data text-[11px] font-bold uppercase tracking-wider leading-none text-white cursor-pointer hover:border-mint"
          >
            <span>LIVE SITE</span>
            <ExternalLink size={12} className="text-mint" />
          </a>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-dark-gradient min-h-[38px] h-9 sm:h-10 box-border inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 rounded-full font-mono-data text-[11px] font-bold uppercase tracking-wider leading-none cursor-pointer disabled:opacity-50"
            title="Refresh submissions"
          >
            <RefreshCw size={13} className={`text-mint ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">REFRESH</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExport}
            className="btn-mint-gradient min-h-[38px] h-9 sm:h-10 box-border inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 rounded-full font-mono-data text-[11px] font-black uppercase tracking-wider leading-none text-[#060D0B] cursor-pointer hover:scale-105 active:scale-98 shadow-lg"
          >
            <Download size={13} className="stroke-[2.5]" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>
    </header>
  )
}
