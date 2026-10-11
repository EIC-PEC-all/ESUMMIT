'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, ExternalLink } from 'lucide-react'
import { useSiteConfig } from '@/hooks/useSummitData'

const STORAGE_KEY = 'pec_summit_dismissed_announcement'

export default function AnnouncementBanner() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [dismissedText, setDismissedText] = useState<string | null>(null)
  const { siteConfig } = useSiteConfig()

  const message = siteConfig?.announcementText?.trim() || ''
  const linkUrl = siteConfig?.announcementLink?.trim() || ''

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setDismissedText(saved)
      }
    } catch {
      // non-critical
    }
  }, [])

  // Stays dismissed in localStorage unless a new announcement message is posted
  const isVisible = Boolean(
    mounted &&
    pathname === '/' &&
    message.length > 0 &&
    dismissedText !== message
  )

  useEffect(() => {
    if (isVisible) {
      document.documentElement.style.setProperty('--announcement-height', '34px')
    } else {
      document.documentElement.style.setProperty('--announcement-height', '0px')
    }
  }, [isVisible])

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, message)
    } catch {
      // non-critical
    }
    setDismissedText(message)
    document.documentElement.style.setProperty('--announcement-height', '0px')
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="Live Summit Announcement"
      className="fixed top-0 left-0 right-0 h-[34px] z-[3500] bg-[#07130F]/95 backdrop-blur-md border-b border-mint/30 text-white flex items-center shadow-lg transition-all duration-300 select-none"
    >
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 text-xs">
        {/* Left: Pulsing Live Indicator + Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
          </span>
          <span className="font-mono-data text-[9px] font-black uppercase tracking-widest text-mint px-2 py-0.5 rounded bg-mint/10 border border-mint/20">
            LIVE BROADCAST
          </span>
        </div>

        {/* Center: Message Text with high readability */}
        <div className="flex-1 overflow-hidden flex items-center justify-center sm:justify-start gap-2">
          <p className="font-mono-data text-[11px] sm:text-xs text-neutral-200 truncate font-semibold tracking-wide text-center sm:text-left">
            {message}
          </p>
          {linkUrl && (
            <Link
              href={linkUrl}
              className="text-mint hover:underline font-mono text-[10px] uppercase font-bold shrink-0 inline-flex items-center gap-0.5"
            >
              <span>Take Action &rarr;</span>
            </Link>
          )}
        </div>

        {/* Right: Close Action */}
        <button
          type="button"
          onClick={handleDismiss}
          className="min-h-[44px] min-w-[44px] p-2 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          title="Dismiss Announcement"
          aria-label="Dismiss Announcement"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  )
}
