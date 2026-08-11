'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Zap, Ticket, Mic2, LayoutGrid, X, Users, HelpCircle, Handshake, Image } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home', label: 'HOME', Icon: Home, sectionId: 'esummit-hero' },
  { id: 'events', label: 'EVENTS', Icon: Zap, sectionId: 'event-portfolio' },
  { id: 'register', label: 'REGISTER', Icon: Ticket, href: '/register', isCtA: true },
  { id: 'speakers', label: 'SPEAKERS', Icon: Mic2, sectionId: 'timeline' },
  { id: 'more', label: 'MORE', Icon: LayoutGrid, isMore: true },
]

const MORE_ITEMS = [
  { id: 'alumni', label: 'ALUMNI', Icon: Users, sectionId: 'alumni' },
  { id: 'gallery', label: 'GALLERY', Icon: Image, sectionId: 'gallery' },
  { id: 'sponsors', label: 'PARTNERS', Icon: Handshake, sectionId: 'sponsors' },
  { id: 'faq', label: 'FAQ', Icon: HelpCircle, sectionId: 'faq' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState('home')
  const [moreOpen, setMoreOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (window.__SCROLL_LOADER_ACTIVE__ === false) return false
      if (window.__SCROLL_LOADER_ACTIVE__ === true || document.body.classList.contains('loader-active')) return true
      return pathname === '/'
    }
    return pathname === '/'
  })

  // Listen to loader and modal state updates
  useEffect(() => {
    const checkState = () => {
      if (typeof window !== 'undefined') {
        setIsLoaderActive(Boolean(window.__SCROLL_LOADER_ACTIVE__ || document.body.classList.contains('loader-active')))
      }
    }
    checkState()

    const handleLoaderState = () => checkState()
    window.addEventListener('scroll-loader-state', handleLoaderState)

    const observer = new MutationObserver(() => {
      setModalOpen(document.body.classList.contains('modal-open'))
      checkState()
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => {
      window.removeEventListener('scroll-loader-state', handleLoaderState)
      observer.disconnect()
    }
  }, [])

  if (pathname === '/register' || pathname === '/speakers') return null
  if (modalOpen || isLoaderActive) return null

  const navigate = (sectionId: string, itemId: string) => {
    setActiveId(itemId)
    setMoreOpen(false)
    window.dispatchEvent(
      new CustomEvent('trigger-chevron-transition', {
        detail: sectionId === 'esummit-hero' ? { targetTop: true } : { targetId: sectionId },
      })
    )
  }

  return (
    <>
      {/* Backdrop for More popup */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            key="more-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* More popup — slides up above the bottom nav */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            key="more-popup"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden fixed bottom-[72px] left-3 right-3 z-[3100] rounded-2xl overflow-hidden border border-white/10"
            style={{ background: 'rgba(10, 17, 14, 0.96)', backdropFilter: 'blur(24px)' }}
          >
            {/* Popup header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <span className="text-[10px] font-black tracking-[0.2em] text-white/40 font-mono-data">SECTIONS</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* Grid of more items */}
            <div className="grid grid-cols-2 gap-px bg-white/8 p-px">
              {MORE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.sectionId, item.id)}
                  className="flex items-center gap-3 px-5 py-4 bg-[#0A110E] hover:bg-white/5 transition-colors text-left group"
                >
                  <item.Icon
                    size={16}
                    strokeWidth={1.5}
                    className="text-white/30 group-hover:text-mint transition-colors shrink-0"
                  />
                  <span className="text-[10px] font-black tracking-[0.15em] text-white/50 group-hover:text-white transition-colors font-mono-data">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[3200] border-t border-white/10"
        style={{ background: 'rgba(10, 17, 14, 0.96)', backdropFilter: 'blur(24px)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-2 h-14">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id
            const isMore = item.isMore
            const isCta = item.isCtA

            if (isCta) {
              return (
                <Link
                  key={item.id}
                  href={item.href!}
                  className="flex flex-col items-center justify-center -mt-4 px-3 py-2.5 rounded-full bg-mint text-[#07130F] font-black text-[9px] tracking-widest font-mono-data shadow-[0_0_20px_rgba(126,211,33,0.4)] border border-[#9FE84A]/50 gap-1"
                  onClick={() => setActiveId(item.id)}
                  aria-label="Register now"
                >
                  <item.Icon size={16} strokeWidth={2.5} />
                  {item.label}
                </Link>
              )
            }

            if (isMore) {
              return (
                <button
                  key={item.id}
                  onClick={() => setMoreOpen((o) => !o)}
                  className="flex flex-col items-center gap-1 px-2 py-2"
                  aria-label="More sections"
                  aria-expanded={moreOpen}
                >
                  <item.Icon
                    size={18}
                    strokeWidth={1.5}
                    className={`transition-colors duration-200 ${moreOpen ? 'text-mint' : 'text-white/30'}`}
                  />
                  <span className={`text-[9px] font-black tracking-widest font-mono-data transition-colors duration-200 ${moreOpen ? 'text-mint' : 'text-white/30'}`}>
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.sectionId!, item.id)}
                className="flex flex-col items-center gap-1 px-2 py-2"
                aria-label={`Go to ${item.label}`}
              >
                <item.Icon
                  size={18}
                  strokeWidth={1.5}
                  className={`transition-colors duration-200 ${isActive ? 'text-mint' : 'text-white/30'}`}
                />
                <span className={`text-[9px] font-black tracking-widest font-mono-data transition-colors duration-200 ${isActive ? 'text-mint' : 'text-white/30'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
