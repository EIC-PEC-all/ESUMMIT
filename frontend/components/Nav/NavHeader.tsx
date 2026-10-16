'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Ticket, User } from 'lucide-react'
import Magnetic from '@/components/Common/Magnetic'
import ThemeToggle from '@/components/Common/ThemeToggle'
import { prefetchRegister } from '@/lib/prefetch'

export interface NavHeaderProps {
  showHeader: boolean
  menuOpen: boolean
  planCount: number
  isRegistered?: boolean
  isModalOrLoaderOpen?: boolean
  isSubPage?: boolean
  onToggleMenu: () => void
  headerButtonRef: React.RefObject<HTMLButtonElement>
}

export default function NavHeader({
  showHeader,
  menuOpen,
  planCount,
  isRegistered = false,
  isModalOrLoaderOpen = false,
  isSubPage = false,
  onToggleMenu,
  headerButtonRef,
}: NavHeaderProps) {
  return (
    <header
      className={`fixed z-[2500] transition-all duration-300 ease-out 
        ${
          isSubPage
            ? `nav-subpage-bar top-[var(--announcement-height,0px)] left-0 w-full rounded-none border-b border-border-panel border-t-0 border-x-0 bg-panel/90 backdrop-blur-2xl shadow-xl`
            : `nav-floating-pill top-[calc(var(--announcement-height,0px)+0.5rem)] left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-7xl rounded-full sm:top-[calc(var(--announcement-height,0px)+0.85rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-3rem)] bg-panel/90 border border-border-panel backdrop-blur-2xl shadow-xl`
        }
        text-primary
        ${isModalOrLoaderOpen ? 'opacity-0 pointer-events-none' : ''}
        ${
          showHeader
            ? 'translate-y-0 opacity-100'
            : isSubPage
              ? 'max-sm:translate-y-0 max-sm:opacity-100 max-sm:pointer-events-auto sm:-translate-y-full sm:opacity-0 sm:pointer-events-none'
              : 'max-sm:translate-y-0 max-sm:opacity-100 max-sm:pointer-events-auto sm:-translate-y-[150%] sm:opacity-0 sm:pointer-events-none'
        }`}
    >
      <div className={`flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 md:px-8 ${isSubPage ? 'max-w-7xl mx-auto w-full' : ''}`}>
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 group py-1"
          aria-label="PEC E-Summit '26 — Home"
        >
          <div className="nav-logo-badge flex items-center px-2 sm:px-3.5 py-1 rounded-full transition-all duration-200 dark:bg-transparent bg-[#061A12] border border-emerald-500/30 dark:border-transparent">
            <Image
              src="/esummit-logo.png"
              alt="PEC E-Summit '26 Logo"
              width={256}
              height={50}
              priority
              className="h-5 sm:h-7 md:h-8 w-auto max-w-[115px] sm:max-w-[200px] md:max-w-[240px] object-contain group-hover:scale-[1.02] transition-all duration-200"
            />
          </div>
        </Link>

        {/* Center: Push buttons to right */}
        <div className="flex-1" />

        {/* Right: Actions — Brochure (desktop), Profile & Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">


          <Magnetic strength={0.3}>
            {isRegistered ? (
              <Link
                href="/profile"
                className="btn-mint-gradient min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 rounded-full font-mono-data text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none text-void cursor-pointer hover:scale-105 shrink-0 shadow-sm"
                id="nav-profile-btn"
                aria-label="View My Profile and Passes"
              >
                <User size={12} className="text-void stroke-[2.5]" />
                <span>PROFILE</span>
              </Link>
            ) : (
              <Link
                href="/register"
                className="btn-mint-gradient min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 rounded-full font-mono-data text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none text-void cursor-pointer hover:scale-105 shrink-0 shadow-sm"
                id="nav-register-btn"
                aria-label="Register for Passes"
              >
                <Ticket size={12} className="text-void stroke-[2.5]" />
                <span>REGISTER</span>
              </Link>
            )}
          </Magnetic>

          {/* Hamburger Trigger Button */}
          <Magnetic strength={0.3}>
            <button
              ref={headerButtonRef}
              className="btn-dark-gradient min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider leading-none cursor-pointer shrink-0 shadow-sm"
              onClick={onToggleMenu}
              aria-label={menuOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              aria-expanded={menuOpen}
            >
              <Menu size={14} />
              <span className="hidden sm:inline">{menuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </header>
  )
}
