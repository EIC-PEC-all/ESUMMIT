'use client'
// components/Concierge/index.tsx
// Floating Agentic Summit Agent + "My Plan" Persistent Itinerary Drawer (Money/Fintech Green Theme)

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, TrendingUp, ChevronDown, Calendar, Plus, Trash2, Bookmark, Check, Zap, MapPin, Navigation, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { useChatbot, type ChatMessage } from '@/hooks/useChatbot'
import type { ItinerarySession } from './agent'
import { FEST_CONTEXT } from '@/lib/data'
import Markdown from 'react-markdown'

interface Message extends ChatMessage {
  role: 'user' | 'assistant'
  text: string
  itinerary?: {
    title: string
    sessions: ItinerarySession[]
  }
}

export default function Concierge() {
  const [open, setOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [myPlan, setMyPlan] = useState<ItinerarySession[]>([])
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [input, setInput] = useState('')
  
  // scrollContainerRef is attached to the messages div itself.
  // We set scrollTop = scrollHeight to scroll to the bottom — this is the
  // standard native approach and avoids the whole-page jump caused by
  // scrollIntoView() on the bottomRef sentinel element.
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory
  } = useChatbot({
    onFunctionCall: (name, args) => {
      console.log('[Concierge] Function call:', name, args)
      if (name === 'highlight_activity_venue' || name === 'get_campus_route') {
        setIsMapOpen(true)
      }
    },
    onFunctionResult: (name, result) => {
      console.log('[Concierge] Function result:', name, result)
      if (name === 'register_for_activity' && result.includes('recorded')) {
        toast.success(result, {
          style: { background: '#0D140E', color: '#F5F5F0', border: '1px solid #7ED321' },
          iconTheme: { primary: '#7ED321', secondary: '#070B08' }
        })
      }
    }
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pec_summit_my_plan')
      if (saved) setMyPlan(JSON.parse(saved))
    } catch (e) {
      console.warn('Failed to load My Plan:', e)
    }
  }, [])

  const savePlan = (newPlan: ItinerarySession[]) => {
    setMyPlan(newPlan)
    try {
      localStorage.setItem('pec_summit_my_plan', JSON.stringify(newPlan))
    } catch (e) {
      console.warn('Failed to save My Plan:', e)
    }
  }

  const addToPlan = (session: ItinerarySession) => {
    if (myPlan.some((s) => s.id === session.id)) {
      toast('Session already in My Plan', { icon: 'ℹ️', style: { background: '#0D140E', color: '#F5F5F0' } })
      return
    }
    const updated = [...myPlan, session]
    savePlan(updated)
    toast.success(`Added "${session.title}" to My Plan!`, {
      style: { background: '#0D140E', color: '#F5F5F0', border: '1px solid #7ED321' },
      iconTheme: { primary: '#7ED321', secondary: '#070B08' },
    })
  }

  const removeFromPlan = (id: string) => {
    const updated = myPlan.filter((s) => s.id !== id)
    savePlan(updated)
    toast('Removed from My Plan', { icon: '🗑️', style: { background: '#0D140E', color: '#F5F5F0' } })
  }

  // Scroll to bottom of the chat container whenever messages change.
  // Using scrollTop = scrollHeight keeps scroll inside the widget; scrollIntoView
  // would move the entire page which caused the side-scrollbar jump.
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      const el = scrollContainerRef.current
      el.scrollTop = el.scrollHeight
    }
  }, [messages, isLoading, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  // Listen for map events from chatbot tools
  useEffect(() => {
    const handleHighlightVenue = (e: CustomEvent) => {
      const { venueId } = e.detail
      window.dispatchEvent(new CustomEvent('conciergeHighlightVenue', { detail: { venueId } }))
      setIsMapOpen(true)
    }
    
    const handleDrawRoute = (e: CustomEvent) => {
      const { coordinates } = e.detail
      window.dispatchEvent(new CustomEvent('conciergeDrawRoute', { detail: { coordinates } }))
      setIsMapOpen(true)
    }

    window.addEventListener('highlightActivityVenue', handleHighlightVenue as EventListener)
    window.addEventListener('drawCampusRoute', handleDrawRoute as EventListener)
    
    return () => {
      window.removeEventListener('highlightActivityVenue', handleHighlightVenue as EventListener)
      window.removeEventListener('drawCampusRoute', handleDrawRoute as EventListener)
    }
  }, [])

  return (
    <>
      {/* Debug marker - visible at top-left */}
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        zIndex: 99999,
        background: '#FF0000',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        🤖 Concierge Loaded
      </div>

      {/* TEST: Simple fixed button at bottom-right (no framer-motion) */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#7ED321',
          border: '2px solid rgba(126,211,33,0.8)',
          color: '#070B08',
          boxShadow: '0 0 40px rgba(126,211,33,0.8), 0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="Open Summit Agent (TEST)"
      >
        <Bot size={28} strokeWidth={3} />
      </button>

      {/* Floating My Plan Drawer Button — Desktop only */}
      <button
        onClick={() => setPlanOpen(true)}
        className="hidden md:flex fixed top-24 right-6 z-40 px-3.5 py-2 rounded-xl bg-[#0D140E] border border-[#7ED321]/40 text-white font-mono-data text-xs items-center gap-2 shadow-lg hover:border-[#7ED321] hover:shadow-[0_0_15px_rgba(126,211,33,0.3)] transition-all"
        aria-label="Open My Plan itinerary drawer"
      >
        <Bookmark size={14} className="text-[#7ED321] fill-[#7ED321]/20" />
        <span>My Plan</span>
        <span className="w-5 h-5 rounded-full bg-[#7ED321] text-[#070B08] font-bold text-[10px] flex items-center justify-center">
          {myPlan.length}
        </span>
      </button>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative"
        style={{
          background: open ? '#0D140E' : '#7ED321',
          border: '2px solid rgba(126,211,33,0.8)',
          color: open ? '#7ED321' : '#070B08',
          boxShadow: open 
            ? '0 0 0 rgba(126,211,33,0)' 
            : '0 0 40px rgba(126,211,33,0.8), 0 8px 32px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.15, boxShadow: '0 0 50px rgba(126,211,33,1), 0 12px 40px rgba(0,0,0,0.5)' }}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? 'Close Summit Agent' : 'Open Summit Agent'}
      >
        {/* Pulse ring — only when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '3px solid rgba(126,211,33,1)', boxShadow: '0 0 30px rgba(126,211,33,0.8)' }}
            animate={{ scale: [1, 1.4, 1.8, 2.2], opacity: [1, 0.6, 0.2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(126,211,33,0.5)' }}
            animate={{ scale: [1, 1.2, 1.4], opacity: [0.8, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
              <X size={28} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ scale: 0.3, opacity: 0, rotate: -180 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.3, opacity: 0, rotate: 180 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              <Bot size={28} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Floating label */}
        {!open && (
          <motion.div
            className="absolute right-full top-1/2 -translate-y-1/2 mr-4 whitespace-nowrap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="bg-[#070B0E] text-[#7ED321] font-mono-data text-xs px-3 py-1.5 rounded-full border border-[#7ED321]/50 shadow-xl">
              Chat with Agent
            </span>
          </motion.div>
        )}
        {!open && messages.some(m => m.role === 'assistant' && m.id !== messages[0]?.id) && (
          <motion.span
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF4D3D] text-white font-mono-data text-[11px] font-bold flex items-center justify-center animate-pulse"
            style={{ boxShadow: '0 0 20px rgba(255,77,61,0.8)' }}
          >
            {messages.filter(m => m.role === 'assistant' && m.id !== messages[0]?.id).length}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden flex flex-col shadow-2xl bg-[#070B08] border border-[#7ED321]/40"
            style={{ height: '540px' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0 bg-[#0D140E] border-b border-[#7ED321]/30">
              <div className="w-9 h-9 rounded-xl bg-[#7ED321]/20 border border-[#7ED321]/40 flex items-center justify-center">
                <Bot size={18} className="text-[#7ED321]" />
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm text-white flex items-center gap-1.5">
                  Summit Agent <Zap size={12} className="text-[#7ED321] fill-[#7ED321]" />
                </p>
                <p className="font-mono-data text-[10px] text-[#7ED321] font-bold">⚡ Official E-Cell Assistant</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMapOpen(true)}
                  className="p-1.5 rounded-lg text-[#8A9488] hover:text-white hover:bg-[#7ED321]/10 transition-colors"
                  aria-label="Open campus map"
                >
                  <MapPin size={16} />
                </button>
                <button 
                  onClick={() => clearHistory()}
                  className="p-1.5 rounded-lg text-[#8A9488] hover:text-[#FF4D3D] hover:bg-[#FF4D3D]/10 transition-colors"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-[#8A9488] hover:text-white">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Messages Log — scrolls natively inside the widget */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-body text-sm scroll-smooth"
              style={{ overscrollBehavior: 'contain' }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'user' ? (
                      /* User avatar */
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative"
                        style={{
                          background: 'linear-gradient(135deg, rgba(126,211,33,0.25) 0%, rgba(61,217,255,0.12) 100%)',
                          border: '1.5px solid #7ED321',
                          boxShadow: '0 0 10px rgba(126,211,33,0.4)',
                        }}
                        whileHover={{ scale: 1.15, boxShadow: '0 0 18px rgba(126,211,33,0.7)' }}
                        title="You"
                      >
                        <motion.span
                          className="absolute -top-1 -right-1 text-[8px] leading-none"
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        >📈</motion.span>
                        <TrendingUp size={14} className="text-[#7ED321]" strokeWidth={2.5} />
                      </motion.div>
                    ) : (
                      /* Bot avatar */
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: 'rgba(126,211,33,0.15)',
                          border: '1.5px solid rgba(126,211,33,0.6)',
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Bot size={14} className="text-[#7ED321]" />
                      </motion.div>
                    )}

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#7ED321] text-[#070B08] font-bold rounded-br-none'
                          : 'bg-[#0D140E] border-l-4 border-l-[#7ED321] border-t border-r border-b border-[#7ED321]/30 text-white rounded-bl-none'
                      }`}
                    >
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>

                  {/* Render Inline Itinerary Card */}
                  {msg.itinerary && (
                    <div className="mt-3 ml-9 w-[85%] rounded-xl p-4 bg-[#0D140E] border border-[#7ED321]/50 shadow-lg space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono-data text-[#7ED321] uppercase font-bold">
                        <Calendar size={14} />
                        <span>{msg.itinerary.title}</span>
                      </div>
                      <div className="space-y-2">
                        {msg.itinerary.sessions.map((session) => {
                          const isInPlan = myPlan.some((s) => s.id === session.id)
                          return (
                            <div
                              key={session.id}
                              className="p-2.5 rounded-lg bg-[#070B08] border border-[#7ED321]/30 flex items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-mono-data text-[10px] text-[#8A9488]">
                                  [{session.day}] {session.time}
                                </p>
                                <p className="font-body text-xs font-semibold text-white truncate">{session.title}</p>
                              </div>
                              <button
                                onClick={() => addToPlan(session as ItinerarySession)}
                                className={`px-2 py-1 rounded text-[10px] font-mono-data shrink-0 flex items-center gap-1 transition-all ${
                                  isInPlan
                                    ? 'bg-[#7ED321]/20 text-[#7ED321] border border-[#7ED321]/40'
                                    : 'bg-[#7ED321] text-[#070B08] font-bold hover:bg-[#7ED321]/90'
                                }`}
                              >
                                {isInPlan ? <Check size={10} /> : <Plus size={10} />}
                                <span>{isInPlan ? 'Added' : 'Add'}</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action buttons for function results */}
                  {msg.role === 'assistant' && msg.functionResponse && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-9">
                      {msg.content.toLowerCase().includes('route') && (
                        <button
                          onClick={() => setIsMapOpen(true)}
                          className="px-3 py-1 rounded-full text-xs font-mono-data bg-[#7ED321]/20 border border-[#7ED321]/30 text-[#7ED321] hover:bg-[#7ED321]/30 transition-all flex items-center gap-1"
                        >
                          <MapPin size={12} /> View Route
                        </button>
                      )}
                      {msg.content.toLowerCase().includes('venue') && msg.content.toLowerCase().includes('highlight') && (
                        <button
                          onClick={() => setIsMapOpen(true)}
                          className="px-3 py-1 rounded-full text-xs font-mono-data bg-[#7ED321]/20 border border-[#7ED321]/30 text-[#7ED321] hover:bg-[#7ED321]/30 transition-all flex items-center gap-1"
                        >
                          <Navigation size={12} /> View on Map
                        </button>
                      )}
                      {msg.content.toLowerCase().includes('register') && (
                        <button
                          className="px-3 py-1 rounded-full text-xs font-mono-data bg-[#7ED321]/20 border border-[#7ED321]/30 text-[#7ED321] hover:bg-[#7ED321]/30 transition-all flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Register
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && <p className="text-xs font-mono-data text-[#7ED321] ml-9">Agent is thinking...</p>}
              {error && <p className="text-xs font-mono-data text-[#FF4D3D] ml-9">Error: {error}</p>}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#0D140E] border-t border-[#7ED321]/30">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); setInput('') }} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about tracks, speakers, activities, or campus navigation..."
                  className="flex-1 bg-[#070B08] border border-[#7ED321]/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#8A9488]/60 outline-none focus:border-[#7ED321] font-body"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-lg bg-[#7ED321] text-[#070B08] font-bold flex items-center justify-center disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campus Map Panel (triggered by chatbot) */}
      <AnimatePresence>
        {isMapOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-[#070B08]/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#0D140E] border-l border-[#7ED321]/40 h-full flex flex-col p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#7ED321]/30 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#7ED321]" />
                  <h3 className="font-display text-2xl text-white">Campus Navigation</h3>
                </div>
                <button onClick={() => setIsMapOpen(false)} className="p-2 rounded-lg text-[#8A9488] hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 text-center text-[#8A9488] font-body text-sm py-16">
                <MapPin size={48} className="mx-auto mb-3 opacity-30 text-[#7ED321]" />
                <p>Map view opened from chat</p>
                <p className="text-xs text-[#8A9488]/70 mt-1">Scroll to Events Navigation section for full interactive map</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent "My Plan" Itinerary Drawer */}
      <AnimatePresence>
        {planOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-[#070B08]/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#0D140E] border-l border-[#7ED321]/40 h-full flex flex-col p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#7ED321]/30 mb-6">
                <div className="flex items-center gap-2">
                  <Bookmark size={18} className="text-[#7ED321] fill-[#7ED321]/20" />
                  <h3 className="font-display text-2xl text-white">My Personal Itinerary</h3>
                </div>
                <button onClick={() => setPlanOpen(false)} className="p-2 rounded-lg text-[#8A9488] hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {myPlan.length === 0 ? (
                  <div className="py-16 text-center text-[#8A9488] font-body text-sm">
                    <Calendar size={36} className="mx-auto mb-3 opacity-30 text-[#7ED321]" />
                    <p>Your plan is empty.</p>
                    <p className="text-xs text-[#8A9488]/70 mt-1">Ask Summit Agent in chat to build a custom itinerary for you!</p>
                  </div>
                ) : (
                  myPlan.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-[#070B08] border border-[#7ED321]/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono-data text-[10px] uppercase text-[#7ED321] block mb-1 font-bold">
                          [{session.day}] {session.time}
                        </span>
                        <h4 className="font-body font-semibold text-sm text-white mb-1">{session.title}</h4>
                        <span className="font-mono-data text-[9px] uppercase px-2 py-0.5 rounded bg-[#0D140E] text-[#8A9488]">
                          {session.type}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromPlan(session.id)}
                        className="p-2 rounded-lg text-[#8A9488] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {myPlan.length > 0 && (
                <div className="pt-4 border-t border-[#7ED321]/30 mt-4 flex justify-between items-center">
                  <span className="font-mono-data text-xs text-[#8A9488]">{myPlan.length} Saved Sessions</span>
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