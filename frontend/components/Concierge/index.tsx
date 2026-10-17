'use client'
// components/Concierge/index.tsx
// Floating E-Summit PEC AI Concierge + "My Plan" Persistent Itinerary Drawer

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { X, Send, Bot, TrendingUp, ChevronDown, Calendar, Plus, Trash2, Bookmark, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useChatbot } from '@/hooks/useChatbot'
import { emitAgentEvent } from '@/lib/events'
import { TOAST_STYLE } from '@/lib/constants'
import type { ItinerarySession } from './agent'

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-mint">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })}
    </span>
  )
}

export default function Concierge() {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const [open, setOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [myPlan, setMyPlan] = useState<ItinerarySession[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaderActive, setIsLoaderActive] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen to window scroll to collapse countdown pill when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live countdown timer calculation for E-Summit (active only on landing page)
  useEffect(() => {
    if (!isLandingPage) return
    const target = new Date('2026-11-14T09:00:00+05:30')

    const checkState = () => {
      const curNow = Date.now()
      const start = target.getTime()
      const end = start + 2 * 24 * 60 * 60 * 1000
      const live = curNow >= start && curNow <= end
      setIsLive(live)

      if (!live) {
        const diff = start - curNow
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((diff / (1000 * 60)) % 60)
          const seconds = Math.floor((diff / 1000) % 60)

          const pad = (n: number) => String(n).padStart(2, '0')
          setTimeLeft({
            days: pad(days),
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds),
          })
        } else {
          setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        }
      }
    }

    checkState()
    const timer = setInterval(checkState, 1000)
    return () => clearInterval(timer)
  }, [isLandingPage])

  // Use MutationObserver on the body class instead of custom events — immune to
  // StrictMode double-invoke timing where the loader cleanup briefly fires active:false.
  useEffect(() => {
    // Sync immediately with actual DOM state on mount
    setIsLoaderActive(document.body.classList.contains('loader-active'))

    const observer = new MutationObserver(() => {
      setIsLoaderActive(document.body.classList.contains('loader-active'))
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])


  // Hide floating action button when any modal (event detail, speaker, sponsor, etc) is open
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsModalOpen(document.body.classList.contains('modal-open'))
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const handleFunctionCall = useCallback((name: string, args: Record<string, unknown>) => {
    if (name === 'scroll_to_section' && typeof args.section === 'string') {
      const sectionMap: Record<string, string> = {
        hero: 'esummit-hero',
        about: 'esummit-about',
        tracks: 'esummit-tracks',
        speakers: 'speakers',
        schedule: 'schedule',
        sponsors: 'sponsors',
        faq: 'faq',
        register: 'register',
        'events-navigation': 'events-navigation',
      }
      const targetId = sectionMap[args.section.toLowerCase()] || args.section
      emitAgentEvent({ type: 'scrollToSection', payload: { id: targetId } })
    }
    if (name === 'highlight_activity_venue' && typeof args.activityId === 'string') {
      window.dispatchEvent(new CustomEvent('conciergeHighlightVenue', { detail: { activityId: args.activityId } }))
    }
    if (name === 'get_campus_route') {
      window.dispatchEvent(new CustomEvent('open-events-navigation'))
    }
  }, [])

  const handleFunctionResult = useCallback((name: string, result: string) => {
    if (name === 'subscribe_email' && result.includes('subscribed')) {
      toast.success('Subscribed to E-Summit PEC updates!', TOAST_STYLE)
    }
    if (name === 'register_for_activity') {
      toast.success('Registration interest recorded!', TOAST_STYLE)
    }
  }, [])

  const { messages, isLoading, sendMessage } = useChatbot({
    onFunctionCall: handleFunctionCall,
    onFunctionResult: handleFunctionResult,
  })

  const visibleMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pec_summit_my_plan')
      if (saved) setMyPlan(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const handleOpenPlan = () => setPlanOpen(true)
    const handleOpenConcierge = () => {
      setOpen(true)
      setPlanOpen(true)
    }
    const handleToggleConcierge = () => {
      setOpen((prev) => !prev)
    }

    window.addEventListener('open-my-plan', handleOpenPlan)
    window.addEventListener('open-concierge', handleOpenConcierge)
    window.addEventListener('toggle-concierge', handleToggleConcierge)
    return () => {
      window.removeEventListener('open-my-plan', handleOpenPlan)
      window.removeEventListener('open-concierge', handleOpenConcierge)
      window.removeEventListener('toggle-concierge', handleToggleConcierge)
    }
  }, [])

  const savePlan = useCallback((newPlan: ItinerarySession[]) => {
    setMyPlan(newPlan)
    try {
      localStorage.setItem('pec_summit_my_plan', JSON.stringify(newPlan))
      window.dispatchEvent(new CustomEvent('pec_plan_updated', { detail: newPlan.length }))
    } catch {
      // ignore
    }
  }, [])

  const addToPlan = (session: ItinerarySession) => {
    if (myPlan.some((s) => s.id === session.id)) return
    const updated = [...myPlan, session]
    savePlan(updated)
    toast.success(`Added "${session.title}" to My Plan!`, TOAST_STYLE)
  }

  const removeFromPlan = (sessionId: string) => {
    const updated = myPlan.filter((s) => s.id !== sessionId)
    savePlan(updated)
    toast.success('Removed session from My Plan.', TOAST_STYLE)
  }

  // Escape key listener for chat and plan modals
  useEffect(() => {
    if (!open && !planOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (planOpen) setPlanOpen(false)
        else if (open) setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, planOpen])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  // Lock body scroll when any modal is open to ensure chat log is scrollable on mobile
  useEffect(() => {
    if (open || planOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open, planOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return
    sendMessage(text)
    setInput('')
  }

  const isHidden = isModalOpen || isLoaderActive

  return (
    <>
      {/* Floating Concierge Action + Live Countdown Capsule */}
      <motion.div
        layout
        style={{
          position: 'fixed',
          // Drop below loader (z-9999) while it's active so it's physically behind the overlay
          zIndex: isLoaderActive ? 9000 : 10000,
        }}
        className={`hidden sm:flex !fixed bottom-10 right-6 items-center transition-all duration-400 ${
          isHidden ? 'opacity-0 scale-75 pointer-events-none translate-y-4' : 'opacity-100 scale-100 pointer-events-auto translate-y-0'
        }`}
      >
        <div data-theme-dark="true" className="relative flex items-center p-1 sm:p-1.5 rounded-full bg-[#060D0B]/85 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.45)] group">
          {/* Collapsible Left Countdown Pill (expanded in desktop at top of page, ONLY on landing page) */}
          <AnimatePresence>
            {!isScrolled && !open && isLandingPage && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex items-center overflow-hidden pl-3.5 pr-1 gap-2.5 select-none"
              >
                {/* Live or Starts Indicator */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#74FB44] animate-pulse" />
                  <span className="text-[9px] font-mono-data font-bold text-[#74FB44] keep-mint uppercase tracking-widest">
                    {isLive ? 'LIVE' : 'STARTS'}
                  </span>
                </div>

                <div className="w-px h-3.5 bg-white/20 shrink-0" />

                {/* Countdown values */}
                {isLive ? (
                  <span className="text-[11px] font-mono-data font-black text-[#74FB44] keep-mint tracking-wider shrink-0">
                    SUMMIT LIVE NOW
                  </span>
                ) : (
                  <div
                    onClick={() => {
                      const el = document.getElementById('passes') || document.getElementById('register') || document.getElementById('esummit-hero')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    title="Click to explore passes"
                    className="flex items-center gap-1.5 font-mono-data tabular-nums shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs sm:text-sm font-black text-white keep-white">{timeLeft.days}</span>
                      <span className="text-[8px] font-extrabold text-[#74FB44] keep-mint uppercase">d</span>
                    </div>
                    <span className="text-[#74FB44]/60 keep-mint text-[9px] font-black">:</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs sm:text-sm font-black text-white keep-white">{timeLeft.hours}</span>
                      <span className="text-[8px] font-extrabold text-[#74FB44] keep-mint uppercase">h</span>
                    </div>
                    <span className="text-[#74FB44]/60 keep-mint text-[9px] font-black">:</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs sm:text-sm font-black text-white keep-white">{timeLeft.minutes}</span>
                      <span className="text-[8px] font-extrabold text-[#74FB44] keep-mint uppercase">m</span>
                    </div>
                    <span className="text-[#74FB44]/60 keep-mint text-[9px] font-black">:</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs sm:text-sm font-black text-[#74FB44] keep-mint">{timeLeft.seconds}</span>
                      <span className="text-[8px] font-extrabold text-[#74FB44] keep-mint uppercase">s</span>
                    </div>
                  </div>
                )}

                <div className="w-px h-4 bg-white/20 shrink-0 mx-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chatbot Action Trigger Button */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Open Summit AI Assistant"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full text-void flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative"
            style={{
              background: 'linear-gradient(180deg, #E2FFA8 0%, #B6F554 18%, #8AC53F 65%, #76B32D 100%)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 16px rgba(138, 197, 63, 0.35)',
            }}
          >
            <Bot size={22} strokeWidth={2.2} />
            {!open && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-void animate-pulse" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="E-Summit PEC AI Assistant"
            className="fixed z-[10000] flex flex-col shadow-2xl bg-panel/95 text-primary backdrop-blur-2xl overflow-hidden
                       inset-0 rounded-none border-0
                       sm:top-auto sm:left-auto sm:bottom-[108px] sm:right-6 sm:w-[360px] sm:h-[min(480px,72vh)] sm:rounded-2xl sm:border sm:border-mint/30"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 shrink-0 bg-mint/10 border-b border-mint/20">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-2xl bg-mint/20 border border-mint/40 flex items-center justify-center">
                  <Bot size={18} className="text-mint" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-primary flex items-center gap-1.5">
                    E-Summit PEC Assistant
                  </p>
                  <p className="font-mono-data text-[10px] text-mint font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
                    <span>Official AI Concierge · E-Cell PEC</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {myPlan.length > 0 && (
                  <button
                    onClick={() => setPlanOpen(true)}
                    className="px-2.5 py-1 rounded-xl bg-mint/20 text-mint border border-mint/30 font-mono-data text-[10px] font-bold flex items-center gap-1 hover:bg-mint hover:text-void transition-all"
                  >
                    <Bookmark size={11} />
                    <span>Plan ({myPlan.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] min-w-[44px] rounded-full bg-mint/15 hover:bg-mint/25 text-primary flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close Assistant"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Messages Log */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 font-body text-sm scrollbar-thin">
              {visibleMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'user' ? (
                      <div className="w-7 h-7 rounded-full bg-mint/20 border border-mint flex items-center justify-center shrink-0">
                        <TrendingUp size={13} className="text-mint" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                        <Bot size={13} className="text-mint" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                        msg.role === 'user'
                          ? 'bg-mint/15 text-mint border border-mint/30 rounded-br-none'
                          : 'bg-panel-alt border border-border-subtle text-primary rounded-bl-none'
                      }`}
                    >
                      <FormattedText text={msg.content} />
                    </div>
                  </div>

                  {/* Render Inline Itinerary Card */}
                  {msg.itinerary && (
                    <div className="mt-3 ml-8 w-[88%] rounded-2xl p-4 bg-panel-alt border border-border-subtle space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono-data text-mint uppercase font-bold">
                        <Calendar size={14} />
                        <span>{msg.itinerary.title}</span>
                      </div>
                      <div className="space-y-2">
                        {msg.itinerary.sessions.map((session) => {
                          const isInPlan = myPlan.some((s) => s.id === session.id)
                          return (
                            <div
                              key={session.id}
                              className="p-3 rounded-xl bg-panel border border-border-subtle flex items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-mono-data text-[10px] text-mint font-bold">
                                  {session.day} • {session.time}
                                </p>
                                <p className="font-body text-xs font-bold text-primary truncate">{session.title}</p>
                              </div>
                              <button
                                onClick={() => addToPlan(session as ItinerarySession)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-data shrink-0 flex items-center gap-1 transition-all ${
                                  isInPlan
                                    ? 'bg-mint/20 text-mint border border-mint/40'
                                    : 'bg-mint text-void font-bold hover:opacity-90'
                                }`}
                              >
                                {isInPlan ? <Check size={10} /> : <Plus size={10} />}
                                <span>{isInPlan ? 'Saved' : 'Add'}</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && <p className="text-xs font-mono-data text-mint ml-8 animate-pulse">Agent is thinking...</p>}
              <div ref={bottomRef} />
            </div>

            {/* Input Form Container */}
            <div className="p-3 bg-panel border-t border-border-subtle pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="flex items-center gap-2 bg-panel-alt border border-border-subtle focus-within:border-mint rounded-2xl p-1.5 transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about E-Summit schedule, tracks, speakers..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-base sm:text-sm text-primary placeholder:text-muted outline-none font-body"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-mint text-void font-bold flex items-center justify-center disabled:opacity-30 hover:scale-105 transition-all shrink-0 cursor-pointer"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent "My Plan" Itinerary Modal */}
      <AnimatePresence>
        {planOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setPlanOpen(false)
            }}
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 sm:p-6 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Personal Itinerary Plan"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-panel border border-border-subtle rounded-3xl flex flex-col p-6 shadow-2xl relative max-h-[85vh] text-primary cursor-default"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Bookmark size={18} className="text-mint fill-mint/20" />
                  <h3 className="font-display text-2xl text-primary">My Personal Itinerary</h3>
                </div>
                <button
                  onClick={() => setPlanOpen(false)}
                  className="min-h-[44px] min-w-[44px] rounded-xl text-muted hover:text-primary flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Close Itinerary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {myPlan.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-panel-alt border border-border-subtle flex items-center justify-center">
                      <Calendar size={22} className="text-muted" />
                    </div>
                    <p className="font-mono-data text-xs font-bold text-primary uppercase tracking-wider">No Sessions Saved</p>
                    <p className="font-body text-xs text-muted max-w-[200px]">Ask the assistant to build a schedule and add sessions here.</p>
                    <button
                      onClick={() => { setPlanOpen(false); setOpen(true) }}
                      className="mt-2 px-4 py-2 rounded-full bg-mint text-void text-xs font-mono-data font-bold uppercase tracking-wider"
                    >
                      Open Assistant
                    </button>
                  </div>
                ) : (
                  myPlan.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-panel-alt border border-border-subtle flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono-data text-[10px] uppercase text-mint block mb-1 font-bold">
                          {session.day} • {session.time}
                        </span>
                        <h4 className="font-body font-semibold text-sm text-primary mb-1">{session.title}</h4>
                        <span className="font-mono-data text-[9px] uppercase px-2 py-0.5 rounded bg-panel text-muted">
                          {session.type}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromPlan(session.id)}
                        className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {myPlan.length > 0 && (
                <div className="pt-4 border-t border-mint/30 mt-4 flex justify-between items-center">
                  <span className="font-mono-data text-xs text-muted">{myPlan.length} Saved Sessions</span>
                  <button
                    onClick={() => savePlan([])}
                    className="font-mono-data text-xs text-red-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
