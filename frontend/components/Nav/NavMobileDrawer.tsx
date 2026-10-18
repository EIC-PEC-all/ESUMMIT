'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUpRight, Ticket, LogOut, LogIn } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/Common/ThemeToggle'
import { FEST_META } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import { STORAGE_KEYS } from '@/lib/constants'

export interface NavItem {
  label: string
  code: string
  href: string
  sectionId: string | null
}

export interface NavMobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  pathname: string
  navItems: NavItem[]
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => void
  isRegistered?: boolean
}

export default function NavMobileDrawer({
  isOpen,
  onClose,
  pathname,
  navItems,
  onItemClick,
  isRegistered = false,
}: NavMobileDrawerProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement>(null)

  const handleDrawerSignOut = async () => {
    try {
      const { signOut: nextAuthSignOut } = await import('next-auth/react')
      await nextAuthSignOut({ redirect: false }).catch(() => {})
    } catch {}
    try {
      await logout()
    } catch {}
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem('pec_summit_auth_token')
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS)
      localStorage.removeItem(STORAGE_KEYS.PASS_APPLICATIONS)
      localStorage.removeItem(STORAGE_KEYS.ATTENDEE_PROFILE)
      localStorage.removeItem(STORAGE_KEYS.CHECKOUT_DRAFT)
      sessionStorage.clear()
    } catch {}
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('pec_auth_changed'))
    onClose()
    if (pathname === '/profile') {
      router.push('/')
    }
  }

  // Escape key handler & focus trapping
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-backdrop backdrop-blur-md z-[11000] cursor-pointer"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Right-Side Off-Canvas Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full lg:w-[380px] z-[11001] bg-panel text-primary shadow-2xl flex flex-col justify-between p-6 sm:p-8 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] overflow-y-auto border-l border-border-panel backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu Drawer"
          >
            {/* Drawer Top Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-border-subtle mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-mint/15 border border-mint/30 flex items-center justify-center p-1 shadow-inner">
                    <Image
                      src="/esummit-mark.png"
                      alt="PEC E-Summit Emblem"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-mono-data text-xs font-black uppercase tracking-[0.25em] text-primary">
                    E-SUMMIT &apos;26
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle variant="icon" className="shadow-sm" />
                  <button
                    onClick={onClose}
                    className="min-h-[44px] min-w-[44px] rounded-full bg-panel-alt text-primary font-bold flex items-center justify-center border border-border-subtle hover:border-mint hover:text-mint transition-all cursor-pointer shadow-sm"
                    aria-label="Close navigation sidebar"
                  >
                    <X size={20} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-3" aria-label="Sidebar navigation">
                {navItems.map((item) => {
                  const targetHref = pathname === '/' && item.sectionId ? `#${item.sectionId}` : item.href
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.label}
                      href={targetHref}
                      onClick={(e) => onItemClick(e, item)}
                      className="group flex items-baseline justify-between py-2 border-b border-border-subtle transition-all"
                    >
                      <span
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight transition-colors ${
                          isActive
                            ? 'text-mint underline decoration-mint decoration-4 underline-offset-8'
                            : 'text-primary/90 group-hover:text-mint group-hover:underline decoration-mint/50 underline-offset-4'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono-data text-xs text-muted group-hover:text-mint transition-colors font-black tracking-widest">
                        {item.code}
                      </span>
                    </Link>
                  )
                })}

                {/* Profile Navigation Link (Shown for registered users) */}
                {isRegistered && (
                  <div className="group flex items-baseline justify-between py-2 border-b border-border-subtle transition-all">
                    <div className="flex items-center gap-3">
                      <Link
                        href="/profile"
                        onClick={onClose}
                        className="inline-block"
                      >
                        <span
                          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight transition-colors ${
                            pathname === '/profile'
                              ? 'text-mint underline decoration-mint decoration-4 underline-offset-8'
                              : 'text-primary/90 group-hover:text-mint group-hover:underline decoration-mint/50 underline-offset-4'
                          }`}
                        >
                          PROFILE
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleDrawerSignOut}
                        className="p-1.5 -mb-1 rounded-full text-muted hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer border-none bg-transparent"
                        title="Sign Out"
                        aria-label="Sign Out"
                      >
                        <LogOut size={22} className="stroke-[2.5]" />
                      </button>
                    </div>
                    <span className="font-mono-data text-xs text-muted group-hover:text-mint transition-colors font-black tracking-widest">
                      08
                    </span>
                  </div>
                )}
              </nav>

              {/* Drawer Action CTAs (Shown for non-registered users only) */}
              {!isRegistered && (
                <div className="pt-4 flex flex-col gap-2.5">
                  <Link
                    href="/login?redirect=/passes"
                    onClick={onClose}
                    className="w-full py-3 px-5 rounded-full btn-mint-gradient text-void font-mono-data text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.01]"
                  >
                    <Ticket size={14} className="stroke-[2.5]" />
                    <span>REGISTER FOR PASSES</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono-data text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                  >
                    <LogIn size={13} className="text-mint" />
                    <span>SIGN IN / ATTENDEE PORTAL</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Socials & Meta */}
            <div className="pt-6 border-t border-border-subtle mt-6 flex flex-col gap-5">
              <div>
                <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-muted font-black block mb-2.5">
                  SOCIALS &amp; CONNECT
                </span>
                <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono-data text-xs text-secondary font-bold">
                  <a
                    href={FEST_META.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-mint transition-colors min-h-[44px] inline-flex items-center gap-1 py-2"
                    aria-label="E-Cell PEC on Instagram"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight size={12} />
                  </a>
                  <a
                    href={FEST_META.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-mint transition-colors min-h-[44px] inline-flex items-center gap-1 py-2"
                    aria-label="E-Cell PEC on LinkedIn"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight size={12} />
                  </a>
                  <a
                    href={FEST_META.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-mint transition-colors min-h-[44px] inline-flex items-center gap-1 py-2"
                    aria-label="E-Cell PEC on Twitter"
                  >
                    <span>Twitter</span>
                    <ArrowUpRight size={12} />
                  </a>
                  <a
                    href="mailto:eic@pec.edu.in"
                    className="hover:text-mint transition-colors min-h-[44px] inline-flex items-center gap-1 py-2"
                    aria-label="Email EIC PEC"
                  >
                    <span>eic@pec.edu.in</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono-data text-muted font-bold pt-2 border-t border-border-subtle">
                <span>{FEST_META.dates}</span>
                <span>{FEST_META.venue}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
