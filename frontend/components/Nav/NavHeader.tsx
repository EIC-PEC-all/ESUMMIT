'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Ticket, Download, User } from 'lucide-react'
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
            ? `nav-subpage-bar top-[var(--announcement-height,0px)] left-0 w-full rounded-none border-b border-border-panel border-t-0 border-x-0 bg-panel/90 backdrop-blur-2xl shadow-xl ${
                menuOpen ? 'lg:pr-[380px]' : ''
              }`
            : `nav-floating-pill top-[calc(var(--announcement-height,0px)+0.5rem)] left-1/2 w-[calc(100%-1rem)] max-w-7xl rounded-full sm:top-[calc(var(--announcement-height,0px)+0.85rem)] sm:w-[calc(100%-2rem)] bg-panel/90 border border-border-panel backdrop-blur-2xl shadow-xl ${
                menuOpen
                  ? 'lg:w-[calc(100%-380px-3rem)] -translate-x-1/2 lg:-translate-x-[calc(50%+190px)]'
                  : 'lg:w-[calc(100%-3rem)] -translate-x-1/2'
              }`
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
      <div className={`flex items-center justify-between h-14 sm:h-16 px-4 sm:px-8 ${isSubPage ? 'max-w-7xl mx-auto w-full' : ''}`}>
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 group py-1"
          aria-label="PEC E-Summit '26 — Home"
        >
          <div className="nav-logo-badge flex items-center px-3 sm:px-3.5 py-1 rounded-full transition-all duration-200 dark:bg-transparent bg-[#061A12] border border-emerald-500/30 dark:border-transparent">
            <Image
              src="/esummit-logo.png"
              alt="PEC E-Summit '26 Logo"
              width={256}
              height={50}
              priority
              className="h-5.5 sm:h-7.5 md:h-8 w-auto max-w-[150px] sm:max-w-[220px] md:max-w-[260px] object-contain group-hover:scale-[1.02] group-hover:brightness-110 transition-all duration-200"
            />
          </div>
        </Link>

        {/* Center: Push buttons to right */}
        <div className="hidden lg:flex flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!menuOpen && (
            <>
              <Magnetic strength={0.3}>
                <a
                  href="/e-summit-brochure.pdf"
                  target="_blank"
                  className="hidden sm:inline-flex btn-dark-gradient min-h-[40px] sm:min-h-[44px] h-10 sm:h-11 box-border items-center justify-center gap-1.5 px-4 sm:px-6 rounded-full font-mono-data text-[11px] sm:text-xs font-bold uppercase tracking-wider leading-none transition-all duration-200 text-white cursor-pointer hover:border-mint"
                  aria-label="Download E-Summit Brochure"
                >
                  <Download size={14} className="text-mint" />
                  <span>BROCHURE</span>
                </a>
              </Magnetic>

              <Magnetic strength={0.3}>
                {isRegistered ? (
                  <Link
                    href="/profile"
                    className="btn-mint-gradient min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-6 rounded-full font-mono-data text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none transition-all duration-200 text-void cursor-pointer hover:scale-105"
                    id="nav-profile-btn"
                    aria-label="View My Profile and Passes"
                  >
                    <User size={13} className="text-void stroke-[2.5]" />
                    <span>PROFILE</span>
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    onMouseEnter={prefetchRegister}
                    onTouchStart={prefetchRegister}
                    onFocus={prefetchRegister}
                    className="btn-mint-gradient min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 box-border inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-6 rounded-full font-mono-data text-[10px] sm:text-xs font-black uppercase tracking-wider leading-none transition-all duration-200 text-void cursor-pointer"
                    id="nav-passes-btn"
                    aria-label="Register for E-Summit Passes"
                  >
                    <Ticket size={13} className="text-void stroke-[2.5]" />
                    <span>REGISTER</span>
                  </Link>
                )}
              </Magnetic>
            </>
          )}

          {/* Theme Toggle */}
          <Magnetic strength={0.3}>
            <ThemeToggle variant="icon" />
          </Magnetic>

          {/* Hamburger Trigger Button */}
          <Magnetic strength={0.3}>
            <button
              ref={headerButtonRef}
              className="btn-dark-gradient min-h-[36px] sm:min-h-[44px] h-9 sm:h-11 box-border inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider leading-none cursor-pointer"
              onClick={onToggleMenu}
              aria-label={menuOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              aria-expanded={menuOpen}
            >
              <Menu size={15} />
              <span className="hidden sm:inline">{menuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </header>
  )
}
