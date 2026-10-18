'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Ticket, User, Download } from 'lucide-react'
import Magnetic from '@/components/Common/Magnetic'
import ThemeToggle from '@/components/Common/ThemeToggle'
import { BROCHURE_URL } from '@/lib/siteConfig'

export interface NavHeaderProps {
  showHeader: boolean
  menuOpen: boolean
  planCount: number
  isLoggedIn?: boolean
  isRegistered?: boolean
  isModalOrLoaderOpen?: boolean
  isSubPage?: boolean
  isHeroActive?: boolean
  onToggleMenu: () => void
  headerButtonRef: React.RefObject<HTMLButtonElement>
}

export default function NavHeader({
  showHeader,
  menuOpen,
  planCount,
  isLoggedIn = false,
  isRegistered = false,
  isModalOrLoaderOpen = false,
  isSubPage = false,
  isHeroActive = false,
  onToggleMenu,
  headerButtonRef,
}: NavHeaderProps) {
  return (
    <header
      data-nav-dark={isHeroActive ? 'true' : undefined}
      className={`fixed z-[2500] transition-all duration-500 ease-out 
        ${
          isSubPage
            ? `nav-subpage-bar top-[var(--announcement-height,0px)] left-0 w-full rounded-none border-b border-border-panel border-t-0 border-x-0 bg-panel/90 backdrop-blur-2xl shadow-xl text-primary`
            : `nav-floating-pill top-[calc(var(--announcement-height,0px)+0.5rem)] left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-7xl rounded-full sm:top-[calc(var(--announcement-height,0px)+0.85rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-3rem)] backdrop-blur-2xl shadow-xl transition-all duration-500 ${
                isHeroActive
                  ? 'bg-[#060D0B]/85 border border-white/15 text-white shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
                  : 'bg-panel/90 border border-border-panel text-primary'
              }`
        }
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
          <div
            className={`nav-logo-badge flex items-center px-2 sm:px-3.5 py-1 rounded-full transition-all duration-300 ${
              isHeroActive
                ? '!bg-transparent !border-transparent !shadow-none'
                : 'dark:bg-transparent bg-[#061A12] border border-emerald-500/30 dark:border-transparent'
            }`}
          >
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

        {/* Right: Actions — Profile/Register, Brochure, Theme Toggle & Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Download Brochure Button */}
          <Magnetic strength={0.3}>
            <a
              href={BROCHURE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`!hidden lg:!inline-flex min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border items-center justify-center gap-1.5 px-3 sm:px-4 rounded-full font-mono-data text-[10px] sm:text-xs font-bold uppercase tracking-wider leading-none shrink-0 shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer ${
                isHeroActive
                  ? 'bg-white/10 hover:bg-white/20 text-white keep-white border border-white/20'
                  : 'btn-dark-gradient'
              }`}
              id="nav-brochure-btn"
              aria-label="Download E-Summit Brochure PDF"
            >
              <Download size={13} className={`${isHeroActive ? 'text-[#74FB44]' : 'text-mint'} shrink-0`} />
              <span className={isHeroActive ? 'text-white keep-white' : ''}>BROCHURE</span>
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            {isLoggedIn ? (
              <Link
                href="/passes"
                className="btn-mint-gradient min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 rounded-full font-mono-data text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none text-void cursor-pointer hover:scale-105 shrink-0 shadow-sm"
                id="nav-passes-btn"
                aria-label="View Summit Passes"
              >
                <Ticket size={12} className="text-void stroke-[2.5]" />
                <span>PASSES</span>
              </Link>
            ) : (
              <Link
                href="/login?redirect=/passes"
                className="btn-mint-gradient min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 rounded-full font-mono-data text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none text-void cursor-pointer hover:scale-105 shrink-0 shadow-sm"
                id="nav-register-btn"
                aria-label="Register / Sign In for Passes"
              >
                <Ticket size={12} className="text-void stroke-[2.5]" />
                <span>REGISTER</span>
              </Link>
            )}
          </Magnetic>

          {/* Theme Toggle Button */}
          <Magnetic strength={0.3}>
            <ThemeToggle variant="icon" />
          </Magnetic>

          {/* Hamburger Trigger Button */}
          <Magnetic strength={0.3}>
            <button
              ref={headerButtonRef}
              className={`min-h-[32px] sm:min-h-[38px] h-[32px] sm:h-[38px] box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider leading-none cursor-pointer shrink-0 shadow-sm transition-all duration-300 ${
                isHeroActive
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'btn-dark-gradient'
              }`}
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
