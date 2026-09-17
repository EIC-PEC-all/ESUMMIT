'use client'
// components/Concierge/index.tsx
// Floating E-Summit PEC AI Concierge + "My Plan" Persistent Itinerary Drawer

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [open, setOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [myPlan, setMyPlan] = useState<ItinerarySession[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaderActive, setIsLoaderActive] = useState(true)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

    window.addEventListener('open-my-plan', handleOpenPlan)
    window.addEventListener('open-concierge', handleOpenConcierge)
    return () => {
      window.removeEventListener('open-my-plan', handleOpenPlan)
      window.removeEventListener('open-concierge', handleOpenConcierge)
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
      {/* Floating Concierge Action Pill */}
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          // Drop below loader (z-9999) while it's active so it's physically behind the overlay
          zIndex: isLoaderActive ? 9000 : 10000,
        }}
        className={`bg-[#B5F23D] !fixed bottom-14 right-3 sm:right-6 min-h-[48px] px-5 py-3 rounded-[20px] font-mono-data text-[13px] font-bold text-black flex items-center gap-2.5 cursor-pointer transition-all duration-400 shadow-[0_8px_30px_rgba(181,242,61,0.25)] border border-[#C4F850] hover:brightness-110 hover:shadow-[0_8px_40px_rgba(181,242,61,0.4)] ${
          isHidden ? 'opacity-0 scale-75 pointer-events-none translate-y-4' : 'opacity-100 scale-100 pointer-events-auto translate-y-0'
        }`}
        whileHover={{ scale: isHidden ? 0.75 : 1.05, y: -2 }}
        whileTap={{ scale: isHidden ? 0.75 : 0.95 }}
        aria-label="Open Summit AI Assistant"
      >
        <Bot size={22} strokeWidth={2} />
        <span className="hidden sm:inline tracking-wide uppercase">Ask Assistant</span>
        {!open && (
          <span className="w-2.5 h-2.5 rounded-full bg-black ml-1 animate-pulse" />
        )}
      </motion.button>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="E-Summit PEC AI Assistant"
            className="fixed bottom-[100px] sm:bottom-[108px] right-3 sm:right-6 left-auto z-[10000] w-[360px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden flex flex-col shadow-2xl bg-gradient-to-b from-[#0D2218]/95 via-[#081710]/95 to-[#040A07]/95 border border-mint/30 backdrop-blur-2xl"
            style={{ height: 'min(480px, 72vh)' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 shrink-0 bg-[#B5F23D]/10 border-b border-[#B5F23D]/20">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-2xl bg-mint/20 border border-mint/40 flex items-center justify-center">
                  <Bot size={18} className="text-mint" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-white flex items-center gap-1.5">
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
                  className="min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close Assistant"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Messages Log */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-body text-sm scrollbar-thin">
              {visibleMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'user' ? (
                      <div className="w-7 h-7 rounded-full bg-mint/20 border border-mint flex items-center justify-center shrink-0">
                        <TrendingUp size={13} className="text-mint" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <Bot size={13} className="text-mint" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                        msg.role === 'user'
                          ? 'bg-mint/15 text-mint border border-mint/30 rounded-br-none'
                          : 'bg-white/[0.06] border border-white/10 text-white rounded-bl-none'
                      }`}
                    >
                      <FormattedText text={msg.content} />
                    </div>
                  </div>

                  {/* Render Inline Itinerary Card */}
                  {msg.itinerary && (
                    <div className="mt-3 ml-8 w-[88%] rounded-2xl p-4 bg-white/[0.04] border border-white/10 space-y-3">
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
                              className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-mono-data text-[10px] text-mint font-bold">
                                  {session.day} • {session.time}
                                </p>
                                <p className="font-body text-xs font-bold text-white truncate">{session.title}</p>
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
            <div className="p-3 bg-white/5 border-t border-white/10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend(input)
                }}
                className="flex items-center gap-2 bg-black/40 border border-white/20 focus-within:border-mint rounded-2xl p-1.5 transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about E-Summit schedule, tracks, speakers..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-base sm:text-sm text-white placeholder:text-gray-400 outline-none font-body"
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
          <div className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Personal Itinerary Plan"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#0C1A14] via-[#07120E] to-[#040A08] border border-mint/35 rounded-3xl flex flex-col p-6 shadow-[0_0_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.1)] relative max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-mint/30 mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Bookmark size={18} className="text-mint fill-mint/20" />
                  <h3 className="font-display text-2xl text-white">My Personal Itinerary</h3>
                </div>
                <button
                  onClick={() => setPlanOpen(false)}
                  className="min-h-[44px] min-w-[44px] rounded-xl text-muted hover:text-white flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close Itinerary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {myPlan.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center">
                      <Calendar size={22} className="text-muted" />
                    </div>
                    <p className="font-mono-data text-xs font-bold text-white uppercase tracking-wider">No Sessions Saved</p>
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
                      className="p-4 rounded-xl bg-void border border-mint/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono-data text-[10px] uppercase text-mint block mb-1 font-bold">
                          {session.day} • {session.time}
                        </span>
                        <h4 className="font-body font-semibold text-sm text-white mb-1">{session.title}</h4>
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
