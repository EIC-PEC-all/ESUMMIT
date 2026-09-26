'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Ticket, Download } from 'lucide-react'
import Magnetic from '@/components/Common/Magnetic'
import { prefetchRegister } from '@/lib/prefetch'

export interface NavHeaderProps {
  showHeader: boolean
  menuOpen: boolean
  planCount: number
  onToggleMenu: () => void
  headerButtonRef: React.RefObject<HTMLButtonElement>
}

export default function NavHeader({
  showHeader,
  menuOpen,
  planCount,
  onToggleMenu,
  headerButtonRef,
}: NavHeaderProps) {
  return (
    <header
      className={`fixed z-[2500] transition-all duration-300 ease-out 
        top-[calc(var(--announcement-height,0px)+0.5rem)] left-1/2 w-[calc(100%-1rem)] max-w-7xl rounded-full sm:top-[calc(var(--announcement-height,0px)+0.85rem)] sm:w-[calc(100%-2rem)] 
        bg-[#0F1D17]/90 text-white backdrop-blur-2xl shadow-2xl border border-white/15
        ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'} 
        ${
          menuOpen
            ? 'lg:w-[calc(100%-380px-3rem)] -translate-x-1/2 lg:-translate-x-[calc(50%+190px)]'
            : 'lg:w-[calc(100%-3rem)] -translate-x-1/2'
        }`}
    >
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-8">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group py-1"
          aria-label="PEC E-Summit '26 — Home"
        >
          <Image
            src="/esummit-logo.png"
            alt="PEC E-Summit '26 Logo"
            width={180}
            height={55}
            priority
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,245,212,0.25)] group-hover:scale-[1.02] group-hover:brightness-110 transition-all duration-200"
          />
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
                <Link
                  href="/register"
                  onMouseEnter={prefetchRegister}
                  onTouchStart={prefetchRegister}
                  onFocus={prefetchRegister}
                  className="btn-mint-gradient min-h-[40px] sm:min-h-[44px] h-10 sm:h-11 box-border inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 rounded-full font-mono-data text-[11px] sm:text-xs font-black uppercase tracking-wider leading-none transition-all duration-200 text-void cursor-pointer"
                  id="nav-passes-btn"
                  aria-label="Register for E-Summit Passes"
                >
                  <Ticket size={14} className="text-void stroke-[2.5]" />
                  <span>REGISTER</span>
                </Link>
              </Magnetic>
            </>
          )}

          {/* Hamburger Trigger Button */}
          <Magnetic strength={0.3}>
            <button
              ref={headerButtonRef}
              className="btn-dark-gradient min-h-[40px] sm:min-h-[44px] h-10 sm:h-11 box-border inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider leading-none cursor-pointer"
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
